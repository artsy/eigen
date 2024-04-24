import { BackButton, Flex, Screen, Text, useSpace } from "@artsy/palette-mobile"
import { ArtworkLists } from "app/Scenes/ArtworkLists/ArtworkLists"
import { goBack } from "app/system/navigation/navigate"

export const SavedArtworks = () => {
  const space = useSpace()

  return (
    <Screen>
      <Screen.AnimatedHeader
        leftElements={
          <Flex flexDirection="row" alignItems="center" gap={space(1)}>
            <BackButton onPress={goBack} />
            <Text>Profile</Text>
          </Flex>
        }
        title="Saves"
      />
      <Screen.StickySubHeader title="Saves" />
      <Screen.Body fullwidth>
        <ArtworkLists isTab={false} />
      </Screen.Body>
    </Screen>
  )
}
