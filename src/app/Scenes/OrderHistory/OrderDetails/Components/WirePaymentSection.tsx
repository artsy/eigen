import { WirePaymentSection_order$data } from "__generated__/WirePaymentSection_order.graphql"
import { sendEmail } from "app/utils/sendEmail"
import { Flex, Spacer, Text } from "palette"
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
          <Text color="blue100" onPress={() => sendEmail("orders@artsy.net")}>
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
      <Text>Account name: Art.sy Inc.</Text>
      <Text>Account number: 4243851425</Text>
      <Text>Routing number: 121000248</Text>
      <Text>International SWIFT: WFBIUS6S</Text>
      <Spacer mt={2} />
      <Text fontWeight="bold" color="black100">
        Bank address
      </Text>
      <Spacer mt={1} />
      <Text>Wells Fargo Bank, N.A.</Text>
      <Text>420 Montgomery Street</Text>
      <Text>San Francisco, CA 9410</Text>
      <Spacer mt={2} />
      <Text fontStyle="italic">
        Add order number #{code} to the notes section in your wire transfer.
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
