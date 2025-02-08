import {
  BadgeInfo,
  BadgePercent,
  BookMarked,
  FileCode,
  FolderCode,
  GlobeLock,
  Home,
  LayoutPanelTop,
  LifeBuoy,
  Lightbulb,
  MessageCircle,
  Rocket,
  Rss,
} from "lucide-react";

export interface IPagesConstants {
  route: string;
  icon?: any;
  label: string;
  subMenu?: IPagesConstants[];
}

export const pagesConstants: IPagesConstants[] = [
  { route: "/home", icon: <Home />, label: "Home" },
  { route: "/docs", icon: <FileCode />, label: "Docs" },
  { route: "/blogs", icon: <Rss />, label: "Blogs" },
  { route: "/develop", icon: <FolderCode />, label: "Develop" },
  { route: "/templates", icon: <LayoutPanelTop />, label: "Templates" },
  { route: "/pricing", icon: <BadgePercent />, label: "Pricing" },
  { route: "/releases", icon: <Rocket />, label: "Releases" },
  {
    route: "/community",
    icon: <BookMarked />,
    label: "Community",
    subMenu: [
      {
        route: "/community/comments",
        label: "Comments",
        icon: <MessageCircle />,
      },
      {
        route: "/community/feature-requests",
        label: "Feature Requests",
        icon: <Lightbulb />,
      },
      { route: "/community/support", label: "Support", icon: <LifeBuoy /> },
    ],
  },
  { route: "/privacy", icon: <GlobeLock />, label: "Privacy" },
];
