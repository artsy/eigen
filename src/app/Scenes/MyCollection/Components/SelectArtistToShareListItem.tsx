import { Checkbox, useSpace } from "@artsy/palette-mobile"
import { SelectArtistToShareListItem_artist$key } from "__generated__/SelectArtistToShareListItem_artist.graphql"
import { ArtistListItemContainer } from "app/Components/ArtistListItem"
import { UserInterestsStore } from "app/Scenes/MyCollection/Screens/CollectedArtistsPrivacy/UserInterestsStore"
import { useState } from "react"
import { useFragment, graphql } from "react-relay"
import useDebounce from "react-use/lib/useDebounce"

interface SelectArtistToShareListItemProps {
  artist: SelectArtistToShareListItem_artist$key
  interestID: string
  private: boolean
}

export const SelectArtistToShareListItem: React.FC<SelectArtistToShareListItemProps> = ({
  artist,
  interestID,
  private: privateProp,
}) => {
  const artistData = useFragment<SelectArtistToShareListItem_artist$key>(artistFragment, artist)

  const space = useSpace()
  const userInterests = UserInterestsStore.useStoreState((state) => state.userInterests)

  const addOrUpdateUserInterest = UserInterestsStore.useStoreActions(
    (actions) => actions.addOrUpdateUserInterest
  )

  const interest = userInterests.find((userInterest) => userInterest.id === interestID)

  const isPrivate = interest ? !interest.private : !privateProp

  const [checked, setChecked] = useState(!isPrivate)

  useDebounce(
    () => {
      if (privateProp !== isPrivate) {
        addOrUpdateUserInterest({
          id: interestID,
          private: !checked,
        })
      }
    },
    300,
    [checked]
  )

  return (
    <ArtistListItemContainer
      artist={artistData}
      avatarSize="xs"
      withFeedback
      showFollowButton={false}
      containerStyle={{ paddingHorizontal: space(2), paddingVertical: space(1) }}
      onPress={() => setChecked(!checked)}
      RightButton={
        <Checkbox
          mr={1}
          checked={checked}
          accessibilityHint={`Share ${artistData.name} with galleries}`}
          accessibilityState={{ checked }}
          onPress={() => setChecked(!checked)}
        />
      }
    />
  )
}

const artistFragment = graphql`
  fragment SelectArtistToShareListItem_artist on Artist {
    internalID
    name
    ...ArtistListItem_artist
  }
`
