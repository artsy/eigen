import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { useTheme } from "palette/Theme"
import { Spacer } from "palette/atoms/Spacer"
import { Flex } from "palette/elements/Flex"
import { Text } from "palette/elements/Text"
import { View } from "react-native"
import LinearGradient from "react-native-linear-gradient"

import { CardTag, CardTagProps } from "./CardTag"

export interface LargeCardProps {
  image: string
  title: string
  subtitle?: string
  tag?: CardTagProps
}

/**
 * `Large` is a card with one image one tall image, and text for title and subtitle
 * at the bottom.
 */
export const LargeCard: React.FC<LargeCardProps> = ({ image, title, subtitle, tag }) => {
  const { color, space } = useTheme()
  return (
    <View style={{ width: "100%", aspectRatio: 1.0 / 1.33, flexDirection: "row" }}>
      <Flex flex={2} background={color("black10")}>
        <OpaqueImageView imageURL={image} style={{ flex: 1 }} />
      </Flex>
      <LinearGradient
        colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)"]}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          opacity: 0.15,
        }}
      />
      <Flex
        style={{
          position: "absolute",
          bottom: 0,
          left: space("2"),
          right: space("6"),
        }}
      >
        <Text variant="sm-display" color={color("white100")}>
          {title}
        </Text>
        {!!subtitle && (
          <Text variant="sm" color={color("white100")}>
            {subtitle}
          </Text>
        )}
        <Spacer mt={2} />
      </Flex>
      {!!tag && (
        <CardTag {...tag} style={{ position: "absolute", top: space("2"), left: space("2") }} />
      )}
    </View>
  )
}
