import { Button, Flex, Join, Spacer, Text, useSpace } from "@artsy/palette-mobile"
import { Image, ScrollView } from "react-native"

export const TipsForTakingPhotos: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
  const space = useSpace()

  return (
    <Flex>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Text variant="lg-display" mb={4} px={2}>
          Three tips to improve your chances of selling
        </Text>
        <Join separator={<Spacer y={4} />}>
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: space(2) }}
            >
              <Join separator={<Spacer x={1} />}>
                <Image
                  source={require("images/photo-takingtips-example-01-01.webp")}
                  resizeMode="contain"
                />
                <Image
                  source={require("images/photo-takingtips-example-01-02.webp")}
                  resizeMode="contain"
                />
                <Image
                  source={require("images/photo-takingtips-example-01-03.webp")}
                  resizeMode="contain"
                />
              </Join>
            </ScrollView>
            <Spacer y={0.5} />
            <Text variant="sm-display" px={2}>
              Upload high-quality photos of the artwork’s front and back using natural light and a
              neutral backdrop. Shoot from various angles.
            </Text>
          </>
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: space(2) }}
            >
              <Join separator={<Spacer x={1} />}>
                <Image
                  source={require("images/photo-takingtips-example-02-01.webp")}
                  resizeMode="contain"
                />
                <Image
                  source={require("images/photo-takingtips-example-02-02.webp")}
                  resizeMode="contain"
                />
                <Image
                  source={require("images/photo-takingtips-example-02-03.webp")}
                  resizeMode="contain"
                />
              </Join>
            </ScrollView>
            <Spacer y={0.5} />
            <Text variant="sm-display" px={2}>
              Include signatures, edition numbers or close-ups of details to give confidence to
              buyers.
            </Text>
          </>
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: space(2) }}
            >
              <Join separator={<Spacer x={1} />}>
                <Image
                  source={require("images/photo-takingtips-example-03-01.webp")}
                  resizeMode="contain"
                />
                <Image
                  source={require("images/photo-takingtips-example-03-02.webp")}
                  resizeMode="contain"
                />
                <Image
                  source={require("images/photo-takingtips-example-03-03.webp")}
                  resizeMode="contain"
                />
              </Join>
            </ScrollView>
            <Spacer y={0.5} />
            <Text variant="sm-display" px={2}>
              Include framed images or display the artwork in real-life settings to help buyers
              visualize how it will look in their own spaces.
            </Text>
          </>
        </Join>

        <Flex p={2} mt={2}>
          <Button block haptic onPress={onDismiss} variant="outline">
            Close
          </Button>
        </Flex>
      </ScrollView>
    </Flex>
  )
}
