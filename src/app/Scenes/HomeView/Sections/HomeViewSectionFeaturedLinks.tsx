import {
  Button,
  Flex,
  FlexProps,
  Join,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
} from "@artsy/palette-mobile"
import { HomeViewSectionFeaturedLinksQuery } from "__generated__/HomeViewSectionFeaturedLinksQuery.graphql"
import { HomeViewSectionFeaturedLinks_section$key } from "__generated__/HomeViewSectionFeaturedLinks_section.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { times } from "lodash"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionFeaturedLinksProps {
  section: HomeViewSectionFeaturedLinks_section$key
  index: number
}

export const HomeViewSectionFeaturedLinks: React.FC<HomeViewSectionFeaturedLinksProps> = ({
  section: sectionProp,
  ...flexProps
}) => {
  const section = useFragment(fragment, sectionProp)
  const links = extractNodes(section.linksConnection)
  if (links.length === 0) return null

  return (
    <Flex {...flexProps}>
      <Flex px={2}>
        <SectionTitle title={section.component?.title} />

        <Flex flexDirection="row" flexWrap="wrap">
          {links.map((link) => (
            <Button
              key={link.href}
              variant="fillDark"
              size="small"
              mr={0.5}
              mb={0.5}
              onPress={() => {
                if (link?.href) navigate(link.href)
              }}
            >
              {link.title}
            </Button>
          ))}
        </Flex>
      </Flex>
    </Flex>
  )
}

const fragment = graphql`
  fragment HomeViewSectionFeaturedLinks_section on HomeViewSectionFeaturedLinks {
    __typename
    internalID
    contextModule
    ownerType
    component {
      title
    }

    linksConnection(first: 10) {
      edges {
        node {
          title
          href
        }
      }
    }
  }
`

const HomeViewSectionFeaturedLinksPlaceholder: React.FC<FlexProps> = (flexProps) => {
  return (
    <Skeleton>
      <Flex {...flexProps}>
        <Flex px={2}>
          <SkeletonText my={2}>Browse links</SkeletonText>

          <Flex flexDirection="row" flexWrap="wrap">
            <Join separator={<Spacer x={0.5} />}>
              {times(10).map((index) => (
                <SkeletonBox
                  key={index}
                  height={30}
                  width={60 + Math.random() * 40}
                  mb={0.5}
                  borderRadius={20}
                />
              ))}
            </Join>
          </Flex>
        </Flex>
      </Flex>
    </Skeleton>
  )
}

const homeViewSectionFeaturedLinksQuery = graphql`
  query HomeViewSectionFeaturedLinksQuery($id: String!) {
    homeView {
      section(id: $id) {
        ...HomeViewSectionFeaturedLinks_section
      }
    }
  }
`

export const HomeViewSectionFeaturedLinksQueryRenderer: React.FC<SectionSharedProps> = withSuspense(
  ({ sectionID, index, ...flexProps }) => {
    const data = useLazyLoadQuery<HomeViewSectionFeaturedLinksQuery>(
      homeViewSectionFeaturedLinksQuery,
      {
        id: sectionID,
      }
    )

    if (!data.homeView.section) {
      return null
    }

    return (
      <HomeViewSectionFeaturedLinks section={data.homeView.section} index={index} {...flexProps} />
    )
  },
  HomeViewSectionFeaturedLinksPlaceholder
)
