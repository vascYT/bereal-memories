import { Download } from "lucide-react";
import { Button } from "./ui/button";
import { useSelectedMoments } from "~/lib/selected_moments";
import { useTokenStore } from "~/lib/token_store";
import { ofetch } from "ofetch";
import { saveAs } from "file-saver";
import { useToast } from "./ui/use-toast";

export default function ExportButton() {
  const momentIds = useSelectedMoments((state) => state.momentIds);
  const accessToken = useTokenStore((state) => state.accessToken);
  const { toast } = useToast();

  return (
    <Button
      disabled={momentIds.length <= 0}
      onClick={async () => {
        if (accessToken) {
          const showedToast = toast({
            title: "Your export has started...",
            description:
              "This may take a while, depending on how many items your selected.",
            duration: Infinity,
            dismissible: false,
          });
          const res = await ofetch<Blob>("/api/generateImages", {
            method: "POST",
            body: {
              accessToken,
              momentIds,
            },
          });
          showedToast.dismiss();
          saveAs(res, `bereal-export.zip`);
        }
      }}
    >
      <Download className="mr-1 h-4 w-4" />
      <span>Export {momentIds.length}</span>
    </Button>
  );
}
