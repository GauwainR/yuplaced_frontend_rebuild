import type { InputHTMLAttributes } from 'react';

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function TextField({ label, id, className = '', ...props }: TextFieldProps) {
  const inputId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="field">
      <label className="field-label" htmlFor={inputId}>{label}</label>
      <input className={['field-input', className].filter(Boolean).join(' ')} id={inputId} {...props} />
    </div>
  );
}
