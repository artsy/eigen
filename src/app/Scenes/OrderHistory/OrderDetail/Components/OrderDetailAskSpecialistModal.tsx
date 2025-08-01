import { Box, Button, Flex, Input, Screen, Separator, Text } from "@artsy/palette-mobile"
import { OrderDetailAskSpecialistModal_me$key } from "__generated__/OrderDetailAskSpecialistModal_me.graphql"
import { OrderDetailAskSpecialistModal_order$key } from "__generated__/OrderDetailAskSpecialistModal_order.graphql"
import { NavigationHeader } from "app/Components/NavigationHeader"
import { useToast } from "app/Components/Toast/toastHook"
import { useSubmitInquiryRequest } from "app/utils/mutations/useSubmitInquiryRequest"
import { useState } from "react"
import { Modal } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql, useFragment } from "react-relay"

interface OrderDetailAskSpecialistModalProps {
  order: OrderDetailAskSpecialistModal_order$key
  me: OrderDetailAskSpecialistModal_me$key
  visible: boolean
  handleDismiss: () => void
}

export const OrderDetailAskSpecialistModal: React.FC<OrderDetailAskSpecialistModalProps> = ({
  me,
  order,
  visible,
  handleDismiss,
}) => {
  const toast = useToast()
  const { bottom } = useSafeAreaInsets()
  const [message, setMessage] = useState("")
  const [error, setError] = useState(false)

  const { name, email } = useFragment(meFragment, me)
  const orderData = useFragment(orderFragment, order)
  const [submit, isSubmitting] = useSubmitInquiryRequest()

  const artworkID = orderData.lineItems[0]?.artwork?.internalID

  const handleSubmit = () => {
    if (!message.trim()) {
      return
    }

    if (!artworkID) {
      setError(true)
      return
    }

    // clear error and submit
    setError(false)
    submit({
      variables: {
        input: {
          contactGallery: false,
          inquireableID: artworkID,
          inquireableType: "Artwork",
          message,
        },
      },
      onError: () => setError(true),
      onCompleted: () => {
        handleDismiss()
        toast.show("Your message has been sent", "bottom", {
          backgroundColor: "green100",
        })
      },
    })
  }

  return (
    <Modal
      onRequestClose={handleDismiss}
      visible={visible}
      statusBarTranslucent
      animationType="slide"
    >
      <Screen>
        <NavigationHeader useXButton onLeftButtonPress={handleDismiss}>
          Send message to Artsy
        </NavigationHeader>
        {!!error && (
          <Flex bg="red100" py={1} alignItems="center">
            <Text variant="xs" color="mono0">
              Sorry, we were unable to send this message. Please try again.
            </Text>
          </Flex>
        )}

        <Flex flex={1} px={2} style={{ marginBottom: bottom }}>
          <Box mt={4} my={2}>
            <Text variant="sm-display">
              An Artsy Specialist is available to answer your questions and help you collect through
              Artsy.
            </Text>
          </Box>

          <Separator />

          <Flex flexDirection="row" py={2}>
            <Text variant="sm-display" color="mono60" mr={2}>
              From
            </Text>

            <Text variant="sm-display">
              {name} ({email})
            </Text>
          </Flex>

          <Separator />

          <Box>
            <Input
              multiline
              placeholder="Leave your comments"
              title="Your message"
              accessibilityLabel="Your message"
              defaultValue=""
              onChangeText={setMessage}
              required
            />
          </Box>

          <Flex flex={1} alignItems="center" justifyContent="flex-end">
            <Button loading={isSubmitting} onPress={handleSubmit} block>
              Send
            </Button>
          </Flex>
        </Flex>
      </Screen>
    </Modal>
  )
}

const orderFragment = graphql`
  fragment OrderDetailAskSpecialistModal_order on Order {
    lineItems {
      artwork {
        internalID
      }
    }
  }
`
const meFragment = graphql`
  fragment OrderDetailAskSpecialistModal_me on Me {
    name
    email
  }
`
