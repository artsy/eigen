import { Button, CheckIcon } from "palette"
import React from "react"
import { useIntl } from "react-intl"
import { ButtonProps } from "."

type FollowButtonProps = Omit<
  ButtonProps,
  "variant" | "size" | "longestText" | "icon" | "children"
> & {
  isFollowed: boolean
}

export const FollowButton: React.FC<FollowButtonProps> = ({ isFollowed, ...rest }) => {
  const intl = useIntl()
  const followText = intl.formatMessage({
    id: "palette.elements.button.followButton.follow",
    defaultMessage: "Follow",
  })
  const followingText = intl.formatMessage({
    id: "palette.elements.button.followButton.following",
    defaultMessage: "Following",
  })

  return (
    <Button
      variant={isFollowed ? "outline" : "outlineGray"}
      size="small"
      longestText={followingText}
      icon={isFollowed && <CheckIcon fill="black60" width="16px" height="16px" />}
      {...rest}
    >
      {isFollowed ? followingText : followText}
    </Button>
  )
}
