import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type ButtonVariant = 'primary' | 'secondary' | 'submit';

type BaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonLinkProps = BaseProps & {
  to: string;
};

const variantClassMap: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  submit: 'btn-submit',
};

export function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  const classes = [variantClassMap[variant], className].filter(Boolean).join(' ');

  return (
    <button className={classes} type="button" {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({ children, variant = 'primary', className = '', to }: ButtonLinkProps) {
  const classes = [variantClassMap[variant], className].filter(Boolean).join(' ');

  return (
    <Link className={classes} to={to}>
      {children}
    </Link>
  );
}
