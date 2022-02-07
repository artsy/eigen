import { LocalImage } from "lib/utils/LocalImageStore"
import React, { useState } from "react"

export const MyProfileContext = React.createContext({})

export const MyProfileProvider: React.FC = ({ children }) => {
  const [localImage, setLocalImage] = useState<LocalImage | null>(null)

  return (
    <MyProfileContext.Provider value={{ localImage, setLocalImage }}>
      {children}
    </MyProfileContext.Provider>
  )
}
