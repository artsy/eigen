import { fetchProfileDataQuery } from "__generated__/fetchProfileDataQuery.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { fetchQuery, graphql } from "react-relay"

export const MyProfileHeaderScreenQuery = graphql`
  query fetchProfileDataQuery {
    me {
      ...useCompleteMyProfileSteps_me

      internalID
      name
      location {
        display
      }
      profession
      icon {
        url(version: "thumbnail")
      }
      isIdentityVerified
      counts @required(action: NONE) {
        followedArtists
        savedArtworks
        savedSearches
      }
      collectorProfile @required(action: NONE) {
        confirmedBuyerAt
      }
    }
  }
`

export const fetchProfileData = async () => {
  return fetchQuery<fetchProfileDataQuery>(getRelayEnvironment(), MyProfileHeaderScreenQuery, {})
}
