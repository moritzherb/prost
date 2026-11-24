import { useEffect, useState } from 'react';
import { t } from '../i18n';
import { useRoom } from '../net/RoomProvider';
import Glyph from '../components/Glyph';

/**
 * Big pop-up when anyone in the room taps "Cheers!". Shows on every screen: it slides down from the
 * top and back up the same way, keeping its words while it goes (a transition, so a second cheers
 * mid-way just carries on).
 */
export default function CheersToast() {
  const { cheers } = useRoom();
  const [visible, setVisible] = useState<typeof cheers>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!cheers) return;
    setVisible(cheers);
    setOpen(true);
    const timeout = setTimeout(() => setOpen(false), 2200);
    return () => clearTimeout(timeout);
  }, [cheers]);

  if (!visible) return null;
  // The name is bold, so split the sentence around it.
  const [before, after] = t('{name} says cheers').split('{name}');
  return (
    <div className={`toast${open ? ' open' : ''}`} role="status" aria-hidden={!open}>
      <span className="toast-emoji">
        <Glyph name="cheers" />
      </span>
      <span>
        {before}
        <strong>{visible.name}</strong>
        {after}
      </span>
    </div>
  );
}
