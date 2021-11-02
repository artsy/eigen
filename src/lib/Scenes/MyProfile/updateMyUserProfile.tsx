// import { updateMyUserProfileMutation } from "__generated__/updateMyUserProfileMutation.graphql"
// import { defaultEnvironment } from "lib/relay/createEnvironment"
// import { commitMutation, graphql } from "relay-runtime"

// export const updateMyUserProfile = async (input: updateMyUserProfileMutation["variables"]["input"]) => {
//   await new Promise((resolve, reject) =>
//     commitMutation<updateMyUserProfileMutation>(defaultEnvironment, {
//       onCompleted: resolve,
//       mutation: graphql`
//         mutation updateMyUserProfileMutation($input: UpdateMyProfileInput!) {
//           updateMyUserProfile(input: $input) {
//             me {
//               name
//               bio
//               icon {
//                 internalID
//                 imageURL
//               }
//             }
//             userOrError {
//               ... on UpdateMyProfileMutationFailure {
//                 mutationError {
//                   message
//                 }
//               }
//             }
//           }
//         }
//       `,
//       variables: {
//         input,
//       },
//       onError: (e) => {
//         // try to ge a user-facing error message
//         try {
//           const message = JSON.parse(JSON.stringify(e))?.res?.json?.errors?.[0]?.message ?? ""
//           if (typeof message === "string") {
//             const jsonString = message.match(/http.* (\{.*)$/)?.[1]
//             if (jsonString) {
//               const json = JSON.parse(jsonString)
//               if (typeof json?.error === "string") {
//                 reject(json.error)
//                 return
//               }
//               if (typeof json?.message === "string") {
//                 reject(json.message)
//                 return
//               }
//             }
//           }
//         } catch (e) {
//           // fall through
//         }
//         reject("Something went wrong")
//       },
//     })
//   )
// }
