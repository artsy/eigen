import { Flex, Spinner } from "@artsy/palette-mobile"
import { FC } from "react"

interface ArtworkListsLoadingIndicatorProps {
  visible: boolean
}

export const ArtworkListsLoadingIndicator: FC<ArtworkListsLoadingIndicatorProps> = ({
  visible,
}) => {
  if (!visible) {
    return null
  }

  return (
    <Flex my={2} alignItems="center" justifyContent="center">
      <Spinner />
    </Flex>
  )
}
