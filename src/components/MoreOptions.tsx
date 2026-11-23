import { useState, type ReactNode } from 'react';
import { t } from '../i18n';
import { ChevronIcon } from './Icons';

/**
 * Settings most groups never touch, folded away under one quiet line that says what they're set to
 * (fewer choices on the first look: Hick's law). Tap to open.
 */
export default function MoreOptions({ summary, children }: { summary: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`more-opts${open ? ' open' : ''}`}>
      <button type="button" className="more-opts-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span>{t('More options')}</span>
        <span className="more-opts-summary">{summary}</span>
        <ChevronIcon />
      </button>
      {open && <div className="more-opts-body">{children}</div>}
    </div>
  );
}
