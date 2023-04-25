import { ShareIcon, ChevronIcon } from "@artsy/palette-mobile"
import { ArtistHeaderFloatingButtons_artist$data } from "__generated__/ArtistHeaderFloatingButtons_artist.graphql"
import { HeaderButton } from "app/Components/HeaderButton"
import { useShareSheet } from "app/Components/ShareSheet/ShareSheetContext"
import { useStickyTabPageContext } from "app/Components/StickyTabPage/StickyTabPageContext"
import { goBack } from "app/system/navigation/navigate"
import { useRef, useState } from "react"
import Animated, { block, call, cond, onChange, set, useCode } from "react-native-reanimated"
import { createFragmentContainer, graphql } from "react-relay"

interface ArtistHeaderFloatingButtonsProps {
  artist: ArtistHeaderFloatingButtons_artist$data
}

const BACK_ICON_SIZE = 21
const SHARE_ICON_SIZE = 23

export const ArtistHeaderFloatingButtons: React.FC<ArtistHeaderFloatingButtonsProps> = ({
  artist,
}) => {
  const { showShareSheet } = useShareSheet()
  const [hideButton, setHideButton] = useState(false)
  const { headerOffsetY } = useStickyTabPageContext()

  const value = useRef(new Animated.Value(1)).current
  const shouldHideButton = Animated.lessOrEq(headerOffsetY, -10)

  useCode(
    () =>
      block([
        cond(shouldHideButton, set(value, 0), set(value, 1)),
        onChange(
          shouldHideButton,
          call([shouldHideButton], ([shouldHide]) => {
            setHideButton(!!shouldHide)
          })
        ),
      ]),
    []
  )

  const handleSharePress = () => {
    showShareSheet({
      type: "artist",
      internalID: artist.internalID,
      slug: artist.slug,
      artists: [{ name: artist.name }],
      title: artist.name!,
      href: artist.href!,
      currentImageUrl: artist.image?.url ?? undefined,
    })
  }

  return (
    <>
      <HeaderButton
        shouldHide={hideButton}
        position="left"
        onPress={goBack}
        applySafeAreaTopInsets={false}
      >
        <ChevronIcon direction="left" width={BACK_ICON_SIZE} height={BACK_ICON_SIZE} />
      </HeaderButton>

      <HeaderButton
        shouldHide={hideButton}
        onPress={handleSharePress}
        position="right"
        applySafeAreaTopInsets={false}
      >
        <ShareIcon width={SHARE_ICON_SIZE} height={SHARE_ICON_SIZE} />
      </HeaderButton>
    </>
  )
}

export const ArtistHeaderFloatingButtonsFragmentContainer = createFragmentContainer(
  ArtistHeaderFloatingButtons,
  {
    artist: graphql`
      fragment ArtistHeaderFloatingButtons_artist on Artist {
        internalID
        slug
        href
        name
        image {
          url(version: "large")
        }
      }
    `,
  }
)
