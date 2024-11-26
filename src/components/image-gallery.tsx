'use client'

import { useState, useEffect } from 'react'
import axios from "axios";
import { Heart, HeartIcon, MessageCircle, Share2, X, Download, DownloadIcon, Play ,CirclePlay } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PiFileZip } from "react-icons/pi";
import { IconContext } from 'react-icons'
import { MdFileDownload } from "react-icons/md";
import { IoIosPlayCircle } from "react-icons/io";
import { IoIosPlay } from "react-icons/io";
// import { LiaDownloadSolid } from "react-icons/lia";
// import { HeartIcon, MessageCircleIcon, ShareIcon } from "lucide-react"
// import Link from 'next/link'
import { Progress } from "@/components/ui/progress"

const API_ENDPOINT = "http://localhost:7860/"
// const API_ENDPOINT = "https://x-image-api2.vercel.app/"
// const INIT_USER = "enako_cos"
const MAX_DISPLAY = 20

type UserProfile = {
  name: string
  description: string
  image: string
}

type Post = {
  postid: string
  postedat: string
  likes: number
  media_type : string
  image_url: string
  video_url: string
  caption: string
}

// import Dummy from "@/test/init_data.json"

// const userProfile1: UserProfile = Dummy.user_profile;
// const posts1: Post[] = Dummy.media_data;

const imageDownload = (postid: string, imageUrl: string) => {
  fileDownload(postid, imageUrl)
}

const fileDownload = (name: string, fileUrl: string) => {

  const fileName = name + "." + fileUrl.split('.').pop()

  fetch(fileUrl)
  .then(response => response.blob())
  .then(blob => {
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
  })
  .catch(() => console.error('画像のダウンロードに失敗しました'))
}

const ImageModal = ({ post, onClose }: { post: Post | null, onClose: () => void }) => {
  if (!post) return null
  return (
    <div className="fixed inset-10 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-lg overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="relative">
          {post.media_type === "image" && <img src={post.image_url} alt={post.caption} className="object-cover size-[576px]"/>}
          {post.media_type === "video" && <div><Play /><video src={post.video_url} className="object-cover size-[576px]" controls autoPlay/></div>}
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
          <p className="text-sm font-semibold mb-2"><a href={"https://x.com/dummy/status/" + post.postid} target="_blank">{post.caption}</a></p>
          <div>
            <div className="float-left flex items-center text-sm text-gray-500">
              {new Date(post.postedat).toLocaleDateString()} {new Date(post.postedat).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
            <Button
                size="icon"
                variant="link"
                className="float-right flex items-center mb-4"
                onClick={() => imageDownload(post.postid, post.image_url)}
            >
              <DownloadIcon className="w-5 h-5"/>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Component() {

  // const [likedPosts, setLikedPosts] = useState<number[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [userName, setUsername] = useState<string>("")
  const [message, setMessage] = useState<string>("")

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    description: "",
    image: ""
  })

  const [postData, setPostData] = useState<Post[]>([
    // postid: "",
    // postedat: "",
    // likes: 0,
    // image_url: "",
    // video_url: "",
    // caption: ""
  ])

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [isDownloading, setIsDownloading] = useState(false)

  // 初期処理
  useEffect(() => {

    // setUserProfile(Dummy.user_profile);
    // setPostData(Dummy.media_data);

    const fetchData = async () => {
      await request_data("", 0)
    }

    fetchData();

    // await axios.get(API_ENDPOINT, {
    //   params: {
    //     username: "",
    //     pagenum: 0
    //   }
    //   ,withCredentials: true
    // }).then((response) => {
    //   setUserProfile({
    //     name: response.data.user_profile.name,
    //     description: response.data.user_profile.description,
    //     image: response.data.user_profile.image
    //   })
    //   setTotalPages(
    //     response.data.media_count / MAX_DISPLAY
    //   )
    //   setPostData(
    //     response.data.media_data
    //   )
    // })
    // setUsername(userProfile.name)

  }, []);

  // const handleLike = (postId: number) => {
  //   setLikedPosts(prev => 
  //     prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
  //   )
  // }

  const handleImageClick = (post: Post) => {
    setSelectedPost(post)
  }

  const handleCloseModal = () => {
    setSelectedPost(null)
  }

  function search(formData: any) {
    const username = formData.get("query").replace("@", "");
    request_data(username, 1)
  }

  // const handlePageChange = (pageNumber: number) => {
  async function handlePageChange(pageNumber: number) {
    setCurrentPage(pageNumber)
    await request_data(userName, pageNumber)
    window.scroll({ top: 0, behavior: "smooth"});
  }

  const zipDownload = () => {
    
    let endPost = false
    setIsDownloading(true)
    setDownloadProgress(0)

    const file_list = []

    for (const elem of postData) {
      // console.log(elem.postid, elem.image_url, elem.video_url);
      file_list.push([elem.postid, elem.image_url, elem.video_url])
    }

    // for (const elem of file_list) {
    //   console.log(elem)
    // }

    // return

    axios.post(API_ENDPOINT, {username:userName, filelist:file_list}, {timeout: 50000, withCredentials: true})
    .then((response) => {
      // console.log(response.data)
      // setIsDownloading(false)
      setDownloadProgress(100)
      endPost = true
      if (response.data.file_url != "") {
        // console.log(response.data.file_url)
        fileDownload(userName + "_" + currentPage, response.data.file_url)
      } else {
        setMessage("申し訳ございません。エラーが発生しました。")
        clearInterval(interval)
      }
    })
    .catch((error) =>  {
      console.log(error)
      setMessage("申し訳ございません。サーバーでエラーが発生しました。")
      clearInterval(interval)
    })
    // for (let i = 0; i < totalImages; i++) {
    //   setDownloadProgress(((i + 1) / totalImages) * 100)
    //   setTimeout(() => {i+}, 1000)
    // }
    let count = 0;

    const interval = setInterval(function() {
      
      // console.log(endPost)

      if (endPost) {
        setDownloadProgress(100)
        clearInterval(interval);
      } else {
        count = count < 12 ? count+1 : count;
        setDownloadProgress((count / 15) * 100)
      }
    }, 1000);
    
  }

  async function request_data(username: string, pagenum: number) {

    setIsDownloading(false)

    await axios.get(API_ENDPOINT, {
      params: {
        username: username,
        pagenum: pagenum
      }
      ,withCredentials: true
    }).then((response) => {
      if (response.data.user_profile.name != "") {

        if (response.data.media_count > 0) {

          if (username == "") {
            setUsername(response.data.user_name)
          } else {
            setUsername(username)
          }
          setUserProfile({
            name: response.data.user_profile.name,
            description: response.data.user_profile.description,
            image: response.data.user_profile.image
          })
          setTotalPages(
            Math.ceil(response.data.media_count / MAX_DISPLAY)
          )
          setPostData(
            response.data.media_data
          )
        } else {
          setMessage("メディアデータが存在しないか、取得できません")
          // console.log(msg)
        }

      } else {
        setMessage("ユーザが存在しません")
        // console.log(msg)
      }
    })
    .catch((error) =>  {
      console.log(error)
      setMessage("申し訳ございません。サーバーでエラーが発生しました。")
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">X Image Gallery</h1>
      {/* <CardContent className="flex justify-center items-center"> */}
      <div className="flex justify-center">
        <form action={search} className="flex gap-2">
          <Input
            type="text"
            placeholder="@enako_cos ..."
            // value="@enako_cos"
            // onChange={(e) => setUsername(e.target.value)}
            className="w-50"
            name='query'
            // onClick={() => setCount(count+1)}
          />
          <Button type="submit" className="">
            Search
          </Button>
        </form>
      </div>
      {isDownloading && (
        // <div className="mt-4">
        <div className="flex justify-center items-center mt-3">
          <Progress value={downloadProgress} className="w-[20%]" />
          &ensp;Downloading…
          {/* <p className="text-center mt-2">{Math.round(downloadProgress)}% Downloaded</p> */}
        </div>
      )}
      <IconContext.Provider value={{ color: '#000000', size: '30px'}}>
        <MdFileDownload
          className="float-right mr-5 cursor-pointer"
          onClick={() =>zipDownload()}
        />
      </IconContext.Provider>
      <IconContext.Provider value={{ color: '#000000', size: '30px' }}>
        <PiFileZip className="float-right mx-0 px-0"/>
      </IconContext.Provider>
      <div className="flex justify-center font-semibold my-3">{message}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        <div className="flex items-center justify-center border rounded-lg overflow-hidden shadow-lg">
          <CardContent className="flex items-center space-x-4 p-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={userProfile.image} alt={userProfile.name} />
              <AvatarFallback>{userProfile.name}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{userProfile.name}</h2>
              <p className="text-gray-500">@{userName}</p>
            </div>
          </CardContent>         
        </div>
        {postData.map(post => (
          <div key={post.postid} className="border rounded-lg overflow-hidden shadow-lg relative">
            <button 
              onClick={() => handleImageClick(post)} 
              className="w-full h-72 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`View larger image of ${post.caption}`}
            >
              {post.media_type === "video" &&
              <div>
                <IoIosPlay /* 背景を白にするために追加 */
                  className="absolute m-auto inset-0"
                  style={{color: "#FFFFFF", fontSize: '80px'}}
                />
                <IoIosPlayCircle
                  className="absolute m-auto inset-0"
                  style={{color: "#000000", fontSize: '80px'}}
                />
                <img 
                  src={post.image_url} 
                  alt={post.caption} 
                  // className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                  className="w-full h-full object-cover"
                />      
              </div>
              }
              {post.media_type === "image" &&
              <img 
                src={post.image_url} 
                alt={post.caption} 
                className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
              />    
              }    
            </button>
            <div className="p-4">
              <p className="text-sm font-semibold mb-3">
                <a href={"https://x.com/"+userName+"/status/"+post.postid} target="_blank">{post.caption}</a>
              </p>
              <div className="text-sm text-gray-500">
                <div className="float-left mb-4">
                    Posted {new Date(post.postedat).toLocaleDateString()}
                </div>
                <Button
                    size="icon"
                    variant="link"
                    className="float-right ml-1"
                    onClick={() =>imageDownload(post.postid, post.image_url)}
                  >
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
      <div className="mt-8 flex justify-center items-center space-x-2">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          &lt;&lt;&lt; Previous
        </Button>
        {/* <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span> */}
        <span>&emsp;</span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          Next &gt;&gt;&gt;
        </Button>
      </div>
      <ImageModal post={selectedPost} onClose={handleCloseModal} />
    </div>
  )
}