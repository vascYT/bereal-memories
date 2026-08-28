import moment from "moment";
import type { Post } from "../lib/bereal.ts";

export default function Memory({ post }: { post: Post }) {
  return (
    <div className="group relative flex h-[130px] w-[98px] items-center justify-center rounded-md border border-white/30 p-2">
      <div className="z-10 text-center">
        <h2 className="text-xl font-bold">
          {moment(post.takenAt).format("D")}
        </h2>
        <h3 className="text-md">{moment(post.takenAt).format("MMM YY")}</h3>
      </div>
      {/* <Checkbox
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
      /> */}
      {/* <Dialog>
        <DialogTrigger>
          <LucideEye className="absolute bottom-2 left-2 mt-2 hidden size-4 group-hover:block" />
        </DialogTrigger>
        <DialogContent>
          <MomentViewer moment={props.moment} />
        </DialogContent>
      </Dialog> */}

      {/* <img
        alt="BeReal Thumbnail"
        className="pointer-events-none absolute left-0 right-0 top-0 h-full w-full rounded-md object-cover opacity-20"
        src={`https://cdn.bereal.network/${post.primary.path}`}
      /> */}
    </div>
  );
}
