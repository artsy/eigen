import {
  GraphQLFieldResolver,
  GraphQLResolveInfo,
  isAbstractType,
  isLeafType,
  isNonNullType,
  responsePathAsArray,
} from "graphql"
import { IMocks } from "graphql-tools/dist/Interfaces"
import getNetworkLayer from "relay-mock-network-layer"
import { INetwork as RelayNetwork, Network } from "relay-runtime"
import uuid from "uuid"

import { get } from "lib/utils/get"
import schema from "../../../../data/schema.graphql"
import FormattedNumber from "./CustomScalars/formatted_number"
/**
 * @deprecated use createMockNetworkLayer2
 * @param mockResolvers
 */
export const createMockNetworkLayer = (mockResolvers: IMocks) => {
  return Network.create(
    getNetworkLayer({
      schema,
      mocks: { FormattedNumber: () => FormattedNumber, ...mockResolvers },
      resolveQueryFromOperation: ({ id }) => {
        return require("../../../../data/complete.queryMap.json")[id]
      },
    })
  )
}

export const createMockNetworkLayer2 = ({
  mockData = {},
  mockMutationResults = {},
}: {
  mockData?: object
  mockMutationResults?: object
}): RelayNetwork => {
  return Network.create(createMockFetchQuery({ mockData, mockMutationResults }))
}

/**
 * Here we create a mock for the `fetchQuery` graphql helper which executes
 * a query. The mock is injected with fake results.
 * @param param0
 */
export const createMockFetchQuery = ({
  mockData = {},
  mockMutationResults = {},
}: {
  mockData?: object
  mockMutationResults?: object
}) => {
  const idMap = new WeakMap()
  // getNetworkLayer is quite poorly named. It's actually returning a
  // `fetchQuery` function
  return getNetworkLayer({
    // We pass this field resolver in so that we can control the resolution
    // logic for all data that relay tries to extract from our mock fixtures.
    fieldResolver: ((source, _args, _context, info) => {
      const pathAsArray = responsePathAsArray(info.path)
      if (pathAsArray.length === 1) {
        // source is null for root fields
        source = source || (info.operation.operation === "mutation" ? mockMutationResults : mockData)
      }

      // fail early if source is not an object type
      // this happens because graphql only checks for null when deciding
      // whether to resolve fields in a given value
      if (typeof source !== "object") {
        const parentPath = pathAsArray.slice(0, -1).join("/")
        const operationName = get(info, i => i.operation.name.value)
        throw new Error(
          `The value at path '${parentPath}' for operation '${operationName}' should be an object but is a ${typeof source}.`
        )
      }

      // handle aliased fields first
      const alias = info.fieldNodes[0].alias
      if (alias && alias.value in source) {
        const value = source[alias.value]
        checkValue(value, info)
        return value
      }

      // the common case, the field has a fixture and is not aliased
      if (info.fieldName in source) {
        const value = source[info.fieldName]
        checkValue(value, info)
        return value
      }

      if (info.fieldName === "id" || info.fieldName === "slug" || info.fieldName === "internalID") {
        // if relay is looking for `id`, `slug`, or `internalID`, but we only supplied one of the other
        if ("slug" in source) {
          return source.slug
        }
        if ("internalID" in source) {
          return source.internalID
        }
        if ("id" in source) {
          return source.id
        }

        // relay is looking for an id to denormalize the fixture in the store
        // but we don't want to have to specify ids for all fixtures
        // so generate one and store it in a weak map so we don't mutate
        // the object itself
        if (idMap.has(source)) {
          return idMap.get(source)
        }

        const id = uuid()
        idMap.set(source, id)
        return id
      }

      throw error(
        info,
        ({ type, path, operationName }) =>
          `A mock for field at path '${path}' of type '${type}' was expected for operation '${operationName}', but none was found.`
      )
    }) as GraphQLFieldResolver<any, any>,
    schema,
    resolveQueryFromOperation: ({ id }) => {
      return require("../../../../data/complete.queryMap.json")[id]
    },
    resolvers: {
      FormattedNumber: () => FormattedNumber,
      // here we map the mock fixture entries to resolver functions if they aren't
      // already. graphql-tools expects functions, but we want to be able to just
      // supply plain data for syntax convenience.
      Query: Object.keys(mockData).reduce(
        (acc, k) => ({
          ...acc,
          [k]: typeof mockData[k] === "function" ? mockData[k] : () => mockData[k],
        }),
        {}
      ),
      Mutation: Object.keys(mockMutationResults).reduce(
        (acc, k) => ({
          ...acc,
          [k]: typeof mockMutationResults[k] === "function" ? mockMutationResults[k] : () => mockMutationResults[k],
        }),
        {}
      ),
    },
  })
}

const checkNonNullType = (value: unknown, info: GraphQLResolveInfo) => {
  const returnType = info.returnType
  if (value == null) {
    if (isNonNullType(returnType)) {
      throw error(
        info,
        ({ type, path, operationName }) =>
          `Expected '${type}' value for non-nullable field at path '${path}' for operation '${operationName}'`
      )
    }
  }
}

const checkLeafType = (value: unknown, info: GraphQLResolveInfo) => {
  const returnType = info.returnType

  if (isLeafType(returnType) && value != null) {
    try {
      returnType.parseValue(value)
    } catch (e) {
      throw error(
        info,
        ({ type, path, operationName }) =>
          `Expected mock value of type '${type}' but got '${
            value === null ? "null" : typeof value
          }' at path '${path}' for operation '${operationName}'`
      )
    }
  }
}

// This function tries to infer the concrete type of a value that appears
// in a position whose type is either a union or an interface
const checkUnionOrInterfaceType = (value: unknown, info: GraphQLResolveInfo) => {
  let returnType = info.returnType

  if (isNonNullType(returnType)) {
    returnType = returnType.ofType
  }

  if (!isAbstractType(returnType)) {
    return value
  }

  // remember that typeof null === 'object'
  if (typeof value !== "object") {
    throw error(
      info,
      ({ type, path, operationName }) =>
        `Expected object of type '${type}' but got '${typeof value}' at path '${path}' for operation '${operationName}'`
    )
  }

  if (value == null || "__typename" in value) {
    return value
  }

  const unionMemberTypes = info.schema.getPossibleTypes(returnType)

  // try to find keys in the object which are unique to one type
  for (const key of Object.keys(value)) {
    const matchingTypes = unionMemberTypes.filter(type => type.getFields()[key])
    if (matchingTypes.length === 1) {
      return { ...value, __typename: matchingTypes[0].name }
    }
  }

  // failed to find unique keys so the object is ambiguous and we need to ask for a __typename
  const possibleTypes = unionMemberTypes.map(type => type.name).join(", ")
  throw error(
    info,
    ({ path, operationName }) =>
      `Ambiguous object at path '${path}' for operation '${operationName}'. Add a __typename from this list: [${possibleTypes}]`
  )
}

const checkValue = (value: unknown, info: GraphQLResolveInfo) => {
  checkNonNullType(value, info)
  checkLeafType(value, info)
  checkUnionOrInterfaceType(value, info)
}

function error(
  info: GraphQLResolveInfo,
  renderMessage: (
    args: {
      type: string
      path: string
      operationName: string
    }
  ) => string
) {
  return new Error(
    renderMessage({
      path: responsePathAsArray(info.path).join("/"),
      type: info.returnType.inspect(),
      operationName: get(info, i => i.operation.name.value, "(unknown)"),
    })
  )
}
