import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

const Button = ({ children, onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="w-64 py-3 px-6 rounded-2xl text-white bg-blue-600 hover:bg-blue-700 transition-all text-lg font-medium shadow-md"
    >
      {children}
    </button>
  );
};

export default Button;
