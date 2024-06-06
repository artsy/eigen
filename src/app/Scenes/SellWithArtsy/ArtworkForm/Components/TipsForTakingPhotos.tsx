import { Flex, Spacer, Text, Join, useTheme } from "@artsy/palette-mobile"
import { ScrollView, Image } from "react-native"

export const TipsForTakingPhotos: React.FC<{}> = () => {
  const { space } = useTheme()

  return (
    <Flex flex={1}>
      <ScrollView>
        <Text variant="lg-display" mb={4} px={2}>
          Three tips to improve your chances of selling
        </Text>
        <Join separator={<Spacer y={4} />}>
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: space(2), paddingRight: space(2) }}
            >
              <Join separator={<Spacer x={1} />}>
                <Image
                  width={160}
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
            <Text px={2}>
              Upload high-quality photos of the artwork’s front and back using natural light and a
              neutral backdrop. Shoot from various angles.
            </Text>
          </>
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: space(2), paddingRight: space(2) }}
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
            <Text px={2}>
              Include signatures, edition numbers or close-ups of details to give confidence to
              buyers.
            </Text>
          </>
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: space(2), paddingRight: space(2) }}
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
            <Text px={2}>
              Include framed images or display the artwork in real-life settings to help buyers
              visualize how it will look in their own spaces.
            </Text>
          </>
        </Join>
      </ScrollView>
    </Flex>
  )
}
