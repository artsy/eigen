import { Button, CheckIcon } from "palette"
import { ButtonProps } from "."

type FollowButtonProps = Omit<
  ButtonProps,
  "variant" | "size" | "longestText" | "icon" | "children"
> & {
  isFollowed: boolean
  variant?: "v1" | "v2"
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  isFollowed,
  variant = "v1",
  ...rest
}) => {
  const iteration: { variant: ButtonProps["variant"] } =
    variant === "v2"
      ? { variant: "fillLight" }
      : { variant: isFollowed ? "outline" : "outlineGray" }

  return (
    <Button
      size="small"
      longestText="Following"
      icon={isFollowed && <CheckIcon fill="black60" width="16px" height="16px" />}
      {...iteration}
      {...rest}
    >
      {isFollowed ? "Following" : "Follow"}
    </Button>
  )
}
