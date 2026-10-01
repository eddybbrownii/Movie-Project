import React from 'react'

export default function SearchBar ({ query, setQuery, suggestions, onPick, onSubmit }) {
  return (
    <form
      className="search-form"
      onSubmit={e => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <div className="search-field-wrap">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by title or IMDb ID (e.g. tt0111161)"
          aria-label="Search titles"
          autoComplete="off"
        />

        <div className={`suggestions ${suggestions.length ? 'visible' : ''}`}>
          {suggestions.slice(0, 6).map((s, i) => (
            <button key={s.imdbID || i} type="button" className="suggestion-item" onClick={() => onPick(s)}>
              {s.Title} ({s.Year})
            </button>
          ))}
        </div>
      </div>

      <button type="submit"><span>Search</span></button>
    </form>
  )
}
