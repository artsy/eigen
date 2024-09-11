import { Flex, Separator, Text, Touchable, useSpace } from "@artsy/palette-mobile"
import { HomeViewSectionArticlesCards_section$key } from "__generated__/HomeViewSectionArticlesCards_section.graphql"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { graphql, useFragment } from "react-relay"

interface HomeViewSectionArticlesCardsProps {
  section: HomeViewSectionArticlesCards_section$key
}

export const HomeViewSectionArticlesCards: React.FC<HomeViewSectionArticlesCardsProps> = (
  props
) => {
  const { section } = props
  const data = useFragment(fragment, section)
  const articles = extractNodes(data.cardArticlesConnection)
  const title = data.component?.title ?? "News"
  const componentHref = data.component?.behaviors?.viewAll?.href
  const componentButtonText = data.component?.behaviors?.viewAll?.buttonText

  const space = useSpace()

  const handleOnPress = () => {
    if (componentHref) {
      navigate(componentHref)
    }
  }

  return (
    <Flex m={2} p={2} border="1px solid" borderColor="black30" gap={space(2)}>
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
        <Text variant="lg-display">{title}</Text>
        <Text variant="lg-display">{date()}</Text>
      </Flex>
      {articles.map((article, index) => (
        <Flex key={index} gap={space(2)}>
          <Touchable onPress={handleOnPress}>
            <Flex flexDirection="row" alignItems="center">
              <Text variant="sm-display" numberOfLines={3}>
                {article.title}
              </Text>
            </Flex>
          </Touchable>
          {index !== articles.length - 1 && <Separator />}
        </Flex>
      ))}
      {!!componentHref && (
        <Touchable onPress={() => navigate(componentHref)}>
          <Flex flexDirection="row" justifyContent="flex-end">
            <Text variant="sm-display">{componentButtonText}</Text>
          </Flex>
        </Touchable>
      )}
    </Flex>
  )
}

const date = () =>
  new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })

const fragment = graphql`
  fragment HomeViewSectionArticlesCards_section on HomeViewSectionArticles {
    component {
      title
      behaviors {
        viewAll {
          href
          buttonText
        }
      }
    }

    cardArticlesConnection: articlesConnection(first: 3) {
      edges {
        node {
          title
          href
        }
      }
    }
  }
`
