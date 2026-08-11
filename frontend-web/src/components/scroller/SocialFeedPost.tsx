import { useState } from 'react'

interface PostData {
  handle: string
  displayName: string
  followers: string
  following: string
  avatarBg: string
  timePosted: string
  caption: string
  likes: string
  retweets: string
  replies: string
  views: string
  imageUrl: string
  imageAlt: string
}

export function SocialFeedPost({ post }: { post: PostData }) {
  const [liked, setLiked] = useState(false)
  const [retweeted, setRetweeted] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  return (
    <div className="bg-black border-b border-[#2f3336] pt-4">
      {/* Author row */}
      <div className="flex gap-3 px-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-base text-white flex-shrink-0"
          style={{ background: post.avatarBg }}
        >
          {post.displayName.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-px">
            <span className="font-bold text-[15px] text-[#e7e9ea] whitespace-nowrap">
              {post.displayName}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[13px] text-[#71767b]">{post.handle}</span>
            <span className="text-[#71767b] text-sm">·</span>
            <span className="text-[13px] text-[#71767b]">{post.timePosted}</span>
          </div>
        </div>
        <button className="bg-transparent border-0 cursor-pointer text-[#71767b] text-lg px-1 leading-none">
          ···
        </button>
      </div>

      {/* Caption */}
      <div className="text-[15px] text-[#e7e9ea] leading-[1.53] mx-4 my-3 whitespace-pre-line">
        {post.caption}
      </div>

      {/* Image */}
      <div className="mx-4 rounded-[14px] overflow-hidden mb-3 border border-[#2f3336] bg-[#1a2240]">
        <img src={post.imageUrl} alt={post.imageAlt} className="w-full block max-h-[340px] object-cover" />
      </div>

      {/* Stats */}
      <div className="flex gap-4 pb-3 border-b border-[#2f3336] text-[13px] text-[#71767b] flex-wrap px-4">
        {[{ label: 'Replies', val: post.replies }, { label: 'Reposts', val: post.retweets }, { label: 'Likes', val: post.likes }, { label: 'Views', val: post.views }].map(({ label, val }) => (
          <span key={label}><strong className="text-[#e7e9ea]">{val}</strong> {label}</span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-around py-1 px-4">
        {[
          { emoji: '💬', label: post.replies, active: false, color: '#1d9bf0', action: undefined },
          { emoji: '🔁', label: post.retweets, active: retweeted, color: '#00ba7c', action: () => setRetweeted(!retweeted) },
          { emoji: liked ? '❤️' : '🤍', label: post.likes, active: liked, color: '#f91880', action: () => setLiked(!liked) },
          { emoji: '📊', label: post.views, active: false, color: '#1d9bf0', action: undefined },
          { emoji: bookmarked ? '🔖' : '🏳', label: '', active: bookmarked, color: '#1d9bf0', action: () => setBookmarked(!bookmarked) },
        ].map((a, i) => (
          <button
            key={i}
            onClick={a.action}
            className="flex items-center gap-[5px] text-[13px] px-2 py-1.5 rounded-full transition-all duration-150 bg-transparent border-0"
            style={{ color: a.active ? a.color : '#71767b', cursor: a.action ? 'pointer' : 'default' }}
          >
            <span className="text-[17px]">{a.emoji}</span>
            {a.label && <span>{a.label}</span>}
          </button>
        ))}
      </div>

      {/* Followers */}
      <div className="py-3 border-t border-[#2f3336] text-[13px] text-[#71767b] px-4">
        <span className="font-bold text-[#e7e9ea]">{post.followers}</span> Followers
        <span className="mx-2 text-[#2f3336]">|</span>
        <span className="font-bold text-[#e7e9ea]">{post.following}</span> Following
      </div>
    </div>
  )
}
