import { render, screen } from '@testing-library/react'
import Blog from './Blog'



test('renders blog', () => {
  const blog = {
    title: 'A lost star',
    author: 'Ben Kek',
    url: 'www.benkek.com',
    likes: 4,
    user: {
      id: 123,
      name: 'Someone',
      username: 'someoneawesome'
    }
  }

  render(<Blog blog={blog} />)
  const element = screen.getByText('A lost star Ben Kek')
  expect(element).toBeDefined()
})