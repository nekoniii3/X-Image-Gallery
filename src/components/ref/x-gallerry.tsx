'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

type ImagePost = {
    id: number;
    image: string;
    likes: number;
    comments: number;
  }
  
const imagePosts: ImagePost[] = [
    { id: 1, image: "https://pbs.twimg.com/media/GHQQ9O8aQAAL8pv.jpg", likes: 120, comments: 15 },
    { id: 2, image: "https://pbs.twimg.com/media/FX7X-dXaAAAZ4jU.jpg", likes: 85, comments: 7 }
]

export default function Component() {
  const [username, setUsername] = useState('')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  const fetchImages = async () => {
    // setLoading(true)
    // try {
    //   const response = await fetch(`/api/getUserImages?username=${username}`)
    //   const data = await response.json()
    //   setImages(data.images)
    // } catch (error) {
    //   console.error('Error fetching images:', error)
    // }
    // setLoading(false)
    setImages(["https://pbs.twimg.com/media/FX7X-dXaAAAZ4jU.jpg"])

  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Twitter User Image Gallery</h1>
      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter Twitter username"
          className="flex-grow"
        />
        <Button onClick={fetchImages} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Images'}
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-2">
                  <img 
                    src={image} 
                    alt={`Tweet image ${index + 1}`} 
                    className="w-full h-auto rounded"
                  />
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-3xl w-full p-0">
              <img 
                src={image} 
                alt={`Tweet image ${index + 1}`} 
                className="w-full h-auto"
              />
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  )
}