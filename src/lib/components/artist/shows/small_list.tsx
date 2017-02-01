import Relay from 'react-relay'
import React from 'react'
import { View, StyleSheet, ListView } from 'react-native'

import Show from './show'

import colors from '../../../../data/colors'

class SmallList extends React.Component {
  state: {
    dataSource: ListView.DataSource,
  };

  constructor(props) {
    super(props)
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged:(row1, row2) => row1 !== row2,
      }).cloneWithRows(this.props.shows)
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

  renderShow = (show) => {
    return (
      <Show show={show} styles={showStyles} />
    )
  }
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: colors['gray-regular'],
  },
})

const showStyles = StyleSheet.create({
  container: {
    marginTop: -8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 75,
    height: 75,
    marginBottom: 20,
    marginTop: 20,
    marginRight: 15
  },
})


export default Relay.createContainer(SmallList, {
  fragments: {
    shows: () => Relay.QL`
      fragment on PartnerShow @relay(plural: true) {
        ${Show.getFragment('show')}
      }
    `,
  }
})

interface IRelayProps {
  shows: Array<{

  } | null> | null,
}
