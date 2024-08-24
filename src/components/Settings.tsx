import { DialogClose } from "@radix-ui/react-dialog";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function SettingsButton() {
  const [accessToken, saveAccessToken] = useLocalStorage<string | null>(
    "bereal_access_token",
    null,
  );

  const [accessTokenValue, setAccessTokenValue] = useState<string | undefined>(
    typeof accessToken === "string" ? accessToken : undefined,
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-screen-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              BeReal Access Token
            </Label>
            <Input
              id="access-token"
              value={accessTokenValue}
              onChange={(e) => {
                if (typeof e?.target?.value === "string") {
                  setAccessTokenValue(e.target.value);
                }
              }}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="submit"
              onClick={() => saveAccessToken(accessTokenValue ?? null)}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
