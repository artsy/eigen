import { action, Action } from "easy-peasy"
import { AppStore } from "lib/store/AppStore"
import { Flex } from "palette"
import React from "react"
import { ActivityIndicator, Modal } from "react-native"

export const LoadingBlock: React.FC = () => {
  const isShowing = AppStore.useAppState((state) => state.loadingBlock.sessionState.isShowing)

  if (!isShowing) {
    return null
  }

  return (
    <Modal animationType="fade" visible={isShowing} transparent>
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
    </Modal>
  )
}

export const LoadingBlockProvider: React.FC = ({ children }) => {
  return (
    <>
      {children}
      <LoadingBlock />
    </>
  )
}

export const useShowLoadingBlock = () => {
  return (value: boolean) => {
    AppStore.actions.loadingBlock.setIsShowing(value)
  }
}

///// rename this file

export interface LoadingBlockModel {
  sessionState: {
    isShowing: boolean
  }

  setIsShowing: Action<LoadingBlockModel, boolean>
}

export const LoadingBlockModel: LoadingBlockModel = {
  sessionState: {
    isShowing: false,
  },

  setIsShowing: action((state, input) => {
    state.sessionState.isShowing = input
  }),
}
