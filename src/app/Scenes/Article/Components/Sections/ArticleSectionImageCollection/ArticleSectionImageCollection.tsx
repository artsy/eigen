import { Flex, Spacer } from "@artsy/palette-mobile"
import { ArticleSectionImageCollection_section$key } from "__generated__/ArticleSectionImageCollection_section.graphql"
import { PaginationDots } from "app/Components/PaginationDots"
import { ArticleSectionImageCollectionCaption } from "app/Scenes/Article/Components/Sections/ArticleSectionImageCollection/ArticleSectionImageCollectionCaption"
import { ArticleSectionImageCollectionImage } from "app/Scenes/Article/Components/Sections/ArticleSectionImageCollection/ArticleSectionImageCollectionImage"
import { useState } from "react"
import { FlatList, NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import { useFragment, graphql } from "react-relay"

interface ArticleSectionImageCollectionProps {
  section: ArticleSectionImageCollection_section$key
}

export const ArticleSectionImageCollection: React.FC<ArticleSectionImageCollectionProps> = ({
  section,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const data = useFragment(ArticleSectionImageCollectionQuery, section)

  if (!data?.figures?.length) {
    return null
  }

  const updateCurrentPageIndex = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const totalWidth = event.nativeEvent.layoutMeasurement.width
    const xPos = event.nativeEvent.contentOffset.x
    const pageIndex = Math.floor(xPos / totalWidth)

    setCurrentPageIndex(pageIndex)
  }

  return (
    <>
      <FlatList
        testID="ArticleSectionImageCollection"
        data={data.figures}
        scrollEnabled={data?.figures?.length > 1}
        ItemSeparatorComponent={() => <Spacer x={0.5} />}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={updateCurrentPageIndex}
        horizontal
        pagingEnabled
        renderItem={({ item, index }) => {
          return (
            <Flex key={`ImageCollection-${index}`} flexDirection="column" justifyContent="center">
              <ArticleSectionImageCollectionImage figure={item} />
              <Flex px={2} py={1}>
                <ArticleSectionImageCollectionCaption figure={item} />
              </Flex>
            </Flex>
          )
        }}
      />

      {data.figures.length > 1 && (
        <>
          <Flex my={2}>
            <PaginationDots currentIndex={currentPageIndex} length={data.figures.length} />
          </Flex>
        </>
      )}
    </>
  )
}

const ArticleSectionImageCollectionQuery = graphql`
  fragment ArticleSectionImageCollection_section on ArticleSectionImageCollection {
    figures {
      ...ArticleSectionImageCollectionImage_figure
      ...ArticleSectionImageCollectionCaption_figure
    }
  }
`
