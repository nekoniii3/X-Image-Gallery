'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

// 仮のデータ構造
interface Post {
  id: number
  imageUrl: string
  user: {
    name: string
    avatar: string
  }
  likes: number
  comments: number
}

const posts: Post[] = [
  {
    id: 1,
    imageUrl: "/placeholder.svg?height=300&width=300",
    user: { name: "User1", avatar: "/placeholder.svg?height=32&width=32" },
    likes: 120,
    comments: 15
  },
  {
    id: 2,
    imageUrl: "/placeholder.svg?height=300&width=300",
    user: { name: "User2", avatar: "/placeholder.svg?height=32&width=32" },
    likes: 85,
    comments: 7
  },
  // さらに投稿を追加...
]

export default function ImageGallery() {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">最新の投稿</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {posts.map((post) => (
          <Dialog key={post.id}>
            <DialogTrigger asChild>
              <div className="cursor-pointer">
                <Image
                  src={post.imageUrl}
                  alt={`Post by ${post.user.name}`}
                  width={300}
                  height={300}
                  className="rounded-lg object-cover w-full aspect-square"
                />
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={post.user.avatar} alt={post.user.name} />
                      <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{post.user.name}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {post.likes} likes · {post.comments} comments
                  </div>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>投稿詳細</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[80vh]">
                <Image
                  src={post.imageUrl}
                  alt={`Post by ${post.user.name}`}
                  width={400}
                  height={400}
                  className="rounded-lg object-cover w-full"
                />
                <div className="mt-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Avatar>
                      <AvatarImage src={post.user.avatar} alt={post.user.name} />
                      <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{post.user.name}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {post.likes} likes · {post.comments} comments
                  </p>
                  {/* ここにコメントセクションなどを追加できます */}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  )
}