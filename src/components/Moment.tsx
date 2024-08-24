import type { MemoriesData } from "~/types/bereal";

interface Props {
  moment: MemoriesData;
}
export default function Moment(props: Props) {
  return (
    <div className="rounded-md border border-white/20 bg-white/5 p-2">
      <div className="flex flex-row justify-between">
        <div>
          <h2 className="text-xl font-bold">{props.moment.memoryDay}</h2>
          <div className="flex flex-row gap-1">
            <p>{props.moment.numPostsForMoment} Posts</p>
            {props.moment.isLate && <p className="text-orange-300">Late</p>}
          </div>
        </div>
        <img
          alt="BeReal Thumbnail"
          className="rounded-md"
          src={props.moment.mainPostThumbnail.url}
          width={40}
        />
      </div>
    </div>
  );
}
