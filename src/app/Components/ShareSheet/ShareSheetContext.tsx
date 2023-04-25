import { ShareSheet } from "app/Components/ShareSheet/ShareSheet"
import { ShareSheetItem } from "app/Components/ShareSheet/types"
import { createContext, useContext, useState } from "react"

export interface ShareSheetContextProps {
  isVisible: boolean
  item: ShareSheetItem | null
  showShareSheet: (item: ShareSheetItem) => void
  hideShareSheet: () => void
}

const ShareSheetContext = createContext<ShareSheetContextProps>({
  isVisible: false,
  item: null,
  showShareSheet: () => {},
  hideShareSheet: () => {},
})

export function useShareSheet() {
  return useContext(ShareSheetContext)
}

export default ShareSheetContext

interface ShareSheetProviderProps {
  children?: React.ReactNode
}

export const ShareSheetProvider: React.FC<ShareSheetProviderProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [item, setItem] = useState<ShareSheetItem | null>(null)

  const showShareSheet = (shareSheetItem: ShareSheetItem) => {
    setItem(shareSheetItem)

    setIsVisible(true)
  }

  const hideShareSheet = () => {
    setItem(null)
    setIsVisible(false)
  }

  const contextValue: ShareSheetContextProps = {
    isVisible,
    item,
    showShareSheet,
    hideShareSheet,
  }

  return (
    <ShareSheetContext.Provider value={contextValue}>
      {children}
      {!!isVisible && <ShareSheet />}
    </ShareSheetContext.Provider>
  )
}
