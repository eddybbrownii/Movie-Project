import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import SearchBar from '../components/SearchBar'

test('SearchBar renders and accepts input', () => {
  const mockSetQuery = vi.fn()
  const mockOnSubmit = vi.fn()
  render(<MemoryRouter><SearchBar query="" setQuery={mockSetQuery} suggestions={[]} onPick={() => {}} onSubmit={mockOnSubmit} /></MemoryRouter>)
  const input = screen.getByPlaceholderText(/Search by title or IMDb ID/i)
  expect(input).toBeInTheDocument()
  fireEvent.change(input, { target: { value: 'batman' } })
  expect(mockSetQuery).toHaveBeenCalled()
})
