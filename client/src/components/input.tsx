import React from "react";
import clsx from "clsx";

interface InputProps {
  id: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  value: string;
  label: string;
  type?: string;
  min?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  id,
  onChange,
  value,
  label,
  type,
  min,
  className,
}) => {
  return (
    <div className="relative">
      <input
        onChange={onChange}
        type={type}
        value={value}
        id={id}
        min={min}
        className={clsx(
          "block rounded-md px-6 pt-6 pb-1 w-full text-md text-neutral-900 bg-primary-light appearance-none focus:outline-none focus:ring-0 peer",
          className
        )}
        placeholder=" "
      />
      <label
        className="
          absolute
          text-md
          text-neutral-600
          duration-150
          transform
          -translate-y-3
          scale-75
          top-3.5
          z-10
          origin-[0]
          left-6
          peer-placeholder-shown:scale-100
          peer-placeholder-shown:translate-y-0
          peer-focus:scale-75
          peer-focus:-translate-y-3
        "
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  );
};