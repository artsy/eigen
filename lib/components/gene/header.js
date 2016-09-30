/* @flow */
'use strict'

import React from 'react'
import Relay from 'react-relay'
import { StyleSheet, View } from 'react-native'

import InvertedButton from '../buttons/inverted_button'
import Headline from '../text/headline'

class Header extends React.Component {
  state: {
    following: ?boolean
  }

  static propTypes: Object = {
    gene: React.PropTypes.shape({
      name: React.PropTypes.string,
    }),
  }

  constructor(props) {
    super(props)
    this.state = { following: null }
  }

  render() {
    const gene = this.props.gene
    return (
      <View style={{paddingTop: 20}}>
        <Headline style={[styles.base, styles.headline]}>
          {gene.name}
        </Headline>
        {this.renderFollowButton()}
      </View>
    )
  }

  renderFollowButton() {
    if (this.state.following !== null) {
      return (
        <View style={styles.followButton}>
            <InvertedButton text={this.state.following ? 'Following' : 'Follow'}
                            selected={this.state.following}
                            onPress={this.handleFollowChange} />
        </View>
      )
    } else {
      return (<View style={styles.followButton}/>)
    }
  }

// NO-OP for now
  handleFollowChange = () => {}
}

const styles = StyleSheet.create({
  base: {
    textAlign: 'center',
  },
  headline: {
    fontSize: 14,
  },
  followButton: {
    height: 40,
  }
})

export default Relay.createContainer(Header, {
  fragments: {
    gene: () => Relay.QL`
      fragment on Gene {
        _id
        id
        name
      }
    `,
  }
})
