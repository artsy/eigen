/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { View, Text, StyleSheet, ListView } = React;

import Headline from '../../text/headline'
import SerifText from '../../text/serif'
import OpaqueImageView from '../../opaque_image_view'
import ShowMetadata from './show_metadata'


class LargeList extends React.Component {
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
      />
    )
  }

  renderShow(show) {
    return (
      <View style={styles.container}>
        <OpaqueImageView imageURL={show.meta_image.cropped.url} style={{width: 350, height: 200, marginBottom: 5}} />
        <ShowMetadata show={show}/>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    marginTop: 10,
  },
});

export default Relay.createContainer(LargeList, {
  fragments: {
    shows: () => Relay.QL`
      fragment on PartnerShow @relay(plural: true) {
        meta_image {
          cropped(width: 350, height: 200) {
            url
          }
        }
        ${ShowMetadata.getFragment('show')}
      }
    `,
  }
});