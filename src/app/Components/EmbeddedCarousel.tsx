import { Spacer } from "@artsy/palette-mobile"
import { SectionTitle } from "app/Components/SectionTitle"
import { Flex, Touchable } from "palette"
import React from "react"
import { FlatList, FlatListProps } from "react-native"

interface EmbeddedCarouselProps {
  title?: string
  testID: string
  data: object[]
  renderItem: ({ item }: any) => JSX.Element
  onCardPress?: () => void
}

export const EmbeddedCarousel: React.FC<EmbeddedCarouselProps & FlatListProps<any>> = (props) => {
  const { title, testID, data, renderItem, onCardPress, ...restProps } = props

  if (!data.length) {
    return null
  }

  return (
    <Flex>
      {!!title && (
        <Flex px={2}>
          <SectionTitle title={title} />
        </Flex>
      )}
      <FlatList
        testID={testID}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <Spacer x="1" />}
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
        ListHeaderComponent={() => <Spacer x="2" />}
        ListFooterComponent={() => <Spacer x="2" />}
        {...restProps}
      />
    </Flex>
  )
}
