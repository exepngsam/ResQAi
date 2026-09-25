import { Loader2 } from "lucide-react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = "left",
  ...props
}) => {
  const variantStyles = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    glass: "btn-glass",
    danger: "btn-danger",
    ghost: "btn-ghost"
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-xs",
    lg: "px-5 py-2.5 text-sm"
  };

  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`btn-base ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : Icon && iconPosition === "left" ? (
        <Icon className="w-3.5 h-3.5" />
      ) : null}
      <span>{children}</span>
      {!loading && Icon && iconPosition === "right" ? (
        <Icon className="w-3.5 h-3.5" />
      ) : null}
    </button>
  );
};

export { Button };
