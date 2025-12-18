import OrganizationRepo from "../repositories/organization.repo.ts";
import { AzaType } from "../types/enums/aza.ts";
import { CreateOrganizationPayload } from "../validations/organization.validation.ts";

class OrganizationService {
  constructor(private organizationRepo: OrganizationRepo) {}

  createOrganization = async (
    organizationCredentials: CreateOrganizationPayload,
    userId: string
  ) => {
    // Check if organization with username already exists
    const existingOrg = await this.organizationRepo.getOrganizationByUsername(
      organizationCredentials.username
    );
    if (existingOrg) {
      throw new Error("Organization with this username already exists");
    }

    // Create organization
    const organizationData = {
      name: organizationCredentials.name,
      username: organizationCredentials.username,
      description: organizationCredentials.description,
      type: organizationCredentials.type,
      logo: organizationCredentials.logo,
      owner: userId,
    };

    const organization = await this.organizationRepo.storeOrganizationInDB(
      organizationData
    );

    // Create aza account
    const azaData = {
      account_number: organizationCredentials.account_number,
      bank_code: organizationCredentials.bank_code,
      bank_name: organizationCredentials.bank_name,
      type: AzaType.naira, // Nigerian, so NGN
      userOwner: userId,
      organizationOwner: organization._id,
    };

    const aza = await this.organizationRepo.storeOrganizationAzaInDB(azaData);

    return {
      organization: {
        id: organization._id,
        name: organization.name,
        username: organization.username,
        description: organization.description,
        type: organization.type,
        logo: organization.logo,
        owner: organization.owner,
      },
      aza: {
        id: aza._id,
        account_number: aza.account_number,
        bank_name: aza.bank_name,
        type: aza.type,
      },
    };
  };
}

export default OrganizationService;
