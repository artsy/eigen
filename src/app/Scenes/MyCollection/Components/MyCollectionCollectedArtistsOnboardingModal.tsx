import { Button, Flex, Text, useColor, useSpace } from "@artsy/palette-mobile"
import { VisualCluesConstMap } from "app/store/config/visualClues"
import { navigate } from "app/system/navigation/navigate"
import { setVisualClueAsSeen, useVisualClue } from "app/utils/hooks/useVisualClue"
import React from "react"
import { Image, Modal } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export const MyCollectionCollectedArtistsOnboardingModal: React.FC<{}> = () => {
  const { showVisualClue } = useVisualClue()

  const color = useColor()
  const space = useSpace()

  const showMyCollectionCollectedArtistsOnboarding = !!showVisualClue(
    "MyCollectionArtistsCollectedOnboarding"
  )

  if (!showMyCollectionCollectedArtistsOnboarding) {
    return null
  }

  return (
    <Modal presentationStyle="formSheet" animationType="slide">
      <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
        <Flex>
          <Flex top={space(1)} alignItems="center" justifyContent="flex-start" width="100%">
            <Flex
              style={{
                backgroundColor: color("black100"),
                borderRadius: 2,
                height: 4,
                width: 40,
              }}
            />
          </Flex>
        </Flex>
        <Flex flexGrow={1} mt={4}>
          <Flex mx={2} position="relative" flex={1}>
            <Text variant="lg-display">Share Artists You Collect</Text>
            <Text mt={1} variant="sm-display">
              Boost your chances of a positive response when you contact a gallery by sharing which
              artists you collect.
            </Text>
            <Flex mt={2} flex={1} justifyContent="flex-end">
              <Image
                style={{ width: "100%", height: "100%" }}
                source={require("images/myCollectionArtistsCollectedOnboarding.webp")}
              />
            </Flex>
            <Button
              my={2}
              block
              onPress={() => {
                setVisualClueAsSeen(VisualCluesConstMap.MyCollectionArtistsCollectedOnboarding)
                setTimeout(() => {
                  navigate("/my-collection/collected-artists/privacy-settings")
                }, 1000)
              }}
            >
              Select Artists to Share
            </Button>
          </Flex>
        </Flex>
      </SafeAreaView>
    </Modal>
  )
}
