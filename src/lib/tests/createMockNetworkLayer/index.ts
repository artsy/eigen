import { GraphQLFieldResolver, responsePathAsArray } from "graphql"
import { IMocks } from "graphql-tools/dist/Interfaces"
import getNetworkLayer from "relay-mock-network-layer"
import { Network } from "relay-runtime"
import * as uuid from "uuid"

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

const complain = (info, type) => {
  const filepath = responsePathAsArray(info.path).join("/")
  const message = `A mock for field at path '${filepath}' of type '${type}' was expected but not found.`
  throw new Error(message)
}

export const createMockNetworkLayer2 = (queryData: object = {}, mutationData: object = {}) => {
  const idMap = new WeakMap()
  return Network.create(
    getNetworkLayer({
      fieldResolver: ((source, _args, _context, info) => {
        // source is null for aliased root fields
        source = source || queryData
        if (source) {
          if (info.fieldName in source) {
            return source[info.fieldName]
          }
          const alias = info.fieldNodes[0].alias
          if (alias && alias.value in source) {
            return source[alias.value]
          }

          if (info.fieldName === "__id" || info.fieldName === "id") {
            if ("id" in source) {
              return source.id
            }

            if (idMap.has(source)) {
              return idMap.get(source)
            }

            const id = uuid()
            idMap.set(source, id)
            return id
          }
        }
        complain(info, info.returnType.inspect())
      }) as GraphQLFieldResolver<any, any>,
      schema,
      resolveQueryFromOperation: ({ id }) => {
        return require("../../../__generated__/complete.queryMap.json")[id]
      },
      resolvers: {
        FormattedNumber: () => FormattedNumber,
        // @ts-ignore
        Query: Object.entries(queryData).reduce(
          (acc, [k, v]) => ({
            ...acc,
            [k]: typeof v === "function" ? v : () => v,
          }),
          {}
        ),
        // @ts-ignore
        Mutation: Object.entries(mutationData).reduce(
          (acc, [k, v]) => ({
            ...acc,
            [k]: typeof v === "function" ? v : () => v,
          }),
          {}
        ),
      },
    })
  )
}
