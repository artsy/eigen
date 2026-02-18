import { ContextModule } from "@artsy/cohesion"
import { ChevronDownIcon, ChevronUpIcon } from "@artsy/icons/native"
import {
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
import { memo, RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { InteractionManager, ListRenderItem, Platform } from "react-native"
import { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable"
import Animated, {
  Easing,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"
import usePrevious from "react-use/lib/usePrevious"

const MAX_NUMBER_OF_TASKS = 10

// Height of each task + seperator
const TASK_CARD_HEIGHT = 92

const IS_ANDROID = Platform.OS === "android"

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
  const firstSwipeableRef = useRef<SwipeableMethods>(null)

  // Define a Map of refs to each task but since it will never be
  // reassigned, we can access current immediately
  const taskRefs = useRef<Map<string, RefObject<SwipeableMethods>>>(new Map()).current

  const section = useFragment(tasksFragment, sectionProp)
  const tasks = extractNodes(section.tasksConnection)
  const isFocused = useIsFocused()

  const { isDismissed } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const { dismiss } = GlobalStore.actions.progressiveOnboarding

  const [showAll, setShowAll] = useState(false)

  const displayTaskStack = tasks.length > 1 && !showAll
  const HeaderIconComponent = showAll ? ChevronUpIcon : ChevronDownIcon

  // TODO: remove this when this reanimated issue gets fixed
  // https://github.com/software-mansion/react-native-reanimated/issues/5728
  const [flatlistHeight, setFlatlistHeight] = useState<number | undefined>(undefined)

  const task = tasks?.[0]

  // adding the save-artwork onboarding key to prevent overlap
  const shouldStartOnboardingAnimation =
    isFocused &&
    !isDismissed("act-now-tasks").status &&
    !!isDismissed("save-artwork").status &&
    !!firstSwipeableRef.current &&
    !!task

  useEffect(() => {
    if (shouldStartOnboardingAnimation) {
      InteractionManager.runAfterInteractions(() => {
        if (firstSwipeableRef.current) {
          firstSwipeableRef.current.openRight()
        }
      }).then(() => {
        setTimeout(() => {
          if (firstSwipeableRef.current) {
            firstSwipeableRef.current.close()
            dismiss("act-now-tasks")
          }
        }, 2000)
      })
    }
  }, [shouldStartOnboardingAnimation])

  const previousShowAll = usePrevious(showAll)
  useEffect(() => {
    if (!showAll && previousShowAll) {
      closeAllTasks()
    }
  }, [showAll, previousShowAll])

  // Close all tasks except the one with the provided taskID
  const closeAllTasks = (excludeTaskID?: string) => {
    taskRefs.forEach((ref, taskID) => {
      if (ref.current && taskID !== excludeTaskID) {
        ref.current.close()
      }
    })
  }

  const getCellZIndex = useCallback(({ index }: { index: number }) => {
    return { zIndex: -index }
  }, [])

  const renderItem = useCallback<ListRenderItem<Task>>(
    ({ item, index }) => {
      return (
        <TaskItem
          task={item}
          taskRefs={taskRefs}
          index={index}
          showAll={showAll}
          displayTaskStack={displayTaskStack}
          onOpenTask={() => closeAllTasks(item.internalID)}
          setShowAll={setShowAll}
        />
      )
    },
    [displayTaskStack, showAll]
  )

  const motiViewHeight = useMemo(() => {
    // this is the height of the first task card + the section title height + padding
    const singleTaskHeight = TASK_CARD_HEIGHT + 40 + 40

    if (!showAll) {
      return singleTaskHeight
    }

    return singleTaskHeight + (tasks.length - 1) * TASK_CARD_HEIGHT
  }, [tasks, showAll])

  return (
    <AnimatePresence>
      {!!tasks.length && (
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
                  if (tasks.length < 2) {
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
              <Animated.FlatList
                onLayout={(event) => {
                  if (IS_ANDROID) {
                    setFlatlistHeight(event.nativeEvent.layout.height)
                  }
                }}
                style={IS_ANDROID ? { height: flatlistHeight } : {}}
                contentContainerStyle={IS_ANDROID ? { flex: 1, height: flatlistHeight } : {}}
                itemLayoutAnimation={LinearTransition}
                scrollEnabled={false}
                data={tasks}
                keyExtractor={(item) => item.internalID}
                CellRendererComponentStyle={getCellZIndex}
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
  @argumentDefinitions(
    numberOfTasks: { type: "Int", defaultValue: 10 }
    after: { type: "String" }
  ) {
    id
    internalID
    contextModule
    ownerType
    component {
      title
    }
    tasksConnection(first: $numberOfTasks, after: $after)
      @connection(key: "HomeViewSectionTasks_tasksConnection") {
      edges {
        node {
          internalID
          ...Task_task
        }
      }
    }
  }
`

interface TaskItemProps {
  task: Task
  taskRefs: Map<string, RefObject<SwipeableMethods | null>>
  showAll: boolean
  index: number
  displayTaskStack: boolean
  onOpenTask: () => void
  setShowAll: React.Dispatch<React.SetStateAction<boolean>>
}

const TaskItem = ({
  task,
  taskRefs,
  index,
  showAll,
  displayTaskStack,
  onOpenTask,
  setShowAll,
}: TaskItemProps) => {
  const taskRef = useRef<SwipeableMethods>(null)

  useEffect(() => {
    if (!taskRefs.has(task.internalID)) {
      taskRefs.set(task.internalID, taskRef)
    }
  }, [])

  const animationTransform = useMemo(() => {
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

    return { scaleX, translateY, opacity }
  }, [showAll, index])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scaleX: withTiming(animationTransform.scaleX) },
        { translateY: withTiming(animationTransform.translateY) },
      ],
      opacity: withTiming(animationTransform.opacity),
    }
  })

  return (
    <Animated.View exiting={FadeOut} style={animatedStyle} key={task.internalID}>
      <Task
        disableSwipeable={displayTaskStack}
        onPress={displayTaskStack ? () => setShowAll((prev) => !prev) : undefined}
        ref={taskRef}
        onOpenTask={onOpenTask}
        task={task}
      />
    </Animated.View>
  )
}

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

export const HomeViewSectionTasksQueryRenderer: React.FC<SectionSharedProps> = memo(
  withSuspense({
    Component: ({ sectionID, index, refetchKey, ...flexProps }) => {
      const data = useLazyLoadQuery<HomeViewSectionTasksQuery>(
        homeViewSectionTasksQuery,
        { id: sectionID, numberOfTasks: MAX_NUMBER_OF_TASKS },
        {
          fetchKey: refetchKey,
          fetchPolicy: "store-and-network",
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
)
