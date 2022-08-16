import { Button, ButtonProps, CheckIcon } from "palette"

type OnboardingFollowButtonProps = Omit<
  ButtonProps,
  "variant" | "size" | "longestText" | "icon" | "children"
> & {
  isFollowed: boolean
}

export const OnboardingFollowButton: React.FC<OnboardingFollowButtonProps> = ({
  isFollowed,
  ...rest
}) => {
  return (
    <Button
      size="small"
      longestText="Following"
      icon={isFollowed && <CheckIcon fill="black60" width="16px" height="16px" />}
      {...rest}
    >
      {isFollowed ? "Following" : "Follow"}
    </Button>
  )
}
