import * as React from "react"
import * as Relay from "react-relay/classic"

import { StyleSheet, View, ViewStyle } from "react-native"

import Biography from "./Biography"

import RelatedArtists from "../RelatedArtists"
import Separator from "../Separator"

class About extends React.Component<RelayPropsWorkaround, any> {
  render() {
    return (
      <View>
        {this.biography()}
        {this.relatedArtists()}
      </View>
    )
  }

  biography() {
    return (
      <View>
        <Biography gene={this.props.gene as any} style={styles.sectionSeparator} />
        <Separator style={styles.sectionSeparator} />
      </View>
    )
  }

  relatedArtists() {
    return (this.props.gene.trending_artists || []).length
      ? <RelatedArtists artists={this.props.gene.trending_artists} />
      : null
  }
}

interface Styles {
  sectionSeparator: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  sectionSeparator: {
    marginBottom: 20,
  },
})

export default Relay.createContainer(About, {
  fragments: {
    gene: () => Relay.QL`
      fragment on Gene {
        ${Biography.getFragment("gene")}
        trending_artists {
          ${RelatedArtists.getFragment("artists")}
        }
      }
    `,
  },
})

interface RelayProps {
  gene: {
    trending_artists: Array<boolean | number | string | null> | null
  }
}
interface RelayPropsWorkaround {
  gene: {
    trending_artists: any[]
  }
}
