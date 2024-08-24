import Head from "next/head";
import { useIsClient, useLocalStorage } from "@uidotdev/usehooks";
import Moment from "~/components/Moment";

import { api } from "~/utils/api";
import { Settings } from "lucide-react";
import { SettingsButton } from "~/components/Settings";

function Home() {
  const [accessToken] = useLocalStorage<string | null>(
    "bereal_access_token",
    null,
  );

  const { data: memories, isLoading } = api.bereal.memories.useQuery(
    {
      accessToken: accessToken!,
    },
    {
      enabled: !!accessToken,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  return (
    <>
      <Head>
        <title>BeReal Memories</title>
        <link rel="icon" href="https://fav.farm/📸" />
      </Head>
      <div className="flex min-h-screen flex-col">
        <header className="flex flex-row justify-between p-5">
          <h1 className="text-center text-3xl font-bold">BeReal Memories 📸</h1>
          <SettingsButton />
        </header>
        <main className="grow">
          {accessToken ? (
            <div className="grid grid-cols-5 gap-4 p-5">
              {memories?.data ? (
                memories.data.map((moment) => (
                  <Moment key={moment.momentId} moment={moment} />
                ))
              ) : (
                <p>No data</p>
              )}
            </div>
          ) : (
            <p>Please set the access token in the settings.</p>
          )}
        </main>
      </div>
    </>
  );
}

export default function HomeOnlyClient() {
  const isClient = useIsClient();

  if (isClient === false) {
    return null;
  }

  return <Home />;
}
