import { IMocks } from "graphql-tools/dist/Interfaces"
import getNetworkLayer from "relay-mock-network-layer"
import { Network } from "relay-runtime"

// Typescript thinks we're in React Native, this file should be test-only i.e. executed within Node.
declare const __dirname: string
// @ts-ignore
import * as fs from "fs"
// @ts-ignore
import * as path from "path"

import FormattedNumber from "./CustomScalars/formatted_number"

const schema = fs.readFileSync(path.resolve(__dirname, "../../../../data/schema.graphql"), "utf-8")

export const createMockNetworkLayer = (mockResolvers: IMocks) => {
  return Network.create(
    getNetworkLayer({
      schema,
      mocks: { FormattedNumber: () => FormattedNumber, ...mockResolvers },
      resolveQueryFromOperation: ({ id }) => {
        return require("../../../__generated__/complete.queryMap.json")[id]
      },
    })
  )
}
