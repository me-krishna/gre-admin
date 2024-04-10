import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/custom/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function UserNav() {
  const [user, setUser] = useState<any>();
  const nav = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("USER-REF-DETAILS")
      ? JSON.parse(localStorage.getItem("USER-REF-DETAILS")!)
      : nav("/login");
    setUser(user);
  }, []);

  const logout = () => {
    localStorage.removeItem("USER-REF-DETAILS");
    nav("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full border-violet-300"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-violet-200 dark:bg-violet-700">
              {user?.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none"> {user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.username}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logout}
          className="cursor-pointer bg-red-100 dark:bg-red-600 dark:text-white"
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
