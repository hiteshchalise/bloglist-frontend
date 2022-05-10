import { useState } from "react"

const blogStyle = {
  border: 'solid',
  borderColor: 'gray',
  borderWidth: 1,
  marginBottom: 5,
  paddingTop: 10,
  paddingBottom: 2,
}

const Blog = ({ blog, handleLikeClick }) => {

  const [show, setShow] = useState(false)

  const changeShowState = () => setShow(!show)
  const activatedWhenShow = { display: show ? '' : 'none' }
  const handleLikeButton = () => {
    handleLikeClick({
      ...blog,
      likes: blog.likes + 1
    })
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={changeShowState} >{show ? 'hide' : 'show'}</button>
      <div style={activatedWhenShow}>
        <div>{blog.url}</div>
        <div>likes {blog.likes}<button onClick={handleLikeButton}>like</button></div>
        <div> {blog.user.name}</div>
      </div>
    </div>
  )
}

export default Blog