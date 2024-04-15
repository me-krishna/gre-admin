import { IconLayoutDashboard , IconAd , IconActivity , IconUsersGroup} from "@tabler/icons-react";

export interface NavLink {
  title: string;
  label?: string;
  href: string;
  icon: JSX.Element;
}

export interface SideLink extends NavLink {
  sub?: NavLink[];
}

export const sidelinks: SideLink[] = [
  {
    title: "Dasboard",
    label: "",
    href: "/",
    icon: <IconLayoutDashboard size={18} />,
  },
  {
    title: "Students",
    label: "",
    href: "/students",
    icon: <IconUsersGroup size={18} />,
  },
  {
    title: "Visitors Tracking",
    label: "",
    href: "/user-tracking",
    icon: <IconActivity size={18} />,
  },
];
