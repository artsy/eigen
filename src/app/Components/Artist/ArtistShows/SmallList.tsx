import React from "react"
import { FlatList, StyleSheet, View, ViewProps } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import { ArtistShowFragmentContainer } from "./ArtistShow"

import { SmallList_shows } from "__generated__/SmallList_shows.graphql"

interface Props extends ViewProps {
  shows: SmallList_shows
}

const SmallList: React.FC<Props> = ({ shows }) => {
  return (
    <FlatList
      data={shows}
      style={{ flex: 1 }}
      renderItem={({ item }) => <ArtistShowFragmentContainer show={item} styles={showStyles} />}
      keyExtractor={({ id }) => id}
      scrollsToTop={false}
      ItemSeparatorComponent={() => <View style={{ marginBottom: 20 }} />}
    />
  )
}

const showStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 82,
    height: 82,
    marginRight: 15,
  },
})

export default createFragmentContainer(SmallList, {
  shows: graphql`
    fragment SmallList_shows on Show @relay(plural: true) {
      id
      ...ArtistShow_show
    }
  `,
})
