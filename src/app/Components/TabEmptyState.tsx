import { Box, Text } from "@artsy/palette-mobile"

export const TabEmptyState: React.FC<{
  text: string
}> = ({ text }) => {
  return (
    <Box mt={4}>
      <Text variant="sm" color="mono60" style={{ textAlign: "center" }}>
        {text}
      </Text>
    </Box>
  )
}
