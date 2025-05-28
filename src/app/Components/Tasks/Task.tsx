import { ContextModule } from "@artsy/cohesion"
import { Flex, Image, Text, Touchable } from "@artsy/palette-mobile"
import { Task_task$key } from "__generated__/Task_task.graphql"
import { useAcknowledgeTaskMutation$data } from "__generated__/useAcknowledgeTaskMutation.graphql"
import { useDismissTaskMutation$data } from "__generated__/useDismissTaskMutation.graphql"
import { Swipeable } from "app/Components/Swipeable/Swipeable"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { navigate } from "app/system/navigation/navigate"
import { useAcknowledgeTask } from "app/utils/mutations/useAcknowledgeTask"
import { useDismissTask } from "app/utils/mutations/useDismissTask"
import { forwardRef, useCallback } from "react"
import { PixelRatio } from "react-native"
import { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable"
import { ConnectionHandler, graphql, useFragment } from "react-relay"
import { SelectorStoreUpdater } from "relay-runtime"

const TASK_IMAGE_SIZE = 60

export interface TaskProps {
  disableSwipeable?: boolean
  onOpenTask: () => void
  onPress?: () => void
  task: Task_task$key
}

export const Task = forwardRef<SwipeableMethods, TaskProps>(
  ({ disableSwipeable, onOpenTask, onPress, ...restProps }, ref) => {
    const { tappedTaskGroup, tappedClearTask } = useHomeViewTracking()
    const [acknowledgeTask] = useAcknowledgeTask()
    const [dismissTask] = useDismissTask()
    const fontScale = PixelRatio.getFontScale()
    const task = useFragment(taskFragment, restProps.task)

    const optimisticallyClearTask: SelectorStoreUpdater<
      useAcknowledgeTaskMutation$data | useDismissTaskMutation$data
    > = useCallback((store) => {
      const homeViewTaskSection = store
        .getRoot()
        .getLinkedRecord("homeView")
        ?.getLinkedRecord("section", { id: "home-view-section-tasks" })

      if (!homeViewTaskSection) {
        return
      }
      const key = "HomeViewSectionTasks_tasksConnection"
      const tasksConnection = ConnectionHandler.getConnection(homeViewTaskSection, key)

      if (tasksConnection) {
        // remove the task with matching relay id from the connection
        ConnectionHandler.deleteNode(tasksConnection, task.relayID)
      }
    }, [])

    const handlePressTask = () => {
      if (onPress) {
        onPress()
        return
      }

      tappedTaskGroup(ContextModule.actNow, task.actionLink, task.internalID, task.taskType)
      acknowledgeTask({
        variables: { taskID: task.internalID },
        optimisticUpdater: optimisticallyClearTask,
        onCompleted: () => {
          navigate(task.actionLink)
        },
      })
    }

    const handleClearTask = () => {
      dismissTask({
        variables: { taskID: task.internalID },
        optimisticUpdater: optimisticallyClearTask,
      })

      tappedClearTask(ContextModule.actNow, task.actionLink, task.internalID, task.taskType)
    }

    return (
      <Swipeable
        testID={`user-task-${task.internalID}`}
        ref={ref}
        actionComponent={
          <Text variant="xs" color="mono0">
            Clear
          </Text>
        }
        actionComponentWidth={80 * fontScale}
        actionOnPress={handleClearTask}
        actionOnSwipe={handleClearTask}
        onSwipeableWillOpen={onOpenTask}
        enabled={!disableSwipeable}
      >
        <Flex backgroundColor="mono0" borderRadius={5}>
          <Touchable accessibilityRole="button" onPress={handlePressTask}>
            <Flex
              p={1}
              ml={2}
              flexDirection="row"
              border="1px solid"
              borderColor="mono100"
              borderRadius={5}
              zIndex={3}
              backgroundColor="mono100"
            >
              <Flex pr={1}>
                <Image src={task.imageUrl} width={TASK_IMAGE_SIZE} height={TASK_IMAGE_SIZE} />
              </Flex>

              <Flex flex={1} pr={1}>
                <Text color="mono0" variant="xs" fontWeight="bold">
                  {task.title}
                </Text>

                <Text color="mono0" variant="xs">
                  {task.message}
                </Text>
              </Flex>
            </Flex>
          </Touchable>
        </Flex>
      </Swipeable>
    )
  }
)

const taskFragment = graphql`
  fragment Task_task on Task {
    relayID: id
    actionLink
    imageUrl
    internalID
    message
    title
    taskType
  }
`
