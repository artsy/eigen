import { CheckIcon } from "@artsy/palette-mobile"
import { Button, ButtonProps } from "."

type FollowButtonProps = Omit<
  ButtonProps,
  "variant" | "size" | "longestText" | "icon" | "children"
> & {
  isFollowed: boolean
}

export const FollowButton = ({ isFollowed, ...restProps }: FollowButtonProps) => {
  return (
    <Button
      variant={isFollowed ? "outline" : "outlineGray"}
      size="small"
      longestText="Following"
      icon={isFollowed && <CheckIcon fill="black60" width="16px" height="16px" />}
      {...restProps}
    >
      {isFollowed ? "Following" : "Follow"}
    </Button>
  )
}
