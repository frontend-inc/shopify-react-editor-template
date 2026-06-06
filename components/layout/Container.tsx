import * as React from "react";
import { cn } from "@/lib/utils";

export type ContainerProps = React.HTMLAttributes<HTMLElement> & {
  as?: React.ElementType;
};

export function Container({
  as: Comp = "div",
  className,
  style,
  ...props
}: ContainerProps) {
  return (
    <Comp
      className={cn("mx-auto w-full px-6", className)}
      style={{ maxWidth: "var(--container-max-width, 80rem)", ...style }}
      {...props}
    />
  );
}
