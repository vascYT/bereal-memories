import { Download } from "lucide-react";
import { useSelectedMemories } from "../lib/useSelectedMemories.ts";
import { generateMemoriesFromZip } from "../lib/bereal.ts";

export default function ExportButton({ zipFile }: { zipFile: File }) {
  const memoryIds = useSelectedMemories((state) => state.memoryIds);

  return (
    <button
      className="flex items-center justify-center bg-white px-4 py-2 rounded-md text-black disabled:bg-white/40"
      disabled={memoryIds.length <= 0}
      onClick={async () => {
        await generateMemoriesFromZip(zipFile, memoryIds);
      }}
    >
      <Download className="mr-1 h-4 w-4" />
      <span>Export {memoryIds.length}</span>
    </button>
  );
}
