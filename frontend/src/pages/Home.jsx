import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Home () {
  const [play, setPlay] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setPlay(true), 180)
    return () => clearTimeout(t)
  }, [])

  return (
    <main className="container main-content home-main">
      <section className="home-hero">
        <div className={`ticket-wrap ${play ? 'play' : ''}`} aria-hidden={!play}>
          <div className="ticket-book">
            <div className="book">
              <div className="page back">
                <div className="stripe" />
                <div className="ticket-title">Movie Masters</div>
              </div>
              <div className="page front">
                <div className="stripe" />
                <div className="ticket-title">Your next watch awaits</div>
              </div>
            </div>
          </div>
        </div>

        <div className="home-copy">
          <h1>Welcome to Movie Masters</h1>
          <p className="home-tagline">Search movies, series, and explore details powered by OMDb.</p>
          <Link to="/search" className="home-cta">Start Searching</Link>
        </div>
      </section>
    </main>
  )
}
