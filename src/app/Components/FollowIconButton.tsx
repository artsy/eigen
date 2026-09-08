import { AddStrokeIcon, CheckmarkIcon } from "@artsy/icons/native"
import { Flex } from "@artsy/palette-mobile"
import { FC } from "react"
import { TouchableOpacity } from "react-native"

/** What the show header and the Saves-tab rows specify. The City Guide rails pass 18. */
const DEFAULT_SIZE = 24
/** Keeps a small glyph at a comfortable tap target without changing its drawn size. */
const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 }

interface Props {
  isFollowed: boolean
  onPress: () => void
  isInFlight?: boolean
  /** Named for the thing being followed, e.g. "440 Gallery", so the label reads sensibly. */
  name?: string
  size?: number
  testID?: string
}

/**
 * The bare plus/tick follow control the designs use wherever a labelled Save button would
 * crowd the row: the show header, and the Saves tab's followed shows, fairs and galleries.
 *
 * Only the glyph and its touch behaviour live here. Each caller keeps its own mutation and
 * tracking, because what "follow" means differs — a show is followed directly, a fair and a
 * gallery through their profile.
 */
export const FollowIconButton: FC<Props> = ({
  isFollowed,
  onPress,
  isInFlight = false,
  name,
  size = DEFAULT_SIZE,
  testID,
}) => {
  const action = isFollowed ? "Unsave" : "Save"

  return (
    <TouchableOpacity
      testID={testID ?? "follow-icon-button"}
      accessibilityRole="button"
      accessibilityLabel={name ? `${action} ${name}` : action}
      accessibilityState={{ selected: isFollowed, disabled: isInFlight }}
      disabled={isInFlight}
      hitSlop={HIT_SLOP}
      onPress={onPress}
    >
      <Flex width={size} height={size} alignItems="center" justifyContent="center">
        {isFollowed ? (
          <CheckmarkIcon testID="follow-icon-button-check" width={size} height={size} />
        ) : (
          <AddStrokeIcon testID="follow-icon-button-add" width={size} height={size} />
        )}
      </Flex>
    </TouchableOpacity>
  )
}
