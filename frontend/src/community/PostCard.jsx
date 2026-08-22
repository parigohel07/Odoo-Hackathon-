import { useState } from 'react'
import {
  Bookmark, Heart, MapPin, MessageCircle, Pencil, SendHorizonal, Trash2, Users, X,
} from 'lucide-react'
import Card from '../common/Card'
import { cn } from '../common/cn'
import { useUser } from '../context/user'
import { getCategoryMeta } from '../data/communityCategories'
import PostForm from './PostForm'
import { gradientFor, initialsOf } from '../utils/avatar'
import { timeAgo } from '../utils/time'

const CONTENT_CLAMP = 300

export default function PostCard({
  post,
  badge,
  onUpdate,
  onDelete,
  onToggleLike,
  onToggleSave,
  onAddComment,
  onDeleteComment,
}) {
  const { user } = useUser()
  const myEmail = user?.email || ''
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [commentDraft, setCommentDraft] = useState('')

  const liked = post.likedBy.includes(myEmail)
  const saved = post.savedBy.includes(myEmail)
  const isOwner = post.authorId === myEmail
  const category = getCategoryMeta(post.category)
  const isLong = post.content.length > CONTENT_CLAMP

  const submitComment = (event) => {
    event.preventDefault()
    const content = commentDraft.trim()
    if (!content) return
    onAddComment(content)
    setCommentDraft('')
  }

  const avatar = (
    <span className={`flex size-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-sm font-bold text-white shadow-sm ${gradientFor(post.authorName)}`}>
      {initialsOf(post.authorName)}
    </span>
  )

  return (
    <Card hoverable className={cn('p-5', post.buddyWanted && 'border-lav-300/70 bg-lav-50/40 dark:bg-lav-500/5')}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {avatar}
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm font-semibold text-ink">
              <span className="truncate">{post.authorName}</span>
              {isOwner && (
                <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-bold text-primary-strong">YOU</span>
              )}
              {badge && (
                <span className="text-[11px] font-medium text-ink-muted" title={`${badge.label} · ${badge.count} stories`}>
                  {badge.emoji} {badge.label}
                </span>
              )}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-muted">
              <MapPin className="size-3 shrink-0" aria-hidden />
              <span className="truncate">{post.place}</span>
              <span aria-hidden>·</span>
              <span className="shrink-0">{timeAgo(post.createdAt)}</span>
            </p>
          </div>
        </div>

        {!editing && (
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="rounded-full bg-surface-2 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wide text-ink-muted uppercase">
              {category.emoji} {category.value}
            </span>
            {isOwner && (
              <>
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  aria-label="Edit post"
                  title="Edit post"
                  className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-surface-2 hover:text-primary"
                >
                  <Pencil className="size-3.5" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={onDelete}
                  aria-label="Delete post"
                  title="Delete post"
                  className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-500/15"
                >
                  <Trash2 className="size-3.5" aria-hidden />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {post.buddyWanted && !editing && (
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-lav-100 px-3 py-1 text-xs font-bold text-lav-600 dark:bg-lav-500/15 dark:text-lav-300">
          <Users className="size-3.5" aria-hidden />
          👋 Open to travel buddies — say hi!
        </p>
      )}

      {editing ? (
        <div className="mt-4 border-t border-line pt-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-display text-sm font-bold text-ink">Editing your story</p>
            <button
              type="button"
              onClick={() => setEditing(false)}
              aria-label="Cancel editing"
              className="cursor-pointer text-ink-muted transition-colors hover:text-ink"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
          <PostForm
            initial={post}
            submitLabel="Save changes"
            onSubmit={(values) => {
              onUpdate(values)
              setEditing(false)
            }}
          />
        </div>
      ) : (
        <>
          <h3 className="font-display mt-3 text-lg leading-snug font-bold text-ink">{post.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-wrap text-ink">
            {expanded || !isLong ? post.content : `${post.content.slice(0, CONTENT_CLAMP)}…`}
          </p>
          {isLong && (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="mt-1 cursor-pointer text-xs font-semibold text-primary transition-colors hover:text-primary-strong"
            >
              {expanded ? 'Show less ↑' : 'Read more ↓'}
            </button>
          )}
        </>
      )}

      {!editing && (
        <>
          <div className="my-3 border-t border-dashed border-line" />

          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={onToggleLike}
              aria-pressed={liked}
              aria-label={liked ? 'Unlike' : 'Like'}
              className={cn(
                'flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all active:scale-95',
                liked ? 'bg-candy-100 text-candy-600 dark:bg-candy-500/15 dark:text-candy-300' : 'text-ink-muted hover:bg-surface-2',
              )}
            >
              <Heart key={`${post.id}-${liked}`} size={15} fill={liked ? 'currentColor' : 'none'} className={cn(liked && 'animate-pop')} />
              {post.likedBy.length > 0 ? post.likedBy.length : 'Like'}
            </button>

            <button
              type="button"
              onClick={() => setCommentsOpen((prev) => !prev)}
              aria-expanded={commentsOpen}
              aria-label="Toggle comments"
              className={cn(
                'flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all active:scale-95',
                commentsOpen ? 'bg-primary-soft text-primary-strong' : 'text-ink-muted hover:bg-surface-2',
              )}
            >
              <MessageCircle size={15} aria-hidden />
              {post.comments.length > 0 ? post.comments.length : 'Reply'}
            </button>

            <button
              type="button"
              onClick={onToggleSave}
              aria-pressed={saved}
              aria-label={saved ? 'Remove bookmark' : 'Bookmark'}
              className={cn(
                'ml-auto flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all active:scale-95',
                saved ? 'bg-caramel-100 text-caramel-600 dark:bg-caramel-500/15 dark:text-caramel-300' : 'text-ink-muted hover:bg-surface-2',
              )}
            >
              <Bookmark size={15} fill={saved ? 'currentColor' : 'none'} />
              {saved ? 'Saved' : 'Save'}
            </button>
          </div>

          {commentsOpen && (
            <div className="mt-3 space-y-3 border-t border-dashed border-line pt-3">
              {post.comments.length === 0 && (
                <p className="text-xs text-ink-muted">No replies yet — start the conversation 👇</p>
              )}
              <ul className="space-y-3">
                {post.comments.map((comment) => (
                  <li key={comment.id} className="flex items-start gap-2.5">
                    <span className={`flex size-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-[10px] font-bold text-white ${gradientFor(comment.authorName)}`}>
                      {initialsOf(comment.authorName)}
                    </span>
                    <div className="min-w-0 flex-1 rounded-xl bg-surface-2/70 px-3 py-2">
                      <p className="flex flex-wrap items-center gap-x-2 text-xs">
                        <span className="font-semibold text-ink">{comment.authorName}</span>
                        <span className="text-ink-muted">{timeAgo(comment.createdAt)}</span>
                      </p>
                      <p className="mt-0.5 text-sm break-words whitespace-pre-wrap text-ink">{comment.content}</p>
                    </div>
                    {comment.authorId === myEmail && (
                      <button
                        type="button"
                        onClick={() => onDeleteComment(comment.id)}
                        aria-label="Delete comment"
                        title="Delete comment"
                        className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-ink-muted opacity-60 transition-all hover:bg-red-100 hover:text-red-500 hover:opacity-100 dark:hover:bg-red-500/15"
                      >
                        <Trash2 className="size-3.5" aria-hidden />
                      </button>
                    )}
                  </li>
                ))}
              </ul>

              <form onSubmit={submitComment} className="flex items-center gap-2">
                {avatar}
                <input
                  value={commentDraft}
                  onChange={(event) => setCommentDraft(event.target.value)}
                  placeholder={`Add a reply as ${user?.name?.split(' ')[0] || 'you'}…`}
                  aria-label="Write a reply"
                  className="h-10 w-full rounded-xl border border-line bg-page px-3.5 text-sm text-ink transition-all placeholder:text-ink-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!commentDraft.trim()}
                  aria-label="Send reply"
                  className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-primary text-white shadow-sm shadow-primary/30 transition-all hover:bg-primary-strong active:scale-95 disabled:pointer-events-none disabled:opacity-50 dark:text-espresso-950"
                >
                  <SendHorizonal className="size-4" aria-hidden />
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </Card>
  )
}
