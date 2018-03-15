import { Environment, Network, RecordSource, Store } from "relay-runtime"
import { fetchQuery } from "./fetchQuery"

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
