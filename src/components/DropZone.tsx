import { FileIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import usePostStore from "../lib/usePostStore";
import { PostsSchema } from "../lib/bereal.ts";

export default function DropZone() {
  const setPosts = usePostStore((state) => state.setPosts);

  const onDrop = useCallback(async (files: File[]) => {
    if (!files || files.length == 0) return;

    const file = files[0];
    try {
      const txt = await file.text();
      const json = JSON.parse(txt);
      const parsed = PostsSchema.parse(json);
      setPosts(parsed);
    } catch (e) {
      console.error("Couldn't process file");
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      className="flex items-center justify-center text-gray-300 h-28 border-4 border-dashed border-white/20"
      {...getRootProps()}
    >
      <FileIcon className="mr-2 h-4 w-4" />{" "}
      <p>
        {isDragActive ? "Drop post.json here" : "Drag and drop post.json here"}
      </p>
      <input {...getInputProps()} />
    </div>
  );
}
