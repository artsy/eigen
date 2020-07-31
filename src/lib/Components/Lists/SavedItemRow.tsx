import React, { useRef } from "react"

import { TouchableHighlight } from "react-native"

import { color, Flex, Sans, Spacer } from "@artsy/palette"
import Switchboard from "lib/NativeModules/SwitchBoard"
import OpaqueImageView from "../OpaqueImageView/OpaqueImageView"

interface SavedItemRowProps {
  href: string
  name: string
  image: {
    url: string | null
  }
  square_image?: boolean
}

export const SavedItemRow: React.FC<SavedItemRowProps> = ({ href, name, image, square_image }) => {
  const imageURL = image?.url
  const navRef = useRef(null)
  return (
    <TouchableHighlight
      ref={navRef}
      underlayColor={color("black5")}
      onPress={() => {
        Switchboard.presentNavigationViewController(navRef.current!, href)
      }}
      style={{ paddingVertical: 5 }}
    >
      <Flex flexDirection="row" alignItems="center" justifyContent="flex-start" px="2">
        <OpaqueImageView
          imageURL={imageURL}
          width={50}
          height={50}
          style={{ borderRadius: square_image ? 2 : 25, overflow: "hidden" }}
        />
        <Spacer mr="2" />
        <Sans size="3" weight="medium">
          {name}
        </Sans>
      </Flex>
    </TouchableHighlight>
  )
}
