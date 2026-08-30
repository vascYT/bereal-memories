import { CheckIcon } from "lucide-react";
import { Checkbox as RdxCheckbox } from "radix-ui";

export default function Checkbox({
  checked,
  onClick,
}: {
  checked: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <RdxCheckbox.Root
      className="flex size-5 appearance-none items-center justify-center rounded bg-white outline-none hover:bg-violet3 focus:shadow-[0_0_0_2px_black]"
      checked={checked}
      onClick={onClick}
    >
      <RdxCheckbox.Indicator className="text-violet11">
        <CheckIcon className="text-black p-1" />
      </RdxCheckbox.Indicator>
    </RdxCheckbox.Root>
  );
}
