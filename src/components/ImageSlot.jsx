import { SLOTS } from '../slots.js';

const icon = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="m21 15-5-5L5 21" />
  </svg>
);

// Fills its (sized) parent. Shows the image registered for `id` in slots.js, otherwise a quiet placeholder.
export default function ImageSlot({ id, placeholder = '', alt = '', radius = 0 }) {
  const src = SLOTS[id];
  return (
    <div className="slot" style={{ borderRadius: radius }}>
      {src ? (
        <img src={src} alt={alt} loading="lazy" draggable={false} />
      ) : (
        <div className="slot__empty">
          {placeholder && icon}
          {placeholder && <span>{placeholder}</span>}
        </div>
      )}
    </div>
  );
}
