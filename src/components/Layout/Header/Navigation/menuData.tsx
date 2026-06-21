import { HeaderItem } from "@/types/menu";

export const headerData: HeaderItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Causes",
    href: "#",
    submenu: [
      { label: "Cause list", href: "/cause" },
      { label: "Cause details", href: "/cause/cause-1" },
    ],
  },
  {
    label: "Events",
    href: "#",
    submenu: [
      { label: "Events list", href: "/events" },
      { label: "Events details", href: "/events/event-1" },
    ],
  },
  {
    label: "Blog",
    href: "#",
    submenu: [
      { label: "Blog list", href: "/blog" },
      { label: "Blog details", href: "/blog/blog_1" },
    ],
  },
  { label: "Contact", href: "/contact" },
  { label: "Documentation", href: "/documentation#version" },
];
