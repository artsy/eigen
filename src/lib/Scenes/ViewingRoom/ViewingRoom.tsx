import { Box, Separator, Serif } from "@artsy/palette"
import React from "react"
import { FlatList } from "react-native"
import { ViewingRoomHeader } from "./Components/ViewingRoomHeader"

interface Props {
  viewingRoomID: string
}

interface ViewingRoomPageSection {
  key: string
  element: JSX.Element
  excludePadding?: boolean
}

export class ViewingRoom extends React.Component<Props> {
  sections(): ViewingRoomPageSection[] {
    const sections: ViewingRoomPageSection[] = []

    sections.push({
      key: "header",
      element: <ViewingRoomHeader artwork="https://media.giphy.com/media/2wS9xmYJNsFUTzcNKU/giphy.gif" />,
      excludePadding: true,
    })

    sections.push({
      key: "bodyText",
      element: (
        <Serif size="3t">
          Wynn/Win is excited to present you an online exclusive viewing of Nicolas Party’s selected works. Grotto,
          alludes to three large-format pastels depicting caves. From Renaissance paintings of hermits through to
          Courbet’s The Source of the Loue and, more specifically, The Grotto of Manacor (c. 1901) by the Belgian
          painter William Degouve de Nuncques, depictions of underground caverns conjure up a wealth of historical and
          philosophical connotations.
        </Serif>
      ),
    })

    return sections
  }

  render() {
    return (
      <FlatList<ViewingRoomPageSection>
        data={this.sections()}
        ItemSeparatorComponent={() => (
          <Box px={2} mx={2} my={3}>
            <Separator />
          </Box>
        )}
        contentInset={{ bottom: 40 }}
        renderItem={({ item }) => (item.excludePadding ? item.element : <Box px={2}>{item.element}</Box>)}
      />
    )
  }
}
