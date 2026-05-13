import { AuthIntent } from "app/Components/AuthBottomSheet/AuthBottomSheetTypes"
import { useRequireAuth } from "app/utils/hooks/useRequireAuth"
import { cloneElement, ReactElement } from "react"

interface RequireAuthProps {
  children: ReactElement<{ onPress?: (...args: any[]) => any }>
  intent?: AuthIntent
  /**
   * The action to run when authenticated. If omitted, the child's own
   * onPress is used instead, so you can wrap any existing button without
   * touching its props.
   */
  onPress?: (...args: any[]) => any
}

/**
 * Wraps a single child's onPress with auth-gating. If the user is not
 * logged in the auth bottom sheet is shown instead of running the action.
 *
 * @example — override child's onPress:
 *   <RequireAuth intent="create_alert" onPress={() => openModal()}>
 *     <Button>Create Alert</Button>
 *   </RequireAuth>
 *
 * @example — guard the child's existing onPress in-place:
 *   <RequireAuth intent="follow_artist">
 *     <FollowButton isFollowed={false} onPress={handleFollow} />
 *   </RequireAuth>
 */
export const RequireAuth: React.FC<RequireAuthProps> = ({
  children,
  intent = "generic",
  onPress,
}) => {
  const requireAuth = useRequireAuth()
  const childOnPress = children.props.onPress
  const action =
    onPress && childOnPress
      ? (...args: any[]) => {
          onPress(...args)
          childOnPress(...args)
        }
      : onPress ?? childOnPress
  return cloneElement(children, {
    onPress: action ? requireAuth(action, { intent }) : undefined,
  })
}
