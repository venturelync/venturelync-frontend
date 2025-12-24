import * as React from "react";
import { useSession } from "@auth/create/react";
import { useQuery } from "@tanstack/react-query";

const useUser = () => {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const {
    data: profileData,
    isLoading: profileLoading,
    refetch,
  } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          return data.profile;
        }
        return null;
      } catch (e) {
        console.error("Failed to fetch profile in useUser", e);
        return null;
      }
    },
    enabled: !!userId,
  });

  // Combine session user with profile data
  const user = React.useMemo(() => {
    if (status === "unauthenticated") return null;
    if (!session?.user) return null;
    return { ...session.user, ...profileData };
  }, [session, profileData, status]);

  // Loading is true if session is loading OR if we are authenticated but profile is still fetching
  const loading =
    status === "loading" || (status === "authenticated" && profileLoading);

  return {
    user,
    data: user,
    loading,
    refetch,
    mutate: refetch,
  };
};

export { useUser };

export default useUser;
