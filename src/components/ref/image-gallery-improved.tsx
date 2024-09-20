import { useState } from 'react'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { HeartIcon, MessageCircleIcon } from 'lucide-react'

interface Post {
  id: number
  imageUrl: string
  user: {
    name: string
    avatar: string
  }
  likes: number
  comments: number
  caption: string
}

const posts: Post[] = [
  {
    id: 1,
    imageUrl: "/placeholder.svg?height=800&width=600",
    user: { name: "User1", avatar: "/placeholder.svg?height=32&width=32" },
    likes: 120,
    comments: 15,
    caption: "This is a beautiful landscape I captured during my recent trip."
  },
  {
    id: 2,
    imageUrl: "/placeholder.svg?height=600&width=800",
    user: { name: "User2", avatar: "/placeholder.svg?height=32&width=32" },
    likes: 85,
    comments: 7,
    caption: "Enjoying a sunny day at the beach!"
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
          <Dialog key={post.id} onOpenChange={(open) => {
            if (open) setSelectedPost(post)
            else setSelectedPost(null)
          }}>
            <DialogTrigger asChild>
              <div className="cursor-pointer group">
                <div className="aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={post.imageUrl}
                    alt={`Post by ${post.user.name}`}
                    width={300}
                    height={300}
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={post.user.avatar} alt={post.user.name} />
                      <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{post.user.name}</span>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center space-x-2">
                    <span className="flex items-center"><HeartIcon className="w-4 h-4 mr-1" /> {post.likes}</span>
                    <span className="flex items-center"><MessageCircleIcon className="w-4 h-4 mr-1" /> {post.comments}</span>
                  </div>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">投稿詳細</DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="relative aspect-square">
                        <Image
                          src={selectedPost?.imageUrl || ''}
                          alt={`Post by ${selectedPost?.user.name}`}
                          layout="fill"
                          objectFit="contain"
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-4">
                        <Avatar>
                          <AvatarImage src={selectedPost?.user.avatar} alt={selectedPost?.user.name} />
                          <AvatarFallback>{selectedPost?.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{selectedPost?.user.name}</span>
                      </div>
                      <p className="text-sm mb-4">{selectedPost?.caption}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center"><HeartIcon className="w-4 h-4 mr-1" /> {selectedPost?.likes} likes</span>
                        <span className="flex items-center"><MessageCircleIcon className="w-4 h-4 mr-1" /> {selectedPost?.comments} comments</span>
                      </div>
                      {/* ここにコメントセクションなどを追加できます */}
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  )
}