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
  Touchable,
} from "@artsy/palette-mobile"
import { HomeViewSectionTasksQuery } from "__generated__/HomeViewSectionTasksQuery.graphql"
import {
  HomeViewSectionTasks_section$data,
  HomeViewSectionTasks_section$key,
} from "__generated__/HomeViewSectionTasks_section.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { Task } from "app/Components/Tasks/Task"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { useEffect, useState } from "react"
import { FlatList, LayoutAnimation } from "react-native"
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
  const section = useFragment(tasksFragment, sectionProp)
  const tasks = extractNodes(section.tasksConnection)

  const [clearedTasks, setClearedTasks] = useState<string[]>([])
  const [showAll, setShowAll] = useState(false)

  const filteredTasks = tasks.filter((task) => !clearedTasks.includes(task.internalID))
  const displayTaskStack = filteredTasks.length > 1 && !showAll
  const HeaderIconComponent = showAll ? ArrowUpIcon : ArrowDownIcon

  const handleShowAll = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

    setShowAll(!showAll)
  }

  const handleClearTask = (task: Task) => {
    if (!task) return

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

    setClearedTasks([...clearedTasks, task.internalID])
  }

  // This is a workaround to avoid header copy text to be animateed when using LayoutAnimation.
  // We need to wait for the animation to finish before changing the text.
  // TODO: Remove this workaround when we have a better solution for the animation.

  const [showHeaderButton, setShowHeaderButton] = useState(filteredTasks.length > 1)

  useEffect(() => {
    setTimeout(() => {
      setShowHeaderButton(filteredTasks.length > 1)
    }, 200)
  }, [setShowHeaderButton, filteredTasks.length])

  if (!filteredTasks.length) {
    return null
  }

  return (
    <Flex {...flexProps}>
      <Flex mx={2}>
        <SectionTitle
          title={section.component?.title}
          RightButtonContent={() =>
            showHeaderButton ? (
              <Touchable noFeedback onPress={handleShowAll}>
                <Flex flexDirection="row">
                  <Text variant="xs">{showAll ? "Show Less" : "Show All"}</Text>
                  <HeaderIconComponent fill="black60" ml={0.5} my="auto" style={{ marginTop: 3 }} />
                </Flex>
              </Touchable>
            ) : null
          }
          onPress={() => {}}
        />
      </Flex>

      <Touchable noFeedback onPress={() => !showAll && handleShowAll()}>
        <Flex mr={2}>
          <FlatList
            data={filteredTasks.slice(0, showAll ? MAX_NUMBER_OF_TASKS : 1)}
            keyExtractor={(task) => task.internalID + showAll}
            ItemSeparatorComponent={() => <Spacer y={1} />}
            renderItem={({ item }) => {
              return (
                <Flex>
                  {/* zIndex is needed for the task stack */}
                  <Box zIndex={1}>
                    <Task
                      disableSwipeable={displayTaskStack}
                      onClearTask={() => handleClearTask(item)}
                      onPress={displayTaskStack ? handleShowAll : undefined}
                      task={item}
                    />
                  </Box>

                  {!!displayTaskStack && (
                    <TaskStack taskSize={Math.max(filteredTasks.length - 1, 2)} />
                  )}
                </Flex>
              )
            }}
          />
        </Flex>
      </Touchable>
    </Flex>
  )
}

const tasksFragment = graphql`
  fragment HomeViewSectionTasks_section on HomeViewSectionTasks {
    internalID
    contextModule
    ownerType
    component {
      title
    }
    tasksConnection(first: 5) {
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
  query HomeViewSectionTasksQuery($id: String!) @cacheable {
    homeView {
      section(id: $id) {
        ...HomeViewSectionTasks_section
      }
    }
  }
`

export const HomeViewSectionTasksQueryRenderer: React.FC<SectionSharedProps> = withSuspense({
  Component: ({ sectionID, index, ...flexProps }) => {
    const data = useLazyLoadQuery<HomeViewSectionTasksQuery>(homeViewSectionTasksQuery, {
      id: sectionID,
    })

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
