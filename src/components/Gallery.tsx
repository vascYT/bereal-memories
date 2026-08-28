import usePostStore from "../lib/usePostStore.ts";
import DropZone from "./DropZone.tsx";
import Memory from "./Memory.tsx";

export default function Gallery() {
  const posts = usePostStore((state) => state.posts);

  if (posts.length === 0) {
    return <DropZone />;
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {posts.map((p) => (
        <Memory key={p.takenAt} post={p} />
      ))}
    </div>
  );
}
