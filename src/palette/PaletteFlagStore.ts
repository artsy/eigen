import AsyncStorage from "@react-native-community/async-storage"
import { zNames } from "lib/utils/zustandPersistNames"
import create from "zustand"
import { persist } from "zustand/middleware"

interface PaletteFlagState {
  allowV3: boolean
  setAllowV3: (value: boolean) => void
}

export const usePaletteFlagStore = create<PaletteFlagState>(
  persist(
    (set) => ({
      allowV3: __TEST__,
      setAllowV3: (value) => set((_state) => ({ allowV3: value })),
    }),
    { name: zNames.paletteFlag, getStorage: () => AsyncStorage }
  )
)
