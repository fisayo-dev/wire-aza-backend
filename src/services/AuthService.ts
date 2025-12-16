import AuthRepo from "../repositories/auth.repo.ts";
import { OauthType } from "../types/enums/auth.ts";
import bcrypt from "bcrypt";
import axios from "axios";
import {
  EmailSignupPayload,
  OAuthSignupPayload,
} from "../validations/auth.validation.ts";
import { comparePassword, hashPassword, signToken } from "../utils/auth.ts";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  OAUTH_CALLBACK_URL_BASE,
} from "../configs/env.ts";

class AuthService {
  constructor(private authRepo: AuthRepo) {}

  signupByEmail = async (authCredentials: EmailSignupPayload) => {
    try {
      // Normalize email
      const email = authCredentials.email.trim().toLowerCase();

      // Hash password
      const hashedPassword = await hashPassword(authCredentials.password);

      const userData = {
        name: authCredentials.name,
        email,
        password: hashedPassword,
        avatar: authCredentials.avatar,
      };

      const duplicateUser = await this.authRepo.getUser(email);
      if (duplicateUser) {
        throw new Error("User with this email already exists");
      }

      const user = await this.authRepo.storeUserInDB(userData);

      // Generate JWT token
      const token = signToken(user._id.toString());

      return {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  };

  loginByEmail = async (email: string, password: string) => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const user = await this.authRepo.getUser(normalizedEmail);

      if (!user) {
        throw new Error("User does not exist");
      }

      const isPasswordValid = await comparePassword(password, user.password!);

      if (!isPasswordValid) {
        throw new Error("Invalid email or password");
      }

      // Generate JWT token
      const token: string = signToken(user._id.toString());

      return {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  };

  loginByOAuth = async (oauthId: string, provider: OauthType) => {
    try {
      let user = await this.authRepo.findUserByOAuthId(
        oauthId,
        provider as string
      );

      if (!user) {
        throw new Error("OAuth account not found");
      }

      // Generate JWT token
      const token = signToken(user._id.toString());

      return {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  };

  getOAuthRedirectUrl = (provider: string) => {
    if (!OAUTH_CALLBACK_URL_BASE) {
      throw new Error("OAUTH_CALLBACK_URL_BASE is not configured");
    }

    const redirectUri = `${OAUTH_CALLBACK_URL_BASE}/auth/oauth/${provider}/callback`;

    if (provider === "google") {
      const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      url.searchParams.set("client_id", String(GOOGLE_CLIENT_ID ?? ""));
      url.searchParams.set("redirect_uri", redirectUri);
      url.searchParams.set("response_type", "code");
      url.searchParams.set("scope", "openid profile email");
      url.searchParams.set("access_type", "offline");
      return url.toString();
    } else if (provider === "github") {
      const url = new URL("https://github.com/login/oauth/authorize");
      url.searchParams.set("client_id", String(GITHUB_CLIENT_ID ?? ""));
      url.searchParams.set("redirect_uri", redirectUri);
      url.searchParams.set("scope", "read:user user:email");
      return url.toString();
    }

    throw new Error("Unsupported OAuth provider");
  };

  handleOAuthCallback = async (provider: string, code: string) => {
    try {
      let oauthId: string | undefined;
      let email: string | undefined;
      let name: string | undefined;
      let avatar: string | undefined;
      let accessToken: string | undefined;

      const redirectUri = `${OAUTH_CALLBACK_URL_BASE}/auth/oauth/${provider}/callback`;

      if (provider === "google") {
        // Exchange code for tokens
        const tokenRes = await axios.post(
          "https://oauth2.googleapis.com/token",
          new URLSearchParams({
            code,
            client_id: String(GOOGLE_CLIENT_ID ?? ""),
            client_secret: String(GOOGLE_CLIENT_SECRET ?? ""),
            redirect_uri: redirectUri,
            grant_type: "authorization_code",
          }).toString(),
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          }
        );

        accessToken = tokenRes.data.access_token;

        // Fetch profile
        const profileRes = await axios.get(
          "https://www.googleapis.com/oauth2/v2/userinfo",
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        oauthId = profileRes.data.id;
        email = profileRes.data.email;
        name = profileRes.data.name;
        avatar = profileRes.data.picture;
      } else if (provider === "github") {
        // Exchange code for access token
        const tokenRes = await axios.post(
          "https://github.com/login/oauth/access_token",
          {
            client_id: GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET,
            code,
            redirect_uri: redirectUri,
          },
          { headers: { Accept: "application/json" } }
        );

        accessToken = tokenRes.data.access_token;

        // Fetch user
        const userRes = await axios.get("https://api.github.com/user", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        oauthId = String(userRes.data.id);
        name = userRes.data.name || userRes.data.login;
        avatar = userRes.data.avatar_url;

        // Fetch primary email
        const emailsRes = await axios.get(
          "https://api.github.com/user/emails",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const primaryEmail =
          (emailsRes.data || []).find((e: any) => e.primary) ||
          emailsRes.data[0];
        email = primaryEmail?.email;
      } else {
        throw new Error("Unsupported OAuth provider");
      }

      if (!oauthId || !email) {
        throw new Error(
          "Unable to retrieve required OAuth profile information"
        );
      }

      // Normalize email
      const normalizedEmail = email.trim().toLowerCase();

      // Try find user by oauth id
      let user = await this.authRepo.findUserByOAuthId(oauthId, provider);

      if (!user) {
        // Try finding by email
        const existing = await this.authRepo.getUser(normalizedEmail);
        if (existing) {
          // Attach oauth info to existing account
          const set: any = {};
          set[`oauth.${provider}`] = { id: oauthId, accessToken };
          await this.authRepo.updateUser(normalizedEmail, set);
          user = await this.authRepo.getUser(normalizedEmail);
        } else {
          // Create new user
          const username = normalizedEmail.split("@")[0];
          const userData: any = {
            name,
            email: normalizedEmail,
            username,
            avatar,
            oauth: {
              [provider]: { id: oauthId, accessToken },
            },
          };

          user = await this.authRepo.storeUserInDB(userData);
        }
      }

      // Generate JWT token
      const token = signToken(user?._id.toString()!);

      return {
        user: {
          id: user?._id!,
          name: user?.name!,
          email: user?.email!,
          avatar: user?.avatar!,
        },
        token,
      };
    } catch (error: any) {
      throw error;
    }
  };
}

export default AuthService;
