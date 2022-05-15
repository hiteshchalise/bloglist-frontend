import { useState } from 'react'

export const BlogForm = ({ createNewBlog }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleNewBlogSubmit = async (event) => {
    event.preventDefault()
    createNewBlog(title, author, url)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>

      <h2>create new</h2>
      <form onSubmit={handleNewBlogSubmit}>
        <div>
          <label htmlFor='title'> title:</label>
          <input
            id='title'
            type="text"
            value={title}
            name="title"
            onChange={(event) => setTitle(event.target.value)} />
        </div>
        <div>
          <label htmlFor='author'>author: </label>
          <input
            id='author'
            type="text"
            value={author}
            name="author"
            onChange={(event) => setAuthor(event.target.value)} />
        </div>
        <div>
          <label htmlFor='url'>url: </label>
          <input
            id='url'
            type="text"
            value={url}
            name="url"
            onChange={(event) => setUrl(event.target.value)} />
        </div>
        <button id='blog-submit-button' type='submit'>create</button>
      </form>
    </div>
  )
}