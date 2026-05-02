import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
};

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  width = 460,
}: ModalProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Focus the first focusable element inside the modal when it opens
  useEffect(() => {
    if (!open) return;
    const node = cardRef.current;
    if (!node) return;
    const focusable = node.querySelector<HTMLElement>(
      'input, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusable?.focus();
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="yn-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="yn-modal-card"
        style={{ width }}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="yn-modal-header">
          <span className="yn-modal-title">{title}</span>
          <button
            type="button"
            className="yn-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </header>

        <div className="yn-modal-body">{children}</div>

        {footer && <footer className="yn-modal-footer">{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}
