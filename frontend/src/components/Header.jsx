import React from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Header () {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand-link" aria-label="Movie Masters home">
          <div className="brand">
            <Logo size={40} className="logo" title="Movie Masters logo" />
            <div className="brand-text">Movie Masters</div>
          </div>
        </Link>
        <nav className="top-nav">
          <Link to="/">Home</Link>
          <a href="#">About</a>
          <a href="#">Connect</a>
          <a href="#">Contact</a>
        </nav>
      </div>
    </header>
  )
}
