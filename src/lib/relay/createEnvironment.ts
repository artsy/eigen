import { Environment, Network, RecordSource, Store } from "relay-runtime"
import { metaphysics } from "../metaphysics"

// Define a function that fetches the results of an operation (query/mutation/etc)
// and returns its results as a Promise:
function fetchQuery(operation, variables, _cacheConfig, _uploadables) {
  return metaphysics({ query: operation.text, variables })
}

export default function createEnvironment() {
  const network = Network.create(fetchQuery)
  const source = new RecordSource()
  const store = new Store(source)
  return new Environment({
    network,
    store,
  })
}

export const defaultEnvironment = createEnvironment()
