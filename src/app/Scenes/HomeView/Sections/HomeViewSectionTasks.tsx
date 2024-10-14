import { ContextModule } from "@artsy/cohesion"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Flex,
  FlexProps,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
  Text,
  Touchable,
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
import { useEffect, useRef, useState } from "react"
import { InteractionManager } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable"
import { Easing } from "react-native-reanimated"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

const MAX_NUMBER_OF_TASKS = 5

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

    // setDisplayTask(false)
  }

  return (
    <AnimatePresence>
      {!!filteredTasks.length && (
        <MotiView
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          exitTransition={{ type: "timing", easing: Easing.inOut(Easing.ease) }}
        >
          <Flex {...flexProps}>
            <Flex mx={2}>
              <SectionTitle
                title={section.component?.title}
                RightButtonContent={() => {
                  return (
                    <Flex flexDirection="row">
                      <Text variant="xs">{showAll ? "Show less" : "Show all"}</Text>
                      <HeaderIconComponent />
                    </Flex>
                  )
                }}
                onPress={() => setShowAll((prev) => !prev)}
              />
            </Flex>

            <Touchable onPress={() => !showAll && setShowAll((prev) => !prev)}>
              <Flex mr={2}>
                <FlatList
                  data={filteredTasks.slice(0, showAll ? filteredTasks.length : 1)}
                  keyExtractor={(item) => item.internalID + showAll}
                  ItemSeparatorComponent={() => <Spacer y={1} />}
                  renderItem={({ item }) => {
                    return (
                      <Flex>
                        <MotiView key={item.internalID} style={{ zIndex: 1 }}>
                          <Task
                            disableSwipeable={displayTaskStack}
                            onClearTask={() => handleClearTask(item)}
                            onPress={
                              displayTaskStack ? () => setShowAll((prev) => !prev) : undefined
                            }
                            ref={swipeableRef}
                            task={task}
                          />
                        </MotiView>

                        {!!displayTaskStack && (
                          <TaskStack taskSize={Math.max(filteredTasks.length - 1, 2)} />
                        )}
                      </Flex>
                    )
                  }}
                />
              </Flex>
            </Touchable>

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

interface TaskStackProps {
  taskSize: number
}

const TaskStack: React.FC<TaskStackProps> = ({ taskSize }) => {
  return (
    <Flex>
      {taskSize > 1 && (
        <Flex
          ml={2}
          style={{
            transform: [{ scale: 0.965 }],
            height: 12,
            marginTop: -4,
            backgroundColor: "#2D2D2D",
            borderColor: "#2D2D2D",
          }}
          flexDirection="row"
          border="1px solid"
          borderRadius={5}
          zIndex={-1}
        />
      )}
      {taskSize > 2 && (
        <Flex
          ml={2}
          style={{
            transform: [{ scale: 0.928 }],
            height: 12,
            marginTop: -5,
            backgroundColor: "#515151",
            borderColor: "#515151",
          }}
          flexDirection="row"
          border="1px solid"
          borderRadius={5}
          zIndex={-2}
        />
      )}
    </Flex>
  )
}
