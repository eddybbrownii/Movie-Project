import React from 'react'

// faint ticket stubs scattered behind the page (decorative only)
export default function TicketCollage () {
  return (
    <div className="ticket-collage" aria-hidden="true">
      {[1, 2, 3, 4, 5, 6].map(n => (
        <span key={n} className={`ticket ticket-${n}`} />
      ))}
    </div>
  )
}
