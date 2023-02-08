import { Spacer } from "@artsy/palette-mobile"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "app/system/navigation/navigate"
import { Flex, Text, Touchable, useColor } from "palette"

interface SavedItemRowProps {
  href: string
  name: string
  image: {
    url: string | null
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
        underlayColor={color("black5")}
        onPress={() => {
          navigate(href)
        }}
        style={{ paddingVertical: 5 }}
      >
        <Flex flexDirection="row" alignItems="center" justifyContent="flex-start" px="2">
          <OpaqueImageView
            imageURL={imageURL}
            width={size}
            height={size}
            style={{ borderRadius: square_image ? 2 : size / 2, overflow: "hidden" }}
          />
          <Spacer x={2} />
          <Text variant="sm" weight="medium">
            {name}
          </Text>
        </Flex>
      </Touchable>
    </Flex>
  )
}
