import Topbar from "@/components/Topbar.tsx";
import { useMusicStore } from "@/stores/useMusicStore.ts";
import { useEffect } from "react";

const HomePage = () => {
  const {
    fetchFeaturedSongs,
    fetchMadeForYouSongs,
    fetchTrendingSongs,
    isLoading,
    madeForYouSongs,
    featuredSongs,
    trendingSongs,
  } = useMusicStore();

  useEffect(() => {
    fetchFeaturedSongs();
    fetchMadeForYouSongs();
    fetchTrendingSongs();
  }, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

  console.log({ isLoading, madeForYouSongs, featuredSongs, trendingSongs });

  return (
    <div className="rounded-md overflow-hidden">
      <Topbar />
    </div>
  );
};

export default HomePage;
