/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { View, Text, StyleSheet, ListView } = React;

import Headline from '../../text/headline'
import SerifText from '../../text/serif'
import OpaqueImageView from '../../opaque_image_view'
import ShowMetadata from './show_metadata'


class CurrentShows extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged:(row1, row2) => row1 !== row2,
      }).cloneWithRows(this.props.artist.partner_shows)
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
        <OpaqueImageView imageURL={show.cover_image.cropped.url} style={{width: 350, height: 200, marginBottom: 5}} />
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

export default Relay.createContainer(CurrentShows, {
  fragments: {
    artist: () => Relay.QL`
      fragment on Artist {
        partner_shows(status: "running") {
          cover_image {
            cropped(width: 350, height: 200) {
              url
            }
          }
          ${ShowMetadata.getFragment('show')}
        }
      }
    `,
  }
});