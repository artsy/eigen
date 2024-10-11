import {
  Flex,
  FlexProps,
  Join,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
} from "@artsy/palette-mobile"
import { HomeViewSectionTasksQuery } from "__generated__/HomeViewSectionTasksQuery.graphql"
import { HomeViewSectionTasks_section$key } from "__generated__/HomeViewSectionTasks_section.graphql"
import { MEDIUM_CARD_HEIGHT, MEDIUM_CARD_WIDTH } from "app/Components/Cards"
import { SectionTitle } from "app/Components/SectionTitle"
import { Task } from "app/Components/Tasks/Task"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { useMemoizedRandom } from "app/utils/placeholders"
import { times } from "lodash"
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

const HomeViewSectionTasksPlaceholder: React.FC = () => {
  const randomValue = useMemoizedRandom()

  return (
    <Skeleton>
      <Flex>
        <Flex mx={2}>
          <SkeletonText variant="sm-display">Act Now</SkeletonText>

          <Spacer y={2} />

          <Flex flexDirection="row">
            <Join separator={<Spacer x="15px" />}>
              {times(2 + randomValue * 10).map((index) => (
                <Flex key={index}>
                  <SkeletonBox height={MEDIUM_CARD_HEIGHT} width={MEDIUM_CARD_WIDTH} />
                </Flex>
              ))}
            </Join>
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
    const data = useLazyLoadQuery<HomeViewSectionTasksQuery>(
      homeViewSectionTasksQuery,
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

    return <HomeViewSectionTasks section={data.homeView.section} index={index} {...flexProps} />
  },
  LoadingFallback: HomeViewSectionTasksPlaceholder,
  ErrorFallback: NoFallback,
})

// const data = useLazyLoadQuery<HomeViewSectionTasksQuery>(
//   graphql`
//     query HomeViewSectionTasksQuery {
//       me {
//         tasks(limit: 1) {
//           internalID
//           ...Task_task
//         }
//       }
//     }
//   `,
//   {},
//   {
//     fetchPolicy: "network-only",
//   }
// )
