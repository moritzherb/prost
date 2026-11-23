import { useState } from 'react';
import { t } from '../i18n';
import { usePersistentState } from '../lib/storage';
import { useProfile } from '../net/profile';
import Avatar from './Avatar';
import BigButton from './BigButton';
import { PLAYER_COLORS } from '../state/AppState';

/*
 * Friends: your own code to hand out, and the friends you've added by theirs. Kept on this phone
 * for now (placeholders until there are accounts to look codes up in).
 * shortcut: friends stored locally by code and name only, until a backend can resolve codes.
 */

interface Friend {
  code: string;
  name: string;
}

/** A short code from this phone's id: easy to read out, the same every time. */
export const friendCode = (id: string) => id.replace(/[^a-z0-9]/gi, '').slice(0, 8).toUpperCase().replace(/(.{4})/, '$1-');

export default function Friends() {
  const { profile } = useProfile();
  const [friends, setFriends] = usePersistentState<Friend[]>('friends', []);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const mine = friendCode(profile.clientId);
  const clean = code.replace(/[^a-z0-9]/gi, '').toUpperCase();
  const ok = clean.length === 8 && name.trim().length > 0 && clean !== mine.replace('-', '') && !friends.some((f) => f.code === clean);
  return (
    <div className="friends">
      <div className="friends-code">
        <span className="setting-hint">{t('Your friend code')}</span>
        <strong>{mine}</strong>
      </div>
      <div className="friends-add">
        <input className="friends-input" value={code} onChange={(e) => setCode(e.target.value)} placeholder={t('Their code')} maxLength={9} autoCapitalize="characters" />
        <input className="friends-input" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('Their name')} maxLength={18} />
        <BigButton
          disabled={!ok}
          onClick={() => {
            setFriends([...friends, { code: clean, name: name.trim() }]);
            setCode('');
            setName('');
          }}
        >
          {t('Add friend')}
        </BigButton>
      </div>
      {friends.length ? (
        <ul className="friends-list">
          {friends.map((f, i) => (
            <li key={f.code}>
              <span className="friends-face">
                <Avatar name={f.name} color={PLAYER_COLORS[i % PLAYER_COLORS.length]} />
              </span>
              <span className="friends-name">{f.name}</span>
              <button type="button" className="text-btn" onClick={() => setFriends(friends.filter((x) => x.code !== f.code))}>
                {t('Remove')}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="fine-print center">{t('No friends added yet. Swap codes with your crew.')}</p>
      )}
    </div>
  );
}
