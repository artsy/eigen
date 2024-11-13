import { fetchArtworkNonCacheableFieldsQuery } from "__generated__/fetchArtworkNonCacheableFieldsQuery.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { useEffect, useState } from "react"
import { fetchQuery, graphql } from "react-relay"

export const fetchArtworkNonCacheableFields = async (artworkID: string) => {
  return fetchQuery<fetchArtworkNonCacheableFieldsQuery>(
    getRelayEnvironment(),
    graphql`
      query fetchArtworkNonCacheableFieldsQuery($id: String!) {
        artwork(id: $id) {
          isSaved
        }
      }
    `,
    { id: artworkID }
  ).toPromise()
}

export const useArtworkNonCacheableFields = (artworkID: string) => {
  const [data, setData] = useState<fetchArtworkNonCacheableFieldsQuery["response"]>()
  useEffect(() => {
    fetchArtworkNonCacheableFields(artworkID).then((res) => {
      if (res) {
        setData(res)
      }
    })
  }, [artworkID])

  return data
}
