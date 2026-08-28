export type ClubOrganization =
  | "Baruch"
  | "Macaulay";

export type ClubStatus =
  | "Interested"
  | "Applying"
  | "Applied"
  | "Active"
  | "Inactive";

export type Club = {
  id: string;
  name: string;
  organization: ClubOrganization;
  status: ClubStatus;

  category?: string;
  role?: string;

  instagram?: string;
  website?: string;

  description?: string;
  notes?: string;
};

export type NewClub = Omit<Club, "id">;