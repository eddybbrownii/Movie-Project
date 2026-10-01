import { render, screen } from '@testing-library/react'
import App from '../App'

test('renders the brand text', () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: /Movie Masters/i })).toBeInTheDocument()
})
