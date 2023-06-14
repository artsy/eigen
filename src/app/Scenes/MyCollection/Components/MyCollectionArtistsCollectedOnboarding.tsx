import { Text, Flex, Button, useColor, useSpace } from "@artsy/palette-mobile"
import React from "react"
import { Image, Platform } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const MyCollectionArtistsCollectedOnboarding: React.FC<{}> = () => {
  const insets = useSafeAreaInsets()
  const color = useColor()
  const space = useSpace()
  return (
    <>
      <Flex mt={Platform.OS === "android" ? `${insets.top}px` : undefined}>
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
              console.warn("TODO: add navigtion in a separate ticket")
              /* navigate("", {
              passProps: {
                onSuccess: () => {
                  // Since the career highlights screen is a modal, we need to dismiss it after
                  // saving the artwork.
                  dismissModal()
                },
              },
            }) */
            }}
          >
            Select Artists to Share
          </Button>
        </Flex>
      </Flex>
    </>
  )
}
