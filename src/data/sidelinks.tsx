import {
  IconLayoutDashboard,
  IconUsersGroup,
  IconFilePencil,
  IconEyeCheck,
  IconPencilQuestion,
  IconNotebook,
  IconDeviceIpadQuestion,
} from "@tabler/icons-react";

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
    title: "Questions Factory",
    label: "",
    href: "/questions-factory",
    icon: <IconDeviceIpadQuestion size={18} />,
  },
  {
    title: "Tests",
    label: "",
    href: "#",
    icon: <IconNotebook size={18} />,
    sub: [
      {
        title: "Test Patterns",
        label: "",
        href: "/tests/test-pattern",
        icon: <IconFilePencil size={18} />,
      },
      {
        title: "Create Test",
        label: "",
        href: "/tests/create-test",
        icon: <IconPencilQuestion size={18} />,
      }
    ],
  },
];
