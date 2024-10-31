import { ContextModule } from "@artsy/cohesion"
import { Flex, FlexProps, Skeleton, SkeletonBox, SkeletonText, Spacer } from "@artsy/palette-mobile"
import { HomeViewSectionTasksQuery } from "__generated__/HomeViewSectionTasksQuery.graphql"
import { HomeViewSectionTasks_section$key } from "__generated__/HomeViewSectionTasks_section.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { Task } from "app/Components/Tasks/Task"
import { HomeViewSectionSentinel } from "app/Scenes/HomeView/Components/HomeViewSectionSentinel"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import { GlobalStore } from "app/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { useEffect, useRef, useState } from "react"
import { InteractionManager, LayoutAnimation } from "react-native"
import { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable"
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

  const swipeableRef = useRef<SwipeableMethods>(null)
  const {
    isDismissed,
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const { dismiss } = GlobalStore.actions.progressiveOnboarding

  // adding the find-saved-artwork onboarding key to prevent overlap
  const shouldStartOnboardingAnimation =
    isReady && !isDismissed("act-now-tasks").status && !!isDismissed("find-saved-artwork").status

  // In the future, we may want to show multiple tasks
  const task = tasks?.[0]

  const [displayTask, setDisplayTask] = useState(true)

  useEffect(() => {
    if (shouldStartOnboardingAnimation) {
      startOnboardingAnimation()
    }
  }, [shouldStartOnboardingAnimation])

  if (!task || !displayTask) {
    return null
  }

  const startOnboardingAnimation = () => {
    InteractionManager.runAfterInteractions(() => {
      swipeableRef.current?.openRight()
    }).then(() => {
      setTimeout(() => {
        swipeableRef.current?.close()
        dismiss("act-now-tasks")
      }, 1500)
    })
  }

  const handleClearTask = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

    setDisplayTask(false)
  }

  return (
    <Flex {...flexProps}>
      <Flex mx={2}>
        <SectionTitle title={section.component?.title} />
      </Flex>

      <Flex mr={2}>
        <Task ref={swipeableRef} task={task} onClearTask={handleClearTask} />
      </Flex>

      <HomeViewSectionSentinel
        contextModule={section.contextModule as ContextModule}
        index={index}
      />
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
