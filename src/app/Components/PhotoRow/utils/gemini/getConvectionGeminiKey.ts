import { getConvectionGeminiKeyQuery } from "__generated__/getConvectionGeminiKeyQuery.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { fetchQuery, graphql } from "react-relay"

// Parallel uploads share one request instead of each fetching the same key
let pendingKey: Promise<string | null | undefined> | null = null

export const getConvectionGeminiKey = () =>
  (pendingKey ??= fetchQuery<getConvectionGeminiKeyQuery>(
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
    .finally(() => {
      pendingKey = null
    }))
