import { Box, Sans } from "palette"

export const TabEmptyState: React.FC<{
  text: string
}> = ({ text }) => {
  return (
    <Box mt={3}>
      <Sans size="3t" color="black60" style={{ textAlign: "center" }}>
        {text}
      </Sans>
    </Box>
  )
}
