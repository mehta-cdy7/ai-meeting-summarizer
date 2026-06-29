import React from "react";
import { cn } from "../../lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function Card({ children, className, glow = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "glass-panel rounded-2xl p-6 relative overflow-hidden transition-all duration-300",
        glow && "before:absolute before:inset-0 before:bg-radial before:from-violet-500/10 before:to-transparent before:pointer-events-none",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-1.5 mb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold tracking-tight text-white/95 leading-none",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-zinc-400 leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center mt-6 pt-4 border-t border-white/5", className)} {...props}>
      {children}
    </div>
  );
}
