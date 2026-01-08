import { Screen, Spacer, Text } from "@artsy/palette-mobile"
import { HTML } from "app/Components/HTML"
import { goBack } from "app/system/navigation/navigate"

export const HTMLTest: React.FC = () => {
  return (
    <Screen>
      <Screen.AnimatedHeader title="HTML Test" onBack={goBack} />
      <Screen.Body>
        <Screen.ScrollView>
          <Text variant="lg">HTML Test Screen</Text>

          <Text my={1}>
            This screen provides a kitchen sink test of the HTML component used throughout the app.
          </Text>

          <Text variant="xl" color="brand">
            Headings
          </Text>

          <HTML html={headings} />
        </Screen.ScrollView>
      </Screen.Body>
    </Screen>
  )
}

const headings = `
<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>
<h5>Heading 5</h5>
<h6>Heading 6</h6>
`
