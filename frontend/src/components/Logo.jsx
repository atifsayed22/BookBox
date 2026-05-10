export default function Logo({ size = 'md' }) {
  const scale = { sm: 0.75, md: 1, lg: 1.4 };
  const s = scale[size] || 1;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: `${8 * s}px` }}>
      {/* Icon mark */}
      <svg
        width={36 * s}
        height={36 * s}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Rounded blue square */}
        <rect width="36" height="36" rx="9" fill="#1a73e8" />

        {/* Open box bottom */}
        <path
          d="M8 20 L8 27 Q8 28 9 28 L27 28 Q28 28 28 27 L28 20"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Box left flap */}
        <path
          d="M8 20 L18 17 L28 20"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Box ribbon vertical */}
        <line x1="18" y1="17" x2="18" y2="28" stroke="white" strokeWidth="2.2" strokeLinecap="round" />

        {/* Checkmark inside box */}
        <path
          d="M13 23.5 L16 26.5 L23 22"
          stroke="#93c5fd"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Bookmark tag top */}
        <path
          d="M14 8 L14 15 L18 12.5 L22 15 L22 8 Q22 7 21 7 L15 7 Q14 7 14 8 Z"
          fill="white"
          opacity="0.9"
        />
      </svg>

      {/* Wordmark */}
      <span
        style={{
          fontSize: `${22 * s}px`,
          fontWeight: 700,
          letterSpacing: '-0.5px',
          lineHeight: 1,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <span style={{ color: '#1f2937' }}>Book</span>
        <span style={{ color: '#1a73e8' }}>Box</span>
      </span>
    </div>
  );
}
