import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Home () {
  const [play, setPlay] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setPlay(true), 180)
    return () => clearTimeout(t)
  }, [])

  return (
    <main className="container main-content">
      <section style={{textAlign: 'center'}}>
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

        <div style={{paddingTop: 12}}>
          <h1>Welcome to Movie Masters</h1>
          <p style={{color: 'var(--text-soft)'}}>Search movies, series, and explore details powered by OMDb.</p>
          <div style={{marginTop:16}}>
            <Link to="/search"><button style={{padding:'10px 16px', borderRadius:8, background:'var(--button)', color:'#fff', border:0}}>Start Searching</button></Link>
          </div>
        </div>
      </section>
    </main>
  )
}
