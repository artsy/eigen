import AsyncStorage from "@react-native-community/async-storage"
import PushNotification from "react-native-push-notification"
import { ASYNC_STORAGE_PUSH_NOTIFICATIONS_KEY } from "../AdminMenu"
import * as Push from "../PushNotification"

describe("Push Notification Tests", () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await AsyncStorage.removeItem(ASYNC_STORAGE_PUSH_NOTIFICATIONS_KEY)
  })

  afterAll(async () => {
    jest.clearAllMocks()
    await AsyncStorage.removeItem(ASYNC_STORAGE_PUSH_NOTIFICATIONS_KEY)
  })

  it("Initialises when feature flag is true", async () => {
    await AsyncStorage.setItem(ASYNC_STORAGE_PUSH_NOTIFICATIONS_KEY, "true")

    await Push.configure()
    expect(PushNotification.configure).toHaveBeenCalled()
  })

  it("Does not when feature flag is false", async () => {
    await AsyncStorage.setItem(ASYNC_STORAGE_PUSH_NOTIFICATIONS_KEY, "false")
    await Push.configure()
    expect(PushNotification.configure).not.toHaveBeenCalled()
  })
})
