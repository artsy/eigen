import * as React from 'react'
import { StyleSheet, Text } from 'react-native'

export default class SectionTitle extends React.Component<any, any> {
  static propTypes = {
    ...Text.propTypes
  }

  render() {
    const { children, ...props } = this.props
    return (
      <Text style={styles.headerText} numberOfLines={0} {...props}>
        {children}
      </Text>
    )
  }
}

const styles = StyleSheet.create({
  headerText: {
    fontFamily: 'AGaramondPro-Regular',
    fontSize: 30,
    textAlign: 'center',
  }
})