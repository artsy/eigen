import { Flex, Skeleton, SkeletonBox, Spacer, useSpace } from "@artsy/palette-mobile"
import { SectionTitle } from "app/Components/SectionTitle"
import { FlatList } from "react-native"

export const DiscoverSomethingNewChipsPlaceholder: React.FC = () => {
  const space = useSpace()

  const listSize = 9
  const numColumns = Math.ceil(listSize / 3)

  return (
    <Skeleton>
      <Flex testID="DiscoverSomethingNewChipsPlaceholder">
        <SectionTitle title="Discover Something New" mx={2} />

        <FlatList
          scrollEnabled={false}
          columnWrapperStyle={{ paddingHorizontal: space(2) }}
          ItemSeparatorComponent={() => <Spacer y={1} />}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          numColumns={numColumns}
          data={Array.from({ length: listSize })}
          renderItem={() => (
            <Flex width={250} mr={1}>
              <SkeletonBox height={60} borderRadius="5px" />
            </Flex>
          )}
        />
      </Flex>
    </Skeleton>
  )
}
