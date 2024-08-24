import { DialogClose } from "@radix-ui/react-dialog";
import { Settings } from "lucide-react";
import { useRef } from "react";
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
import { useTokenStore } from "~/lib/token_store";

export function SettingsButton() {
  const accessToken = useTokenStore((state) => state.accessToken);
  const refreshToken = useTokenStore((state) => state.refreshToken);
  const setAccessToken = useTokenStore((state) => state.setAccessToken);
  const setRefreshToken = useTokenStore((state) => state.setRefreshToken);

  const accessTokenInputRef = useRef<HTMLInputElement>(null);
  const refreshTokenInputRef = useRef<HTMLInputElement>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings className="mr-1 h-4 w-4" />
          <span>Settings</span>
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
              ref={accessTokenInputRef}
              defaultValue={accessToken ?? undefined}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              BeReal Refresh Token
            </Label>
            <Input
              ref={refreshTokenInputRef}
              defaultValue={refreshToken ?? undefined}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="submit"
              onClick={() => {
                setAccessToken(accessTokenInputRef.current?.value ?? null);
                setRefreshToken(refreshTokenInputRef.current?.value ?? null);
              }}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
