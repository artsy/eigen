import AsyncStorage from "@react-native-community/async-storage"

export const storage = {
  async getItem(key: string) {
    return JSON.parse((await AsyncStorage.getItem(key))!)
  },
  async setItem(key: string, data: any) {
    AsyncStorage.setItem(key, JSON.stringify(data))
  },
  async removeItem(key: string) {
    AsyncStorage.removeItem(key)
  },
}
