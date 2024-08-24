import Head from "next/head";

import { useHydration, useTokenStore } from "~/lib/token_store";
import Memories from "~/components/Memories";
import { isExpired } from "~/lib/utils";
import { api } from "~/utils/api";
import { SettingsButton } from "~/components/Settings";
import ExportButton from "~/components/ExportButton";
import { useEffect, useState } from "react";
import { Toaster } from "~/components/ui/toaster";

export default function Home() {
  const accessToken = useTokenStore((state) => state.accessToken);
  const refreshToken = useTokenStore((state) => state.refreshToken);
  const isHydrated = useHydration();
  const [accessTokenVerified, setAccessTokenVerified] = useState(false);

  const refreshTokenMutation = api.bereal.refreshToken.useMutation();

  useEffect(() => {
    const { accessToken, refreshToken, setAccessToken, setRefreshToken } =
      useTokenStore.getState();

    if (accessToken && refreshToken && isExpired(accessToken)) {
      refreshTokenMutation
        .mutateAsync({ refreshToken: refreshToken })
        .then((data) => {
          setAccessToken(data.access_token);
          setRefreshToken(data.refresh_token);
          setAccessTokenVerified(true);
        })
        .catch((e) =>
          console.log(`An error occured while refreshing tokens: ${e}`),
        );
    } else {
      setAccessTokenVerified(true);
    }
  }, []);

  if (isHydrated && !accessToken && !refreshToken) {
    return (
      <div className="flex flex-col items-center gap-1">
        <p>Please set the BeReal tokens in settings.</p>
        <SettingsButton />
      </div>
    );
  }

  if (!accessTokenVerified) {
    return <p>Validating access token...</p>;
  }

  return (
    <>
      <Head>
        <title>BeReal Memories</title>
      </Head>
      <div className="mb-4 flex items-center justify-center gap-3">
        <ExportButton />
        <SettingsButton />
      </div>
      <Memories />
      <Toaster />
    </>
  );
}
