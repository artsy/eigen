import { AddStrokeIcon, CheckmarkIcon } from "@artsy/icons/native"
import { Flex, Touchable } from "@artsy/palette-mobile"
import { ICON_HIT_SLOP } from "app/Components/constants"
import React from "react"

const DEFAULT_SIZE = 24

interface Props {
  isFollowed: boolean
  onPress: () => void
  isInFlight?: boolean
  /** Named for the thing being followed, e.g. "440 Gallery", so the label reads sensibly. */
  name?: string
  size?: number
  testID?: string
}

export const FollowIconButton: React.FC<Props> = ({
  isFollowed,
  onPress,
  isInFlight = false,
  name,
  size = DEFAULT_SIZE,
  testID,
}) => {
  const action = isFollowed ? "Unsave" : "Save"

  return (
    <Touchable
      testID={testID ?? "follow-icon-button"}
      accessibilityRole="button"
      accessibilityLabel={name ? `${action} ${name}` : action}
      accessibilityState={{ selected: isFollowed, disabled: isInFlight }}
      disabled={isInFlight}
      hitSlop={ICON_HIT_SLOP}
      onPress={onPress}
    >
      <Flex width={size} height={size} alignItems="center" justifyContent="center">
        {isFollowed ? (
          <CheckmarkIcon testID="follow-icon-button-check" width={size} height={size} />
        ) : (
          <AddStrokeIcon testID="follow-icon-button-add" width={size} height={size} />
        )}
      </Flex>
    </Touchable>
  )
}
