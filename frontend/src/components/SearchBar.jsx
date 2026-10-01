import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SearchBar ({ query, setQuery, suggestions, onPick, onSubmit, onClose }) {
  const wrapRef = useRef(null)
  const navigate = useNavigate()
  const isOpen = suggestions.length > 0

  // close the suggestion box when clicking anywhere outside the search field
  useEffect(() => {
    if (!isOpen || !onClose) return
    function handleClick (e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen, onClose])

  return (
    <form
      className="search-form"
      onSubmit={e => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <div className="search-field-wrap" ref={wrapRef}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => { if (e.key === 'Escape' && onClose) onClose() }}
          placeholder="Search by title or IMDb ID (e.g. tt0111161)"
          aria-label="Search titles"
          autoComplete="off"
        />

        <div className={`suggestions ${isOpen ? 'visible' : ''}`}>
          {suggestions.slice(0, 6).map((s, i) => (
            <button key={s.imdbID || i} type="button" className="suggestion-item" onClick={() => {
              onPick(s)
              if (s.imdbID) navigate(`/movie/${s.imdbID}`)
            }}>
              {s.Title} ({s.Year})
            </button>
          ))}
        </div>
      </div>

      <button type="submit"><span>Search</span></button>
    </form>
  )
}
