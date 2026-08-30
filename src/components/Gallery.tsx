import { useEffect, useState } from "react";
import DropZone from "./DropZone.tsx";
import MemoryItem from "./MemoryItem.tsx";
import { extractMemoriesFromZip, type Memory } from "../lib/bereal.ts";
import ExportButton from "./ExportButton.tsx";
import Info from "./Info.tsx";

export default function Gallery() {
  const [zipFile, setZipFile] = useState<File>();
  const [memories, setMemories] = useState<Memory[]>();

  useEffect(() => {
    if (zipFile) {
      extractMemoriesFromZip(zipFile).then(({ memories }) => {
        const filteredMemories = memories.filter(
          (m) =>
            m.frontImage.mediaType !== "video" ||
            m.backImage.mediaType !== "video",
        );
        setMemories(filteredMemories);
      });
    } else {
      setMemories(undefined);
    }
  }, [zipFile]);

  if (!memories || !zipFile) {
    return (
      <>
        <DropZone setZipFile={setZipFile} />
        <Info />
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center mb-4">
        <ExportButton zipFile={zipFile} />
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {memories.map((m, i) => (
          <MemoryItem
            key={m.takenTime}
            index={i}
            memory={m}
            memories={memories}
            zipFile={zipFile}
          />
        ))}
      </div>
    </>
  );
}
