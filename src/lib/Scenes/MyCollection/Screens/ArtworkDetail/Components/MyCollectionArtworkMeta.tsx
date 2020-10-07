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

export const MyCollectionArtworkMeta: React.FC<MyCollectionArtworkMetaProps> = ({ artwork, viewAll = false }) => {
  const {
    artistNames,
    category,
    costMinor,
    costCurrencyCode,
    date,
    depth,
    editionNumber,
    editionSize,
    height,
    medium,
    metric,
    title,
    width,
  } = artwork

  const dimensions = formatArtworkDimensions({ height, width, depth, metric })
  const navActions = AppStore.actions.myCollection.navigation

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
        <Field label="Edition number" value={editionNumber} />
        <Field label="Edition size" value={editionSize} />
        {/* FIXME:
            If null is submitted to MP/Grav on artwork create, it will return 0,
            falsly populating this field */}
        {!!(costMinor && costCurrencyCode) && <Field label="Price paid" value={`${costMinor} ${costCurrencyCode}`} />}
      </ScreenMargin>
    )
  } else {
    return (
      <ScreenMargin>
        <Field label="Category" value={capitalize(medium as string)} />
        <Field label="Dimensions" value={dimensions} />
        <Field label="Edition number" value={editionNumber} />
        <Field label="Edition size" value={editionSize} />

        {/* FIXME:
            If null is submitted to MP/Grav on artwork create, it will return 0,
            falsly populating this field */}
        {!!(costMinor && costCurrencyCode) && <Field label="Price paid" value={`${costMinor} ${costCurrencyCode}`} />}

        <Spacer my={0.5} />

        <CaretButton
          onPress={() =>
            navActions.navigateToViewAllArtworkDetails({
              passProps: {
                artwork,
              },
            })
          }
          text="View more"
        />
      </ScreenMargin>
    )
  }
}

export const MyCollectionArtworkMetaFragmentContainer = createFragmentContainer(MyCollectionArtworkMeta, {
  artwork: graphql`
    fragment MyCollectionArtworkMeta_artwork on Artwork {
      ...MyCollectionArtworkDetail_sharedProps @relay(mask: false)
    }
  `,
})
