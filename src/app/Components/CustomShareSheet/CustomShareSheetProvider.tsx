import { CustomShareSheet } from "app/Components/CustomShareSheet/CustomShareSheet"
import { ShareSheetItem } from "app/Components/CustomShareSheet/types"
import { useState } from "react"
import CustomShareSheetContext, { CustomShareSheetContextProps } from "./CustomShareSheetContext"

interface CustomShareSheetProviderProps {
  children?: React.ReactNode
}

export const CustomShareSheetProvider: React.FC<CustomShareSheetProviderProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [item, setItem] = useState<ShareSheetItem | null>(null)

  const showShareSheet = (i: ShareSheetItem) => {
    setItem(i)

    setIsVisible(true)
  }

  const hideShareSheet = () => {
    setItem(null)
    setIsVisible(false)
  }

  const contextValue: CustomShareSheetContextProps = {
    isVisible,
    item,
    showShareSheet,
    hideShareSheet,
  }

  return (
    <CustomShareSheetContext.Provider value={contextValue}>
      {children}
      {!!isVisible && <CustomShareSheet />}
    </CustomShareSheetContext.Provider>
  )
}
