import ClubsView from "@/components/clubs-view";
import { clubs } from "@/data/clubs";

export default function ClubsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-10">
      <ClubsView clubs={clubs} />
    </div>
  );
}