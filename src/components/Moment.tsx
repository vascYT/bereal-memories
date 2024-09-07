import type { Memories, MemoriesData } from "~/types/bereal";
import moment from "moment";
import { Checkbox } from "./ui/checkbox";
import { useSelectedMoments } from "~/lib/selected_moments";
import { LucideEye } from "lucide-react";
import { cn } from "~/lib/utils";
import { useMemo } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import MomentViewer from "./MomentViewer";

interface Props {
  moment: MemoriesData;
  index: number;
  memories: Memories;
}
export default function Moment(props: Props) {
  const momentIds = useSelectedMoments((state) => state.momentIds);
  const addMoment = useSelectedMoments((state) => state.addMoment);
  const multiAddMoment = useSelectedMoments((state) => state.multiAddMoment);
  const removeMoment = useSelectedMoments((state) => state.removeMoment);
  const checked = useMemo(
    () => momentIds.includes(props.moment.momentId),
    [momentIds, props.moment.momentId],
  );

  return (
    <div
      className={cn(
        checked ? "border-white" : "border-white/20",
        "group relative flex h-[130px] w-[98px] items-center justify-center rounded-md border p-2",
      )}
    >
      <div className="absolute -right-2 -top-2 z-10 rounded-full bg-white px-2 text-black">
        <p>{props.moment.numPostsForMoment}</p>
      </div>
      <div className="z-10 text-center">
        <h2 className="text-xl font-bold">
          {moment(props.moment.memoryDay).format("D")}
        </h2>
        <h3 className="text-md">
          {moment(props.moment.memoryDay).format("MMM YY")}
        </h3>
      </div>
      <Checkbox
        className={cn(
          checked ? "block" : "hidden group-hover:block",
          "absolute left-2 top-2",
        )}
        checked={checked}
        onClick={(e) => {
          const checked = e.currentTarget.ariaChecked !== "true";
          if (checked && e.shiftKey) {
            multiAddMoment(props.index, props.memories);
          } else if (checked) {
            addMoment(props.moment.momentId, props.index);
          } else {
            removeMoment(props.moment.momentId);
          }
        }}
      />
      <Dialog>
        <DialogTrigger>
          <LucideEye className="absolute bottom-2 left-2 mt-2 hidden size-4 group-hover:block" />
        </DialogTrigger>
        <DialogContent>
          <MomentViewer moment={props.moment} />
        </DialogContent>
      </Dialog>

      <img
        alt="BeReal Thumbnail"
        className="pointer-events-none absolute left-0 right-0 top-0 w-full rounded-md opacity-20"
        src={props.moment.mainPostThumbnail.url}
      />
    </div>
  );
}
