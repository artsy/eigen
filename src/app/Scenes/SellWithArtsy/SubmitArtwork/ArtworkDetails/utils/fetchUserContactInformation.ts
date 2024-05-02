import { fetchUserContactInformationQuery } from "__generated__/fetchUserContactInformationQuery.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { fetchQuery, graphql } from "react-relay"

export const fetchUserContactInformation = async () => {
  const query = graphql`
    query fetchUserContactInformationQuery {
      me {
        name
        email
        phoneNumber {
          isValid
          originalNumber
        }
      }
    }
  `

  const request = fetchQuery<fetchUserContactInformationQuery>(
    getRelayEnvironment(),
    query,
    {},
    {
      networkCacheConfig: {
        force: true,
      },
    }
  )
  const response = await request.toPromise()

  if (!response?.me) throw new Error("Failed fetching user contact information")

  return response.me
}
