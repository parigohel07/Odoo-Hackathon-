import { useEffect, useState } from 'react'
import { COMMUNITY_POSTS } from '../data/communitySeed'
import { useUser } from './user'
import { CommunityContext } from './community'

const STORAGE_KEY = 'globetrotter-community'

function loadPosts() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    const parsed = stored ? JSON.parse(stored) : null
    return Array.isArray(parsed) ? parsed : COMMUNITY_POSTS
  } catch (error) {
    console.warn('Could not load community posts, falling back to seed data.', error)
    return COMMUNITY_POSTS
  }
}

const makeId = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`

export function CommunityProvider({ children }) {
  const [posts, setPosts] = useState(loadPosts)
  const { user } = useUser()

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
  }, [posts])

  const myEmail = user?.email || ''

  const addPost = ({ title, place, category, content, buddyWanted }) => {
    if (!myEmail) return null
    const post = {
      id: makeId('p'),
      authorId: myEmail,
      authorName: user.name,
      title,
      place,
      category,
      content,
      buddyWanted: Boolean(buddyWanted),
      createdAt: new Date().toISOString(),
      likedBy: [],
      savedBy: [],
      comments: [],
    }
    setPosts((prev) => [post, ...prev])
    return post
  }

  const updatePost = (postId, patch) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId && post.authorId === myEmail ? { ...post, ...patch } : post,
      ),
    )
  }

  const deletePost = (postId) => {
    setPosts((prev) => prev.filter((post) => !(post.id === postId && post.authorId === myEmail)))
  }

  const toggleLike = (postId) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post
        const liked = post.likedBy.includes(myEmail)
        return { ...post, likedBy: liked ? post.likedBy.filter((e) => e !== myEmail) : [...post.likedBy, myEmail] }
      }),
    )
  }

  const toggleSave = (postId) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post
        const saved = post.savedBy.includes(myEmail)
        return { ...post, savedBy: saved ? post.savedBy.filter((e) => e !== myEmail) : [...post.savedBy, myEmail] }
      }),
    )
  }

  const addComment = (postId, content) => {
    if (!myEmail) return
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                { id: makeId('c'), authorId: myEmail, authorName: user.name, content, createdAt: new Date().toISOString() },
              ],
            }
          : post,
      ),
    )
  }

  const deleteComment = (postId, commentId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, comments: post.comments.filter((c) => !(c.id === commentId && c.authorId === myEmail)) }
          : post,
      ),
    )
  }

  return (
    <CommunityContext.Provider
      value={{ posts, addPost, updatePost, deletePost, toggleLike, toggleSave, addComment, deleteComment }}
    >
      {children}
    </CommunityContext.Provider>
  )
}
