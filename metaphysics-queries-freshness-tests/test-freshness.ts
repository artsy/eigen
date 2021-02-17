import { request, gql } from "graphql-request"
const query = gql`
  {
    artists {
      name
    }
  }
`

request("https://metaphysics-staging.artsy.net/v2", query).then((data) => console.log(data))
