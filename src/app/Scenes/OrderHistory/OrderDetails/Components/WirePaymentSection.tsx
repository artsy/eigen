import Clipboard from "@react-native-clipboard/clipboard"
import { WirePaymentSection_order$data } from "__generated__/WirePaymentSection_order.graphql"
import { useToast } from "app/Components/Toast/toastHook"
import { sendEmail } from "app/utils/sendEmail"
import { Flex, LinkIcon, Spacer, Text } from "palette"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  order: WirePaymentSection_order$data
}

const NumberedListItem: React.FC<{ index: number }> = ({ children, index }) => (
  <Flex flexDirection="row">
    <Flex minWidth={20}>
      <Text>{index}.</Text>
    </Flex>
    {children}
  </Flex>
)

const PaymentInfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <Flex flexDirection="row" alignItems="center">
    <Text>{label}: </Text>
    <CopySection value={value} />
  </Flex>
)

const CopySection: React.FC<{ value: string }> = ({ value }) => {
  const toast = useToast()

  const handleCopyPress = () => {
    Clipboard.setString(value)
    toast.show("Copied", "middle")
  }

  return (
    <Text
      onPress={handleCopyPress}
      style={{
        flexDirection: "row",
      }}
    >
      <Text fontStyle="italic" underline>
        {value}
      </Text>
      <LinkIcon width={12} height={12} />
    </Text>
  )
}

const WirePaymentSection: React.FC<Props> = ({ order: { code } }) => (
  <Flex>
    <Flex my={2} bg="orange10" p={2}>
      <Text color="orange150">Proceed with the wire transfer to complete your purchase</Text>
      <Text>
        Please provide your proof of payment within 7 days. After this period, your order will be
        eligible for cancellation by the gallery.
      </Text>
      <Spacer mt={2} />

      <NumberedListItem index={1}>
        <Text>Find the order total and Artsy’s banking details below.</Text>
      </NumberedListItem>

      <NumberedListItem index={2}>
        <Text>
          Please inform your bank that you will be responsible for all wire transfer fees.
        </Text>
      </NumberedListItem>

      <NumberedListItem index={3}>
        <Text>
          Once you have made the transfer, please email{" "}
          <Text
            color="blue100"
            onPress={() =>
              sendEmail("orders@artsy.net", {
                subject: `Proof of wire transfer payment (#${code})`,
              })
            }
          >
            orders@artsy.net
          </Text>{" "}
          with your proof of payment.
        </Text>
      </NumberedListItem>
    </Flex>

    <Flex borderWidth={1} borderColor="black10" p={2}>
      <Text fontWeight="bold" color="black100">
        Send wire transfer to
      </Text>
      <Spacer mt={1} />

      <PaymentInfoItem label="Account name" value="Art.sy Inc." />
      <PaymentInfoItem label="Account number" value="4243851425" />
      <PaymentInfoItem label="Routing number" value="121000248" />
      <PaymentInfoItem label="International SWIFT" value="WFBIUS6S" />

      <Spacer mt={2} />

      <Text fontWeight="bold" color="black100">
        Bank address
      </Text>
      <Spacer mt={1} />
      <Text>Wells Fargo Bank, N.A.</Text>
      <Text>420 Montgomery Street</Text>
      <Text>San Francisco, CA 9410</Text>
      <Spacer mt={2} />

      <Text>
        <Text fontStyle="italic">Add order number #</Text>
        <CopySection value={code} />
        <Text fontStyle="italic"> to the notes section in your wire transfer.</Text>
      </Text>
    </Flex>
  </Flex>
)

export const WirePaymentSectionFragmentContainer = createFragmentContainer(WirePaymentSection, {
  order: graphql`
    fragment WirePaymentSection_order on CommerceOrder {
      code
    }
  `,
})
