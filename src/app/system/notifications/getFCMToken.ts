import messaging from "@react-native-firebase/messaging"

export const getFCMToken = async () => {
  await messaging().registerDeviceForRemoteMessages()
  const token = await messaging().getToken()
  return token
}
