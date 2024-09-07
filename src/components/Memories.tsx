import { useTokenStore } from "~/lib/token_store";
import { api } from "~/utils/api";
import Moment from "./Moment";

export default function Memories() {
  const accessToken = useTokenStore((state) => state.accessToken);

  const { data: memories, isLoading } = api.bereal.memories.useQuery(
    {
      accessToken: accessToken!,
    },
    {
      enabled: !!accessToken,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
    },
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {memories?.data ? (
        memories.data.map((moment, i) => (
          <Moment
            key={moment.momentId}
            moment={moment}
            index={i}
            memories={memories}
          />
        ))
      ) : (
        <p>No data</p>
      )}
    </div>
  );
}
