import Relay from 'react-relay'
import React from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'

import OpaqueImageView from '../../opaque_image_view'
import ShowMetadata from './metadata'
import SwitchBoard from '../../../native_modules/switch_board'

class Show extends React.Component {
  handleTap() {
    SwitchBoard.presentNavigationViewController(this, this.props.show.href)
  }

  render() {
    const show = this.props.show
    const image = show.cover_image
    const imageURL = image && image.url

    const styles = this.props.styles

    return (
      <TouchableWithoutFeedback onPress={this.handleTap.bind(this)} >
        <View style={styles.container}>
          <OpaqueImageView imageURL={imageURL} style={styles.image} />
          <ShowMetadata show={show} style={styles.metadata} />
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default Relay.createContainer(Show, {
  fragments: {
    show: () => Relay.QL`
      fragment on PartnerShow {
        href
        cover_image {
          url(version: "large")
        }
        ${ShowMetadata.getFragment('show')}
      }
    `
  }
})

interface IRelayProps {
  show: {
    href: string | null,
    cover_image: {
      url: string | null,
    } | null,
  },
}
