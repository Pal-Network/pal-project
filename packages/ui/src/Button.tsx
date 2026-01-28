import React from "react";

export type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center rounded-full bg-ember px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
    >
      {children}
    </button>
  );
}
