import { storiesOf } from "@storybook/react-native"
import React from "react"

import { CollectionRenderer } from "lib/relay/QueryRenderers"
import renderWithLoadProgress from "../../../utils/renderWithLoadProgress"
import { CollectionContainer } from "../Collection"

const CollectionStoryRenderer = ({ collectionID }) => {
  return (
    <CollectionRenderer
      collectionID={collectionID}
      render={renderWithLoadProgress(CollectionContainer, { collectionID })}
    />
  )
}

storiesOf("Collection")
  .add("Contemporary", () => {
    return <CollectionStoryRenderer collectionID="contemporary" />
  })
  .add("Contemporary Street Art", () => {
    return <CollectionStoryRenderer collectionID="street-art-now" />
  })
  .add("Black Arts Movement", () => {
    return <CollectionStoryRenderer collectionID="black-arts-movement" />
  })
