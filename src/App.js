import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/loginService'
import { BlogForm } from './components/BlogForm'
import { Togglable } from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState({ message: '', error: false })
  const blogToggleRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      updateBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedBlogUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedBlogUserJSON) {
      const parsedUser = JSON.parse(loggedBlogUserJSON)
      blogService.setToken(parsedUser.token)
      setUser(parsedUser)
    }
  }, [])

  const updateBlogs = (blogs) => {
    const sortedBlogsBylikes = blogs
      .concat([])
      .sort((a, b) => a.likes < b.likes ? 1 : a.likes === b.likes ? 0 : -1)
    setBlogs(sortedBlogsBylikes)
  }

  const setMessage = (message, error = false) => {
    setNotification({ message, error })
    setTimeout(() => setNotification({ message: '', error: false }), 3000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      setMessage(`${user.name} is now logged in.`, false)
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log(exception)
      if (exception.response.status === 401) setMessage('Wrong Credentials', true)
      else setMessage('Some error occured.', true)
    }
  }

  const createNewBlog = async (title, author, url) => {
    try {
      const response = await blogService.createBlog({ title, author, url })
      setMessage(`A new blog "${title}" by ${author} added.`)
      updateBlogs(blogs.concat(response))
      blogToggleRef.current.toggleVisibility()
    } catch (exception) {
      console.log('exception: ', exception)
      const error = exception.response.data.error
      setMessage(error ? error : 'invalid data', true)
    }
  }

  const removeUserState = () => {
    window.localStorage.removeItem('loggedBlogUser')
    setMessage('Logged out', false)
    blogService.setToken('')
    setUser(null)
  }

  const handleLikeClick = async (blogToBeUpdated) => {
    try {
      const response = await blogService.updateBlog(blogToBeUpdated)
      updateBlogs(blogs.map(blog => response.id === blog.id ? response : blog))
      setMessage('Liked a blog', false)
    } catch (exception) {
      console.log(exception)
      if (exception.response.status === 401) {
        removeUserState()
        setMessage('Token expired, Please login again', true)
      }
      const error = exception.response.data.error
      setMessage(error ? error : 'invalid data', true)
    }
  }

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="username"
            onChange={(event) => setUsername(event.target.value)} />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type='submit'>Login</button>
      </form>
    </div>
  )

  const blogList = () => (
    <div>
      <h2>blogs</h2>
      <div>
        {user.name} logged in <button onClick={removeUserState}>logout</button>
      </div>
      <Togglable toggleName="create new blog" ref={blogToggleRef}><BlogForm createNewBlog={createNewBlog} /></Togglable>
      <br />
      {
        blogs.map(blog =>
          <Blog key={blog.id} blog={blog} handleLikeClick={handleLikeClick} />
        )
      }
    </div>
  )

  return (
    <div>
      <Notification message={notification.message} error={notification.error} />
      {user === null ? loginForm() : blogList()}
    </div>
  )
}

export default App
