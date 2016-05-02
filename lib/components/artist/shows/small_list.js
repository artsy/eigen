/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { View, Text, StyleSheet, ListView } = React;

import Headline from '../../text/headline'
import SerifText from '../../text/serif'
import OpaqueImageView from '../../opaque_image_view'
import ShowMetadata from './metadata'


class SmallList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged:(row1, row2) => row1 !== row2,
      }).cloneWithRows(this.props.shows)
    };
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderShow}
        renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
      />
    )
  }

  renderShow(show) {
    return (
      <View style={styles.container}>
        <OpaqueImageView imageURL={show.meta_image.cropped.url} style={styles.image} />
        <ShowMetadata show={show}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  image: {
    width: 75,
    height: 75,
    marginBottom: 20,
    marginTop: 20,
    marginRight: 15
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
});

export default Relay.createContainer(SmallList, {
  fragments: {
    shows: () => Relay.QL`
      fragment on PartnerShow @relay(plural: true) {
        meta_image {
          cropped(width: 75, height: 75) {
            url
          }
        }
        ${ShowMetadata.getFragment('show')}
      }
    `,
  }
});
