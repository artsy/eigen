import { getConvectionGeminiKeyQuery } from "__generated__/getConvectionGeminiKeyQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { fetchQuery, graphql } from "relay-runtime"

export const getConvectionGeminiKey = () =>
  fetchQuery<getConvectionGeminiKeyQuery>(
    defaultEnvironment,
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
    { force: true }
  ).then(data => data.system.services.convection.geminiTemplateKey)
