import { useState } from "react"

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
        </div>
    )
}