import { Flex, Separator, Screen, Box, Spacer } from "@artsy/palette-mobile"
import {
  PlaceholderButton,
  PlaceholderGrid,
  PlaceholderText,
  ProvidePlaceholderContext,
} from "app/utils/placeholders"

export const TagPlaceholder: React.FC = () => {
  return (
    <ProvidePlaceholderContext>
      <Screen>
        <Box flexDirection="row" alignItems="center">
          <Spacer x={2} />
          <PlaceholderButton width={20} height={20} />
          <Spacer x={2} />
          <PlaceholderText marginTop={10} width={100} height={20} />
        </Box>
        <Spacer y={1} />
        <Flex flexDirection="row" justifyContent="space-around" pb={1}>
          <PlaceholderText marginTop={10} width={100} height={20} />
          <PlaceholderText marginTop={10} width={100} height={20} />
        </Flex>
        <Separator />
        <Flex accessibilityLabel="Tag results are loading">
          <Flex height={28} my={1} px={2} justifyContent="space-between">
            <Flex flex={1} pt={0.5} flexDirection="row">
              <PlaceholderButton width={20} height={20} />
              <PlaceholderButton marginLeft={5} width={70} height={20} />
            </Flex>
          </Flex>
          <Separator mb={2} />
          <PlaceholderGrid />
        </Flex>
      </Screen>
    </ProvidePlaceholderContext>
  )
}
