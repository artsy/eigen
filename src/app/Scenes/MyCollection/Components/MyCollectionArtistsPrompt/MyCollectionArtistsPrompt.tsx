import { Flex, Spinner, Text, useSpace } from "@artsy/palette-mobile"
import { useBottomSheet } from "@gorhom/bottom-sheet"
import { MyCollectionArtistsPromptBody } from "app/Scenes/MyCollection/Components/MyCollectionArtistsPrompt/MyCollectionArtistsPromptBody"
import { SNAP_POINTS } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModalArtistsPrompt"
import { MyCollectionAddCollectedArtistsStore } from "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtistsStore"
import { MotiView } from "moti"
import { FC, Suspense } from "react"
import { useDerivedValue } from "react-native-reanimated"

export interface MyCollectionArtistsPromptProps {
  title: string
  subtitle?: string
}

export const MyCollectionArtistsPrompt: FC<MyCollectionArtistsPromptProps> = ({
  title,
  subtitle,
}) => {
  const space = useSpace()
  const { animatedIndex } = useBottomSheet()

  return (
    <MotiView
      animate={useDerivedValue(() => ({
        height: animatedIndex.value === 1 ? SNAP_POINTS[1] : SNAP_POINTS[0],
      }))}
      transition={{
        type: "timing",
        duration: 200,
      }}
    >
      <Flex px={2} pt={1} pb={2} flex={1}>
        <Suspense
          fallback={
            <Flex justifyContent="center" alignItems="center" flex={1}>
              <Spinner />
            </Flex>
          }
        >
          <Text variant="md">{title}</Text>

          {!!subtitle && <Text>{subtitle}</Text>}

          <Flex pt={2} gap={space(2)} flex={1}>
            <MyCollectionAddCollectedArtistsStore.Provider>
              <MyCollectionArtistsPromptBody />
            </MyCollectionAddCollectedArtistsStore.Provider>
          </Flex>
        </Suspense>
      </Flex>
    </MotiView>
  )
}
