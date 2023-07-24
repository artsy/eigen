import { fetchUserInterestByArtistIdQuery } from "__generated__/fetchUserInterestByArtistIdQuery.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { fetchQuery, graphql } from "relay-runtime"

const query = graphql`
  query fetchUserInterestByArtistIdQuery($interestID: String!) {
    me {
      userInterestsConnection(
        first: 1
        category: COLLECTED_BEFORE
        interestType: ARTIST
        interestID: $interestID
      ) {
        edges {
          internalID
          private
          node {
            ... on Artist {
              internalID
            }
          }
        }
      }
    }
  }
`

export const fetchUserInterestByArtistId = async (artistId: string) => {
  const environment = getRelayEnvironment()

  try {
    const res = await fetchQuery<fetchUserInterestByArtistIdQuery>(
      environment,
      query,
      { interestID: artistId },
      {
        networkCacheConfig: { force: true },
      }
    ).toPromise()

    if (res?.me?.userInterestsConnection?.edges?.length === 1) {
      return res.me.userInterestsConnection.edges[0]
    }

    throw new Error("No Artist interest found")
  } catch (error) {
    throw error
  }
}
