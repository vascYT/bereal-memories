import moment from "moment";
import { getImageUrlsFromMemory, type Memory } from "../lib/bereal.ts";
import ExportButton from "./ExportButton.tsx";

export default function MemoryViewer({
  memory,
  zipFile,
}: {
  memory: Memory;
  zipFile: File;
}) {
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
      <div className="mt-3 flex items-center justify-center">
        <ExportButton zipFile={zipFile} memory={memory} />
      </div>
    </div>
  );
}
