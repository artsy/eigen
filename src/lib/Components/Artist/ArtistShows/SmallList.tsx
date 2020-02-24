import React from "react"
import { FlatList, StyleSheet, View, ViewProperties, ViewStyle } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import ArtistShow from "./ArtistShow"

import colors from "lib/data/colors"

import { SmallList_shows } from "__generated__/SmallList_shows.graphql"

interface Props extends ViewProperties {
  shows: SmallList_shows
}

class SmallList extends React.Component<Props> {
  render() {
    return (
      <FlatList
        data={this.props.shows}
        renderItem={({ item }) => <ArtistShow show={item} styles={showStyles} />}
        scrollsToTop={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    )
  }
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: colors["gray-regular"],
  },
})

const showStyles = StyleSheet.create({
  container: {
    marginTop: -8,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 75,
    height: 75,
    marginBottom: 20,
    marginTop: 20,
    marginRight: 15,
  },
}) as {
  // TODO: This issue has been fixed in more recent versions of the RN typings, so we can remove this when we upgrade.
  container: ViewStyle
  image: ViewStyle
}

export default createFragmentContainer(SmallList, {
  shows: graphql`
    fragment SmallList_shows on Show @relay(plural: true) {
      ...ArtistShow_show
    }
  `,
})
