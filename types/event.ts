export type ClubEvent = {
  id: string;

  clubId?: string;
  clubName?: string;

  title: string;
  description?: string;
  location?: string;

  startAt: string;
  endAt: string;
};

export type NewClubEvent = Omit<
  ClubEvent,
  "id" | "clubName"
>;