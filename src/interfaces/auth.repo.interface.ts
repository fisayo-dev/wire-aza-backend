export interface IAuthRepo {
  getUser(email: string): Promise<any>;
  storeUserInDB(userData: any): Promise<any>;
  findUserByOAuthId(oauthId: string, provider: string): Promise<any>;
  updateUser(email: string, data: any): Promise<any>;
}
