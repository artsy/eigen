import { Flex } from "palette"
import { ReactNode } from "react"

interface StickyTabPageViewProps {
  children: ReactNode
}

export const StickyTabPageView: React.FC<StickyTabPageViewProps> = ({ children }) => {
  return <Flex flex={1}>{children}</Flex>
}
