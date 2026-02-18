import { Flex, Box, Text, Separator, TextProps, NAVBAR_HEIGHT } from "@artsy/palette-mobile"
import { View } from "react-native"

export const PageWithSimpleHeader: React.FC<
  React.PropsWithChildren<{
    title: string
    titleWeight?: TextProps["weight"]
    left?: React.ReactNode
    right?: React.ReactNode
    noSeparator?: boolean
  }>
> = ({ title, titleWeight, left, right, children, noSeparator }) => {
  return (
    <Box style={{ flex: 1 }}>
      <Flex px={2} flexDirection="row" alignItems="center" height={54}>
        <Flex
          alignItems="flex-start"
          justifyContent="center"
          height={NAVBAR_HEIGHT}
          position="absolute"
          left={2}
        >
          {left}
        </Flex>
        <Flex flex={1} height={NAVBAR_HEIGHT} justifyContent="center" width="100%" mx={2}>
          <Text variant="sm-display" weight={titleWeight} textAlign="center" numberOfLines={2}>
            {title}
          </Text>
        </Flex>
        <Flex
          alignItems="flex-end"
          justifyContent="center"
          height={NAVBAR_HEIGHT}
          alignSelf="flex-end"
          position="absolute"
          right={2}
        >
          {right}
        </Flex>
      </Flex>
      {!noSeparator && <Separator />}
      <View style={{ flex: 1 }}>{children}</View>
    </Box>
  )
}
