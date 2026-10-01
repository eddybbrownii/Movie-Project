import { render, screen } from '@testing-library/react'
import ResultsGrid from '../components/ResultsGrid'

test('ResultsGrid shows no results message when empty', () => {
  render(<ResultsGrid items={[]} />)
  expect(screen.getByText(/No results found./i)).toBeInTheDocument()
})
