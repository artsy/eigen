import { Flex, Text } from "palette"

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
