import NetInfo from "@react-native-community/netinfo"
import { useScreenDimensions } from "app/utils/useScreenDimensions"
import { Button, Flex, Spacer, Text } from "palette"
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
          backgroundColor="white"
          alignItems="center"
          px={2}
          py={2}
          paddingBottom={safeAreaInsets.bottom + 20}
        >
          <Text textAlign="center" variant="lg">
            Connection Error
          </Text>

          <Spacer mt={1} />

          <Text textAlign="center" variant="sm" color="black60">
            Oops! Looks like your device is not connected to the Internet.
          </Text>

          <Spacer mt={2} />

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
