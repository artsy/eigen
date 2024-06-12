import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"

export interface SpecialistsData {
  image: string
  name: string
  firstName: string
  jobTitle: string
  bio: string
  email: string
}

interface TestimonialData {
  reviewText: string
  image: string
  reviewerName: string
  gallery: string
}

interface CacheDataType {
  createdAt: number
  data: {
    specialists: SpecialistsData[] | null
    testimonials: TestimonialData[] | null
  }
}

const SWA_LANDING_PAGE_DATA_KEY = "SWA_LANDING_PAGE_DATA_KEY"

const CacheValidPeriodInMs = 86400000 // 24 hours

const dataUrl = "https://artsy-public.s3.amazonaws.com/sell-with-artsy/landingpagedata.json"

export const useSWALandingPageData = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<CacheDataType["data"]>({ specialists: null, testimonials: null })

  useEffect(() => {
    AsyncStorage.getItem(SWA_LANDING_PAGE_DATA_KEY)
      .then((value) => {
        if (value) {
          const data: CacheDataType = JSON.parse(value)
          const shouldRefetch =
            new Date().getTime() - new Date(data.createdAt).getTime() > CacheValidPeriodInMs
          if (shouldRefetch) {
            fetchData()
            return
          }
          setData(data.data)
          return
        }
        fetchData()
      })
      .catch(() => {
        fetchData()
      })
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch(dataUrl)
      const data = await response.json()
      setData(data)
      setLoading(false)
      AsyncStorage.setItem(
        SWA_LANDING_PAGE_DATA_KEY,
        JSON.stringify({
          createdAt: new Date().getTime(),
          data,
        })
      )
    } catch (error) {
      setLoading(false)
      console.error("[SWALandingPageDataError] Error:", error)
    }
  }

  return { data, loading }
}
