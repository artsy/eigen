import { updateMyUserProfileMutation } from "__generated__/updateMyUserProfileMutation.graphql"
import {
  NOTIFICATION_SETTINGS,
  UserPushNotificationSettings,
} from "app/Scenes/MyProfile/MyProfilePushNotifications"

// Import the mutation type
type MutationResponse = updateMyUserProfileMutation["response"]
type UpdateMyUserProfile = NonNullable<MutationResponse["updateMyUserProfile"]>
type MeObject = NonNullable<UpdateMyUserProfile["me"]>

// TypeScript will error here if any UserPushNotificationSettings key is not in MeObject
const _typeCheck = (k: UserPushNotificationSettings): keyof MeObject => {
  return k // If this passes type-checking, the key exists on MeObject
}

// For each notification setting key, it must exist as a property on the Me object
// TypeScript compiler will catch any missing properties
Object.values(NOTIFICATION_SETTINGS).forEach((notification) => {
  _typeCheck(notification.key)
})
