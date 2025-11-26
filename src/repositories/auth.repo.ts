import User from "../models/personas/user.model.ts";

class AuthRepo {
  checkIfEmailExist = async (email: string) => {
    const user = await User.findOne({ email });
  };
}

export default AuthRepo;
