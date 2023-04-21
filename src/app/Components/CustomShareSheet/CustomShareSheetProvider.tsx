import { Flex, Text } from "@artsy/palette-mobile"
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

  const hideShareSheet = () => setIsVisible(false)

  const contextValue: CustomShareSheetContextProps = {
    isVisible,
    showShareSheet,
    hideShareSheet,
  }

  return (
    <CustomShareSheetContext.Provider value={contextValue}>
      {children}
      {!!isVisible && (
        <Flex position="absolute" top={10} height={200} width={200} backgroundColor="red10">
          {/* TODO: to be changed with the new CustomShareSheet */}
          <Text>{item?.slug}</Text>
        </Flex>
      )}
    </CustomShareSheetContext.Provider>
  )
}
