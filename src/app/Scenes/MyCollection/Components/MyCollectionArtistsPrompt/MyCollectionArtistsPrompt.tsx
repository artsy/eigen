import { Flex, Text } from "@artsy/palette-mobile"
import { useBottomSheet } from "@gorhom/bottom-sheet"
import { MyCollectionArtistsPromptBody } from "app/Scenes/MyCollection/Components/MyCollectionArtistsPrompt/MyCollectionArtistsPromptBody"
import { SNAP_POINTS } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModalArtistsPrompt"
import { MyCollectionAddCollectedArtistsStore } from "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtistsStore"
import { MotiView } from "moti"
import { FC } from "react"
import { useAnimatedStyle, withTiming } from "react-native-reanimated"

export interface MyCollectionArtistsPromptProps {
  title: string
  subtitle?: string
}

export const MyCollectionArtistsPrompt: FC<MyCollectionArtistsPromptProps> = ({
  title,
  subtitle,
}) => {
  const { animatedIndex } = useBottomSheet()

  const style = useAnimatedStyle(() => {
    return {
      height: withTiming(animatedIndex.value === 1 ? SNAP_POINTS[1] : SNAP_POINTS[0], {
        duration: 200,
      }),
    }
  })

  return (
    <MotiView style={style}>
      <Flex px={2} pt={1} pb={2} flex={1}>
        <Text variant="md">{title}</Text>

        {!!subtitle && <Text>{subtitle}</Text>}

        <Flex pt={2} gap={2} flex={1}>
          <MyCollectionAddCollectedArtistsStore.Provider>
            <MyCollectionArtistsPromptBody />
          </MyCollectionAddCollectedArtistsStore.Provider>
        </Flex>
      </Flex>
    </MotiView>
  )
}
