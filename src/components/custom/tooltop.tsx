import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { IconInfoCircle } from "@tabler/icons-react";

type IType = "info" | "warning" | "error" | "success";

const OToolTip = ({ msg, type }: { msg: string; type?: IType }) => {
  const classGenerator = () => {
    switch (type) {
      case "info":
        return "border-blue-200 text-blue-600 bg-blue-100";
      case "warning":
        return "border-orange-200 text-orange-600 bg-orange-100";
      case "error":
        return "border-red-200 text-red-600 bg-red-100";
      case "success":
        return "border-success-200 text-success-600 bg-success-100";
      default:
        return "border-slate-200 text-slate-600 bg-slate-100";
    }
  };
  const iconClassGenerator = () => {
    switch (type) {
      case "info":
        return "text-blue-300 ";
      case "warning":
        return "text-orange-300";
      case "error":
        return "text-red-300";
      case "success":
        return "text-success-300";
      default:
        return "text-slate-300";
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <IconInfoCircle size={18} className={iconClassGenerator()} />
        </TooltipTrigger>
        <TooltipContent>
          <div className={`p-2 border rounded-md ${classGenerator()}`}>
            {msg}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default OToolTip;
