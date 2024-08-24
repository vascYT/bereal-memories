import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TokenState {
  accessToken: string | null;
  refreshToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
}

export const useTokenStore = create<TokenState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      setAccessToken: (accessToken) => set({ accessToken }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
    }),
    {
      name: "bereal_tokens",
    },
  ),
);

export const useHydration = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useTokenStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );

    setHydrated(useTokenStore.persist.hasHydrated());

    return () => unsub();
  }, []);

  return hydrated;
};
