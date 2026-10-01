import React from 'react'

export default function FilterPanel ({ typeFilter, setTypeFilter, yearFilter, setYearFilter, years, sortMode, setSortMode, clearFilters }) {
  return (
    <div className="controls-panel">
      <div className="control-group">
        <label className="toolbar-field">
          <span>Filter</span>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="movie">Movies</option>
            <option value="series">Series</option>
          </select>
        </label>

        <label className="toolbar-field">
          <span>Year</span>
          <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
            <option value="all">All years</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="control-group control-group-sort">
        <div className="sort-slider-wrap">
          <div className="sort-header">
            <span>Sort</span>
            <strong id="sortValueLabel">{sortMode === 0 ? 'Relevance' : sortMode === 1 ? 'Oldest' : 'Newest'}</strong>
          </div>
          <input id="sortSlider" type="range" min="0" max="2" step="1" value={sortMode} onChange={e => setSortMode(Number(e.target.value))} />
          <div className="sort-scale">
            <span>Relevance</span>
            <span>Oldest</span>
            <span>Newest</span>
          </div>
        </div>

        <button type="button" id="clearFilters" className="clear-filters" onClick={clearFilters}>
          Clear filters
        </button>
      </div>
    </div>
  )
}
