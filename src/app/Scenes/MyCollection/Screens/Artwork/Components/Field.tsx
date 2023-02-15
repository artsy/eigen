import { Flex } from "@artsy/palette-mobile"
import { Text } from "palette"

const EMPTY_VALUE = "----"

export const Field: React.FC<{
  label: string
  value: string | null
  color?: "black100" | "black60"
}> = ({ label, value, color }) => {
  if (!value) {
    return null
  }
  return (
    <Flex flexDirection="row" justifyContent="space-between" my={1}>
      <Text variant="xs" color="black100" pr={1}>
        {label}
      </Text>

      <Text
        style={{ flex: 1, maxWidth: "70%" }}
        variant="xs"
        textAlign="right"
        color={color ?? "black100"}
      >
        {value}
      </Text>
    </Flex>
  )
}

export const MetaDataField: React.FC<{ label: string; value: string | null | undefined }> = ({
  label,
  value,
}) => {
  return (
    <Field label={label} value={value || EMPTY_VALUE} color={!value ? "black60" : "black100"} />
  )
}
