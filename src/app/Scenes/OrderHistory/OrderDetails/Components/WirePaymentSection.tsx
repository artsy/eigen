import { LinkIcon } from "@artsy/icons/native"
import { Spacer, Flex, Text } from "@artsy/palette-mobile"
import Clipboard from "@react-native-clipboard/clipboard"
import { WirePaymentSection_order$data } from "__generated__/WirePaymentSection_order.graphql"
import { useToast } from "app/Components/Toast/toastHook"
import { sendEmail } from "app/utils/sendEmail"
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

const WirePaymentSection: React.FC<Props> = ({ order: { code, currencyCode, source } }) => {
  const emailAddressToUse =
    source === "private_sale" ? "privatesales@artsy.net" : "orders@artsy.net"

  return (
    <Flex>
      <Flex my={2} bg="orange10" p={2}>
        <Text color="orange150">Proceed with the wire transfer to complete your purchase</Text>
        <Text>
          Please provide your proof of payment within 7 days. After this period, your order will be
          eligible for cancellation by the gallery.
        </Text>
        <Spacer y={2} />

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
                sendEmail(emailAddressToUse, {
                  subject: `Proof of wire transfer payment (#${code})`,
                })
              }
            >
              {emailAddressToUse}
            </Text>{" "}
            with your proof of payment.
          </Text>
        </NumberedListItem>
      </Flex>

      <Flex borderWidth={1} borderColor="mono10" p={2}>
        <Text fontWeight="bold" color="mono100">
          Send wire transfer to
        </Text>
        {wireTransferArtsyBankDetails(code, currencyCode)}
      </Flex>
    </Flex>
  )
}

const wireTransferArtsyBankDetails = (code: string, currencyCode: string) => {
  switch (currencyCode) {
    case "GBP":
      return (
        <>
          <Spacer y={1} />
          <PaymentInfoItem label="Account name" value="Art.sy Inc." />
          <PaymentInfoItem label="Account number" value="88005417" />
          <PaymentInfoItem label="IBAN" value="GB30PNBP16567188005417" />
          <PaymentInfoItem label="International SWIFT" value="PNBPGB2L" />
          <PaymentInfoItem label="Sort Code" value="16-56-71" />

          <Spacer y={2} />

          <Text fontWeight="bold" color="mono100">
            Bank address
          </Text>
          <Spacer y={1} />
          <Text>Wells Fargo Bank, N.A. London Branch</Text>
          <Text>1 Plantation Place</Text>
          <Text>30 Fenchurch Street</Text>
          <Text>London, United Kingdom, EC3M 3BD</Text>
          <Spacer y={2} />
          <Text>
            <Text fontStyle="italic">Add order number #</Text>
            <CopySection value={code} />
            <Text fontStyle="italic">
              {" "}
              to the notes section in your wire transfer. If your bank account is not in GBP, please
              reference Artsy's intermediary bank ING Brussels (Intermediary Bank BIC/SWIFT:
              NWBKGB2LXXX) along with Artsy's international SWIFT (PNBPGB2L) when making payment.
              Ask your bank for further instructions.
            </Text>
          </Text>
        </>
      )
    case "EUR":
      return (
        <>
          <Spacer y={1} />
          <PaymentInfoItem label="Account name" value="Art.sy Inc." />
          <PaymentInfoItem label="Account numbe" value="88005419" />
          <PaymentInfoItem label="IBAN" value="GB73PNBP16567188005419" />
          <PaymentInfoItem label="International SWIFT" value="PNBPGB2L" />

          <Spacer y={2} />

          <Text fontWeight="bold" color="mono100">
            Bank address
          </Text>
          <Spacer y={1} />
          <Text>Wells Fargo Bank, N.A. London Branch</Text>
          <Text>1 Plantation Place</Text>
          <Text>30 Fenchurch Street</Text>
          <Text>London, United Kingdom, EC3M 3BD</Text>
          <Spacer y={2} />
          <Text>
            <Text fontStyle="italic">Add order number #</Text>
            <CopySection value={code} />
            <Text fontStyle="italic">
              {" "}
              to the notes section in your wire transfer. If your bank account is not in EUR, please
              reference Artsy's intermediary bank ING Brussels (Intermediary Bank BIC/SWIFT:
              BBRUBEBB010) along with Artsy's international SWIFT (PNBPGB2L) when making payment.
              Ask your bank for further instructions.
            </Text>
          </Text>
        </>
      )
    default:
      return (
        <>
          <Spacer y={1} />
          <PaymentInfoItem label="Account name" value="Art.sy Inc." />
          <PaymentInfoItem label="Account number" value="4243851425" />
          <PaymentInfoItem label="Routing number" value="121000248" />
          <PaymentInfoItem label="International SWIFT" value="WFBIUS6S" />

          <Spacer y={2} />

          <Text fontWeight="bold" color="mono100">
            Bank address
          </Text>
          <Spacer y={1} />
          <Text>Wells Fargo Bank, N.A.</Text>
          <Text>420 Montgomery Street</Text>
          <Text>San Francisco, CA 94104</Text>
          <Spacer y={2} />
          <Text>
            <Text fontStyle="italic">Add order number #</Text>
            <CopySection value={code} />
            <Text fontStyle="italic">
              {" "}
              to the notes section in your wire transfer. If your bank account is not in USD, please
              reference Artsy's intermediary bank ING Brussels (Intermediary Bank BIC/SWIFT:
              PNBPUS3NNYC) along with Artsy's international SWIFT (WFBIUS6S) when making payment.
              Ask your bank for further instructions.
            </Text>
          </Text>
        </>
      )
  }
}

export const WirePaymentSectionFragmentContainer = createFragmentContainer(WirePaymentSection, {
  order: graphql`
    fragment WirePaymentSection_order on CommerceOrder {
      code
      currencyCode
      source
    }
  `,
})
