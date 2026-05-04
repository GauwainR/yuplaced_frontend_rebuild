import { useEffect, useState } from 'react';
import { Modal } from '../../shared/ui/modal';
import type { Folder } from '../../entities/folder/model/types';

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (input: { name: string; color: string }) => void;
  /** If provided, the modal is in edit mode. */
  editFolder?: Folder | null;
  onUpdate?: (id: number, patch: { name: string; color: string }) => void;
};

const PRESET_COLORS = [
  '#e040a0',
  '#ff5151',
  '#ff9f0a',
  '#35d46f',
  '#4da3ff',
  '#b978ff',
  '#41d6c3',
  '#ffffff',
];

export function CreateFolderModal({
  open,
  onClose,
  onCreate,
  editFolder,
  onUpdate,
}: Props) {
  const isEdit = !!editFolder;
  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);

  useEffect(() => {
    if (!open) return;
    if (editFolder) {
      setName(editFolder.name);
      setColor(editFolder.color);
    } else {
      setName('');
      setColor(PRESET_COLORS[0]);
    }
  }, [open, editFolder]);

  const canSubmit = name.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    if (isEdit && editFolder && onUpdate) {
      onUpdate(editFolder.id, { name: name.trim(), color });
    } else {
      onCreate({ name: name.trim(), color });
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'EDIT FOLDER' : 'NEW FOLDER'}
      width={420}
      footer={
        <>
          <button
            type="button"
            className="yn-modal-btn yn-modal-btn--ghost"
            onClick={onClose}
          >
            CANCEL
          </button>
          <button
            type="button"
            className="yn-modal-btn yn-modal-btn--primary"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {isEdit ? 'SAVE' : 'CREATE'}
          </button>
        </>
      }
    >
      <div className="yn-modal-preview">
        <span
          className="yn-modal-preview__dot"
          style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
        />
        <span
          className={`yn-modal-preview__title ${
            name ? '' : 'yn-modal-preview__title--placeholder'
          }`}
        >
          {name.toUpperCase() || 'FOLDER NAME'}
        </span>
      </div>

      <div className="yn-modal-field">
        <div className="yn-modal-label">NAME</div>
        <input
          className="yn-modal-input"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && canSubmit) handleSubmit();
          }}
          placeholder="e.g. WORK"
        />
      </div>

      <div className="yn-modal-field">
        <div className="yn-modal-label">COLOR</div>
        <div className="yn-modal-color-row">
          {PRESET_COLORS.map((c) => {
            const isActive = c === color;
            return (
              <button
                key={c}
                type="button"
                className={`yn-modal-color-swatch ${isActive ? 'is-active' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
                aria-label={`Pick ${c}`}
              />
            );
          })}

          <label className="yn-modal-color-custom" aria-label="Custom color">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
            <span>+</span>
          </label>
        </div>
      </div>
    </Modal>
  );
}
