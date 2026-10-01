import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import App from '../App'

const movie = { Title: 'The Matrix', Year: '1999', imdbID: 'tt0133093', Type: 'movie', Poster: 'N/A' }

beforeEach(() => {
  window.history.pushState({}, '', '/search')
  globalThis.fetch = vi.fn(() => Promise.resolve({ json: () => Promise.resolve({ Search: [movie], Response: 'True' }) }))
})

test('suggestion box closes after a suggestion is picked and stays closed', async () => {
  render(<App />)
  fireEvent.change(screen.getByLabelText(/Search titles/i), { target: { value: 'matrix' } })

  const item = await screen.findByRole('button', { name: 'The Matrix (1999)' })
  fireEvent.click(item)
  expect(screen.queryByRole('button', { name: 'The Matrix (1999)' })).not.toBeInTheDocument()
  expect(window.location.pathname).toBe('/movie/tt0133093')

  // wait past the 300ms debounce so the follow-up lookup has a chance to reopen it
  await new Promise(r => setTimeout(r, 500))
  await waitFor(() => expect(document.querySelector('.suggestions.visible')).toBeNull())
})

test('a slow lookup that finishes after the pick does not reopen the box', async () => {
  // lookups take 250ms, like a real network round trip
  globalThis.fetch = vi.fn(() => new Promise(r => setTimeout(
    () => r({ json: () => Promise.resolve({ Search: [movie], Response: 'True' }) }), 250)))
  render(<App />)
  const input = screen.getByLabelText(/Search titles/i)

  fireEvent.change(input, { target: { value: 'matr' } })
  const item = await screen.findByRole('button', { name: 'The Matrix (1999)' }, { timeout: 2000 })

  // keep typing so a new lookup starts, then pick while it is still in flight
  fireEvent.change(input, { target: { value: 'matrix' } })
  await new Promise(r => setTimeout(r, 350))
  fireEvent.click(item)

  await new Promise(r => setTimeout(r, 300))
  expect(document.querySelector('.suggestions.visible')).toBeNull()
})
