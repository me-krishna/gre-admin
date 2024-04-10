import { IconLayoutDashboard , IconAd , IconActivity} from "@tabler/icons-react";

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
    title: "Leads",
    label: "",
    href: "/leads",
    icon: <IconAd size={18} />,
  },
  {
    title: "Visitors Tracking",
    label: "",
    href: "/user-tracking",
    icon: <IconActivity size={18} />,
  },
];
