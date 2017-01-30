import Relay from 'react-relay'
import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import SerifText from '../../text/serif'
import Article from './article'

class Articles extends React.Component {
  render() {
    const articles = this.props.articles
    return (
      <View>
        <SerifText style={styles.heading}>Featured Articles</SerifText>
        <ScrollView horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    scrollsToTop={false}
                    style={{ overflow: 'visible', marginBottom: 40 }}>
          { articles.map(article => <Article key={article.__id} article={article} style={styles.article} />) }
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  heading: {
    marginBottom: 12,
    fontSize: 20,
  },
  article: {
    // TODO: Why doesn’t this work? Currently working around it by making the Article internal view 20pt wider.
    // marginRight: 20,
  }
})

export default Relay.createContainer(Articles, {
  fragments: {
    articles: () => Relay.QL`
      fragment on Article @relay(plural: true) {
          __id
          ${Article.getFragment('article')}
      }
    `,
  }
})
