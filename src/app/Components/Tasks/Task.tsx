import { Flex, Image, Text, Touchable } from "@artsy/palette-mobile"
import { Task_task$key } from "__generated__/Task_task.graphql"
import { Swipeable } from "app/Components/Swipeable/Swipeable"
import { navigate } from "app/system/navigation/navigate"
import { useDismissTask } from "app/utils/mutations/useDismissTask"
import { graphql, useFragment } from "react-relay"

const TASK_IMAGE_SIZE = 60

export const Task: React.FC<{
  disableSwipeable?: boolean
  onClearTask: () => void
  task: Task_task$key
}> = ({ disableSwipeable, onClearTask, ...restProps }) => {
  const { submitMutation: dismissTask } = useDismissTask()

  const task = useFragment(taskFragment, restProps.task)

  const handlePressTask = () => {
    // TODO: Add tracking
    // TODO: Resolve task (call mutation)

    onClearTask()

    navigate(task.actionLink)
  }

  const handleClearTask = async () => {
    // TODO: Add tracking

    dismissTask({ variables: { taskID: task.internalID } })

    onClearTask()
  }

  return (
    <Swipeable
      actionComponent={<Text color="white100">Clear</Text>}
      actionOnPress={handleClearTask}
      actionOnSwipe={handleClearTask}
      actionBackground="red100"
      enabled={!disableSwipeable}
    >
      <Flex backgroundColor="white100" borderRadius={5}>
        <Touchable onPress={handlePressTask}>
          <Flex
            p={1}
            ml={2}
            flexDirection="row"
            border="1px solid"
            borderColor="black60"
            borderRadius={5}
            zIndex={3}
            backgroundColor="black100"
          >
            <Flex pr={1}>
              <Image src={task.imageUrl} width={TASK_IMAGE_SIZE} height={TASK_IMAGE_SIZE} />
            </Flex>

            <Flex flex={1}>
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
  }
`
