import { PageableScreenEntity } from "app/Components/PageableScreensView/PageableScreensContext"
import { Flex } from "palette"
import { useEffect, useState } from "react"

interface PageableLazyScreenProps {
  screen: PageableScreenEntity
  shouldRender: boolean
}

// TODO: Remove this component when we need to request data for all artworks
export const PageableLazyScreen: React.FC<PageableLazyScreenProps> = ({ screen, shouldRender }) => {
  // If `canMount` is true, then we should render screen contents. Otherwise, a stub is displayed.
  const [canMount, setCanMount] = useState(false)

  useEffect(() => {
    if (shouldRender) {
      setCanMount(true)
    }
  }, [shouldRender])

  if (canMount) {
    return <Flex>{screen.Component}</Flex>
  }

  return <Flex pointerEvents="box-none" />
}
