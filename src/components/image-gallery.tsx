'use client'

import { useState } from 'react'
import { Heart, HeartIcon, MessageCircle, Share2, X, Download, DownloadIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
// import { HeartIcon, MessageCircleIcon, ShareIcon } from "lucide-react"
import Link from 'next/link'
// import { saveAs } from 'file-saver'

type UserProfile = {
  name: string
  description: string
  image: string
}

type Post = {
  id: string
  postedat: string
  likes: number
  image_url: string
  video_url: string
  caption: string
}

import Dummy from "@/test/test_1.json";

const userProfile: UserProfile = Dummy.user_profile;
const posts: Post[] = Dummy.media_data;

const imageDownload = (imageUrl: string) => {
  // 実際のアプリケーションでは、ここで画像のダウンロード処理を行います
  console.log(`Downloading image: ${imageUrl}`)

  let link = document.createElement('a')
  link.href = imageUrl
  link.download = "FX7X-dXaAAAZ4jU.jpg"
  // link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link);
}

const ImageModal = ({ post, onClose }: { post: Post | null, onClose: () => void }) => {
  if (!post) return null

  return (
    // <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
    //   <div className="bg-white rounded-lg max-w-3xl w-full overflow-hidden" onClick={e => e.stopPropagation()}>
    //     <div className="relative">
    <div className="fixed inset-10 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-lg overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="relative">
          {post.video_url === "" && <img src={post.image_url} alt={post.caption} className="object-cover size-[576px]"/>}
          {post.video_url != "" && <video src={post.video_url} className="object-cover size-[576px]" controls autoPlay/>}
          <Button 
            variant="ghost" 
            size="icon" 
            // className="absolute ms-auto inset-0 bg-white bg-opacity-50 hover:bg-opacity-75"
            className="absolute m-auto inset-0 bg-white left-[504px] bottom-[504px] bg-opacity-50 hover:bg-opacity-90"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <div className="p-4">
          {/* <div className="flex items-center mb-2">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={userProfile.avatarurl} alt={userProfile.username} />
              <AvatarFallback>{userProfile.username}</AvatarFallback>
            </Avatar>
            <span className="font-semibold">{userProfile.username}</span>
          </div> */}
          <p className="text-sm font-semibold mb-2">{post.caption}</p>
          <div>
            <div className="float-left flex items-center text-sm text-gray-500">
              {new Date(post.postedat).toLocaleDateString()} {new Date(post.postedat).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
            {/* <div className="float-right ml-2 mb-4">
              <DownloadIcon className="w-5 h-5" onClick={() => handleDownload(post.imageUrl)}/>
            </div> */}
            <Button
                size="icon"
                variant="link"
                className="float-right flex items-center mb-4"
                onClick={() => imageDownload(post.image_url)}
              >
                {/* <Download className="h-4 w-4" />
                <span className="sr-only">Download image</span> */}
                <DownloadIcon className="w-5 h-5"/>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Component() {
  const [likedPosts, setLikedPosts] = useState<number[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  const handleLike = (postId: number) => {
    setLikedPosts(prev => 
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    )
  }

  const handleImageClick = (post: Post) => {
    setSelectedPost(post)
  }

  const handleCloseModal = () => {
    setSelectedPost(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">X Image Gallery</h1>
      <CardContent className="flex items-center justify-center">
          <form className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter X Username"
              value="@enako_cos"
              // onChange={(e) => setUsername(e.target.value)}
              className="w-50"
            />
            <Button type="submit">
              Search
            </Button>
          </form>
        </CardContent>
      <Card className="mb-6">
        <CardContent className="flex items-center space-x-4 p-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src={userProfile.image} alt={userProfile.name} />
            <AvatarFallback>{userProfile.name}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{userProfile.name}</h2>
            <p className="text-gray-500">@enako_cos</p>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <div key={post.id} className="border rounded-lg overflow-hidden shadow-lg">
            {/* <div className="p-4 flex items-center">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.avatarUrl} alt={post.username} />
                <AvatarFallback>{post.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="ml-2 font-semibold">{post.username}</span>
            </div> */}
            <button 
              onClick={() => handleImageClick(post)} 
              className="w-full h-64 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`View larger image of ${post.caption}`}
            >
              <img 
                src={post.image_url} 
                alt={post.caption} 
                className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
              />
            </button>
            <div className="p-4">
              <p className="text-sm font-semibold mb-4">{post.caption}</p>
              {/* <div className="flex items-center justify-between text-sm text-gray-500"> */}
              <div className="text-sm text-gray-500">
                {/* <div className="flex items-center float-left text-xs text-gray-400 mt-2"> */}
                <div className="float-left mb-4">
                    Posted {new Date(post.postedat).toLocaleDateString()}
                </div>
                {/* <div className="float-right items-center ml-2">
                    <DownloadIcon className="w-5 h-5"/>
                </div> */}
                <Button
                    size="icon"
                    variant="link"
                    className="float-right ml-1"
                    onClick={() =>imageDownload(post.image_url)}
                  >
                    {/* <Download className="h-4 w-4" />
                    <span className="sr-only">Download image</span> */}
                    <Download className="mb-5"/>
                </Button>
                <div className="float-right items-center text-pink-500 hover:text-pink-600 transition-colors" aria-label={`${post.likes} likes`}>
                    {post.likes.toLocaleString()}
                </div>
                <div className="float-right items-center text-pink-500 hover:text-pink-600 transition-colors" aria-label={`${post.likes} likes`}>
                    <HeartIcon className="w-5 h-5" />
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
      <ImageModal post={selectedPost} onClose={handleCloseModal} />
    </div>
  )
}