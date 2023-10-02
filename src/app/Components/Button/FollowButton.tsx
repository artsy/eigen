import { CheckIcon, Button, ButtonProps, Text } from "@artsy/palette-mobile"
import { formatLargeNumber } from "app/utils/formatLargeNumber"

type FollowButtonProps = Omit<
  ButtonProps,
  "variant" | "size" | "longestText" | "icon" | "children"
> & {
  isFollowed: boolean
  followCount?: number
}

export const FollowButton = ({ isFollowed, followCount, ...restProps }: FollowButtonProps) => {
  return (
    <Button
      variant={isFollowed ? "outline" : "outlineGray"}
      size="small"
      longestText="Following 999.9k"
      icon={!!isFollowed && <CheckIcon fill="black60" width="16px" height="16px" />}
      {...restProps}
    >
      <Text variant="xs">
        {isFollowed ? "Following" : "Follow"}
        {!!followCount && followCount > 1 && (
          <>
            <Text variant="xs" color="black60">
              {" " + formatLargeNumber(followCount, 1)}
            </Text>
          </>
        )}
      </Text>
    </Button>
  )
}
