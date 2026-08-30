import { FileIcon } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function DropZone({
  setZipFile,
}: {
  setZipFile: (file: File | undefined) => void;
}) {
  const onDrop = useCallback(async (files: File[]) => {
    if (!files || files.length == 0) return;

    const file = files[0];
    if (file.type === "application/zip") {
      setZipFile(file);
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
        {isDragActive
          ? "Drop Profile & Activity zip here"
          : "Drag and drop Profile & Activity zip here"}
      </p>
      <input {...getInputProps()} />
    </div>
  );
}
