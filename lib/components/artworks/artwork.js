'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { Text, View } = React;

import ImageView from '../opaque_image_view';

export default class Artwork extends React.Component {
  render() {
    const artwork = this.props.artwork;
    const optionals = [];
    // TODO partner ?
    if (artwork.sale_message) {
      optionals.push(<Text key="sale_message">{this.props.artwork.sale_message}</Text>);
    }
    return (
      <View>
        <ImageView style={{ backgroundColor: 'grey' }} aspectRatio={artwork.image.aspect_ratio} imageURL={artwork.image.url} />
        <Text>{artwork.artist.name}</Text>
        <Text>{artwork.title}</Text>
        <Text>{artwork.partner.name}</Text>
        {optionals}
      </View>
    );
  }
};

Artwork.propTypes = {
  artwork: React.PropTypes.shape({
    title: React.PropTypes.string,
    sale_message: React.PropTypes.string,
    image: React.PropTypes.shape({
      url: React.PropTypes.string,
      // TODO: The React convention seems to be to use camelCase, but metaphysics uses snake_case.
      aspect_ratio: React.PropTypes.number,
    }),
    artist: React.PropTypes.shape({
      name: React.PropTypes.string,
    }),
    partner: React.PropTypes.shape({
      name: React.PropTypes.string,
    }),
  }),
};

// While we do pagination manually, we can’t actually use Relay containers.
Artwork.artworkFragment = Relay.QL`
  fragment on Artwork {
    title
    sale_message
    image {
      url
      aspect_ratio
    }
    artist {
      name
    }
    partner {
      name
    }
  }
`;
