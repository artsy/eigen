import React from "react"
import { ListView, ListViewDataSource, StyleSheet, View, ViewProperties, ViewStyle } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import ArtistShow from "./ArtistShow"

import colors from "lib/data/colors"

import { SmallList_shows } from "__generated__/SmallList_shows.graphql"

interface Props extends ViewProperties {
  shows: SmallList_shows
}

interface State {
  dataSource: ListViewDataSource
}

class SmallList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }).cloneWithRows(this.props.shows),
    }
  }

  render() {
    return (
      <ListView
        enableEmptySections={true}
        dataSource={this.state.dataSource}
        renderRow={this.renderShow}
        scrollsToTop={false}
        renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
      />
    )
  }

  renderShow = (show: any) => {
    return <ArtistShow show={show} styles={showStyles} /> as React.ReactElement<{}>
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
    fragment SmallList_shows on PartnerShow @relay(plural: true) {
      ...ArtistShow_show
    }
  `,
})
