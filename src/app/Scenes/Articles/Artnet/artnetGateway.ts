import Keys from "react-native-keys"

export const ARTNET_GATEWAY_URL = "https://gateway.artnet-dev.com/graphql"

export const ARTNET_CF_ACCESS_CLIENT_ID = Keys.secureFor("ARTNET_CF_ACCESS_CLIENT_ID")
export const ARTNET_CF_ACCESS_CLIENT_SECRET = Keys.secureFor("ARTNET_CF_ACCESS_CLIENT_SECRET")

export interface ArtnetImage {
  aspectRatio: string | null
  url: string | null
}

export interface ArtnetArticle {
  id: string
  author: string | null
  authorUrl: string | null
  categoryName: string | null
  categoryUrl: string | null
  date: string | null
  featuredImage: ArtnetImage[] | null
  title: string | null
  url: string
}

const NEWS_ARTICLES_QUERY = `query NewsArticles($filters: EntityFilter_Input!, $pageSize: Int!, $page: Int!) {
  getNewsArticles(input: { filters: { creator: $filters }, page: $page, pageSize: $pageSize }) {
    results {
      id
      author
      authorUrl
      categoryName
      categoryUrl
      date
      featuredImage { aspectRatio url }
      title
      url
    }
  }
}`

export interface FetchArtnetNewsParams {
  /** Artnet entity keys, e.g. ["Artist_17524"] */
  artistKeys: string[]
  page?: number
  pageSize?: number
}

export const fetchArtnetNews = async ({
  artistKeys,
  page = 1,
  pageSize = 10,
}: FetchArtnetNewsParams): Promise<ArtnetArticle[]> => {
  if (!ARTNET_CF_ACCESS_CLIENT_ID || !ARTNET_CF_ACCESS_CLIENT_SECRET) {
    throw new Error(
      "Missing Artnet Cloudflare Access credentials. Set ARTNET_CF_ACCESS_CLIENT_ID / _SECRET in your keys file."
    )
  }

  const response = await fetch(ARTNET_GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "CF-Access-Client-Id": ARTNET_CF_ACCESS_CLIENT_ID,
      "CF-Access-Client-Secret": ARTNET_CF_ACCESS_CLIENT_SECRET,
    },
    body: JSON.stringify({
      operationName: "NewsArticles",
      query: NEWS_ARTICLES_QUERY,
      variables: { filters: { keys: artistKeys }, page, pageSize },
    }),
  })

  if (!response.ok) {
    throw new Error(`Artnet gateway request failed (${response.status})`)
  }

  const json = await response.json()

  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message ?? "Artnet gateway returned errors")
  }

  return json.data?.getNewsArticles?.results ?? []
}
