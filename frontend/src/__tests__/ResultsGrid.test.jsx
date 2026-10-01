import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ResultsGrid from '../components/ResultsGrid'

test('ResultsGrid shows no results message when empty', () => {
  render(<ResultsGrid items={[]} />)
  expect(screen.getByText(/No results found./i)).toBeInTheDocument()
})

test('each result card links to its movie details page', () => {
  const items = [{ Title: 'The Matrix', Year: '1999', imdbID: 'tt0133093', Type: 'movie', Poster: 'N/A' }]
  render(<MemoryRouter><ResultsGrid items={items} /></MemoryRouter>)
  expect(screen.getByRole('link', { name: /The Matrix/i })).toHaveAttribute('href', '/movie/tt0133093')
})
