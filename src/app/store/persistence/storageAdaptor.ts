import AsyncStorage from "@react-native-async-storage/async-storage"

export const storageAdapter = {
  async getItem(key: string) {
    try {
      const res = await AsyncStorage.getItem(key)
      if (res) {
        return JSON.parse(res)
      }
    } catch (error) {
      throw error
    }
  },
  async setItem(key: string, data: string) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      throw error
    }
  },
  async removeItem(key: string) {
    try {
      await AsyncStorage.removeItem(key)
    } catch (error) {
      throw error
    }
  },
}
