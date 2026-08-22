import { useMemo, useState } from 'react'
import {
  BookOpenText, Hand, Heart, Lock, MessageSquareText, PenLine, Sparkles, Trophy, X,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import PageContainer from '../../components/layout/PageContainer'
import Button from '../../common/Button'
import Card from '../../common/Card'
import Confetti from '../../common/Confetti'
import EmptyState from '../../common/EmptyState'
import Searchbar from '../../common/Searchbar'
import PostCard from '../../community/PostCard'
import PostForm from '../../community/PostForm'
import { cn } from '../../common/cn'
import { useUser } from '../../context/user'
import { useCommunity } from '../../context/community'
import { COMMUNITY_CATEGORIES, authorBadge } from '../../data/communityCategories'
import { gradientFor, initialsOf } from '../../utils/avatar'

const TABS = [
  { value: 'all', label: 'All stories', emoji: '📖' },
  { value: 'buddies', label: 'Buddies wanted', emoji: '👋' },
  { value: 'saved', label: 'Saved', emoji: '🔖' },
  { value: 'mine', label: 'My stories', emoji: '✍️' },
]

const SORTS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'liked', label: 'Most loved' },
  { value: 'discussed', label: 'Most discussed' },
]

export default function Community() {
  const { user } = useUser()
  const { posts, addPost, updatePost, deletePost, toggleLike, toggleSave, addComment, deleteComment } = useCommunity()

  const [tab, setTab] = useState('all')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [composerOpen, setComposerOpen] = useState(false)
  const [celebrating, setCelebrating] = useState(false)

  const myEmail = user?.email || ''

  // Author stats power both the badges and the leaderboard.
  const authorStats = useMemo(() => {
    const map = new Map()
    for (const post of posts) {
      const entry = map.get(post.authorId) || {
        name: post.authorName, posts: 0, likesReceived: 0, commentsReceived: 0,
      }
      entry.posts += 1
      entry.likesReceived += post.likedBy.length
      entry.commentsReceived += post.comments.length
      if (!map.has(post.authorId)) map.set(post.authorId, entry)
    }
    return map
  }, [posts])

  const badgeFor = (authorId) => {
    const stats = authorStats.get(authorId)
    const base = stats ? authorBadge(stats.posts) : null
    return base ? { ...base, count: stats.posts } : null
  }

  const counts = useMemo(
    () => ({
      all: posts.length,
      buddies: posts.filter((p) => p.buddyWanted).length,
      saved: posts.filter((p) => p.savedBy.includes(myEmail)).length,
      mine: posts.filter((p) => p.authorId === myEmail).length,
    }),
    [posts, myEmail],
  )

  const categoryCounts = useMemo(() => {
    const map = new Map()
    for (const post of posts) map.set(post.category, (map.get(post.category) || 0) + 1)
    return map
  }, [posts])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    let out = posts.filter((post) => {
      if (tab === 'buddies' && !post.buddyWanted) return false
      if (tab === 'saved' && !post.savedBy.includes(myEmail)) return false
      if (tab === 'mine' && post.authorId !== myEmail) return false
      if (category && post.category !== category) return false
      if (!q) return true
      return [post.title, post.place, post.content, post.authorName]
        .some((field) => String(field).toLowerCase().includes(q))
    })
    if (sortBy === 'newest') out = [...out].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    if (sortBy === 'oldest') out = [...out].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    if (sortBy === 'liked') out = [...out].sort((a, b) => b.likedBy.length - a.likedBy.length)
    if (sortBy === 'discussed') out = [...out].sort((a, b) => b.comments.length - a.comments.length)
    return out
  }, [posts, tab, query, category, sortBy, myEmail])

  const myStats = authorStats.get(myEmail) || { name: user?.name, posts: 0, likesReceived: 0, commentsReceived: 0 }
  const myBadge = authorBadge(myStats.posts)

  const leaderboard = useMemo(
    () =>
      [...authorStats.entries()]
        .map(([email, stats]) => ({ email, ...stats, score: stats.likesReceived * 2 + stats.commentsReceived * 2 + stats.posts * 10 }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5),
    [authorStats],
  )
  const MEDALS = ['🥇', '🥈', '🥉']

  const handleAddPost = (values) => {
    const isFirstStory = counts.mine === 0
    addPost(values)
    setComposerOpen(false)
    if (isFirstStory) {
      setCelebrating(true)
      setTimeout(() => setCelebrating(false), 3200)
    }
  }

  const totalHearts = posts.reduce((sum, p) => sum + p.likedBy.length, 0)
  const totalReplies = posts.reduce((sum, p) => sum + p.comments.length, 0)

  return (
    <div className="min-h-svh">
      {celebrating && <Confetti seed={7} />}

      <Navbar />
      <PageContainer size="lg">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">Community</p>
            <h1 className="font-display mt-1.5 text-4xl font-semibold tracking-tight text-ink">
              The travellers&apos; lounge
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
              Real trips, real tips — swap stories, steal itineraries and find your next travel buddies.
            </p>
          </div>
          <span className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink-muted">
            📚 {posts.length} stories · ❤️ {totalHearts} · 💬 {totalReplies}
          </span>
        </header>

        {/* Tabs */}
        {!myEmail ? (
          <Card className="mb-6 flex items-center gap-2 px-4 py-3 text-sm text-ink-muted">
            <Lock className="size-4 shrink-0" aria-hidden />
            Log in to share your own travel experiences and reply to fellow travellers.
          </Card>
        ) : composerOpen ? (
          <Card className="mb-6 p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-display flex items-center gap-2 text-lg font-bold text-ink">
                <PenLine className="size-5 text-primary" aria-hidden />
                Share an experience
              </h2>
              <button
                type="button"
                onClick={() => setComposerOpen(false)}
                aria-label="Close composer"
                className="cursor-pointer rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <PostForm onSubmit={handleAddPost} onCancel={() => setComposerOpen(false)} />
          </Card>
        ) : (
          <Button onClick={() => setComposerOpen(true)} className="mb-6">
            <PenLine className="size-4" aria-hidden />
            Share an experience
          </Button>
        )}

        {/* Tab pills */}
        <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Feed tabs">
          {TABS.map(({ value, label, emoji }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              aria-pressed={tab === value}
              className={cn(
                'flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-all active:scale-95',
                tab === value
                  ? 'bg-primary text-white shadow-sm shadow-primary/30 dark:text-espresso-950'
                  : 'border border-line bg-surface text-ink-muted hover:border-primary/40 hover:text-primary',
              )}
            >
              <span role="img" aria-hidden>{emoji}</span>
              {label}
              <span className={cn('rounded-full px-1.5 text-[11px] font-bold tabular-nums', tab === value ? 'bg-white/25 dark:bg-espresso-950/20' : 'bg-surface-2')}>
                {counts[value]}
              </span>
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Feed */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Searchbar
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onClear={() => setQuery('')}
                placeholder="Search stories by place, title or traveller…"
                className="sm:flex-1"
              />
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                aria-label="Sort stories"
                className="h-11 cursor-pointer appearance-none rounded-xl border border-line bg-surface px-4 text-sm font-medium text-ink transition-colors hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none"
              >
                {SORTS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              <button
                type="button"
                onClick={() => setCategory('')}
                aria-pressed={category === ''}
                className={cn(
                  'cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold transition-all active:scale-95',
                  category === ''
                    ? 'bg-ink text-page dark:bg-page dark:text-ink'
                    : 'border border-line bg-surface text-ink-muted hover:border-primary/40 hover:text-primary',
                )}
              >
                All topics
              </button>
              {COMMUNITY_CATEGORIES.map(({ value, emoji }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCategory((prev) => (prev === value ? '' : value))}
                  aria-pressed={category === value}
                  className={cn(
                    'cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold transition-all active:scale-95',
                    category === value
                      ? 'bg-ink text-page dark:bg-page dark:text-ink'
                      : 'border border-line bg-surface text-ink-muted hover:border-primary/40 hover:text-primary',
                  )}
                >
                  <span role="img" aria-hidden>{emoji}</span> {value}
                  <span className="ml-1 opacity-60">{categoryCounts.get(value) || 0}</span>
                </button>
              ))}
            </div>

            {results.length === 0 ? (
              <EmptyState
                icon={BookOpenText}
                title={
                  tab === 'saved' && counts.saved === 0
                    ? 'No bookmarks yet'
                    : tab === 'mine' && counts.mine === 0
                      ? 'You have not posted yet'
                      : tab === 'buddies' && counts.buddies === 0
                        ? 'Nobody is looking for buddies right now'
                        : 'Nothing matches your filters'
                }
                description={
                  tab === 'mine' && counts.mine === 0
                    ? 'Your first story earns you the 🥾 Explorer badge — plus confetti, obviously.'
                    : tab === 'buddies' && counts.buddies === 0
                      ? 'Planning something? Tick “looking for travel buddies” when you post!'
                      : 'Try a different search term, topic or tab.'
                }
              />
            ) : (
              <ul className="space-y-4">
                {results.map((post) => (
                  <li key={post.id}>
                    <PostCard
                      post={post}
                      badge={badgeFor(post.authorId)}
                      onUpdate={(values) => updatePost(post.id, values)}
                      onDelete={() => deletePost(post.id)}
                      onToggleLike={() => toggleLike(post.id)}
                      onToggleSave={() => toggleSave(post.id)}
                      onAddComment={(content) => addComment(post.id, content)}
                      onDeleteComment={(commentId) => deleteComment(post.id, commentId)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Card className="p-5">
              <h3 className="font-display flex items-center gap-2 text-base font-bold text-ink">
                <Sparkles className="size-4 text-primary" aria-hidden />
                Your travel voice
              </h3>
              <div className="mt-3 flex items-center gap-3">
                <span className={`flex size-12 items-center justify-center rounded-full bg-linear-to-br text-base font-bold text-white shadow-sm ${gradientFor(user?.name)}`}>
                  {initialsOf(user?.name)}
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">{user?.name}</p>
                  <p className="text-xs text-ink-muted">
                    {myBadge ? `${myBadge.emoji} ${myBadge.label}` : '🌱 Newcomer — first story pending'}
                  </p>
                </div>
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'Stories', value: myStats.posts, icon: BookOpenText },
                  { label: 'Hearts', value: myStats.likesReceived, icon: Heart },
                  { label: 'Replies', value: myStats.commentsReceived, icon: MessageSquareText },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded-xl bg-surface-2/70 px-2 py-3">
                    <Icon className="mx-auto size-4 text-primary" aria-hidden />
                    <dd className="font-display mt-1 text-xl font-bold tabular-nums text-ink">{value}</dd>
                    <dt className="text-[10px] font-semibold tracking-wide text-ink-muted uppercase">{label}</dt>
                  </div>
                ))}
              </dl>
              {myStats.likesReceived >= 3 && (
                <p className="mt-3 rounded-xl bg-candy-100 px-3 py-2 text-xs font-medium text-candy-700 dark:bg-candy-500/15 dark:text-candy-200">
                  ❤️ Your stories have collected {myStats.likesReceived} hearts. Keep them coming!
                </p>
              )}
            </Card>

            <Card className="p-5">
              <h3 className="font-display flex items-center gap-2 text-base font-bold text-ink">
                <Trophy className="size-4 text-caramel-500" aria-hidden />
                Top storytellers
              </h3>
              {leaderboard.length === 0 ? (
                <p className="mt-3 text-xs text-ink-muted">No stories yet — claim spot #1!</p>
              ) : (
                <ol className="mt-3 space-y-2.5">
                  {leaderboard.map((entry, index) => (
                    <li
                      key={entry.email}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-2.5 py-2',
                        entry.email === myEmail && 'bg-primary-soft',
                      )}
                    >
                      <span className="w-6 shrink-0 text-center text-sm font-bold" aria-hidden>
                        {MEDALS[index] ?? `${index + 1}.`}
                      </span>
                      <span className={`flex size-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-[11px] font-bold text-white ${gradientFor(entry.name)}`}>
                        {initialsOf(entry.name)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">
                          {entry.name}{entry.email === myEmail && ' (you)'}
                        </p>
                        <p className="text-[11px] text-ink-muted">
                          {entry.posts} {entry.posts === 1 ? 'story' : 'stories'} · {entry.likesReceived} ❤️ · {entry.commentsReceived} 💬
                        </p>
                      </div>
                      <span className="shrink-0 font-mono text-xs font-bold tabular-nums text-ink-muted">{entry.score}</span>
                    </li>
                  ))}
                </ol>
              )}
            </Card>

            <Card className="bg-linear-to-br from-lav-100 via-surface to-mint-100 p-5 dark:from-lav-500/10 dark:via-surface dark:to-mint-500/10">
              <h3 className="font-display flex items-center gap-2 text-base font-bold text-ink">
                <Hand className="size-4 text-lav-500" aria-hidden />
                Want travel buddies?
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                Tick “Looking for travel buddies” when you share a story — it lands in the 👋 tab where squads form.
              </p>
              <Button variant="secondary" size="sm" className="mt-3" onClick={() => { setComposerOpen(true); setTab('all') }}>
                <PenLine className="size-3.5" aria-hidden />
                Recruit your squad
              </Button>
            </Card>
          </aside>
        </div>

        <p className="mt-8 text-center text-xs text-ink-muted">
          Stories live in this browser for now — plug in a backend later and the whole module keeps working.{' '}
          <Link to="/explore" className="font-semibold text-primary hover:underline">Meanwhile, explore destinations →</Link>
        </p>
      </PageContainer>
    </div>
  )
}
