import React, { SFC } from "react"
import { Environment } from "relay-runtime"
import { defaultEnvironment } from "../relay/createEnvironment"

interface BaseContextProps {
  relayEnvironment?: Environment
}

/**
 * Catch-all for additional context values passed in during initialization.
 */
export interface ContextProps extends BaseContextProps {
  [key: string]: any
}

const Context = React.createContext<ContextProps>({})

/**
 * Creates a new Context.Provider with a user and Relay environment, or defaults
 * if not passed in as props.
 */
export const ContextProvider: SFC<ContextProps> = ({ children, ...props }) => {
  const relayEnvironment = props.relayEnvironment || defaultEnvironment

  const providerValues = {
    ...props,
    relayEnvironment,
  }

  return <Context.Provider value={providerValues}>{children}</Context.Provider>
}

export const ContextConsumer = Context.Consumer
