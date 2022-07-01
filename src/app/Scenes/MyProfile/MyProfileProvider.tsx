import React, { useState } from "react"

interface MyProfileInterface {
  localImage: string
  setLocalImage: (imagePath: string) => void
}

export const MyProfileContext = React.createContext<MyProfileInterface>({
  localImage: "",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setLocalImage: () => {},
})

export const MyProfileProvider: React.FC = ({ children }) => {
  const [localImage, setLocalImage] = useState<string>("")

  return (
    <MyProfileContext.Provider value={{ localImage, setLocalImage }}>
      {children}
    </MyProfileContext.Provider>
  )
}
