/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react';
import { View, StyleSheet, ListView } from 'react-native';

import Headline from '../../text/headline'
import SerifText from '../../text/serif'
import Show from './show'

class SmallList extends React.Component {
  constructor(props) {
    super(props);
    this.renderShow = this.renderShow.bind(this);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged:(row1, row2) => row1 !== row2,
      }).cloneWithRows(this.props.shows)
    };
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

  renderShow(show) {
    return (
      <Show show={show} styles={showStyles} />
    );
  }
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
});

const showStyles = StyleSheet.create({
  container: {
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
});


export default Relay.createContainer(SmallList, {
  fragments: {
    shows: () => Relay.QL`
      fragment on PartnerShow @relay(plural: true) {
        ${Show.getFragment('show')}
      }
    `,
  }
});
