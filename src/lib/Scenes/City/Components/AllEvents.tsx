import { Box, Separator, Serif } from "@artsy/palette"
import { EventSection } from "lib/Scenes/City/Components/EventSection"
import { BucketKey, BucketResults } from "lib/Scenes/Map/Bucket"
import React, { Component } from "react"
import { FlatList } from "react-native"
import styled from "styled-components/native"

interface Props {
  currentBucket: BucketKey
  buckets: BucketResults
}

interface State {
  sections: Array<{
    title: string
    id: number
  }>
  extraData?: { animatedValue: { height: number } }
}

export class AllEvents extends React.Component<Props, State> {
  state: State = {
    sections: [
      {
        title: "Fairs",
        id: 0,
      },
      {
        title: "Gallery shows",
        id: 1,
      },
      {
        title: "Museum shows",
        id: 2,
      },
      {
        title: "BMW Art Guide",
        id: 3,
      },
    ],
  }

  renderItemSeparator = () => {
    return (
      <Box py={2} px={2}>
        <Separator />
      </Box>
    )
  }

  renderItem = ({ item: { title, id } }) => {
    if (id === 0) {
      return <AllEventsFairSection />
    }
    return <EventSection title={title} />
  }

  render() {
    const { sections } = this.state
    return (
      <FlatList
        data={sections}
        ItemSeparatorComponent={this.renderItemSeparator}
        keyExtractor={item => item.id}
        renderItem={item => this.renderItem(item)}
      />
    )
  }
}

class AllEventsFairSection extends Component {
  render() {
    return (
      <FairSectionBackground>
        <Serif size="8" color="white">
          Fairs
        </Serif>
      </FairSectionBackground>
    )
  }
}

const FairSectionBackground = styled(Box)`
  background: black;
  padding: 20px;
`
