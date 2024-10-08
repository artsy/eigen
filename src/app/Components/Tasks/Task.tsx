import { Button, Flex, Image, Text } from "@artsy/palette-mobile"
import { Task_task$key } from "__generated__/Task_task.graphql"
import { Swipeable } from "app/Components/Swipeable/Swipeable"
import { navigate } from "app/system/navigation/navigate"
import { graphql, useFragment } from "react-relay"

export const Task: React.FC<{
  task: Task_task$key
  onClearTask: () => void
}> = ({ onClearTask, ...restProps }) => {
  const task = useFragment(taskFragment, restProps.task)

  const handleClearTask = () => {
    onClearTask()
  }

  return (
    <Flex pb={1}>
      <Swipeable
        actionComponent={<Text color="white100">Clear</Text>}
        actionOnPress={handleClearTask}
        actionOnSwipe={handleClearTask}
        actionBackground="red100"
      >
        <Flex backgroundColor="white100" borderRadius={5}>
          <Flex
            p={1}
            ml={2}
            flexDirection="row"
            border="1px solid"
            borderColor="black60"
            borderRadius={5}
            zIndex={3}
            backgroundColor="white100"
          >
            <Flex pr={1}>
              <Image src={task.imageUrl} width={70} height={70} />
            </Flex>

            <Flex flex={1}>
              <Text variant="xs" fontWeight="bold" mb={0.5}>
                {task.title}
              </Text>

              <Text variant="xs" mb={1}>
                {task.message}
              </Text>

              <Button variant="outline" size="small" onPress={() => navigate(task.actionLink)}>
                {task.actionMessage}
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Swipeable>
    </Flex>
  )
}

const taskFragment = graphql`
  fragment Task_task on Task {
    title
    message
    actionLink
    actionMessage
    imageUrl
  }
`
