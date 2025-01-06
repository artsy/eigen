import { ContextModule } from "@artsy/cohesion"
import { Flex, Image, Text, Touchable } from "@artsy/palette-mobile"
import { Task_task$key } from "__generated__/Task_task.graphql"
import { Swipeable } from "app/Components/Swipeable/Swipeable"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { navigate } from "app/system/navigation/navigate"
import { useAcknowledgeTask } from "app/utils/mutations/useAcknowledgeTask"
import { useDismissTask } from "app/utils/mutations/useDismissTask"
import { forwardRef } from "react"
import { PixelRatio } from "react-native"
import { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable"
import { graphql, useFragment } from "react-relay"

const TASK_IMAGE_SIZE = 60

export interface TaskProps {
  disableSwipeable?: boolean
  onClearTask: <T>(clearTask: () => Promise<T>) => Promise<void>
  onOpenTask: () => void
  onPress?: () => void
  task: Task_task$key
}

export const Task = forwardRef<SwipeableMethods, TaskProps>(
  ({ disableSwipeable, onClearTask, onOpenTask, onPress, ...restProps }, ref) => {
    const { tappedTaskGroup, tappedClearTask } = useHomeViewTracking()
    const [acknowledgeTask] = useAcknowledgeTask()
    const [dismissTask] = useDismissTask()
    const fontScale = PixelRatio.getFontScale()
    const task = useFragment(taskFragment, restProps.task)

    const handlePressTask = async () => {
      if (onPress) {
        onPress()
        return
      }

      await acknowledgeTask({ variables: { taskID: task.internalID } })
      tappedTaskGroup(ContextModule.actNow, task.actionLink, task.internalID, task.taskType)
      await onClearTask(async () => {
        return await acknowledgeTask({ variables: { taskID: task.internalID } })
      })

      navigate(task.actionLink)
    }

    const handleClearTask = async () => {
      await onClearTask(async () => {
        return await dismissTask({ variables: { taskID: task.internalID } })
      })

      tappedClearTask(ContextModule.actNow, task.actionLink, task.internalID, task.taskType)
    }

    return (
      <Swipeable
        testID={`user-task-${task.internalID}`}
        ref={ref}
        actionComponent={
          <Text variant="xs" color="white100">
            Clear
          </Text>
        }
        actionComponentWidth={80 * fontScale}
        actionOnPress={() => {
          handleClearTask()
        }}
        actionOnSwipe={() => {
          handleClearTask()
        }}
        onSwipeableWillOpen={() => {
          onOpenTask()
        }}
        enabled={!disableSwipeable}
      >
        <Flex backgroundColor="white100" borderRadius={5}>
          <Touchable onPress={handlePressTask}>
            <Flex
              p={1}
              ml={2}
              flexDirection="row"
              border="1px solid"
              borderColor="black100"
              borderRadius={5}
              zIndex={3}
              backgroundColor="black100"
            >
              <Flex pr={1}>
                <Image src={task.imageUrl} width={TASK_IMAGE_SIZE} height={TASK_IMAGE_SIZE} />
              </Flex>

              <Flex flex={1} pr={1}>
                <Text color="white100" variant="xs" fontWeight="bold">
                  {task.title}
                </Text>

                <Text color="white100" variant="xs">
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
    actionLink
    imageUrl
    internalID
    message
    title
    taskType
  }
`
