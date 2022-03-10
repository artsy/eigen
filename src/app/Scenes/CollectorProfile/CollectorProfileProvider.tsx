import React, { useState } from "react"

interface CollectorProfileInterface {
  localImage: string
  setLocalImage: (imagePath: string) => void
}

export const CollectorProfileContext = React.createContext<CollectorProfileInterface>({
  localImage: "",
  // tslint:disable-next-line:no-empty
  setLocalImage: () => {},
})

export const CollectorProfileProvider: React.FC = ({ children }) => {
  const [localImage, setLocalImage] = useState<string>("")

  return (
    <CollectorProfileContext.Provider value={{ localImage, setLocalImage }}>
      {children}
    </CollectorProfileContext.Provider>
  )
}
