import { cn } from "@/lib/utils";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "header" | "footer" | "main";
};

export function Container({
  children,
  className,
  as: Component = "div",
}: ContainerProps) {
  return <Component className={cn("page-shell", className)}>{children}</Component>;
}
