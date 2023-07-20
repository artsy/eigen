import { graphql, useMutation } from "react-relay"

export const useCreateUserInterests = () => {
  return useMutation(graphql`
    mutation useCreateUserInterestsMutation($input: CreateUserInterestsMutationInput!) {
      createUserInterests(input: $input) {
        userInterestsOrErrors {
          ... on UserInterest {
            category
            interest {
              ... on Artist {
                name
              }
            }
          }
          ... on CreateUserInterestFailure {
            mutationError {
              type
              message
            }
          }
        }
      }
    }
  `)
}
