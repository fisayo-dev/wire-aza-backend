import AuthRepo from "../repositories/auth.repo.ts";
import { OauthType } from "../types/enums/auth.ts";

class AuthService {
  constructor(private authRepo: AuthRepo) {}

  signupByEmail = async () => {
    
  };

  loginByEmail = async () => {};

  loginByOAuth = async (type: OauthType) => {};

  signupByOAuth = async (type: OauthType) => {};
}

export default AuthService;
