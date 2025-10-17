import {
  Flex,
  FlexProps,
  Join,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
  useSpace,
} from "@artsy/palette-mobile"
import {
  AboveTheFoldFlatList,
  AboveTheFoldFlatListProps,
} from "app/Components/AboveTheFoldFlatList"
import { CardRailCard, CardRailMetadataContainer } from "app/Components/CardRail/CardRailCard"
import { LARGE_IMAGE_SIZE, SMALL_IMAGE_SIZE } from "app/Components/MultipleImageLayout"
import Spinner from "app/Components/Spinner"
import { Ref } from "react"
import { FlatListProps, View } from "react-native"

type CardRailFlatList<ItemType> = AboveTheFoldFlatListProps<ItemType>

export function CardRailFlatList<ItemType>(
  props: { listRef?: Ref<ItemType | any> } & FlatListProps<ItemType>
) {
  const initialNumToRender = props.initialNumToRender || 2
  const space = useSpace()

  return (
    <AboveTheFoldFlatList<ItemType>
      ListHeaderComponent={() => <Spacer x={2} />}
      ListFooterComponent={() => <Spacer x={2} />}
      ItemSeparatorComponent={() => <View style={{ width: space(2) }} />}
      ListEmptyComponent={() => <Spinner style={{ flex: 1, marginBottom: 20 }} />}
      horizontal
      showsHorizontalScrollIndicator={false}
      scrollsToTop={false}
      initialNumToRender={initialNumToRender}
      {...props}
    />
  )
}

export const CardRailFlatListPlaceholder: React.FC<FlexProps & { numberOfLines?: number }> = ({
  numberOfLines = 1,
  ...flexProps
}) => {
  return (
    <Skeleton>
      <Flex {...flexProps}>
        <Flex mx={2}>
          <SkeletonText variant="sm-display">Some title</SkeletonText>

          <Spacer y={2} />

          <Flex flexDirection="row">
            <Join separator={<Spacer x={2} />}>
              {Array.from({ length: 2 }).map((_, index) => (
                <CardRailCard key={index}>
                  <Flex>
                    <Flex flexDirection="row">
                      <SkeletonBox height={LARGE_IMAGE_SIZE} width={LARGE_IMAGE_SIZE} />
                      <Flex>
                        <SkeletonBox
                          height={SMALL_IMAGE_SIZE}
                          width={SMALL_IMAGE_SIZE}
                          borderLeftWidth={2}
                          borderColor="mono0"
                          borderBottomWidth={1}
                        />
                        <SkeletonBox
                          height={SMALL_IMAGE_SIZE}
                          width={SMALL_IMAGE_SIZE}
                          borderLeftWidth={2}
                          borderColor="mono0"
                          borderTopWidth={1}
                        />
                      </Flex>
                    </Flex>
                    <CardRailMetadataContainer>
                      <SkeletonText numberOfLines={numberOfLines}>
                        {numberOfLines > 1
                          ? "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          : "xxxxxxxxxxxxxxxxx"}
                      </SkeletonText>
                    </CardRailMetadataContainer>
                  </Flex>
                </CardRailCard>
              ))}
            </Join>
          </Flex>
        </Flex>
      </Flex>
    </Skeleton>
  )
}
