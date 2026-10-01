import React from 'react'

export default function Logo ({
  title = 'Movie Masters',
  size = 40,
  className = '',
  bg = '#fef3c7',
  accent = '#d99a22',
  textColor = '#2c1400',
  ariaHidden = false
}) {
  const w = size
  const h = Math.round(size * (140 / 220)) // keep aspect ratio roughly
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-hidden={ariaHidden}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id="logoGrad" x1="0" x2="1">
          <stop offset="0%" stopColor={bg} />
          <stop offset="100%" stopColor="#ffd59a" />
        </linearGradient>
      </defs>
      <rect x="4" y="12" width="56" height="40" rx="6" fill="url(#logoGrad)" stroke={accent} strokeWidth="1.5" />
      <circle cx="12" cy="32" r="4" fill={accent} />
      <circle cx="52" cy="32" r="4" fill={accent} />
      <text x="32" y="38" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="18" textAnchor="middle" fill={textColor}>MM</text>
    </svg>
  )
}
