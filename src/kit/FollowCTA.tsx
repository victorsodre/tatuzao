import { InstagramIcon, YoutubeIcon } from './icons.tsx';
import { INSTAGRAM_PROFILE, YOUTUBE_SUBSCRIBE } from './social.ts';
import { track } from './track.ts';
import './follow.css';

/** Convite para seguir: Instagram primeiro (rede principal), YouTube depois. */
export function FollowCTA({ compact = false, label = 'Gostou? Tem um vídeo novo assim todo dia.' }: { compact?: boolean; label?: string }) {
  return <div className={'ovl-follow' + (compact ? ' ovl-follow--compact' : '')}>
    {!compact && <p>{label}</p>}
    <div className="ovl-follow-actions">
      <a className="ovl-follow-primary" href={INSTAGRAM_PROFILE} target="_blank" rel="noreferrer" onClick={() => track('follow', 'instagram')}><InstagramIcon/>Seguir @ovictorlab</a>
      <a className="ovl-follow-secondary" href={YOUTUBE_SUBSCRIBE} target="_blank" rel="noreferrer" onClick={() => track('follow', 'youtube')}><YoutubeIcon/>Inscrever no YouTube</a>
    </div>
  </div>;
}
