import moment from "moment";
import { getImageUrlsFromMemory, type Memory } from "../lib/bereal.ts";

export default function MemoryViewer({ memory }: { memory: Memory }) {
  const { frontImgUrl, backImgUrl } = getImageUrlsFromMemory(memory);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">
        Memory from {moment(memory.takenTime).format("DD MMMM YYYY HH:MM:SS")}
      </h1>
      <div className="flex flex-row items-center justify-center gap-3">
        <img
          className="w-56 rounded-md"
          alt="Primary BeReal image"
          src={frontImgUrl}
        ></img>
        <img
          className="w-56 rounded-md"
          alt="Secondary BeReal image"
          src={backImgUrl}
        ></img>
      </div>
      <div className="text-center">
        {/* <Button
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
        </Button> */}
      </div>
    </div>
  );
}
