import { ShareIcon } from "@artsy/icons/native"
import { Touchable } from "@artsy/palette-mobile"
import { useShareSheet } from "app/Components/ShareSheet/ShareSheetContext"
import React from "react"

interface ShareHeaderButtonProps {
  href: string
  internalID: string
  name: string
  slug: string
  accessibilityLabel: string
}

/** Opens the app's share sheet for a page with no artwork image, like a show, partner or feature. */
export const ShareHeaderButton: React.FC<ShareHeaderButtonProps> = ({
  href,
  internalID,
  name,
  slug,
  accessibilityLabel,
}) => {
  const { showShareSheet } = useShareSheet()

  const handlePress = () => {
    showShareSheet({ type: "default", href, internalID, slug, title: name })
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
