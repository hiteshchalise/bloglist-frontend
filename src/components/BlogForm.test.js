import { render, screen } from '@testing-library/react'
import { BlogForm } from './BlogForm'
import userEvent from '@testing-library/user-event'


test('form submit is called with proper params', async () => {

  const mockHandler = jest.fn()
  render(<BlogForm createNewBlog={mockHandler} />)
  const user = userEvent.setup()
  const title = screen.getByLabelText(/title/i)
  const author = screen.getByLabelText(/author/i)
  const url = screen.getByLabelText(/url/i)
  const submitButton = screen.getByRole('button', {
    name: /create/i
  })

  await user.type(title, 'Testing Title')
  await user.type(author, 'Testing Author')
  await user.type(url, 'Testing Url')
  await user.click(submitButton)

  expect(mockHandler).toBeCalled()
  expect(mockHandler).toBeCalledWith('Testing Title', 'Testing Author', 'Testing Url')
})