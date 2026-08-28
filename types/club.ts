export type ClubOrganization = "Baruch" | "Macaulay";

export type ClubStatus =
  | "Active"
  | "Interested"
  | "Inactive";

export type Club = {
  id: string;
  name: string;
  organization: ClubOrganization;
  category: string;
  role: string;
  status: ClubStatus;
  description?: string;
  instagram?: string;
  website?: string;
  notes?: string;
};