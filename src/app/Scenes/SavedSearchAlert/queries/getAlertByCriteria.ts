// import { SearchCriteriaAttributes } from "app/Components/ArtworkFilter/SavedSearch/types"
// import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
// import { fetchQuery, graphql } from "react-relay"

// export const getAlertCriteria = async (criteria: SearchCriteriaAttributes) => {
//   const query = graphql`
//     query getAlertByCriteriaQuery($criteria: SearchCriteriaAttributes) {
//       me {
//         alert(attributes: $criteria) {
//           internalID
//         }
//       }
//     }
//   `

//   const request = fetchQuery<getAlertByCriteriaQuery>(
//     getRelayEnvironment(),
//     query,
//     { criteria },
//     {
//       networkCacheConfig: {
//         force: true,
//       },
//     }
//   )
//   const response = await request.toPromise()

//   return response?.me?.alert?.internalID
// }
