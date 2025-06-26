export default function Button({ 
  className = '', 
  onClick, 
  label = '',

}) {
  return (
  <button 
    className={`text-white w-full h-10 rounded-md font-bold hover:bg-secondary/80 flex items-center justify-center gap-2 ${className}`} 
    onClick={onClick}>
    {label}
  </button>
  );
}