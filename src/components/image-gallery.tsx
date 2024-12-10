'use client'

import { useState, useEffect } from 'react'
import { CSSProperties } from 'react'
import axios from "axios";
import { Heart, HeartIcon, MessageCircle, Share2, X, Download, DownloadIcon, Play ,CirclePlay } from 'lucide-react'

// shadcn
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

// react-icons
import { PiFileZip } from "react-icons/pi";
import { IconContext } from 'react-icons'
import { MdFileDownload } from "react-icons/md";
import { IoIosPlayCircle } from "react-icons/io";
import { IoIosPlay } from "react-icons/io";

// etc
import style from "@/app/styles.module.css"
import title from "@/app/title.png"


type UserProfile = {
  name: string
  description: string
  image: string
  buner: string
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

const API_ENDPOINT = "http://localhost:7860/"
// const API_ENDPOINT = "https://x-image-api-test.vercel.app/"

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
          {post.media_type === "video" && <div><video src={post.video_url} className="object-cover size-[576px]" controls autoPlay muted /></div>}
          <Button 
            variant="ghost" 
            size="icon" 
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

  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [userName, setUsername] = useState<string>("")
  const [message, setMessage] = useState<string>("")

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    description: "",
    image: "",
    buner: ""
  })

  const [postData, setPostData] = useState<Post[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  // const [totalPages, setTotalPages] = useState<number>(1)
  const [endFlg, setEndFlg] = useState(false)
  const [nextDisabled, setNextDisabled] = useState(false)
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

  }, []);

  const handleImageClick = (post: Post) => {
    setSelectedPost(post)
  }

  const handleCloseModal = () => {
    setSelectedPost(null)
  }

  function search(formData: any) {
    const username = formData.get("query").replace("@", "");
    setCurrentPage(1)
    request_data(username, 1)
  }

  async function handlePageChange(pageNumber: number) {
    await request_data(userName, pageNumber)
    setCurrentPage(pageNumber)
    window.scroll({ top: 0, behavior: "smooth"});
    console.log(endFlg)
    setNextDisabled(endFlg)
  }

  const zipDownload = () => {
    
    let endPost = false
    setIsDownloading(true)
    setDownloadProgress(0)

    const file_list = []

    for (const elem of postData) {
      file_list.push([elem.postid, elem.image_url, elem.video_url])
    }

    axios.post(API_ENDPOINT, {username:userName, filelist:file_list}, {timeout: 50000, withCredentials: true})
    .then((response) => {
      setDownloadProgress(100)
      endPost = true
      if (response.data.file_url != "") {
        fileDownload(userName + "_" + currentPage, response.data.file_url)
      } else {
        setMessage("申し訳ございません。エラーが発生しました。")
        clearInterval(interval)
      }
    })
    .catch((error) =>  {
      console.log(error)
      setMessage("申し訳ございません。サーバー接続時にエラーが発生しました。")
      clearInterval(interval)
    })

    let count = 0;

    const interval = setInterval(function() {
      if (endPost) {
        setDownloadProgress(100)
        clearInterval(interval);
      } else {
        count = count < 10 ? count+1 : count;
        setDownloadProgress((count / 12) * 100)
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
            image: response.data.user_profile.image,
            buner: response.data.user_profile.buner
          })
          setPostData(
            response.data.media_data
          )
          setEndFlg(
            response.data.endflg
          )
          setMessage("")
        } else {
          setMessage("メディアデータが存在しないか、取得できません")
        }

      } else {
        setMessage("ユーザが存在しません")
      }
    })
    .catch((error) =>  {
      console.log(error)
      setMessage("申し訳ございません。サーバーでエラーが発生しました。")
    })
  }

  const cssProperties = {
    '--image-url': `url(${userProfile.buner})`
  } as CSSProperties

  return (
    <div style={cssProperties} className={style.backgroundImage}>
      <div className="container mx-auto px-4 py-8">
        <div className="">
          <img src={title.src} className="w-96 ml-2 mb-2"/>
        </div> 
        <div className="flex justify-center">
          <form action={search} className="flex gap-2">
            <Input
              type="search"
              placeholder="@enako_cos ..."
              className="w-50 bg-white"
              name='query'
            />
            <Button type="submit" className="">
              Search
            </Button>
          </form>
        </div>
        {isDownloading && (
          <div className="flex justify-center items-center mt-3">
            <Progress value={downloadProgress} className="w-[20%]" />
            &ensp;Downloading…
          </div>
        )}
        <IconContext.Provider value={{ color: '#000000', size: '30px'}}>
          <MdFileDownload
            className="float-right mr-5 cursor-pointer bg-white"
            onClick={() =>zipDownload()}
          />
        </IconContext.Provider>
        <IconContext.Provider value={{ color: '#000000', size: '30px' }}>
          <PiFileZip className="float-right mx-0 px-0 bg-white"/>
        </IconContext.Provider>
        <div className="flex justify-center font-semibold my-3">{message}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          <div className="flex items-center justify-center border rounded-lg overflow-hidden shadow-lg bg-white">
            <CardContent className="flex items-center space-x-4 p-6">
              <Avatar className="w-36 h-36">
                <AvatarImage src={userProfile.image} alt={userProfile.name} />
                <AvatarFallback>{userProfile.name}</AvatarFallback>
              </Avatar>
              <div>
                <a href={"https://x.com/" + userName} target="_blank">
                  <h2 className="text-2xl font-bold">{userProfile.name}</h2>
                  <p className="text-gray-500">@{userName}</p>
                </a>
              </div>
            </CardContent>         
          </div>
          {postData.map(post => (
            <div key={post.postid} className="border rounded-lg overflow-hidden shadow-lg relative bg-white">
              <button 
                onClick={() => handleImageClick(post)} 
                className="w-full h-72 overflow-hidden"
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
              <div className="p-4 bg-white">
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
        <div><hr/></div>
        <div className="mt-8 flex justify-center items-center space-x-2">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            &lt;&lt;&lt; Previous
          </Button>
          <span>&emsp;</span>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={false}
            aria-label="Next page"
          >
            Next &gt;&gt;&gt;
          </Button>
          <Button
            variant="link"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={false}
            aria-label="Next page"
          >
            Link
          </Button>
        </div>
        <ImageModal post={selectedPost} onClose={handleCloseModal} />
      </div>
    </div>
  )
}