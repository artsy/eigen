import { Box, Text } from "palette"

export const TabEmptyState: React.FC<{
  text: string
}> = ({ text }) => {
  return (
    <Box mt={3}>
      <Text variant="sm" color="black60" style={{ textAlign: "center" }}>
        {text}
      </Text>
    </Box>
  )
}
