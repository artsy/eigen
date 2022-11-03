import { SectionTitle } from "app/Components/SectionTitle"
import { Flex, Spacer, Touchable } from "palette"
import React from "react"
import { FlatList } from "react-native"

interface EmbeddedCarouselProps {
  title: string
  subtitle?: string
  data: object[]
  renderItem: ({ item }: any) => JSX.Element
  onCardPress?: () => void
}

export const EmbeddedCarousel: React.FC<EmbeddedCarouselProps> = (props) => {
  const { title, data, renderItem, onCardPress } = props

  return (
    <Flex pl="2" pr="2">
      <SectionTitle title={title} />
      <FlatList
        testID="career-highlight-cards-flatlist"
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <Spacer mx={1} />}
        style={{ overflow: "visible" }}
        data={data}
        renderItem={(item: any) =>
          onCardPress ? (
            <Touchable haptic onPress={onCardPress}>
              {renderItem(item)}
            </Touchable>
          ) : (
            renderItem(item)
          )
        }
      />
    </Flex>
  )
}
