import moment from "moment";
import { getImageUrlsFromMemory, type Memory } from "../lib/bereal.ts";
import { useSelectedMemories } from "../lib/useSelectedMemories.ts";
import { useMemo } from "react";
import Checkbox from "./ui/Checkbox.tsx";
import { Dialog } from "radix-ui";
import { LucideEye } from "lucide-react";
import MemoryViewer from "./MemoryViewer.tsx";

export default function MemoryItem({
  index,
  memory,
  memories,
}: {
  index: number;
  memory: Memory;
  memories: Memory[];
}) {
  const momentIds = useSelectedMemories((state) => state.memoryIds);
  const addMoment = useSelectedMemories((state) => state.addMemory);
  const multiAddMoment = useSelectedMemories((state) => state.multiAddMemory);
  const removeMoment = useSelectedMemories((state) => state.removeMemory);
  const checked = useMemo(
    () => momentIds.includes(memory.takenTime),
    [momentIds, memory.takenTime],
  );

  const { backImgUrl } = getImageUrlsFromMemory(memory);

  return (
    <div
      className={`group relative flex h-32.5 w-24.5 items-center justify-center rounded-md border ${checked ? "border-white" : "border-white/30"} p-2`}
    >
      <div className="z-10 text-center">
        <h2 className="text-xl font-bold">
          {moment(memory.takenTime).format("D")}
        </h2>
        <h3 className="text-md">{moment(memory.takenTime).format("MMM YY")}</h3>
      </div>
      <div className="absolute left-2 top-2">
        <Checkbox
          checked={checked}
          onClick={(e) => {
            const checked = e.currentTarget.ariaChecked !== "true";
            if (checked && e.shiftKey) {
              multiAddMoment(index, memories);
            } else if (checked) {
              addMoment(memory.takenTime, index);
            } else {
              removeMoment(memory.takenTime);
            }
          }}
        />
      </div>

      <Dialog.Root>
        <Dialog.Trigger asChild>
          <LucideEye className="absolute bottom-2 left-2 mt-2 hidden size-4 group-hover:block" />
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 data-[state=open]:animate-overlayShow z-40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-125 -translate-x-1/2 -translate-y-1/2 rounded-md bg-black border border-white/20 focus:outline-none p-5 z-50">
            <MemoryViewer memory={memory} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* <img
        alt="BeReal Thumbnail"
        className="pointer-events-none absolute left-0 right-0 top-0 h-full w-full rounded-md object-cover opacity-20"
        src={backImgUrl}
      /> */}
    </div>
  );
}
