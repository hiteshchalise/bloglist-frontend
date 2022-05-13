import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


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

test('renders blog', () => {
  render(<Blog blog={blog} />)
  const element = screen.getByText('A lost star Ben Kek')
  expect(element).toBeDefined()
})

test('clicking show button shows more blog info', () => {
  render(<Blog blog={blog} />)
  const user = userEvent.setup()
  const button = screen.getByText('show')
  user.click(button)
  const url = screen.getByText('www.benkek.com')
  const likes = screen.getByText('likes 4')
  const name = screen.findByText('Someone')
  expect(url).toBeDefined()
  expect(likes).toBeDefined()
  expect(name).toBeDefined
})

test('clicking like button twice, calls event handler twice', async () => {
  // Setup: rendering and clicking show to display detailed blog
  const mockHandler = jest.fn()
  render(<Blog blog={blog} handleLikeClick={mockHandler} />)
  const user = userEvent.setup()
  const button = screen.getByText('show')
  user.click(button)
  const likeButton = await screen.findByRole('button', {
    name: /like/i
  })

  // Action: clicking like button
  await user.click(likeButton)
  await user.click(likeButton)

  // Assert: handleLikeClick is called twice
  expect(mockHandler).toBeCalledTimes(2)
})