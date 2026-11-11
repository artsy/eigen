import { ShareIcon } from "@artsy/icons/native"
import { Touchable } from "@artsy/palette-mobile"
import { getShareURL } from "app/Components/ShareSheet/helpers"
import React from "react"
import RNShare from "react-native-share"

interface ShareHeaderButtonProps {
  href: string
  name: string
  utmContent: string
  accessibilityLabel: string
}

export const ShareHeaderButton: React.FC<ShareHeaderButtonProps> = ({
  href,
  name,
  utmContent,
  accessibilityLabel,
}) => {
  const handlePress = async () => {
    const url = getShareURL(`${href}?utm_content=${utmContent}`)

    try {
      await RNShare.open({
        title: name,
        message: `View ${name} on Artsy\n${url}`,
        failOnCancel: false,
      })
    } catch (error) {
      console.error("ShareHeaderButton.tsx", error)
    }
  }

  return (
    <Touchable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={handlePress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <ShareIcon width={24} height={24} />
    </Touchable>
  )
}
