import { Serif } from "@artsy/palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

export const CollectionHeader = props => {
  const { title, description } = props.collection
  return (
    <>
      <Serif size="8" color="black100">
        {title}
      </Serif>
      <Serif size="4" color="black100" mt={2}>
        {description}
      </Serif>
    </>
  )
}

export const CollectionHeaderContainer = createFragmentContainer(CollectionHeader, {
  collection: graphql`
    fragment CollectionHeader_collection on MarketingCollection {
      title
      description
    }
  `,
})
