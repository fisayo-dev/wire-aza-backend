import AuthRepo from "../repositories/auth.repo.ts";
import { OauthType } from "../types/enums/auth.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { EmailSignupPayload, OAuthSignupPayload } from "../validations/auth.validation.ts";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";

class AuthService {
  constructor(private authRepo: AuthRepo) {}

  signupByEmail = async (authCredentials: EmailSignupPayload) => {
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(authCredentials.password, 10);

      const userData = {
        name: authCredentials.name,
        email: authCredentials.email,
        password: hashedPassword,
        username: authCredentials.username,
        avatar: authCredentials.avatar,
      };

      const user = await this.authRepo.storeUserInDB(userData);

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRY,
      });

      return {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
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
      const user = await this.authRepo.getUser(email);

      if (!user) {
        throw new Error("Invalid email or password");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new Error("Invalid email or password");
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRY,
      });

      return {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  };

  loginByOAuth = async (
    email: string,
    oauthId: string,
    provider: OauthType
  ) => {
    try {
      let user = await this.authRepo.findUserByOAuthId(
        oauthId,
        provider as string
      );

      if (!user) {
        throw new Error("OAuth account not found");
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRY,
      });

      return {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  };

  signupByOAuth = async (payload: OAuthSignupPayload) => {
    try {
      const existingUser = await this.authRepo.findUserByOAuthId(
        payload.oauthId,
        payload.provider
      );

      if (existingUser) {
        throw new Error("OAuth account already exists");
      }

      // Check if email exists
      const emailExists = await this.authRepo.getUser(payload.email);
      if (emailExists) {
        throw new Error("Email already registered");
      }

      const userData = {
        name: payload.name,
        email: payload.email,
        avatar: payload.avatar,
        [`oauth.${payload.provider}`]: {
          id: payload.oauthId,
          provider: payload.provider,
        },
        password: "oauth-user", // OAuth users don't have passwords
      };

      const user = await this.authRepo.storeUserInDB(userData);

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRY,
      });

      return {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  };
}

export default AuthService;
