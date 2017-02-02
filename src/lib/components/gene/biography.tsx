import * as Relay from 'react-relay'
import * as React from 'react'
import { View, StyleSheet, Dimensions, ViewProperties } from 'react-native'
import removeMarkdown from 'remove-markdown'
import SerifText from '../text/serif'

const sideMargin = Dimensions.get('window').width > 700 ? 50 : 0

class Biography extends React.Component<RelayProps, any> {
  render() {
    const gene = this.props.gene
    if (!gene.description) {
      return null
    }

    return (
      <View style={{marginLeft: sideMargin, marginRight: sideMargin}}>
        { this.blurb(gene) }
      </View>
    )
  }

  blurb(gene) {
    return gene.description ? <SerifText style={styles.blurb} numberOfLines={0}>{removeMarkdown(gene.description)}</SerifText> : null
  }

}

const styles = StyleSheet.create({
  blurb: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 20
  },
  bio: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 40
  }
})

export default Relay.createContainer(Biography, {
  fragments: {
    gene: () => Relay.QL`
      fragment on Gene {
        description
      }
    `,
  }
})

interface RelayProps {
  gene: {
    description: string | null,
  },
}
