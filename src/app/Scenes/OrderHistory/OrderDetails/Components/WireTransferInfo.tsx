import { LinkIcon } from "@artsy/icons/native"
import { Box, Flex, Spacer, Text, TextProps } from "@artsy/palette-mobile"
import Clipboard from "@react-native-clipboard/clipboard"
import { OrderDetailsMessage_order$data } from "__generated__/OrderDetailsMessage_order.graphql"
import { useToast } from "app/Components/Toast/toastHook"

interface WireTransferInfoProps {
  order: Pick<OrderDetailsMessage_order$data, "currencyCode" | "code">
}

export const WireTransferInfo: React.FC<WireTransferInfoProps> = ({ order }) => {
  const currencyCode = order.currencyCode || "USD"

  const details = BANK_DETAILS[currencyCode] || BANK_DETAILS.USD

  return (
    <Box border="1px solid" borderColor="mono15" p={2}>
      <Text variant="sm" fontWeight="bold">
        Send wire transfer to
      </Text>
      <Flex mt={1} mb={4}>
        {details.transferInfo.map((row, index) => (
          <Flex flexDirection="row" alignItems="center" key={index}>
            <Text variant="sm">{row.label}: </Text>
            <CopyText value={row.value} />
          </Flex>
        ))}
      </Flex>

      <Text variant="sm" fontWeight="bold">
        Bank address
      </Text>
      <Flex mt={1} mb={4}>
        {details.bankAddress.map((rowText, index) => (
          <Text variant="sm" key={index}>
            {rowText}
          </Text>
        ))}
      </Flex>

      <Text variant="sm" fontWeight="bold">
        Add order <CopyText value={`#${order.code}`} fontWeight="bold" /> to the notes section in
        your wire transfer.
      </Text>

      <Spacer y={1} />

      <Text variant="sm">
        If your bank account is not in {currencyCode}, please reference Artsy’s intermediary bank
        ING Brussels (Intermediary Bank BIC/SWIFT: {details.referenceInfo.intermediary}) along with
        Artsy’s international SWIFT ({details.referenceInfo.international}) when making payment. Ask
        your bank for further instructions.
      </Text>
    </Box>
  )
}

const CopyText: React.FC<{ value: string } & TextProps> = ({ value, ...rest }) => {
  const toast = useToast()

  const handleCopyPress = () => {
    Clipboard.setString(value)
    toast.show("Copied", "bottom", {})
  }

  return (
    <Text onPress={handleCopyPress} style={{ flexDirection: "row", alignItems: "center" }}>
      <Text {...rest}>{value}</Text>

      <LinkIcon width={12} height={12} />
    </Text>
  )
}

interface BankDetails {
  transferInfo: Record<"label" | "value", string>[]
  bankAddress: string[]
  referenceInfo: {
    intermediary: string
    international: string
  }
}

const BANK_DETAILS: Record<string, BankDetails> = {
  GBP: {
    transferInfo: [
      { label: "Account name", value: "Art.sy Inc." },
      { label: "Account number", value: "88005417" },
      { label: "IBAN", value: "GB30PNBP16567188005417" },
      { label: "International SWIFT", value: "PNBPGB2L" },
      { label: "Sort Code", value: "16-56-7" },
    ],
    bankAddress: [
      "Wells Fargo Bank, N.A. London Branch",
      "1 Plantation Place",
      "30 Fenchurch Street",
      "London, United Kingdom, EC3M 3BD",
    ],
    referenceInfo: { intermediary: "NWBKGB2LXXX", international: "PNBPGB2L" },
  },
  EUR: {
    transferInfo: [
      { label: "Account name", value: "Art.sy Inc." },
      { label: "Account number", value: "88005419" },
      { label: "IBAN", value: "GB73PNBP16567188005419" },
      { label: "International SWIFT", value: "PNBPGB2L" },
    ],
    bankAddress: [
      "Wells Fargo Bank, N.A. London Branch",
      "1 Plantation Place",
      "30 Fenchurch Street",
      "London, United Kingdom, EC3M 3BD",
    ],
    referenceInfo: { intermediary: "BBRUBEBB010", international: "PNBPGB2L" },
  },
  USD: {
    transferInfo: [
      { label: "Account name", value: "Art.sy Inc." },
      { label: "Account number", value: "4243851425" },
      { label: "Routing number", value: "121000248" },
      { label: "International SWIFT", value: "WFBIUS6S" },
    ],
    bankAddress: [
      "Wells Fargo Bank, N.A.",
      "420 Montgomery Street",
      "San Francisco, CA 94104",
      "United States",
    ],
    referenceInfo: { intermediary: "PNBPUS3NNYC", international: "WFBIUS6S" },
  },
}
