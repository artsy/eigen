import { Button, Flex, Join, Separator, Spacer, Text } from "@artsy/palette-mobile"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { ArtworkListsFancyModal } from "app/Scenes/ArtworkLists/components/ArtworkListsFancyModal"
import { navigate } from "app/system/navigation/navigate"
import { FC, useState } from "react"

export const ArtworkLists = () => {
  const [visibleFancyModal, setVisibleFancyModal] = useState(false)
  const [visibleFullScreenFancyModal, setVisibleFullScreenFancyModal] = useState(false)

  const handleNavigateToScreen = () => {
    navigate("/artwork-lists/select-lists-for-artwork")
  }

  const handleOpenFancyModal = () => {
    setVisibleFancyModal(true)
  }

  const handleCloseFancyModal = () => {
    setVisibleFancyModal(false)
  }

  const handleOpenFullScreenFancyModal = () => {
    setVisibleFullScreenFancyModal(true)
  }

  const handleCloseFullScreenFancyModal = () => {
    setVisibleFullScreenFancyModal(false)
  }

  return (
    <>
      <StickyTabPageScrollView contentContainerStyle={{ paddingVertical: 20 }}>
        <Join
          separator={
            <>
              <Spacer y={2} />
              <Separator borderColor="black10" />
              <Spacer y={2} />
            </>
          }
        >
          <Desription
            text="Use app navigation"
            buttonText="Approach #1"
            onPress={handleNavigateToScreen}
          />
          <Desription
            text="Use FancyModal component with independent React Navigation"
            buttonText="Approach #2"
            onPress={handleOpenFancyModal}
          />
          <Desription
            text="Use **fullscreen** FancyModal component with independent React Navigation"
            buttonText="Approach #3"
            onPress={handleOpenFullScreenFancyModal}
          />
        </Join>
      </StickyTabPageScrollView>

      <ArtworkListsFancyModal visible={visibleFancyModal} onClose={handleCloseFancyModal} />
      <ArtworkListsFancyModal
        fullScreen
        visible={visibleFullScreenFancyModal}
        onClose={handleCloseFullScreenFancyModal}
      />
    </>
  )
}

type DesriptionProps = {
  text: string
  buttonText: string
  onPress: () => void
}

const Desription: FC<DesriptionProps> = ({ text, buttonText, onPress }) => {
  return (
    <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
      <Flex flex={1} mr={1}>
        <Text variant="xs" color="black60">
          {text}
        </Text>
      </Flex>

      <Spacer y={1} />

      <Button size="small" onPress={onPress}>
        {buttonText}
      </Button>
    </Flex>
  )
}
