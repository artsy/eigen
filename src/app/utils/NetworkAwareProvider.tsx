import { Spacer, Flex, Text, Button } from "@artsy/palette-mobile"
import NetInfo from "@react-native-community/netinfo"
import { useScreenDimensions } from "app/utils/hooks"
import React, { useEffect, useState } from "react"
import { Modal } from "react-native"

export const NetworkAwareProvider: React.FC<{}> = () => {
  const [isDismissed, setIsDismissed] = useState(false)
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const { safeAreaInsets } = useScreenDimensions()

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected)
    })

    return unsubscribe
  }, [])

  if (isDismissed) {
    return null
  }

  return (
    <Modal
      visible={isConnected === false}
      statusBarTranslucent
      transparent
      animationType="fade"
      hardwareAccelerated
      presentationStyle="overFullScreen"
    >
      <Flex flex={1} justifyContent="flex-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <Flex
          backgroundColor="mono0"
          alignItems="center"
          px={2}
          py={2}
          pb={`${safeAreaInsets.bottom + 20}px`}
        >
          <Text textAlign="center" variant="lg-display">
            Connection Error
          </Text>

          <Spacer y={1} />

          <Text textAlign="center" variant="sm" color="mono60">
            Oops! Looks like your device is not connected to the Internet.
          </Text>

          <Spacer y={2} />

          <Button
            block
            onPress={async () => {
              // Sometimes netinfo doesn't capture network changes so we need to trigger it manually
              await NetInfo.fetch()
            }}
          >
            Try Again
          </Button>
          <Button
            block
            onPress={() => {
              setIsDismissed(true)
            }}
            variant="outline"
            mt={1}
          >
            Dismiss
          </Button>
        </Flex>
      </Flex>
    </Modal>
  )
}
