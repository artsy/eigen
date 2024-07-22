import { fetchArtworkInformationQuery } from "__generated__/fetchArtworkInformationQuery.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { fetchQuery, graphql } from "react-relay"

export const fetchArtworkInformation = async (artworkID: string) => {
  const result = await fetchQuery<fetchArtworkInformationQuery>(
    getRelayEnvironment(),
    graphql`
      query fetchArtworkInformationQuery($artworkID: String!) {
        artwork(id: $artworkID) {
          internalID
          artist {
            displayLabel
            imageUrl
            href
            internalID
          }
          medium
          category
          date
          depth
          editionSize
          editionNumber
          height
          width
          images {
            height
            isDefault
            imageURL
            width
          }
          attributionClass {
            name
          }
          isEdition
          metric
          title
          signature
          provenance
          date
          location {
            city
            state
            country
            postalCode
            address
            address2
          }
          isFramed
          framedHeight
          framedWidth
          framedMetric
          framedDepth
        }
      }
    `,
    { artworkID }
  ).toPromise()

  return result?.artwork
}

export type FetchArtworkInformationResult = Awaited<ReturnType<typeof fetchArtworkInformation>>
