import type { Song } from "@/types";

type SectionGridProps = {
  title: string;
  songs: Song[];
  isLoading: boolean;
};

const SectionGrid = ({ title, songs, isLoading }: SectionGridProps) => {
  console.log(title, songs, isLoading);
  return <div>SectionGrid</div>;
};

export default SectionGrid;
