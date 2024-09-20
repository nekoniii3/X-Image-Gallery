'use client'

import { useState } from "react"
import { Heart, MessageCircle, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog"

type ImagePost = {
  id: number;
  imageUrl: string;
  likes: number;
  comments: number;
}

const imagePosts: ImagePost[] = [
  { id: 1, imageUrl: "https://pbs.twimg.com/media/GHQQ9O8aQAAL8pv.jpg", likes: 120, comments: 15 },
  { id: 2, imageUrl: "https://pbs.twimg.com/media/FX7X-dXaAAAZ4jU.jpg", likes: 85, comments: 7 },
  { id: 3, imageUrl: "/placeholder.svg?height=800&width=800", likes: 200, comments: 32 },
  { id: 4, imageUrl: "/placeholder.svg?height=800&width=800", likes: 65, comments: 5 },
  { id: 5, imageUrl: "/placeholder.svg?height=800&width=800", likes: 150, comments: 20 },
  { id: 6, imageUrl: "/placeholder.svg?height=800&width=800", likes: 95, comments: 12 },
]

export default function ImageGalleryWithModal() {
  const [selectedImage, setSelectedImage] = useState<ImagePost | null>(null)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">ユーザーの投稿画像</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {imagePosts.map((post) => (
          <Card key={post.id} className="overflow-hidden cursor-pointer" onClick={() => setSelectedImage(post)}>
            <CardContent className="p-0 relative">
              <img
                src={post.imageUrl}
                alt={`投稿画像 ${post.id}`}
                className="w-full h-auto object-cover aspect-square"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-white flex items-center space-x-4">
                  <span className="flex items-center">
                    <Heart className="w-5 h-5 mr-1" />
                    {post.likes}
                  </span>
                  <span className="flex items-center">
                    <MessageCircle className="w-5 h-5 mr-1" />
                    {post.comments}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl w-full p-0">
          <DialogClose className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">閉じる</span>
          </DialogClose>
          {selectedImage && (
            <div className="relative">
              <img
                src={selectedImage.imageUrl}
                alt={`拡大表示: 投稿画像 ${selectedImage.id}`}
                className="w-full h-auto"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 flex justify-between items-center">
                <span className="flex items-center">
                  <Heart className="w-5 h-5 mr-1" />
                  {selectedImage.likes}
                </span>
                <span className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-1" />
                  {selectedImage.comments}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}