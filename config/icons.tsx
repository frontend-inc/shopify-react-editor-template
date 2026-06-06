import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Download,
  ExternalLink,

  Play,
  Rocket,
  Sparkles,
  Star,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  "arrow-right": ArrowRight,
  "arrow-up-right": ArrowUpRight,
  check: Check,
  "chevron-right": ChevronRight,
  download: Download,
  "external-link": ExternalLink,

  play: Play,
  rocket: Rocket,
  sparkles: Sparkles,
  star: Star,
  zap: Zap,
};

export const iconOptions = [
  { label: "None", value: "none" },
  { label: "Arrow right", value: "arrow-right" },
  { label: "Arrow up right", value: "arrow-up-right" },
  { label: "Check", value: "check" },
  { label: "Chevron right", value: "chevron-right" },
  { label: "Download", value: "download" },
  { label: "External link", value: "external-link" },

  { label: "Play", value: "play" },
  { label: "Rocket", value: "rocket" },
  { label: "Sparkles", value: "sparkles" },
  { label: "Star", value: "star" },
  { label: "Zap", value: "zap" },
];

export const resolveIcon = (name: string): LucideIcon | null => {
  if (!name || name === "none") return null;
  return iconMap[name] ?? null;
};
