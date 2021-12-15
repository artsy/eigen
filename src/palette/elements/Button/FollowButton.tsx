import { Button, CheckIcon } from "palette"
import React from "react"
import { PressableProps } from "react-native"

export interface FollowButtonProps {
  isFollowed: boolean
  onPress: PressableProps["onPress"]
}
export const FollowButton: React.FC<FollowButtonProps> = ({ isFollowed, onPress }) => {
  return (
    <Button
      variant="outline"
      size="small"
      longestText="Following"
      onPress={onPress}
      // TODO: add borderColor to control the Follow state
      icon={isFollowed && <CheckIcon fill="black60" width="16px" height="16px" />}
    >
      {isFollowed ? "Following" : "Follow"}
    </Button>
  )
}
