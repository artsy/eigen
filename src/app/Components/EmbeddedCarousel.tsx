import { SectionTitle } from "app/Components/SectionTitle"
import { Flex, Spacer, Touchable } from "palette"
import React from "react"
import { FlatList, FlatListProps } from "react-native"

// TODO: replace any type
interface EmbeddedCarouselProps {
  title?: string
  testID: string
  data: object[]
  renderItem: ({ item }: any) => JSX.Element
  onCardPress?: () => void
}

export const EmbeddedCarousel: React.FC<EmbeddedCarouselProps & FlatListProps<any>> = (props) => {
  const { title, testID, data, renderItem, onCardPress, ...restProps } = props

  return (
    <Flex>
      {!!title && <SectionTitle title={title} />}
      <FlatList
        testID={testID}
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
        {...restProps}
      />
    </Flex>
  )
}
