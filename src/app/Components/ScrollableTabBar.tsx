import { View } from "react-native"

interface ScrollableTabProps {
  tabLabel: string
}

export const ScrollableTab: React.FC<ScrollableTabProps> = ({ children }) => (
  <View style={{ flex: 1, overflow: "hidden" }}>{children}</View>
)
