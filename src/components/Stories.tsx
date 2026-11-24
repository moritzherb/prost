import { useEffect, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { t } from '../i18n';
import Avatar from './Avatar';
import { CloseIcon } from './Icons';

/*
 * Stories, as on Instagram: who's playing what right now. Placeholders for now (no accounts yet):
 * a line on the home screen with a ring per friend, tap one to see it full screen.
 * shortcut: fixed sample stories, until friends and a backend exist.
 * Off the home screen for now (kept for later): put <StoryBar /> back on page 0 of home/Springboard.tsx
 * and at the top of home/Launcher.tsx.
 */

interface Story {
  name: string;
  color: string;
  game: string;
  emoji: string;
  /** Minutes ago. */
  ago: number;
}

const STORIES: Story[] = [
  { name: 'Lea', color: '#ff8ac0', game: 'Kings Cup', emoji: '👑', ago: 4 },
  { name: 'Tim', color: '#6cb6ff', game: 'Pub Quiz', emoji: '🧠', ago: 12 },
  { name: 'Ida', color: '#ffc93c', game: 'Speed', emoji: '⚡', ago: 25 },
  { name: 'Ben', color: '#7ae582', game: 'Number Flip', emoji: '🎲', ago: 41 },
  { name: 'Mia', color: '#c9a0ff', game: '4er', emoji: '🃏', ago: 58 },
];

/** How long a story shows before the next one (ms). */
const SHOW_MS = 4000;

export function StoryBar() {
  const [open, setOpen] = useState<number | null>(null);
  const [seen, setSeen] = useState<number[]>([]);
  return (
    <>
      {/* Its own sideways scroll: the home screen's page swipe doesn't take it. */}
      <div className="stories" onTouchStart={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()} onTouchEnd={(e) => e.stopPropagation()} onWheel={(e) => e.stopPropagation()}>
        {STORIES.map((s, i) => (
          <button key={s.name} type="button" className={`story${seen.includes(i) ? ' seen' : ''}`} onClick={() => setOpen(i)} aria-label={t('{name}’s story', { name: s.name })}>
            <span className="story-ring">
              <span className="story-face" style={{ '--f': s.color } as CSSProperties}>
                <Avatar name={s.name} color={s.color} />
              </span>
            </span>
            <span className="story-name">{s.name}</span>
          </button>
        ))}
      </div>
      {open != null && (
        <StoryViewer
          at={open}
          onSeen={(i) => setSeen((x) => (x.includes(i) ? x : [...x, i]))}
          onMove={setOpen}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}

function StoryViewer({ at, onSeen, onMove, onClose }: { at: number; onSeen: (i: number) => void; onMove: (i: number) => void; onClose: () => void }) {
  const s = STORIES[at];
  useEffect(() => {
    onSeen(at);
    const id = window.setTimeout(() => (at + 1 < STORIES.length ? onMove(at + 1) : onClose()), SHOW_MS);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [at]);
  return createPortal(
    <div className="story-view" style={{ '--f': s.color } as CSSProperties} role="dialog" aria-label={t('{name}’s story', { name: s.name })}>
      <div className="story-bars">
        {STORIES.map((_, i) => (
          <span key={i} className={`story-bar${i < at ? ' done' : i === at ? ' now' : ''}`}>
            <i key={i === at ? at : undefined} />
          </span>
        ))}
      </div>
      <div className="story-head">
        <span className="story-face small" style={{ '--f': s.color } as CSSProperties}>
          <Avatar name={s.name} color={s.color} />
        </span>
        <span className="story-who">
          <strong>{s.name}</strong> {t('{n} min', { n: s.ago })}
        </span>
        <button type="button" className="story-close" onClick={onClose} aria-label={t('Close')}>
          <CloseIcon />
        </button>
      </div>
      {/* Left half back, right half on, like the real thing. */}
      <button type="button" className="story-tap back" aria-label={t('Back')} onClick={() => (at > 0 ? onMove(at - 1) : undefined)} />
      <button type="button" className="story-tap on" aria-label={t('Next')} onClick={() => (at + 1 < STORIES.length ? onMove(at + 1) : onClose())} />
      <div className="story-body" key={at}>
        <span className="story-emoji">{s.emoji}</span>
        <span className="story-text">{t('Playing {game} right now', { game: s.game })}</span>
      </div>
    </div>,
    document.body,
  );
}
