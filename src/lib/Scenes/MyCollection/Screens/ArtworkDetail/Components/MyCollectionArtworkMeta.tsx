import { MyCollectionArtworkMeta_artwork } from "__generated__/MyCollectionArtworkMeta_artwork.graphql"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { AppStore } from "lib/store/AppStore"
import { capitalize } from "lodash"
import { Spacer } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { Field } from "./Field"

interface MyCollectionArtworkMetaProps {
  artwork: MyCollectionArtworkMeta_artwork
  viewAll?: boolean
}

const MyCollectionArtworkMeta: React.FC<MyCollectionArtworkMetaProps> = ({ artwork, viewAll = false }) => {
  const navActions = AppStore.actions.myCollection.navigation

  return (
    <ScreenMargin>
      {/*
        NOTE: `medium` prop is correct; catergory is the label. `materials` field
        corresponds to `category` prop. It's a mess :/
      */}
      <Field label="Category" value={capitalize(artwork?.medium as string)} />
      <Field label="Dimensions" value={capitalize(artwork?.dimensions?.in as string)} />
      <Field label="Edition" value="TODO" />

      {!!viewAll && (
        <>
          <Field label="Title" value={artwork.title} />
          <Field label="Year created" value={artwork.date} />
        </>
      )}

      <Spacer my={0.5} />

      <CaretButton
        onPress={() => navActions.navigateToViewAllArtworkDetails({ passProps: artwork })}
        text="View more"
      />
    </ScreenMargin>
  )
}

export const MyCollectionArtworkMetaFragmentContainer = createFragmentContainer(MyCollectionArtworkMeta, {
  artwork: graphql`
    fragment MyCollectionArtworkMeta_artwork on Artwork {
      title
      date
      medium
      dimensions {
        in
      }
    }
  `,
})
