const GlassCard = ({
  children,
  className = "",
  hoverable = false,
  glow = false,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`liquid-glass rounded-xl p-4 md:p-5 border border-white/[0.08] transition-all duration-300 ${
        hoverable ? "hover:border-white/20 hover:translate-y-[-1px] cursor-pointer" : ""
      } ${glow ? "shadow-[0_0_30px_-5px_rgba(255,255,255,0.06)]" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export { GlassCard };
