import React from 'react'
import { StyleSheet, Text } from 'react-native'

class SectionTitle extends React.Component {

  render() {
    const { children, ...props } = this.props
    return (
      <Text style={styles.headerText} numberOfLines={0} {...props}>
        {children}
      </Text>
    )
  }
}

SectionTitle.propTypes = {
  ...Text.propTypes,
}

const styles = StyleSheet.create({
  headerText: {
    fontFamily: 'AGaramondPro-Regular',
    fontSize: 30,
    textAlign: 'center',
  }
})

module.exports = SectionTitle
