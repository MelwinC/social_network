import { capitalize } from "@/lib/utils";
import { CheckCircle, CircleX } from "lucide-react";
import { toast } from "./ui/use-toast";

const Toast = (success: boolean, description: string) => {
  toast({
    description: (
      <span className="flex items-center">
        {success ? (
          <CheckCircle style={{ color: "green" }} />
        ) : (
          <CircleX style={{ color: "red" }} />
        )}
        <p className="pl-4 text-[1rem]">{capitalize(description)}</p>
      </span>
    ),
    duration: 3000,
    variant: "success",
  });
};

export default Toast;
