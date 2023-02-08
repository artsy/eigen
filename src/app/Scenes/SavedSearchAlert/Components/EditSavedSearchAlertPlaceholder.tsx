import { Spacer } from "@artsy/palette-mobile"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { PlaceholderText } from "app/utils/placeholders"
import { Box, Flex } from "palette"

export const EditSavedSearchFormPlaceholder = () => {
  return (
    <PageWithSimpleHeader title="Edit your Alert">
      <Box p={2}>
        {/* Input name */}
        <Box mb={2}>
          <PlaceholderText width={50} height={18} />
          <Spacer y="0.5" />
          <PlaceholderText height={40} />
        </Box>

        {/* Filter pills */}
        <Box mb={2}>
          <PlaceholderText width={50} height={18} />
          <Spacer y="0.5" />
          <Flex flexDirection="row" flexWrap="wrap" mt={1} mx={-0.5}>
            <Box mx={0.5}>
              <PlaceholderText width={65} height={30} />
            </Box>
            <Box mx={0.5}>
              <PlaceholderText width={100} height={30} />
            </Box>
            <Box mx={0.5}>
              <PlaceholderText width={70} height={30} />
            </Box>
            <Box mx={0.5}>
              <PlaceholderText width={120} height={30} />
            </Box>
            <Box mx={0.5}>
              <PlaceholderText width={100} height={30} />
            </Box>
          </Flex>
        </Box>

        <Spacer y={4} />
        <PlaceholderText height={50} />
        <Spacer y={2} />
        <PlaceholderText height={50} />
      </Box>
    </PageWithSimpleHeader>
  )
}
