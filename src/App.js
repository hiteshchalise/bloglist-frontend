import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/loginService'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState({ message: '', error: false })
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
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

  const setMessage = (message, error = false) => {
    setNotification({ message, error })
    setTimeout(() => setNotification({ message: '', error: false }), 5000)
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
      setMessage('wrong credentials', true)
    }
  }

  const handleNewBlogSubmit = async (event) => {
    event.preventDefault()
    console.log('adding a new blog with: ', title, author, url)
    try {
      const response = await blogService.createBlog({ title, author, url })
      setMessage(`A new blog "${title}" by ${author} added.`)
      setBlogs(blogs.concat(response))
    } catch (exception) {
      console.log('exception: ', exception)
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
        {user.name} logged in <button onClick={() => {
          window.localStorage.removeItem('loggedBlogUser')
          setMessage('Logged out', false)
          blogService.setToken('')
          setUser(null)
        }}>logout</button>
      </div>
      <h2>create new</h2>
      <form onSubmit={handleNewBlogSubmit}>
        <div>title:
          <input
            type="text"
            value={title}
            name="title"
            onChange={(event) => setTitle(event.target.value)} />
        </div>
        <div>author:
          <input
            type="text"
            value={author}
            name="author"
            onChange={(event) => setAuthor(event.target.value)} />
        </div>
        <div>url:
          <input
            type="text"
            value={url}
            name="url"
            onChange={(event) => setUrl(event.target.value)} />
        </div>
        <button type='submit'>create</button>
      </form>
      <br />
      {
        blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
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
