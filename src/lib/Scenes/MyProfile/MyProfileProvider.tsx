import React, { useState } from "react"

interface MyProfileInterface {
  localImage: string
  setLocalImage: (imagePath: string) => void
}

export const MyProfileContext = React.createContext<MyProfileInterface>({
  localImage: "",
  // tslint:disable-next-line:no-empty
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
