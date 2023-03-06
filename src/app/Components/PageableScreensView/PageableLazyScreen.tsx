import { Flex } from "@artsy/palette-mobile"
import { PageableScreenEntity } from "app/Components/PageableScreensView/PageableScreensContext"
import { useEffect, useState } from "react"

interface PageableLazyScreenProps {
  screen: PageableScreenEntity
  shouldRender: boolean
}

export const PageableLazyScreen: React.FC<PageableLazyScreenProps> = ({ screen, shouldRender }) => {
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
