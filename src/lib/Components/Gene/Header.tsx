import * as React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { Dimensions, NativeModules, StyleSheet, TextStyle, View, ViewProperties, ViewStyle } from "react-native"
const { ARTemporaryAPIModule } = NativeModules

import Events from "../../NativeModules/Events"

import InvertedButton from "../Buttons/InvertedButton"
import Headline from "../Text/Headline"

interface HeaderProps extends ViewProperties, RelayProps {
  shortForm: boolean
}

interface HeaderState {
  following: boolean | null
}

class Header extends React.Component<HeaderProps, HeaderState> {
  constructor(props) {
    super(props)
    this.state = { following: null }
  }

  componentDidMount() {
    NativeModules.ARTemporaryAPIModule.followStatusForGene(this.props.gene._id, (error, following) => {
      this.setState({ following })
    })
  }

  render() {
    const gene = this.props.gene
    return (
      <View>
        <View style={styles.header}>
          <Headline style={styles.headline} numberOfLines={2}>
            {gene.name}
          </Headline>
        </View>
        {this.renderFollowButton()}
      </View>
    )
  }

  handleFollowChange = () => {
    ARTemporaryAPIModule.setFollowGeneStatus(!this.state.following, this.props.gene._id, (error, following) => {
      if (error) {
        console.warn(error)
      } else {
        Events.postEvent({
          name: following ? "Follow gene" : "Unfollow gene",
          gene_id: this.props.gene._id,
          gene_slug: this.props.gene.id,
          source_screen: "gene page",
        })
      }
      this.setState({ following })
    })
    this.setState({ following: !this.state.following })
  }

  renderFollowButton() {
    if (this.props.shortForm) {
      return null
    }
    if (this.state.following !== null) {
      return (
        <View style={styles.followButton}>
          <InvertedButton
            text={this.state.following ? "Following" : "Follow"}
            selected={this.state.following}
            onPress={this.handleFollowChange}
          />
        </View>
      )
    } else {
      return (
        <View style={styles.followButton}>
          <InvertedButton text="" onPress={this.handleFollowChange} />
        </View>
      )
    }
  }
}

const isPad = Dimensions.get("window").width > 700

interface Styles {
  header: TextStyle
  headline: TextStyle
  followButton: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  header: {
    marginTop: 15,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 40,
    paddingRight: 40,
  },
  headline: {
    textAlign: "center",
    fontSize: isPad ? 20 : 14,
  },
  followButton: {
    height: 40,
    marginTop: 30,
  },
})

export default createFragmentContainer(
  Header,
  graphql`
    fragment Header_gene on Gene {
      _id
      id
      name
    }
  `
)

interface RelayProps {
  gene: {
    _id: string
    id: string
    name: string | null
  }
}
