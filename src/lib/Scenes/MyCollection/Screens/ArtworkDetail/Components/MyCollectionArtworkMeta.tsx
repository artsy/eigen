import { MyCollectionArtworkMeta_artwork } from "__generated__/MyCollectionArtworkMeta_artwork.graphql"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { formatArtworkDimensions } from "lib/Scenes/MyCollection/utils/formatArtworkDimensions"
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
  const { artistNames, category, date, depth, height, medium, metric, title, width } = artwork
  const dimensions = formatArtworkDimensions({ height, width, depth, metric })

  if (viewAll) {
    return (
      <ScreenMargin>
        <Field label="Artist" value={artistNames} />
        <Field label="Title" value={title} />
        <Field label="Year created" value={date} />
        {/*
          NOTE: `medium` prop is correct; catergory is the label. `materials` field
          corresponds to `category` prop. It's a mess :/
        */}
        <Field label="Category" value={capitalize(medium as string)} />
        <Field label="Materials" value={capitalize(category as string)} />
        <Field label="Dimensions" value={dimensions} />
        <Field label="Edition" value="TODO" />
        <Field label="Price paid" value="TODO" />
      </ScreenMargin>
    )
  } else {
    return (
      <ScreenMargin>
        <Field label="Category" value={capitalize(medium as string)} />
        <Field label="Dimensions" value={dimensions} />
        <Field label="Edition" value="TODO" />
        <Field label="Price paid" value="TODO" />

        <Spacer my={0.5} />

        <CaretButton
          onPress={() => navActions.navigateToViewAllArtworkDetails({ passProps: artwork })} // FIXME: need to fix NavigatorIOS
          text="View more"
        />
      </ScreenMargin>
    )
  }
}

export const MyCollectionArtworkMetaFragmentContainer = createFragmentContainer(MyCollectionArtworkMeta, {
  artwork: graphql`
    fragment MyCollectionArtworkMeta_artwork on Artwork {
      title
      artistNames
      date
      medium
      category
      height
      width
      depth
      metric
    }
  `,
})
