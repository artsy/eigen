import { Button, Flex, Spacer, Text, useSpace } from "@artsy/palette-mobile"
import LinearGradient from "react-native-linear-gradient"
import { SafeAreaView } from "react-native-safe-area-context"

export const InfiniteDiscoveryOnboarding: React.FC<{}> = () => {
  const space = useSpace()

  return (
    <Flex flex={1} backgroundColor="white100">
      <Flex flex={1}>
        <LinearGradient
          colors={["rgba(0, 0, 0, 0)", `rgba(0, 0, 0, 0.1)`]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        />
        <SafeAreaView style={{ flex: 1, justifyContent: "flex-end", paddingHorizontal: space(2) }}>
          <Flex>
            <Text variant="sm-display" color="black60">
              Welcome to Discover Daily
            </Text>

            <Spacer y={0.5} />

            <Text variant="lg-display">A new way of browsing works on Artsy.</Text>

            <Spacer y={2} />

            <Flex alignItems="flex-end">
              <Button variant="outline">Next</Button>
            </Flex>
          </Flex>
        </SafeAreaView>
      </Flex>
    </Flex>
  )
}
