import User from "../models/personas/user.model.ts";
import { IAuthRepo } from "../interfaces/auth.repo.interface.ts";

class AuthRepo implements IAuthRepo {
  getUser = async (email: string) => {
    const user = await User.findOne({ email });
    return user;
  };

  storeUserInDB = async (userData: any) => {
    const user = new User(userData);
    await user.save();
    return user;
  };

  findUserByOAuthId = async (oauthId: string, provider: string) => {
    const user = await User.findOne({
      [`oauth.${provider}.id`]: oauthId,
    });
    return user;
  };

  updateUser = async (email: string, data: any) => {
    const user = await User.findOneAndUpdate(
      { email },
      { $set: data },
      { new: true }
    );
    return user;
  };
}

export default AuthRepo;
