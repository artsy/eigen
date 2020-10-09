import { action, Action } from "easy-peasy"
import { AppStore } from "lib/store/AppStore"
import { Flex } from "palette"
import React from "react"
import { ActivityIndicator } from "react-native"

const LoadingBlockingView: React.FC = () => {
  const isShowing = AppStore.useAppState((state) => state.loadingBlockingView.sessionState.isShowing)

  if (!isShowing) {
    return null
  }

  return (
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
  )
}

export const LoadingBlockProvider: React.FC = ({ children }) => {
  return (
    <>
      {children}
      <LoadingBlockingView />
    </>
  )
}

export const useShowLoadingBlock = () => {
  return (value: boolean) => {
    AppStore.actions.loadingBlockingView.setIsShowing(value)
  }
}

///// rename this file

export interface LoadingBlockingViewModel {
  sessionState: {
    isShowing: boolean
  }

  setIsShowing: Action<LoadingBlockingViewModel, boolean>
}

export const LoadingBlockingViewModel: LoadingBlockingViewModel = {
  sessionState: {
    isShowing: false,
  },

  setIsShowing: action((state, input) => {
    state.sessionState.isShowing = input
  }),
}
