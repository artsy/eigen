import { useColor } from "@artsy/palette-mobile"
import { VideoWebView } from "app/Components/VideoWebView"
import { useMemo } from "react"

interface ArticleHeroVideoProps {
  videoUrl: string
  width: number
  height: number
}

export const ArticleHeroVideo: React.FC<ArticleHeroVideoProps> = ({ videoUrl, width, height }) => {
  const color = useColor()
  const backgroundColor = color("mono30")

  // Memoize HTML to prevent re-renders
  const html = useMemo(
    () => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            background-color: ${backgroundColor};
            overflow: hidden;
            position: fixed;
            width: 100%;
            height: 100%;
          }
          video {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            position: absolute;
            top: 0;
            left: 0;
          }
        </style>
      </head>
      <body>
        <video
          autoplay
          loop
          muted
          playsinline
          preload="auto"
          webkit-playsinline
        >
          <source src="${videoUrl}" type="video/mp4">
        </video>
      </body>
    </html>
  `,
    [videoUrl, backgroundColor]
  )

  return <VideoWebView html={html} width={width} height={height} testID="ArticleHeroVideo" />
}
