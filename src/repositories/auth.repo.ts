import User from "../models/personas/user.model.ts";

class AuthRepo {
  getUser = async (email: string) => {
    const user = await User.findOne({ email });
    return user;
  };

  storeUserInDB = async (value) => {};
}

export default AuthRepo;
