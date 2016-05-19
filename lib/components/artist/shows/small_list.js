/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { View, StyleSheet, ListView } = React;

import Headline from '../../text/headline'
import SerifText from '../../text/serif'
import SmallImageShow from './small_image_show'

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
        renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
      />
    )
  }

  renderShow(show) {
    return (
      <SmallImageShow show={show}/>
    );
  }
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
});

export default Relay.createContainer(SmallList, {
  fragments: {
    shows: () => Relay.QL`
      fragment on PartnerShow @relay(plural: true) {
        ${SmallImageShow.getFragment('show')}
      }
    `,
  }
});
