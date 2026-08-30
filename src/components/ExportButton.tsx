import { Download, Loader2 } from "lucide-react";
import { useSelectedMemories } from "../lib/useSelectedMemories.ts";
import { generateMemoriesFromZip } from "../lib/bereal.ts";
import { useState } from "react";

export default function ExportButton({ zipFile }: { zipFile: File }) {
  const [processing, setProcessing] = useState(false);
  const memoryIds = useSelectedMemories((state) => state.memoryIds);

  return (
    <button
      className="flex items-center gap-1 justify-center bg-white px-4 py-2 rounded-md text-black disabled:bg-white/40"
      disabled={memoryIds.length <= 0 || processing}
      onClick={async () => {
        setProcessing(true);
        await generateMemoriesFromZip(zipFile, memoryIds);
        setProcessing(false);
      }}
    >
      {processing ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Download className="size-4" />
      )}
      <span>Export {memoryIds.length}</span>
    </button>
  );
}
