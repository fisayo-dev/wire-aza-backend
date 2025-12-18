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

  getAllOrganizations = async () => {
    const organizations = await OrganizationModel.find();
    return organizations;
  };

  getOrganizationById = async (organizationId: string) => {
    const organization = await OrganizationModel.findById(organizationId);
    return organization;
  }
}

export default OrganizationRepo;
