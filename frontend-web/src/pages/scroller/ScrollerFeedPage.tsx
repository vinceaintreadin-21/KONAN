import { useState, useEffect } from 'react'
import { SocialFeedPost } from '../../components/scroller/SocialFeedPost'
import { useGameStore } from '../../store/gameStore'
import { getScenarioScroller } from '../../services/api'
import type { ScenarioScrollerResponse } from '../../services/api'

export function ScrollerFeedPage() {
  const { scenarioId, setScreen } = useGameStore()
  const [post, setPost] = useState<ScenarioScrollerResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const id = scenarioId ?? 1

    getScenarioScroller(id)
      .then((res) => {setPost(res); setLoading(false)})
      .catch(() => setLoading(false))
  }, [scenarioId])

  if (loading || !post) {
    return(
      <div className="min-h-screen bg-[#080d18] flex items-center justify-center">
        <div className="font-mono text-[11px] text-[#3d5a7a] tracking-[0.2em] animate-pulse">
          Loading post...
        </div>
      </div>
    )
  }

  const postData = {
    handle: post.handle,
    displayName: post.account_name,
    followers: String(post.follower_count),
    following: String(post.following_count),
    avatarBg: post.avatar_color,
    timePosted: post.time_posted,
    caption: post.caption,
    likes: String(post.likes),
    retweets: String(post.retweets),
    replies: String(post.replies),
    views: String(post.views),
    imageUrl: post.image_url,
    imageAlt: post.image_alt,
  }

      
  return (
    <div className="min-h-screen bg-[#080d18] flex flex-col items-center font-sans">
      {/* Mission bar */}
      <div className="w-full bg-[#080d18]/95 border-b border-blue-500/15 py-2 px-4 flex items-center gap-2 justify-center backdrop-blur sticky top-0 z-20">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <span className="font-mono text-[10px] text-blue-400 tracking-[0.14em] uppercase">
          Scroller Active — Describe this post to your Verifier partner
        </span>
      </div>
      <div className="w-full max-w-[620px] flex-1">
        <div className="bg-black/98 border-b border-[#2f3336] px-4 py-3 flex items-center justify-between">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="font-bold text-[19px] text-white">Home</span>
          <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-[13px] font-bold text-white">Y</div>
        </div>
        <SocialFeedPost post={postData} />
      </div>
      <div className="sticky bottom-0 w-full max-w-[620px] px-4 pb-5 pt-3 bg-gradient-to-t from-[#080d18] via-[#080d18]/80 to-transparent flex justify-center">
        <button
          onClick={() => setScreen('scroller-checklist')}
          className="bg-blue-500 text-white rounded-xl px-9 py-3.5 font-mono text-[12px] font-bold tracking-[0.12em] uppercase cursor-pointer shadow-[0_4px_24px_rgba(59,130,246,0.45)] hover:bg-blue-400 transition-colors"
        >
          I've Described This Post →
        </button>
      </div>
    </div>
  )
}
