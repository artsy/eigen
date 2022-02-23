import React from "react"

import { navigate } from "app/navigation/navigate"
import { Flex, Sans, Spacer, Touchable, useColor } from "palette"
import OpaqueImageView from "../OpaqueImageView/OpaqueImageView"

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
          <Spacer mr="2" />
          <Sans size="3" weight="medium">
            {name}
          </Sans>
        </Flex>
      </Touchable>
    </Flex>
  )
}
