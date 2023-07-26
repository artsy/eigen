import { Checkbox, useSpace } from "@artsy/palette-mobile"
import { SelectArtistToShareListItem_artist$key } from "__generated__/SelectArtistToShareListItem_artist.graphql"
import { ArtistListItemContainer } from "app/Components/ArtistListItem"
import { ArtistInterestsStore } from "app/Scenes/MyCollection/Screens/CollectedArtistsPrivacy/ArtistInterestsStore"
import { useCallback } from "react"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface SelectArtistToShareListItemProps {
  artist: SelectArtistToShareListItem_artist$key
  interestID: string
  private: boolean
}

export const SelectArtistToShareListItem: React.FC<SelectArtistToShareListItemProps> = ({
  artist,
  interestID,
  private: isPrivate,
}) => {
  const artistData = useFragment<SelectArtistToShareListItem_artist$key>(artistFragment, artist)

  const space = useSpace()
  const userInterestsPrivacy = ArtistInterestsStore.useStoreState(
    (state) => state.userInterestsPrivacy
  )

  const addOrUpdateUserInterest = ArtistInterestsStore.useStoreActions(
    (actions) => actions.addOrUpdateUserInterest
  )

  const interest = userInterestsPrivacy.find((userInterest) => userInterest.id === interestID)

  const isChecked = interest ? interest.private : isPrivate

  const handlePress = useCallback(
    (checked: boolean) => {
      addOrUpdateUserInterest({
        id: interestID,
        private: checked,
      })
    },
    [isChecked]
  )

  return (
    <ArtistListItemContainer
      artist={artistData}
      avatarSize="xs"
      withFeedback
      showFollowButton={false}
      containerStyle={{ paddingHorizontal: space(2), paddingVertical: space(1) }}
      onPress={() => handlePress(!isChecked)}
      RightButton={
        <Checkbox
          mr={1}
          checked={isChecked}
          accessibilityHint={`Share ${artistData.name} with galleries}`}
          accessibilityState={{ checked: !isChecked }}
          onPress={() => handlePress(!isChecked)}
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
