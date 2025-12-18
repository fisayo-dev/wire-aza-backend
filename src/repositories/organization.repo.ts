import OrganizationModel from "../models/personas/organization.model.ts";
import OrganizationAzaModel from "../models/aza/organizationAza.model.ts";
import { IOrganizationRepo } from "../interfaces/organization.repo.interface.ts";

class OrganizationRepo implements IOrganizationRepo {
  getOrganizationByUsername = async (username: string) => {
    const organization = await OrganizationModel.findOne({ username });
    return organization;
  };

  storeOrganizationInDB = async (organizationData: any) => {
    const organization = new OrganizationModel(organizationData);
    await organization.save();
    return organization;
  };

  storeOrganizationAzaInDB = async (azaData: any) => {
    const aza = new OrganizationAzaModel(azaData);
    await aza.save();
    return aza;
  };
}

export default OrganizationRepo;
