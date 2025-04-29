import { ContextModule } from "@artsy/cohesion"
import {
  ArtworkIcon,
  AuctionIcon as GavelIcon,
  FairIcon,
  Flex,
  FlexProps,
  FollowArtistIcon,
  HeartIcon as HeartStrokeIcon,
  IconProps,
  Pill,
  PublicationIcon,
  Skeleton,
  Spacer,
  Text,
  useSpace,
} from "@artsy/palette-mobile"
import { HomeViewSectionNavigationPillsQuery } from "__generated__/HomeViewSectionNavigationPillsQuery.graphql"
import {
  HomeViewSectionNavigationPills_section$data,
  HomeViewSectionNavigationPills_section$key,
} from "__generated__/HomeViewSectionNavigationPills_section.graphql"
import { HomeViewSectionSentinel } from "app/Scenes/HomeView/Components/HomeViewSectionSentinel"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { GlobalStore } from "app/store/GlobalStore"
import { RouterLink } from "app/system/navigation/RouterLink"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { FC, memo } from "react"
import { FlatList, Platform } from "react-native"
import Animated, { Easing, useAnimatedStyle, withTiming } from "react-native-reanimated"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionNavigationPillsProps {
  section: HomeViewSectionNavigationPills_section$key
  index: number
}

export type NavigationPill = NonNullable<
  NonNullable<NonNullable<HomeViewSectionNavigationPills_section$data>["navigationPills"]>[number]
>

export const HomeViewSectionNavigationPills: React.FC<HomeViewSectionNavigationPillsProps> = ({
  section: sectionProp,
  index,
  ...flexProps
}) => {
  const section = useFragment(sectionFragment, sectionProp)
  const tracking = useHomeViewTracking()
  const { isSplashScreenVisible } = GlobalStore.useAppState((state) => state.sessionState)
  const space = useSpace()

  const navigationPills = section.navigationPills.filter(
    (pill) => pill?.title && pill.href
  ) as NavigationPill[]

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(isSplashScreenVisible ? -150 : 0, {
          duration: 1000,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
        }),
      },
    ],
    overflow: "visible",
  }))

  if (!navigationPills.length) {
    return null
  }

  return (
    <Flex {...flexProps} mt={1}>
      <Animated.FlatList
        data={navigationPills}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={animatedStyles}
        contentContainerStyle={[
          {
            paddingHorizontal: space(2),
          },
        ]}
        ItemSeparatorComponent={() => <Spacer x={0.5} />}
        renderItem={({ item: pill, index }) => (
          <RouterLink
            hasChildTouchable
            to={pill.href}
            key={pill.title}
            onPress={() => {
              tracking.tappedNavigationPillsGroup({
                title: pill.title,
                href: pill.href,
                index: index,
              })
            }}
          >
            <Pill
              accessibilityLabel={pill.title}
              accessibilityRole="link"
              testID={`pill-${pill.title}`}
              variant="link"
              Icon={SUPPORTED_ICONS[pill.icon as string]}
            >
              <Text variant="xs" color="mono100">
                {pill.title}
              </Text>
            </Pill>
          </RouterLink>
        )}
      />

      <HomeViewSectionSentinel
        contextModule={section.contextModule as ContextModule}
        index={index}
      />
    </Flex>
  )
}

const sectionFragment = graphql`
  fragment HomeViewSectionNavigationPills_section on HomeViewSectionNavigationPills {
    internalID
    contextModule
    navigationPills {
      title
      href
      ownerType
      icon
    }
  }
`

const homeViewSectionNavigationPillsQuery = graphql`
  query HomeViewSectionNavigationPillsQuery($id: String!) {
    homeView {
      section(id: $id) {
        ...HomeViewSectionNavigationPills_section
      }
    }
  }
`

const HomeViewSectionNavigationPillsPlaceholder: React.FC<FlexProps> = (flexProps) => {
  const space = useSpace()

  return (
    <Skeleton>
      <Flex {...flexProps} mt={1}>
        <FlatList
          data={NAVIGATION_LINKS_PLACEHOLDER}
          horizontal
          contentContainerStyle={{
            paddingHorizontal: space(2),
          }}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <Spacer x={0.5} />}
          renderItem={({ item: pill }) => (
            <Pill key={pill.title} variant="link" onPress={() => {}}>
              {Platform.OS === "ios" ? (
                <Text variant="xs" color="mono100" opacity={0}>
                  {pill.title}
                </Text>
              ) : (
                // 0 opacity text on android shows the text for a split second and breaks the experience
                // We want to avoid that. I'ts working fine on iOS
                <Flex width={50} />
              )}
            </Pill>
          )}
        />
      </Flex>
    </Skeleton>
  )
}

export const HomeViewSectionNavigationPillsQueryRenderer: React.FC<SectionSharedProps> = memo(
  withSuspense({
    Component: ({ sectionID, index, ...flexProps }) => {
      const data = useLazyLoadQuery<HomeViewSectionNavigationPillsQuery>(
        homeViewSectionNavigationPillsQuery,
        {
          id: sectionID,
        },
        {
          networkCacheConfig: {
            force: false,
          },
        }
      )

      if (!data.homeView.section) {
        return null
      }

      return (
        <HomeViewSectionNavigationPills
          section={data.homeView.section}
          index={index}
          {...flexProps}
        />
      )
    },
    LoadingFallback: HomeViewSectionNavigationPillsPlaceholder,
    ErrorFallback: NoFallback,
  })
)

export const NAVIGATION_LINKS_PLACEHOLDER: Array<NavigationPill> = [
  { title: "Follows", href: "/favorites", ownerType: "whatever", icon: "HeartIcon" },
  { title: "Auctions", href: "/auctions", ownerType: "whatever", icon: "HeartIcon" },
  { title: "Saves", href: "/favorites/saves", ownerType: "whatever", icon: "HeartIcon" },
  { title: "Art under $1000", href: "/collect", ownerType: "whatever", icon: "HeartIcon" },
  { title: "Price Database", href: "/price-database", ownerType: "whatever", icon: "HeartIcon" },
  { title: "Editorial", href: "/news", ownerType: "whatever", icon: "HeartIcon" },
]

const SUPPORTED_ICONS: Record<string, FC<IconProps>> = {
  ArtworkIcon,
  FairIcon,
  FollowArtistIcon,
  GavelIcon,
  HeartStrokeIcon,
  PublicationIcon,
}
