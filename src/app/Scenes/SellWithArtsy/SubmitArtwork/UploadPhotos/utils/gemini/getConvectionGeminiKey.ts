import { getConvectionGeminiKeyQuery } from "__generated__/getConvectionGeminiKeyQuery.graphql"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { fetchQuery, graphql } from "relay-runtime"

export const getConvectionGeminiKey = () =>
  fetchQuery<getConvectionGeminiKeyQuery>(
    getRelayEnvironment(),
    graphql`
      query getConvectionGeminiKeyQuery {
        system {
          services {
            convection {
              geminiTemplateKey
            }
          }
        }
      }
    `,
    {},
    {
      fetchPolicy: "network-only",
    }
  )
    .toPromise()
    .then((data) => data?.system?.services?.convection.geminiTemplateKey)
