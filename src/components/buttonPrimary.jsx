export default function Button({ 
    className = '', 
    onClick, 
    label = ''
}) {
  return (
    <button 
      className={`bg-secondary text-white w-full h-10 rounded-md font-bold ${className}`} 
      onClick={onClick}>
        {label}
      </button>
  );
}