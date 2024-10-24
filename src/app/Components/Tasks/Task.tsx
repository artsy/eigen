import { ContextModule } from "@artsy/cohesion"
import { Flex, Image, Text, Touchable } from "@artsy/palette-mobile"
import { Task_task$key } from "__generated__/Task_task.graphql"
import { Swipeable } from "app/Components/Swipeable/Swipeable"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import { navigate } from "app/system/navigation/navigate"
import { useAcknowledgeTask } from "app/utils/mutations/useAcknowledgeTask"
import { useDismissTask } from "app/utils/mutations/useDismissTask"
import { useRef } from "react"
import { PixelRatio } from "react-native"
import { SwipeableMethods } from "react-native-gesture-handler/lib/typescript/components/ReanimatedSwipeable"
import { graphql, useFragment } from "react-relay"

const TASK_IMAGE_SIZE = 60

interface TaskProps {
  disableSwipeable?: boolean
  onClearTask: () => void
  onPress?: () => void
  task: Task_task$key
}
export const Task: React.FC<TaskProps> = ({
  disableSwipeable,
  onClearTask,
  onPress,
  ...restProps
}) => {
  const { tappedNotification, tappedClearNotification } = useHomeViewTracking()
  const { submitMutation: dismissTask } = useDismissTask()
  const { submitMutation: acknowledgeTask } = useAcknowledgeTask()
  const fontScale = PixelRatio.getFontScale()

  const task = useFragment(taskFragment, restProps.task)

  const handlePressTask = () => {
    if (onPress) {
      onPress()
      return
    }

    acknowledgeTask({ variables: { taskID: task.internalID } })
    tappedNotification(ContextModule.actNow, task.actionLink, task.internalID, task.taskType)
    onClearTask()

    navigate(task.actionLink)
  }

  const handleClearTask = async () => {
    dismissTask({ variables: { taskID: task.internalID } })
    tappedClearNotification(ContextModule.actNow, task.actionLink, task.internalID, task.taskType)
    onClearTask()
  }

  const swipeableRef = useRef<SwipeableMethods>(null)

  return (
    <Swipeable
      actionComponent={
        <Text variant="xs" color="white100">
          Clear
        </Text>
      }
      actionComponentWidth={80 * fontScale}
      actionOnPress={handleClearTask}
      actionOnSwipe={handleClearTask}
      enabled={!disableSwipeable}
      ref={swipeableRef}
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
