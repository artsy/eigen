import { Spacer, Flex, useColor, Text, Touchable } from "@artsy/palette-mobile"
import { ImageWithFallback } from "app/Components/ImageWithFallback/ImageWithFallback"
import { navigate } from "app/system/navigation/navigate"

interface SavedItemRowProps {
  href: string
  name: string
  image: {
    url: string | null | undefined
  }
  square_image?: boolean
  size?: number
}

export const SavedItemRow: React.FC<SavedItemRowProps> = ({
  href,
  name,
  image,
  square_image,
  size = 60,
}) => {
  const color = useColor()
  const imageURL = image?.url
  return (
    <Flex>
      <Touchable
        underlayColor={color("mono5")}
        onPress={() => {
          navigate(href)
        }}
        style={{ paddingVertical: 5 }}
      >
        <Flex flexDirection="row" alignItems="center" justifyContent="flex-start" px={2}>
          <Flex
            height={size}
            width={size}
            borderRadius={square_image ? 2 : size / 2}
            overflow="hidden"
          >
            <ImageWithFallback src={imageURL} width={size} height={size} />
          </Flex>
          <Spacer x={2} />
          <Text variant="sm" weight="medium">
            {name}
          </Text>
        </Flex>
      </Touchable>
    </Flex>
  )
}
