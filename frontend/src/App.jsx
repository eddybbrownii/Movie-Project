import React, { useEffect, useMemo, useState, useRef } from 'react'
import './movie.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import FilterPanel from './components/FilterPanel'
import ResultsGrid from './components/ResultsGrid'
import MoviePage from './pages/MoviePage'
import Home from './pages/Home'

const apiKey = 'd93ed21e'

function useDebounce (value, delay = 300) {
  const [v, setV] = useState (value)
  useEffect (() => {
    const t = setTimeout (() => setV (value), delay)
    return () => clearTimeout (t)
  }, [value, delay])
  return v
}

export default function App () {
  const [query, setQuery] = useState ('batman')
  const debouncedQuery = useDebounce (query, 300)
  const [suggestions, setSuggestions] = useState ([])
  const [results, setResults] = useState ([])
  const [status, setStatus] = useState ('Loading demo results...')
  const [isLoading, setIsLoading] = useState (false)
  const [typeFilter, setTypeFilter] = useState ('all')
  const [yearFilter, setYearFilter] = useState ('all')
  const [years, setYears] = useState ([])
  const [sortMode, setSortMode] = useState (0)
  const suggestionsRef = useRef (null)

  useEffect (() => {
    if (!debouncedQuery || debouncedQuery.trim ().length < 2) {
      setSuggestions ([])
      return
    }
    // don't reopen suggestions for a query that was just picked/submitted
    if (debouncedQuery === suggestionsRef.current) return

    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch (
          `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent (debouncedQuery)}`
        )
        const data = await res.json ()
        if (cancelled) return
        setSuggestions (data.Search || [])
      } catch (e) {
        if (!cancelled) setSuggestions ([])
      }
    }) ()

    return () => {
      cancelled = true
    }
  }, [debouncedQuery])

  function extractImdbId (input) {
    if (!input) return null
    const s = String(input).trim()
    // match tt1234567 anywhere (from URLs or plain)
    const tt = s.match(/tt\d{6,8}/i)
    if (tt) return tt[0].toLowerCase()
    // if numeric only and looks like an id, prepend tt
    const numeric = s.match(/^\d{6,8}$/)
    if (numeric) return `tt${s}`
    return null
  }

  async function runSearch (q) {
    const trimmed = (q || '').trim ()
    if (!trimmed) {
      setStatus ('Please enter a search term.')
      setResults ([])
      return
    }

    setIsLoading(true)
    setStatus ('Searching...')
    setResults ([])

    const imdbId = extractImdbId(trimmed)

    try {
      let data
      if (imdbId) {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${encodeURIComponent(imdbId)}&plot=short`)
        data = await res.json()
        if (data.Response === 'False') {
          setResults([])
          setStatus(data.Error || 'No results found.')
          setYears([])
          setIsLoading(false)
          return
        }
        // API returns a single movie object; normalize to array for UI
        setResults([data])
        setStatus(`Showing 1 result for "${trimmed}"`)
        const y = [Number(data.Year)].filter(n => Number.isFinite(n) && n > 0)
        setYears(y)
        if (!y.includes(Number(yearFilter))) setYearFilter('all')
        setIsLoading(false)
        return
      } else {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(trimmed)}`
        )
        data = await res.json()
        if (data.Response === 'False') {
          setResults([])
          setStatus(data.Error || 'No results found.')
          setYears([])
          setIsLoading(false)
          return
        }

        setResults(data.Search || [])
        setStatus(`Showing ${Math.min((data.Search || []).length, 6)} results for "${trimmed}"`)
        const y = [
          ...new Set(
            (data.Search || [])
              .map(it => Number(it.Year))
              .filter(n => Number.isFinite(n) && n > 0)
              .sort((a, b) => b - a)
          ),
        ]
        setYears(y)
        if (!y.includes(Number(yearFilter))) setYearFilter('all')
      }
      setIsLoading(false)
    } catch (err) {
      console.error (err)
      setStatus ('Something went wrong while loading results.')
      setResults ([])
      setYears ([])
      setIsLoading(false)
    }
  }

  useEffect (() => {
    runSearch (query)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = useMemo (() => {
    let list = [...results]
    if (typeFilter !== 'all') list = list.filter (it => it.Type && it.Type.toLowerCase () === typeFilter)
    if (yearFilter !== 'all') list = list.filter (it => Number (it.Year) === Number (yearFilter))
    if (sortMode === 1) list.sort ((a, b) => Number (a.Year || 0) - Number (b.Year || 0))
    if (sortMode === 2) list.sort ((a, b) => Number (b.Year || 0) - Number (a.Year || 0))
    return list
  }, [results, typeFilter, yearFilter, sortMode])

  function clearFilters () {
    setTypeFilter ('all')
    setYearFilter ('all')
    setSortMode (0)
  }

  function closeSuggestions () {
    suggestionsRef.current = query
    setSuggestions ([])
  }

  function pickSuggestion (item) {
    suggestionsRef.current = item.Title
    setQuery (item.Title)
    setSuggestions ([])
    runSearch (item.Title)
  }

  function submitSearch () {
    closeSuggestions ()
    runSearch (query)
  }

  return (
    <BrowserRouter>
      <div className="app-root">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={(
            <>
              <main className="container main-content">
                <section className="search-panel">
                  <div className="hero-title-wrap">
                    <h1>Movie Masters</h1>
                  </div>

                  <SearchBar query={query} setQuery={setQuery} suggestions={suggestions} onPick={pickSuggestion} onClose={closeSuggestions} onSubmit={submitSearch} />
                  <FilterPanel
                    typeFilter={typeFilter}
                    setTypeFilter={setTypeFilter}
                    yearFilter={yearFilter}
                    setYearFilter={setYearFilter}
                    years={years}
                    sortMode={sortMode}
                    setSortMode={setSortMode}
                    clearFilters={clearFilters}
                  />
                </section>

                <section>
                  <p id="status" className="status">{status}</p>
                  <ResultsGrid items={filtered} isLoading={isLoading} />
                </section>
              </main>
            </>
          )} />

          <Route path="/movie/:id" element={<MoviePage />} />
        </Routes>

        <footer className="site-footer">
          <div className="container footer-inner">
            <div className="footer-brand-wrap">
              <div className="footer-brand">Movie Masters</div>
            </div>
            <div className="footer-links">
              <a href="#">About</a>
              <a href="#">Connect</a>
              <a href="#">Contact</a>
            </div>
            <div className="copyright">© 2026 MovieMakersEntertainment</div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}
