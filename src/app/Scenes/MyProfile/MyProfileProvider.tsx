import React, { useState } from "react"

interface MyProfileInterface {
  localImage: string
  setLocalImage: (imagePath: string) => void
}

export const MyProfileContext = React.createContext<MyProfileInterface>({
  localImage: "",

  setLocalImage: () => {},
})

interface MyProfileProviderProps {
  children?: React.ReactNode
}

export const MyProfileProvider: React.FC<MyProfileProviderProps> = ({ children }) => {
  const [localImage, setLocalImage] = useState<string>("")

  return (
    <MyProfileContext.Provider value={{ localImage, setLocalImage }}>
      {children}
    </MyProfileContext.Provider>
  )
}
