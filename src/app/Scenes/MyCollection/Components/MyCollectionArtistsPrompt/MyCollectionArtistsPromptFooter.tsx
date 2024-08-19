import { Button, Flex, Text, Touchable, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { useBottomSheet } from "@gorhom/bottom-sheet"
import { useToast } from "app/Components/Toast/toastHook"
import { MyCollectionAddCollectedArtistsStore } from "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtistsStore"
import { useUpdateCollectorProfile } from "app/utils/mutations/useUpdateCollectorProfile"
import { FC } from "react"

interface MyCollectionArtistsPromptFooterProps {
  onPress: () => void
  isLoading: boolean
}

export const MyCollectionArtistsPromptFooter: FC<MyCollectionArtistsPromptFooterProps> = ({
  onPress,
  isLoading: _isLoading,
}) => {
  const space = useSpace()
  const {
    safeAreaInsets: { bottom },
  } = useScreenDimensions()
  const { show } = useToast()
  const { close } = useBottomSheet()
  const [commit, inInFlight] = useUpdateCollectorProfile()
  const count = MyCollectionAddCollectedArtistsStore.useStoreState((state) => state.count)

  const handleError = (error: unknown) => {
    show("An error occurred", "bottom")
    console.error("[MyCollectionArtistsPromptFooter updateCollectorProfile] error:", error)
  }

  const handleOnClose = () => {
    commit({
      variables: { input: { promptedForUpdate: true } },
      onCompleted: (res, e) => {
        const error =
          res.updateCollectorProfile?.collectorProfileOrError?.mutationError?.message ?? e
        if (error) {
          handleError(error)
          return
        }
        close()
      },
      onError: handleError,
    })
  }

  const isLoading = _isLoading || inInFlight

  return (
    <Flex
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      p={2}
      gap={space(2)}
      backgroundColor="white100"
      height={FOOTER_HEIGHT + bottom}
    >
      <Button disabled={count === 0} flex={1} onPress={onPress} loading={isLoading}>
        Add Selected Artist{count !== 1 ? "s" : ""} • {count}
      </Button>
      <Touchable onPress={handleOnClose} disabled={!!isLoading}>
        <Text underline textAlign="center">
          I haven’t started a collection yet
        </Text>
      </Touchable>
    </Flex>
  )
}

export const FOOTER_HEIGHT = 130
