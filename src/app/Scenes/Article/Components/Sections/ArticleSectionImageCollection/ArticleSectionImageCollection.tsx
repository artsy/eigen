import { Flex, Spacer } from "@artsy/palette-mobile"
import { ArticleSectionImageCollection_section$key } from "__generated__/ArticleSectionImageCollection_section.graphql"
import { ArticleSectionImageCollectionCaption } from "app/Scenes/Article/Components/Sections/ArticleSectionImageCollection/ArticleSectionImageCollectionCaption"
import { ArticleSectionImageCollectionImage } from "app/Scenes/Article/Components/Sections/ArticleSectionImageCollection/ArticleSectionImageCollectionImage"
import { FlatList } from "react-native"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface ArticleSectionImageCollectionProps {
  section: ArticleSectionImageCollection_section$key
}

export const ArticleSectionImageCollection: React.FC<ArticleSectionImageCollectionProps> = ({
  section,
}) => {
  const data = useFragment(ArticleSectionImageCollectionQuery, section)

  if (!data?.figures?.length) {
    return null
  }

  return (
    <FlatList
      data={data.figures}
      scrollEnabled={data?.figures?.length > 1}
      ItemSeparatorComponent={() => <Spacer x={0.5} />}
      showsHorizontalScrollIndicator={false}
      horizontal
      pagingEnabled
      renderItem={({ item, index }) => {
        return (
          <Flex key={`ImageCollection-${index}`} flexDirection="column" justifyContent="center">
            <ArticleSectionImageCollectionImage figure={item} />
            <ArticleSectionImageCollectionCaption figure={item} />
          </Flex>
        )
      }}
    />
  )
}

const ArticleSectionImageCollectionQuery = graphql`
  fragment ArticleSectionImageCollection_section on ArticleSectionImageCollection {
    layout
    figures {
      ...ArticleSectionImageCollectionImage_figure
      ...ArticleSectionImageCollectionCaption_figure
    }
  }
`
