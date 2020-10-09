import { action, Action } from "easy-peasy"
import { Flex } from "palette"
import React, { useContext, useState } from "react"
import { ActivityIndicator } from "react-native"

const LoadingBlockingView: React.FC = () => (
  <LoadingBlockContext.Consumer>
    {({ loadingBlock }) => {
      return loadingBlock ? (
        <Flex
          position="absolute"
          width="100%"
          height="100%"
          alignItems="center"
          justifyContent="center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.15)" }}
        >
          <ActivityIndicator size="large" />
        </Flex>
      ) : null
    }}
  </LoadingBlockContext.Consumer>
)

const LoadingBlockContext = React.createContext<{ loadingBlock: boolean; setLoadingBlock: (val: boolean) => void }>(
  null!
)

export const LoadingBlockProvider: React.FC = ({ children }) => {
  const [loadingBlock, setLoadingBlock] = useState(false)

  return (
    <LoadingBlockContext.Provider value={{ loadingBlock, setLoadingBlock }}>
      {children}
      <LoadingBlockingView />
    </LoadingBlockContext.Provider>
  )
}

export const useLoadingBlock = () => {
  const { setLoadingBlock } = useContext(LoadingBlockContext)
  return setLoadingBlock
}

export interface LoadingBlockingViewModel {
  sessionState: {
    isShowing: boolean
  }

  show: Action<LoadingBlockingViewModel, boolean>
  hide: Action<LoadingBlockingViewModel, boolean>
}

export const LoadingBlockingViewModel: LoadingBlockingViewModel = {
  sessionState: {
    isShowing: false,
  },

  show: action((state) => {
    state.sessionState.isShowing = true
  }),
  hide: action((state) => {
    state.sessionState.isShowing = false
  }),
}
