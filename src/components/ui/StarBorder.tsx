import { cn } from "../../lib/utils"
import { ElementType, ComponentPropsWithoutRef } from "react"
import { useTheme } from "../../contexts/ThemeContext"

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
  const { isDark } = useTheme()
  const defaultColor = color || (isDark ? "#fbbf24" : "#3b82f6")

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
      <div className={`relative z-10 ${
        isDark 
          ? 'bg-black/20 backdrop-blur-md border border-white/20' 
          : 'bg-white/60 backdrop-blur-md border border-gray-200/50'
        } rounded-full shadow-xl transition-all duration-300`}>
        {children}
      </div>
    </Component>
  )
}