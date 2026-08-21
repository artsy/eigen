import { Flex } from "@artsy/palette-mobile"
import { ShowCard } from "app/Scenes/Map/Components/ShowCard"
import { Fair, Show } from "app/Scenes/Map/types"
import { RefObject } from "react"

export const SHOW_CARD_HEIGHT = 150

interface Props {
  activeShows: Array<Fair | Show>
  showsRef: RefObject<{ [key: string]: Show }>
  fairsRef: RefObject<{ [key: string]: Fair }>
  onSaveStarted: () => void
  onSaveEnded: () => void
}

export const ShowCardOverlay: React.FC<Props> = ({
  activeShows,
  showsRef,
  fairsRef,
  onSaveStarted,
  onSaveEnded,
}) => {
  // We need to update activeShows in case of a mutation (save show)
  const updatedShows: Array<Fair | Show> = activeShows.map((item: any) => {
    if (item.type === "Show") {
      return showsRef.current[item.slug]
    } else if (item.type === "Fair") {
      return fairsRef.current[item.slug]
    }
    return item
  })

  return (
    <Flex
      style={{
        left: 0,
        right: 0,
        position: "absolute",
        height: SHOW_CARD_HEIGHT,
      }}
    >
      <ShowCard shows={updatedShows} onSaveStarted={onSaveStarted} onSaveEnded={onSaveEnded} />
    </Flex>
  )
}
