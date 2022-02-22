import { ActionType, ContextModule, OwnerType, TappedShowMore } from "@artsy/cohesion"
import { MyCollectionArtworkMeta_artwork } from "__generated__/MyCollectionArtworkMeta_artwork.graphql"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import { navigate } from "lib/navigation/navigate"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { formatArtworkDimensions } from "lib/Scenes/MyCollection/utils/formatArtworkDimensions"
import { capitalize } from "lodash"
import { Spacer } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { Field } from "./OldField"

interface MyCollectionArtworkMetaProps {
  artwork: MyCollectionArtworkMeta_artwork
  viewAll?: boolean
}

const MyCollectionArtworkMeta: React.FC<MyCollectionArtworkMetaProps> = ({
  artwork,
  viewAll = false,
}) => {
  const {
    artistNames,
    category,
    pricePaid,
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

  const { trackEvent } = useTracking()

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
        <Field label="Category" value={capitalize(medium!)} />
        <Field label="Materials" value={capitalize(category!)} />
        <Field label="Dimensions" value={dimensions} />
        <Field label="Edition number" value={editionNumber} />
        <Field label="Edition size" value={editionSize} />
        {!!pricePaid && <Field label="Price paid" value={pricePaid.display} />}
      </ScreenMargin>
    )
  } else {
    return (
      <ScreenMargin>
        <Field label="Category" value={capitalize(medium!)} />
        <Field label="Dimensions" value={dimensions} />
        <Field label="Edition number" value={editionNumber} />
        <Field label="Edition size" value={editionSize} />
        {!!pricePaid && <Field label="Price paid" value={pricePaid.display} />}
        <Spacer my={0.5} />

        <CaretButton
          onPress={() => {
            trackEvent(tracks.tappedShowMore(artwork.internalID, artwork.slug, "View more"))
            navigate(`/my-collection/artwork-details/${artwork.internalID}`)
          }}
          text="View more"
        />
      </ScreenMargin>
    )
  }
}

export const MyCollectionArtworkMetaFragmentContainer = createFragmentContainer(
  MyCollectionArtworkMeta,
  {
    artwork: graphql`
      fragment MyCollectionArtworkMeta_artwork on Artwork {
        slug
        internalID
        artistNames
        category
        pricePaid {
          display
        }
        date
        depth
        editionNumber
        editionSize
        height
        medium
        metric
        title
        width
      }
    `,
  }
)

const tracks = {
  tappedShowMore: (internalID: string, slug: string, subject: string) => {
    const tappedShowMore: TappedShowMore = {
      action: ActionType.tappedShowMore,
      context_module: ContextModule.artworkMetadata,
      context_screen_owner_type: OwnerType.myCollectionArtwork,
      context_screen_owner_id: internalID,
      context_screen_owner_slug: slug,
      subject,
    }
    return tappedShowMore
  },
}
