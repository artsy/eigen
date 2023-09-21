import { Button, Flex, Text } from "@artsy/palette-mobile"
import { VisualCluesConstMap } from "app/store/config/visualClues"
import { navigate } from "app/system/navigation/navigate"
import { useIsFocusedInTab } from "app/utils/hooks/useIsFocusedInTab"
import { setVisualClueAsSeen, useVisualClue } from "app/utils/hooks/useVisualClue"
import React, { useEffect, useState } from "react"
import { Image, Modal } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export const MyCollectionCollectedArtistsOnboardingModal: React.FC<{}> = () => {
  const { showVisualClue } = useVisualClue()
  const [showModal, setShowModal] = useState(false)
  const isFocused = useIsFocusedInTab("profile")

  const showMyCollectionCollectedArtistsOnboarding = !!showVisualClue(
    "MyCollectionArtistsCollectedOnboarding"
  )

  useEffect(() => {
    // Only show the modal after a delay to avoid hiding my collection content immediately
    const showModalTimeout = setTimeout(() => {
      if (isFocused) {
        setShowModal(true)
      }
    }, 1000)

    return () => {
      clearTimeout(showModalTimeout)
    }
  }, [isFocused])

  if (!showMyCollectionCollectedArtistsOnboarding || !showModal) {
    return null
  }

  return (
    <Modal
      presentationStyle="fullScreen"
      visible={showMyCollectionCollectedArtistsOnboarding}
      animationType="slide"
      onRequestClose={() => {
        setVisualClueAsSeen(VisualCluesConstMap.MyCollectionArtistsCollectedOnboarding)
        setShowModal(false)
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Flex flexGrow={1} mt={4}>
          <Flex mx={2} position="relative" flex={1}>
            <Text variant="lg-display">Share Artists You Collect</Text>
            <Text mt={1} variant="sm-display">
              Build relationships with galleries on Artsy by sharing the artists in your collection.
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
                }, 500)
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
