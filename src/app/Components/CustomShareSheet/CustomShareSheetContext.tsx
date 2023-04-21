import { ShareSheetItem } from "app/Components/CustomShareSheet/types"
import { createContext, useContext } from "react"

export interface CustomShareSheetContextProps {
  isVisible: boolean
  showShareSheet: (item: ShareSheetItem) => void
  hideShareSheet: () => void
}

const CustomShareSheetContext = createContext<CustomShareSheetContextProps>({
  isVisible: false,
  showShareSheet: () => {},
  hideShareSheet: () => {},
})

export function useCustomShareSheet() {
  return useContext(CustomShareSheetContext)
}

export default CustomShareSheetContext
