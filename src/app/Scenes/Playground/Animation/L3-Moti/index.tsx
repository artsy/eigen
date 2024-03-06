import { Button, Flex } from "@artsy/palette-mobile"
import { MotiView } from "moti"
import { useState } from "react"
import { StyleSheet } from "react-native"

export const L3Moti: React.FC<{}> = () => {
  const [visible, setVisible] = useState(true)
  const [scale, setScale] = useState(1)

  return (
    <Flex alignItems="center" pt={2}>
      <MotiView animate={{ opacity: visible ? 1 : 0 }} style={styles.shape1} />

      <MotiView
        animate={{
          scale: scale === 1 ? 1 : 2,
          translateX: 0,
        }}
        style={styles.shape2}
      />

      <Button onPress={() => setVisible((prev) => !prev)} mt={2}>
        Tap me 1
      </Button>

      <Button onPress={() => setScale((prev) => (prev === 1 ? 2 : 1))} mt={2}>
        Tap me 2
      </Button>
    </Flex>
  )
}

const styles = StyleSheet.create({
  shape1: {
    justifyContent: "center",
    height: 100,
    width: 100,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: "violet",
  },
  shape2: {
    justifyContent: "center",
    height: 100,
    width: 100,
    marginVertical: 100,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: "violet",
  },
  container: {
    flexDirection: "row",
  },
})
