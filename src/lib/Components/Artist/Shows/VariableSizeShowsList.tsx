import * as React from "react"
import * as Relay from "react-relay/classic"

import { LayoutChangeEvent, StyleSheet, View, ViewProperties, ViewStyle } from "react-native"

import Show from "./Show"

interface Props extends ViewProperties {
  showSize: "medium" | "large"
  shows: any[]
}

interface State {
  width: number
  height: number
}

class ShowsList extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      width: 1,
      height: 1,
    }
  }

  imageDimensions(layout) {
    const width = layout.width
    const isPad = width > 700
    const showSize = this.props.showSize

    const marginSpace = 20 * this.numberOfColumns(isPad)
    const imageWidth = isPad ? (width - marginSpace) / this.numberOfColumns(isPad) : width - 20

    const aspectRatio = showSize === "large" ? 1.6 : 1.4
    const imageHeight = Math.floor(imageWidth / aspectRatio)
    return { width: imageWidth, height: imageHeight }
  }

  numberOfColumns = (isPad: boolean) => {
    if (isPad) {
      return this.props.showSize === "large" ? 2 : 3
    }

    return 1
  }

  onLayout = (event: LayoutChangeEvent) => {
    const layout = event.nativeEvent.layout
    this.setState(this.imageDimensions(layout))
  }

  render() {
    const showSize = this.props.showSize
    const showStyles = StyleSheet.create({
      container: {
        margin: 10,
        marginBottom: showSize === "medium" ? 30 : 10,
        width: this.state.width,
      },
      image: {
        width: this.state.width,
        height: this.state.height,
      },
    })

    return (
      <View style={styles.container} onLayout={this.onLayout}>
        {this.props.shows.map(show => this.renderShow(show, showStyles))}
      </View>
    )
  }

  renderShow(show, showStyles) {
    return <Show show={show} styles={showStyles} key={show.__id} />
  }
}

interface Styles {
  container: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    justifyContent: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    marginLeft: -10,
    marginRight: -10,
  },
})

export default Relay.createContainer(ShowsList, {
  fragments: {
    shows: () => Relay.QL`
      fragment on PartnerShow @relay(plural: true) {
        __id
        ${Show.getFragment("show")}
      }
    `,
  },
})

interface RelayProps {
  shows: Array<{
    __id: string
  } | null> | null
}
