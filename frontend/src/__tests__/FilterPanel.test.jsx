import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import FilterPanel from '../components/FilterPanel'

test('FilterPanel renders controls and clear filters works', () => {
  const props = {
    typeFilter: 'all',
    setTypeFilter: vi.fn(),
    yearFilter: 'all',
    setYearFilter: vi.fn(),
    years: [2022, 2021],
    sortMode: 0,
    setSortMode: vi.fn(),
    clearFilters: vi.fn()
  }
  render(<FilterPanel {...props} />)
  expect(screen.getByLabelText(/Filter/i)).toBeInTheDocument()
  const clearBtn = screen.getByRole('button', { name: /Clear filters/i })
  fireEvent.click(clearBtn)
  expect(props.clearFilters).toHaveBeenCalled()
})
