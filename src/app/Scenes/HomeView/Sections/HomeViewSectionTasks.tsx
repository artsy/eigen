import { ContextModule } from "@artsy/cohesion"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Box,
  Flex,
  FlexProps,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
  Text,
} from "@artsy/palette-mobile"
import { useIsFocused } from "@react-navigation/native"
import { HomeViewSectionTasksQuery } from "__generated__/HomeViewSectionTasksQuery.graphql"
import {
  HomeViewSectionTasks_section$data,
  HomeViewSectionTasks_section$key,
} from "__generated__/HomeViewSectionTasks_section.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { Task } from "app/Components/Tasks/Task"
import { HomeViewSectionSentinel } from "app/Scenes/HomeView/Components/HomeViewSectionSentinel"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import { GlobalStore } from "app/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { AnimatePresence, MotiView } from "moti"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { CellRendererProps, InteractionManager, ListRenderItem } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable"
import { Easing } from "react-native-reanimated"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

const MAX_NUMBER_OF_TASKS = 10

// Height of each task + seperator
const TASK_CARD_HEIGHT = 92

type Task = ExtractNodeType<HomeViewSectionTasks_section$data["tasksConnection"]>

interface HomeViewSectionTasksProps extends FlexProps {
  section: HomeViewSectionTasks_section$key
  index: number
}

export const HomeViewSectionTasks: React.FC<HomeViewSectionTasksProps> = ({
  section: sectionProp,
  index,
  ...flexProps
}) => {
  const swipeableRef = useRef<SwipeableMethods>(null)
  const section = useFragment(tasksFragment, sectionProp)
  const tasks = extractNodes(section.tasksConnection)
  const isFocused = useIsFocused()

  const { isDismissed } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const { dismiss } = GlobalStore.actions.progressiveOnboarding

  const [clearedTasks, setClearedTasks] = useState<string[]>([])
  const [showAll, setShowAll] = useState(false)

  const filteredTasks = tasks.filter((task) => !clearedTasks.includes(task.internalID))
  const displayTaskStack = filteredTasks.length > 1 && !showAll
  const HeaderIconComponent = showAll ? ArrowUpIcon : ArrowDownIcon

  const task = tasks?.[0]

  // adding the find-saved-artwork onboarding key to prevent overlap
  const shouldStartOnboardingAnimation =
    isFocused &&
    !isDismissed("act-now-tasks").status &&
    !!isDismissed("find-saved-artwork").status &&
    !!swipeableRef.current &&
    !!task

  useEffect(() => {
    if (shouldStartOnboardingAnimation) {
      InteractionManager.runAfterInteractions(() => {
        if (swipeableRef.current) {
          swipeableRef.current.openRight()
        }
      }).then(() => {
        setTimeout(() => {
          if (swipeableRef.current) {
            swipeableRef.current.close()
            dismiss("act-now-tasks")
          }
        }, 2000)
      })
    }
  }, [shouldStartOnboardingAnimation])

  const handleClearTask = (task: Task) => {
    if (!task) {
      return
    }

    setClearedTasks((prev) => [...prev, task.internalID])
  }

  const renderCell = useCallback(({ index, ...rest }: CellRendererProps<Task>) => {
    return <Box zIndex={-index} {...rest} />
  }, [])

  const renderItem = useCallback<ListRenderItem<Task>>(
    ({ item, index }) => {
      let scaleX = 1
      let translateY = 0
      let opacity = 1

      if (!showAll && index !== 0) {
        scaleX = 1 - index * 0.05
        translateY = -83 * index
        opacity = 1 - index * 0.15
        if (index > 2) {
          opacity = 0
        }
      }

      return (
        <Flex>
          <MotiView
            key={item.internalID + index}
            transition={{ type: "timing" }}
            animate={{ transform: [{ scaleX }, { translateY }], opacity }}
          >
            <Task
              disableSwipeable={displayTaskStack}
              onClearTask={() => handleClearTask(item)}
              onPress={displayTaskStack ? () => setShowAll((prev) => !prev) : undefined}
              ref={swipeableRef}
              task={item}
            />
          </MotiView>
        </Flex>
      )
    },
    [displayTaskStack, handleClearTask, showAll]
  )

  const motiViewHeight = useMemo(() => {
    // this is the height of the first task card + the section title height + padding
    const singleTaskHeight = TASK_CARD_HEIGHT + 40 + 40

    if (!showAll) {
      return singleTaskHeight
    }

    return singleTaskHeight + (filteredTasks.length - 1) * TASK_CARD_HEIGHT
  }, [filteredTasks, showAll])

  return (
    <AnimatePresence>
      {!!filteredTasks.length && (
        <MotiView
          transition={{ type: "timing" }}
          animate={{ opacity: 1, height: motiViewHeight }}
          exit={{ opacity: 0, height: 0 }}
          exitTransition={{ type: "timing", easing: Easing.inOut(Easing.ease) }}
        >
          <Flex {...flexProps}>
            <Flex mx={2}>
              <SectionTitle
                title={section.component?.title}
                RightButtonContent={() => {
                  if (filteredTasks.length < 2) {
                    return null
                  }

                  return (
                    <Flex flexDirection="row">
                      <Text variant="xs">{showAll ? "Show Less" : "Show All"}</Text>
                      <HeaderIconComponent ml={5} mt="2px" />
                    </Flex>
                  )
                }}
                onPress={() => setShowAll((prev) => !prev)}
              />
            </Flex>

            <Flex mr={2}>
              <FlatList
                scrollEnabled={false}
                data={filteredTasks}
                keyExtractor={(item) => item.internalID}
                CellRendererComponent={renderCell}
                ItemSeparatorComponent={() => <Spacer y={1} />}
                renderItem={renderItem}
              />
            </Flex>

            <HomeViewSectionSentinel
              contextModule={section.contextModule as ContextModule}
              index={index}
            />
          </Flex>
        </MotiView>
      )}
    </AnimatePresence>
  )
}

const tasksFragment = graphql`
  fragment HomeViewSectionTasks_section on HomeViewSectionTasks
  @argumentDefinitions(numberOfTasks: { type: "Int", defaultValue: 10 }) {
    internalID
    contextModule
    ownerType
    component {
      title
    }
    tasksConnection(first: $numberOfTasks) {
      edges {
        node {
          internalID
          ...Task_task
        }
      }
    }
  }
`

const HomeViewSectionTasksPlaceholder: React.FC<FlexProps> = (flexProps) => {
  return (
    <Skeleton>
      <Flex {...flexProps}>
        <Flex mx={2}>
          <SkeletonText variant="sm-display">Act Now</SkeletonText>

          <Spacer y={2} />

          <Flex>
            <SkeletonBox height={82} />
          </Flex>
        </Flex>
      </Flex>
    </Skeleton>
  )
}

const homeViewSectionTasksQuery = graphql`
  query HomeViewSectionTasksQuery($id: String!, $numberOfTasks: Int!) {
    homeView {
      section(id: $id) {
        ...HomeViewSectionTasks_section @arguments(numberOfTasks: $numberOfTasks)
      }
    }
  }
`

export const HomeViewSectionTasksQueryRenderer: React.FC<SectionSharedProps> = withSuspense({
  Component: ({ sectionID, index, refetchKey, ...flexProps }) => {
    const data = useLazyLoadQuery<HomeViewSectionTasksQuery>(
      homeViewSectionTasksQuery,
      { id: sectionID, numberOfTasks: MAX_NUMBER_OF_TASKS },
      {
        fetchKey: refetchKey,
        fetchPolicy: "store-and-network",
        networkCacheConfig: { force: true },
      }
    )

    if (!data.homeView.section) {
      return null
    }

    return <HomeViewSectionTasks section={data.homeView.section} index={index} {...flexProps} />
  },
  LoadingFallback: HomeViewSectionTasksPlaceholder,
  ErrorFallback: NoFallback,
})
