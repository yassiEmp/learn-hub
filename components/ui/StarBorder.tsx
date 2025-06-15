import { cn } from "../../lib/utils"
import { ElementType, ComponentPropsWithoutRef } from "react"

interface StarBorderProps<T extends ElementType> {
  as?: T
  color?: string
  speed?: string
  className?: string
  children: React.ReactNode
}

export function StarBorder<T extends ElementType = "button">({
  as,
  className,
  color,
  speed = "6s",
  children,
  ...props
}: StarBorderProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof StarBorderProps<T>>) {
  const Component = as || "button"
  const defaultColor = color || "#fbbf24"

  return (
    <Component 
      className={cn(
        "relative inline-block py-[1px] overflow-hidden rounded-full",
        className
      )} 
      {...props}
    >
      {/* Animated border gradients */}
      <div
        className="absolute w-[300%] h-[50%] bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0 opacity-60"
        style={{
          background: `radial-gradient(circle, ${defaultColor}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div
        className="absolute w-[300%] h-[50%] top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0 opacity-60"
        style={{
          background: `radial-gradient(circle, ${defaultColor}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      
      {/* Content container with translucent styling matching your design */}
      <div className="relative z-10 bg-black/20 backdrop-blur-md rounded-full border border-white/20 shadow-xl">
        {children}
      </div>
    </Component>
  )
}