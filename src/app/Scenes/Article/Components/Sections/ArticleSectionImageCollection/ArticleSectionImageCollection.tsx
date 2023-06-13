import { Flex } from "@artsy/palette-mobile"
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
    <>
      {/* TODO: Feature articles */}
      {/* <Text>{data.layout}</Text> */}

      <FlatList
        horizontal
        pagingEnabled
        scrollEnabled={data?.figures?.length > 1}
        showsHorizontalScrollIndicator={false}
        data={data.figures}
        renderItem={({ item, index }) => {
          return (
            <Flex
              key={`ImageCollection-${index}`}
              flexDirection="column"
              justifyContent="center"
              mr={0.5}
            >
              <ArticleSectionImageCollectionImage figure={item} />
              <ArticleSectionImageCollectionCaption figure={item} />
            </Flex>
          )
        }}
      />
    </>
  )
}

const ArticleSectionImageCollectionQuery = graphql`
  fragment ArticleSectionImageCollection_section on ArticleSectionImageCollection {
    layout
    figures {
      __typename
      ...ArticleSectionImageCollectionImage_figure
      ...ArticleSectionImageCollectionCaption_figure
    }
  }
`
