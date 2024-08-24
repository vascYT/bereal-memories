import type { Memories, MemoriesData } from "~/types/bereal";
import moment from "moment";
import { Checkbox } from "./ui/checkbox";
import { useSelectedMoments } from "~/lib/selected_moments";

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

  return (
    <div className="relative overflow-hidden rounded-md border border-white/20 p-2">
      <div className="z-10 flex flex-row items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">
            {moment(props.moment.memoryDay).format("MMMM Do YY")}
          </h2>
          <div className="flex flex-row gap-1">
            <p>{props.moment.numPostsForMoment} Posts</p>
            {props.moment.isLate && <p className="text-orange-300">Late</p>}
          </div>
        </div>
        <Checkbox
          checked={momentIds.includes(props.moment.momentId)}
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
      </div>
      <img
        alt="BeReal Thumbnail"
        className="pointer-events-none absolute left-0 right-0 top-0 w-full opacity-20 blur-sm"
        src={props.moment.mainPostThumbnail.url}
      />
    </div>
  );
}
