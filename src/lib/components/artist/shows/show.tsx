import * as Relay from 'react-relay'
import * as React from 'react'
import { View, TouchableWithoutFeedback, ViewProperties } from 'react-native'

import OpaqueImageView from '../../opaque_image_view'
import ShowMetadata from './metadata'
import SwitchBoard from '../../../native_modules/switch_board'

interface Props extends ViewProperties {
  show: {
    href: string
    cover_image: {
      url: string
    }
  }
  styles?: {
    container?: any
    image?: any
    metadata?: any
  }
}

class Show extends React.Component<Props, {}> {
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
        <View style={styles && styles.container}>
          <OpaqueImageView imageURL={imageURL} style={styles && styles.image} />
          <ShowMetadata show={show} style={styles && styles.metadata} />
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
