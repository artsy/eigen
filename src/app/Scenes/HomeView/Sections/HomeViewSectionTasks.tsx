import { Flex, FlexProps, Skeleton, SkeletonBox, SkeletonText, Spacer } from "@artsy/palette-mobile"
import { HomeViewSectionTasksQuery } from "__generated__/HomeViewSectionTasksQuery.graphql"
import { HomeViewSectionTasks_section$key } from "__generated__/HomeViewSectionTasks_section.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { Task } from "app/Components/Tasks/Task"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { useState } from "react"
import { LayoutAnimation } from "react-native"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

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

  // In the future, we may want to show multiple tasks
  const task = tasks?.[0]

  const [displayTask, setDisplayTask] = useState(true)

  const handleClearTask = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

    setDisplayTask(false)
  }

  if (!task || !displayTask) {
    return null
  }

  return (
    <Flex {...flexProps}>
      <Flex mr={2}>
        {!!displayTask && (
          <Flex>
            <Flex ml={2}>
              <SectionTitle title={section.component?.title} />
            </Flex>

            <Flex>
              <Task task={task} onClearTask={handleClearTask} />
            </Flex>
          </Flex>
        )}
      </Flex>
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
    tasksConnection(first: 1) {
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
