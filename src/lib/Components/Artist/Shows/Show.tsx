import * as React from "react"
import { TouchableWithoutFeedback, View, ViewProperties } from "react-native"
import { createFragmentContainer, graphql } from "react-relay/compat"

import SwitchBoard from "../../../NativeModules/SwitchBoard"
import OpaqueImageView from "../../OpaqueImageView"
import Metadata from "./Metadata"

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
      <TouchableWithoutFeedback onPress={this.handleTap.bind(this)}>
        <View style={styles && styles.container}>
          <OpaqueImageView imageURL={imageURL} style={styles && styles.image} />
          <Metadata show={show as any} style={styles && styles.metadata} />
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default createFragmentContainer(
  Show,
  graphql`
    fragment Show_show on PartnerShow {
      href
      cover_image {
        url(version: "large")
      }
      ...Metadata_show
    }
  `
)

interface RelayProps {
  show: {
    href: string | null
    cover_image: {
      url: string | null
    } | null
  }
}
