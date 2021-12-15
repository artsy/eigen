import { Button, CheckIcon } from "palette"
import React from "react"
import { PressableProps } from "react-native"
import { HapticFeedbackTypes } from "react-native-haptic-feedback"

export interface FollowButtonProps {
  isFollowed: boolean
  onPress: PressableProps["onPress"]
  haptic?: HapticFeedbackTypes | true
  /** Makes button full width */
  block?: boolean
  /** Displays a loader in the button */
  loading?: boolean
}
export const FollowButton: React.FC<FollowButtonProps> = ({ isFollowed, onPress, haptic, loading }) => {
  return (
    <Button
      onPress={onPress}
      haptic={haptic}
      loading={loading}
      variant="outline"
      size="small"
      longestText="Following"
      icon={isFollowed && <CheckIcon fill="black60" width="16px" height="16px" />}
      // TODO: add borderColor to control the Follow state (it should be black30)
    >
      {isFollowed ? "Following" : "Follow"}
    </Button>
  )
}
