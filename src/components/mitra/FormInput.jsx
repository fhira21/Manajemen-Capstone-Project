import React from 'react';

export default function FormInput({ 
  label, 
  value, 
  onChange, 
  type = '', 
  name, 
  required = false, 
  placeholder = '', 
  className = '',
}) {
  const inputClasses = 'w-full rounded h-10 p-2 focus:outline-none focus:ring-2 focus:ring-secondary';
  
  return (
    <div className="w-full flex flex-col items-start justify-center gap-2">
      {label && <p>{label}</p>}
      <input 
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`${inputClasses} ${className}`}
      />
    </div>
  );
}

