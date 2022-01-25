import { Button, CheckIcon } from "palette"
import React from "react"
import { ButtonProps } from "."

type FollowButtonProps = Omit<
  ButtonProps,
  "variant" | "size" | "longestText" | "icon" | "children"
> & {
  isFollowed: boolean
}

export const FollowButton: React.FC<FollowButtonProps> = ({ isFollowed, ...rest }) => {
  return (
    <Button
      variant={isFollowed ? "outline" : "outlineGray"}
      size="small"
      longestText="Following"
      icon={isFollowed && <CheckIcon fill="black60" width="16px" height="16px" />}
      {...rest}
    >
      {isFollowed ? "Following" : "Follow"}
    </Button>
  )
}
