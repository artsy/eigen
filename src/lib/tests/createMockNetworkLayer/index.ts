import { IMocks } from "graphql-tools/dist/Interfaces"
import getNetworkLayer from "relay-mock-network-layer"
import { Network } from "relay-runtime"

// TypeScript thinks we're in React Native, this file should actually be jest-only.
import fs from "fs"
import path from "path"

import schema from "../../../../../reaction/data/schema.json"
import FormattedNumber from "./CustomScalars/formatted_number"

export const createMockNetworkLayer = (mockResolvers: IMocks) => {
  return Network.create(
    getNetworkLayer({
      schema,
      mocks: { FormattedNumber: () => FormattedNumber, ...mockResolvers },
    })
  )
}
