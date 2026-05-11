import { viewDocument } from "@react-native-documents/viewer"
import { captureException } from "@sentry/react-native"
import { useToast } from "app/Components/Toast/toastHook"
import { useCallback, useEffect, useRef, useState } from "react"
import ReactNativeBlobUtil from "react-native-blob-util"
import type { StatefulPromise, FetchBlobResponse } from "react-native-blob-util"

const CACHE_DIR = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/MessageAttachments`

const toFileURI = (path: string) => (path.startsWith("file://") ? path : `file://${path}`)

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "application/pdf": "pdf",
}

export const useMediaPreview = (url: string, mimeType: string, cacheKey: string) => {
  const { show: showToast } = useToast()
  const [progress, setProgress] = useState(0)
  const [isDownloading, setIsDownloading] = useState(false)
  const taskRef = useRef<StatefulPromise<FetchBlobResponse> | null>(null)

  useEffect(() => {
    return () => {
      taskRef.current?.cancel()
    }
  }, [])

  const openPreview = useCallback(async () => {
    const ext = MIME_TO_EXT[mimeType] ?? mimeType.split("/")[1]
    const filePath = `${CACHE_DIR}/${cacheKey}.${ext}`

    const exists = await ReactNativeBlobUtil.fs.exists(filePath)
    if (exists) {
      try {
        await viewDocument({ uri: toFileURI(filePath), mimeType })
      } catch (e) {
        captureException(e, { tags: { source: "useMediaPreview.ts: openPreview" } })
        showToast("Something went wrong, try again", "bottom", { backgroundColor: "red100" })
      }
      return
    }

    const dirExists = await ReactNativeBlobUtil.fs.exists(CACHE_DIR)
    if (!dirExists) {
      await ReactNativeBlobUtil.fs.mkdir(CACHE_DIR)
    }

    setIsDownloading(true)
    setProgress(0)

    try {
      const task = ReactNativeBlobUtil.config({ path: filePath }).fetch("GET", url)
      taskRef.current = task

      task.progress({ interval: 250 }, (received, total) => {
        setProgress(received / total)
      })

      await task
      await viewDocument({ uri: toFileURI(filePath), mimeType })
    } catch (e) {
      captureException(e, { tags: { source: "useMediaPreview.ts: openPreview" } })
      showToast("Something went wrong, try again", "bottom", { backgroundColor: "red100" })
    } finally {
      setIsDownloading(false)
      setProgress(0)
      taskRef.current = null
    }
  }, [url, mimeType, cacheKey, showToast])

  return { progress, isDownloading, openPreview }
}
