export default function Button({ 
  className = '', 
  onClick, 
  label = '',
  leftIcon = null,
  rightIcon = null
}) {
  return (
  <button 
    className={`text-white w-full h-10 rounded-md font-bold hover:bg-secondary/80 flex items-center justify-center gap-2 ${className}`} 
    onClick={onClick}>
    {leftIcon && <span className="left-icon">{leftIcon}</span>}
    {label}
    {rightIcon && <span className="right-icon">{rightIcon}</span>}
  </button>
  );
}