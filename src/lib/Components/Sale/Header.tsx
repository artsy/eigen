import * as React from "react"
import { Dimensions, NativeModules, StyleSheet, Text, TextStyle, View, ViewProperties, ViewStyle } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

class Header extends React.Component<RelayProps, {}> {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    // const gene = this.props.gene
    const sale = this.props.sale
    return (
      <View>
        <Text>Header!</Text>
        <Text>
          {sale.name}
        </Text>
      </View>
      // <View>
      //   <View style={styles.header}>
      //     <Headline style={styles.headline} numberOfLines={2}>
      //       {gene.name}
      //     </Headline>
      //   </View>
      //   {this.renderFollowButton()}
      // </View>
    )
  }
}

export default createFragmentContainer(
  Header,
  graphql`
    fragment Header_sale on Sale {
      _id
      id
      name
    }
  `
)

interface RelayProps {
  sale: {
    _id: string
    id: string
    name: string | null
  }
}
