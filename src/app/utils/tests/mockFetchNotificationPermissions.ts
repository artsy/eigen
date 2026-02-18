import { getNotificationPermissionsStatus } from "app/system/notifications/getNotificationsPermissions"

jest.mock("app/system/notifications/getNotificationsPermissions", () => ({
  getNotificationPermissionsStatus: jest.fn(),
  PushAuthorizationStatus: {
    NotDetermined: "notDetermined",
    Authorized: "authorized",
    Denied: "denied",
  },
}))

export const mockFetchNotificationPermissions = () => {
  return getNotificationPermissionsStatus as jest.Mock<any>
}
