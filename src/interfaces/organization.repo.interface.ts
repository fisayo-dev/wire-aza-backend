export interface IOrganizationRepo {
  getOrganizationByUsername(username: string): Promise<any>;
  storeOrganizationInDB(organizationData: any): Promise<any>;
  storeOrganizationAzaInDB(azaData: any): Promise<any>;
  getAllOrganizations(): Promise<any[]>;
  getOrganizationById(organizationId: string): Promise<any>;
}
