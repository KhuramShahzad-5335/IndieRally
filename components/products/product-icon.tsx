import { Layers3, Sparkles, Orbit, Command, ChartNoAxesColumn, PenTool, Workflow, AudioLines } from "lucide-react";
import type { Listing } from "@/lib/domain";

export function Icon({
  item,
  large = false,
}: {
  item: Listing;
  large?: boolean;
}) {
  const theme = (item.theme ?? 4) % 8;
  const colors = [
    "bg-[#ececec] text-[#424242]",
    "bg-[#e6e6e6] text-[#4b4b4b]",
    "bg-[#ededed] text-[#525252]",
    "bg-[#ebebeb] text-[#505050]",
    "bg-[#ededed] text-[#4d4d4d]",
    "bg-[#e6e6e6] text-[#4b4b4b]",
    "bg-[#e7e7e7] text-[#4a4a4a]",
    "bg-[#e7e7e7] text-[#494949]",
  ];
  const Mark = [
    Layers3,
    Workflow,
    Orbit,
    ChartNoAxesColumn,
    Sparkles,
    PenTool,
    Command,
    AudioLines,
  ][theme % 8];
  return (
    <span
      aria-hidden
      className={`grid shrink-0 place-items-center ${colors[theme]} ${large ? "size-[74px] rounded-md" : "size-12 rounded-md max-[590px]:size-9 max-[590px]:[&_svg]:size-[18px]"}`}
    >
      <Mark size={large ? 36 : 24} strokeWidth={1.8} />
    </span>
  );
}
