import React from 'react';

interface Props {
  className?: string;
}

const SeatudyLogo: React.FC<Props> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 58 68"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="10" width="38" height="12" rx="6" fill="url(#paint0_linear_96_269)" />
    <rect x="10" y="28" width="38" height="12" rx="6" fill="url(#paint1_linear_96_269)" />
    <rect x="10" y="56" width="38" height="12" rx="6" fill="url(#paint2_linear_96_269)" />
    <rect y="14" width="12" height="12" rx="6" fill="#CF4BFF" />
    <rect x="46" y="42" width="12" height="12" rx="6" fill="#CF4BFF" />
    <defs>
      <linearGradient id="paint0_linear_96_269" x1="10" y1="6" x2="48" y2="6" gradientUnits="userSpaceOnUse">
        <stop stopColor="#44FFFF" />
        <stop offset="1" stopColor="#1755D9" />
      </linearGradient>
      <linearGradient id="paint1_linear_96_269" x1="10" y1="34" x2="48" y2="34" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1AFF00" />
        <stop offset="1" stopColor="#FF9D00" />
      </linearGradient>
      <linearGradient id="paint2_linear_96_269" x1="10" y1="62" x2="48" y2="62" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2E7EF7" />
        <stop offset="1" stopColor="#2FFFAF" />
      </linearGradient>
    </defs>
  </svg>
);

export default SeatudyLogo;
