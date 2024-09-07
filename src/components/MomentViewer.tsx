import { LucideDownload } from "lucide-react";
import { Button } from "./ui/button";
import moment from "moment";
import type { MemoriesData } from "~/types/bereal";
import { useTokenStore } from "~/lib/token_store";
import { api } from "~/utils/api";
import { saveAs } from "file-saver";
import { useState } from "react";
import { toast } from "./ui/use-toast";

interface Props {
  moment: MemoriesData;
}
export default function MomentViewer(props: Props) {
  const accessToken = useTokenStore((state) => state.accessToken);
  const generateImage = api.bereal.generateImage.useMutation();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { data: berealMoment, isLoading } = api.bereal.moment.useQuery(
    {
      accessToken: accessToken!,
      momentId: props.moment.momentId,
    },
    {
      enabled: !!accessToken,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  if (isLoading) {
    return <p>Loading memory...</p>;
  }

  if (!berealMoment) {
    return <p>Couldn&apos;t fetch memory :(</p>;
  }

  if (!berealMoment.posts[0]) {
    return <p>No posts on that day</p>;
  }

  const post = berealMoment.posts[selectedIndex] ?? berealMoment.posts[0];

  return (
    <>
      <h1 className="text-xl font-bold">
        Post from {moment(post.takenAt).format("DD MMMM YYYY HH:MM:SS")}
      </h1>
      <div className="flex flex-row items-center justify-center gap-3">
        <img
          className="w-56 rounded-md"
          alt="Primary BeReal image"
          src={post.primary.url}
        ></img>
        <img
          className="w-56 rounded-md"
          alt="Secondary BeReal image"
          src={post.secondary.url}
        ></img>
      </div>
      <div className="text-center">
        <Button
          onClick={async () => {
            if (!accessToken) return;

            const { fileName, image, error } = await generateImage.mutateAsync({
              accessToken,
              momentId: props.moment.momentId,
              postIndex: selectedIndex,
            });
            if (error) {
              toast({ description: error });
            } else if (image && fileName) {
              saveAs(new Blob([Buffer.from(image, "base64")]), fileName);
            }
          }}
        >
          <LucideDownload className="mr-1 size-4" />
          <span>Download</span>
        </Button>
      </div>
      <div className="flex flex-row items-center justify-center gap-1">
        {berealMoment.posts.map((_, i) => (
          <Button
            key={i}
            variant={selectedIndex === i ? "outline" : "ghost"}
            onClick={() => {
              setSelectedIndex(i);
            }}
          >
            {i + 1}
          </Button>
        ))}
      </div>
    </>
  );
}
