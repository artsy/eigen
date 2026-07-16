import Keys from "react-native-keys"

// v2 talks to the richer Artnet WPGraphQL endpoint (filterable feed + article
// detail + paywall flags), replacing the limited `getNewsArticles` syndication
// endpoint used by the v1 gateway. Kept as a separate module so we can back out
// to v1 by flipping the import in NewsHub.
export const ARTNET_V2_GATEWAY_URL = "https://news.ddev.site/graphql"

const ARTNET_CF_ACCESS_CLIENT_ID = Keys.secureFor("ARTNET_CF_ACCESS_CLIENT_ID")
const ARTNET_CF_ACCESS_CLIENT_SECRET = Keys.secureFor("ARTNET_CF_ACCESS_CLIENT_SECRET")

/**
 * POST a query to the Artnet WPGraphQL gateway. CF Access headers are only sent
 * when credentials are present (i.e. once the endpoint is deployed behind
 * Cloudflare Access — the local ddev endpoint doesn't need them).
 */
const postToArtnetGateway = async <T>(
  query: string,
  variables: Record<string, unknown>
): Promise<T> => {
  const headers: Record<string, string> = { "Content-Type": "application/json" }

  if (ARTNET_CF_ACCESS_CLIENT_ID && ARTNET_CF_ACCESS_CLIENT_SECRET) {
    headers["CF-Access-Client-Id"] = ARTNET_CF_ACCESS_CLIENT_ID
    headers["CF-Access-Client-Secret"] = ARTNET_CF_ACCESS_CLIENT_SECRET
  }

  const response = await fetch(ARTNET_V2_GATEWAY_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  })

  if (!response.ok) {
    throw new Error(`Artnet gateway request failed (${response.status})`)
  }

  const json = await response.json()

  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message ?? "Artnet gateway returned errors")
  }

  return json.data as T
}

export type ArtnetSort = "DESC" | "ASC"

export interface ArtnetEditorialFilters {
  /** category.databaseId values (as strings) → `categoryIn` */
  sectionIds?: string[]
  /** topic.slug values → `topicIn` */
  topicSlugs?: string[]
  /** contributor.nicename values → `contributorIn` */
  authorNicenames?: string[]
  search?: string
  /** sort by publish date; defaults to DESC (newest first) */
  sort?: ArtnetSort
}

// Count of active facet filters (for the Filter button badge / Clear enablement).
// Sort and search are excluded — sort has a default, and search lives inline on
// the list page rather than in the modal.
export const countActiveArtnetFilters = (filters: ArtnetEditorialFilters): number =>
  (filters.sectionIds?.length ?? 0) +
  (filters.topicSlugs?.length ?? 0) +
  (filters.authorNicenames?.length ?? 0)

export interface ArtnetFeedArticle {
  databaseId: number
  title: string | null
  uri: string
  date: string | null
  excerpt: string | null
  isPremium: boolean
  isPartnerContent: boolean
  featuredImage: { node: { sourceUrl: string | null; altText: string | null } | null } | null
  categories: { nodes: { name: string | null; uri: string | null }[] } | null
  topics: { nodes: { name: string | null; slug: string | null }[] } | null
  coAuthors: { name: string | null; url: string | null; avatarUrl: string | null }[] | null
}

export interface ArtnetEditorialFeedPage {
  articles: ArtnetFeedArticle[]
  hasNextPage: boolean
  endCursor: string | null
}

// `categoryIn`/`orderby` are standard WPGraphQL; `topicIn`/`contributorIn` are
// custom to this POC. Scalars are inlined into `where` so we don't depend on the
// (extended) input type name.
const EDITORIAL_FEED_QUERY = `query ArtnetEditorialFeed(
  $first: Int!
  $after: String
  $categoryIn: [ID]
  $topicIn: [String]
  $contributorIn: [String]
  $search: String
  $order: OrderEnum!
) {
  posts(
    first: $first
    after: $after
    where: {
      categoryIn: $categoryIn
      topicIn: $topicIn
      contributorIn: $contributorIn
      search: $search
      orderby: [{ field: DATE, order: $order }]
    }
  ) {
    pageInfo { hasNextPage endCursor }
    nodes {
      databaseId
      title
      uri
      date
      excerpt
      isPremium
      isPartnerContent
      featuredImage { node { sourceUrl altText } }
      categories(first: 1) { nodes { name uri } }
      topics(first: 3) { nodes { name slug } }
      coAuthors { name url avatarUrl }
    }
  }
}`

export interface FetchArtnetEditorialFeedParams {
  filters?: ArtnetEditorialFilters
  after?: string | null
  pageSize?: number
}

export const fetchArtnetEditorialFeed = async ({
  filters = {},
  after = null,
  pageSize = 20,
}: FetchArtnetEditorialFeedParams = {}): Promise<ArtnetEditorialFeedPage> => {
  const { sectionIds, topicSlugs, authorNicenames, search, sort = "DESC" } = filters

  const data = await postToArtnetGateway<{
    posts: {
      pageInfo: { hasNextPage: boolean; endCursor: string | null }
      nodes: ArtnetFeedArticle[]
    } | null
  }>(EDITORIAL_FEED_QUERY, {
    first: pageSize,
    after,
    // omit empty facets so WPGraphQL treats them as "no filter"
    categoryIn: sectionIds?.length ? sectionIds : null,
    topicIn: topicSlugs?.length ? topicSlugs : null,
    contributorIn: authorNicenames?.length ? authorNicenames : null,
    search: search || null,
    order: sort,
  })

  return {
    articles: data.posts?.nodes ?? [],
    hasNextPage: data.posts?.pageInfo?.hasNextPage ?? false,
    endCursor: data.posts?.pageInfo?.endCursor ?? null,
  }
}

export interface ArtnetArticleDetail {
  title: string | null
  date: string | null
  uri: string
  content: string | null
  excerpt: string | null
  isPremium: boolean
  isAccessibleForFree: boolean
  isPartnerContent: boolean
  featuredImage: { node: { sourceUrl: string | null; altText: string | null } | null } | null
  categories: { nodes: { name: string | null; uri: string | null }[] } | null
  topics: { nodes: { name: string | null; slug: string | null }[] } | null
  coAuthors:
    | { name: string | null; bio: string | null; url: string | null; avatarUrl: string | null }[]
    | null
}

const ARTICLE_QUERY = `query ArtnetArticle($uri: ID!) {
  post(id: $uri, idType: URI) {
    title
    date
    uri
    content
    excerpt
    isPremium
    isAccessibleForFree
    isPartnerContent
    featuredImage { node { sourceUrl altText } }
    categories { nodes { name uri } }
    topics { nodes { name slug } }
    coAuthors { name bio url avatarUrl }
  }
}`

export const fetchArtnetArticle = async (uri: string): Promise<ArtnetArticleDetail | null> => {
  const data = await postToArtnetGateway<{ post: ArtnetArticleDetail | null }>(ARTICLE_QUERY, {
    uri,
  })

  return data.post ?? null
}

/** A single selectable filter option. `value` is what gets sent to the feed query. */
export interface ArtnetFacetOption {
  label: string
  value: string
  count: number
}

export interface ArtnetFilterFacets {
  /** sections — `value` is category.databaseId (→ `categoryIn`) */
  sections: ArtnetFacetOption[]
  /** topics — `value` is topic.slug (→ `topicIn`) */
  topics: ArtnetFacetOption[]
  /** authors — `value` is contributor.nicename (→ `contributorIn`) */
  authors: ArtnetFacetOption[]
}

// `topics`/`contributors` are custom to this POC; `categories` is standard
// WPGraphQL. Authors use displayName/nicename (not the cap-prefixed raw slug).
const FILTER_FACETS_QUERY = `query ArtnetFilterFacets {
  categories(first: 100, where: { hideEmpty: true }) {
    nodes { name databaseId count }
  }
  topics(first: 100, where: { hideEmpty: true, orderby: COUNT, order: DESC }) {
    nodes { name slug count }
  }
  contributors(first: 100, where: { hideEmpty: true, orderby: COUNT, order: DESC }) {
    nodes { displayName nicename count }
  }
}`

export const fetchArtnetFilterFacets = async (): Promise<ArtnetFilterFacets> => {
  const data = await postToArtnetGateway<{
    categories: {
      nodes: { name: string | null; databaseId: number; count: number | null }[]
    } | null
    topics: { nodes: { name: string | null; slug: string | null; count: number | null }[] } | null
    contributors: {
      nodes: { displayName: string | null; nicename: string | null; count: number | null }[]
    } | null
  }>(FILTER_FACETS_QUERY, {})

  return {
    sections: (data.categories?.nodes ?? [])
      .filter((n) => !!n.name)
      .map((n) => ({ label: n.name as string, value: String(n.databaseId), count: n.count ?? 0 })),
    topics: (data.topics?.nodes ?? [])
      .filter((n) => !!n.name && !!n.slug)
      .map((n) => ({ label: n.name as string, value: n.slug as string, count: n.count ?? 0 })),
    authors: (data.contributors?.nodes ?? [])
      .filter((n) => !!n.displayName && !!n.nicename)
      .map((n) => ({
        label: n.displayName as string,
        value: n.nicename as string,
        count: n.count ?? 0,
      })),
  }
}
