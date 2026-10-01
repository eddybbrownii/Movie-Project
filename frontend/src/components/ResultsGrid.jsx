import React from 'react'
import { Link } from 'react-router-dom'

export default function ResultsGrid ({ items, isLoading = false }) {
  if (isLoading) {
    const skeletons = Array.from({ length: 6 })
    return (
      <div id="results" className="skeleton-grid" aria-busy="true">
        {skeletons.map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-img skeleton-animate" />
            <div className="skeleton-content">
              <div className="skeleton-line skeleton-animate" style={{ width: '80%' }} />
              <div className="skeleton-line short skeleton-animate" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!items || items.length === 0) {
    return <div className="no-results">No results found.</div>
  }

  return (
    <div id="results" className="results-grid" aria-live="polite">
      {items.slice(0, 6).map(item => (
        <Link key={item.imdbID} to={`/movie/${item.imdbID}`} className="result-card">
          <img src={item.Poster && item.Poster !== 'N/A' ? item.Poster : 'https://placehold.co/300x450/111827/ffffff?text=No+Image'} alt={item.Title} />
          <div className="result-content">
            <h3>{item.Title}</h3>
            <div className="result-meta">{item.Year} • {item.Type}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}
