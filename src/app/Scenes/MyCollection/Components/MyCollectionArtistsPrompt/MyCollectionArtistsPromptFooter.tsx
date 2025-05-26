import { Button, Flex, Text, Touchable, useScreenDimensions } from "@artsy/palette-mobile"
import { useBottomSheet } from "@gorhom/bottom-sheet"
import { MyCollectionAddCollectedArtistsStore } from "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtistsStore"
import { FC } from "react"

interface MyCollectionArtistsPromptFooterProps {
  onPress: () => void
  isLoading: boolean
}

export const MyCollectionArtistsPromptFooter: FC<MyCollectionArtistsPromptFooterProps> = ({
  onPress,
  isLoading,
}) => {
  const {
    safeAreaInsets: { bottom },
  } = useScreenDimensions()
  const { close } = useBottomSheet()
  const count = MyCollectionAddCollectedArtistsStore.useStoreState((state) => state.count)

  return (
    <Flex
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      p={2}
      gap={2}
      backgroundColor="mono0"
      height={FOOTER_HEIGHT + bottom}
    >
      <Button disabled={count === 0} flex={1} onPress={onPress} loading={isLoading}>
        Add Selected Artist{count !== 1 ? "s" : ""} • {count}
      </Button>
      <Touchable accessibilityRole="button" onPress={() => close()} disabled={!!isLoading}>
        <Text underline textAlign="center">
          I haven’t started a collection yet
        </Text>
      </Touchable>
    </Flex>
  )
}

export const FOOTER_HEIGHT = 130
