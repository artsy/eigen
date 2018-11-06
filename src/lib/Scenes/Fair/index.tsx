import { Theme } from "@artsy/palette"
import { Fair_fair } from "__generated__/Fair_fair.graphql"
import React from "react"
import { FlatList, ViewProperties } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { FairHeaderContainer as FairHeader } from "./Components/FairHeader"

interface Props extends ViewProperties {
  fair: Fair_fair
}

export class Fair extends React.Component<Props> {
  state = {
    sections: [],
  }

  componentDidMount() {
    const sections = []

    this.setState({ sections })
  }

  render() {
    const { fair } = this.props
    return (
      <Theme>
        <FlatList
          data={this.state.sections}
          ListHeaderComponent={<FairHeader fair={fair} />}
          renderItem={({ item: { data, type } }) => {
            switch (type) {
              default:
                return null
            }
          }}
        />
      </Theme>
    )
  }
}

export default createFragmentContainer(
  Fair,
  graphql`
    fragment Fair_fair on Fair {
      ...FairHeader_fair
    }
  `
)
