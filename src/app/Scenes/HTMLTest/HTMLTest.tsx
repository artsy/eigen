import { Box, LinkText, Screen, Text } from "@artsy/palette-mobile"
import { HTML } from "app/Components/HTML"
// eslint-disable-next-line no-restricted-imports
import { goBack, navigate } from "app/system/navigation/navigate"

const CREDIT = {
  repo: "cbracco/html5-test-page",
  url: "https://github.com/cbracco/html5-test-page",
}

export const HTMLTest: React.FC = () => {
  return (
    <Screen>
      <Screen.AnimatedHeader title="HTML Test" onBack={goBack} />
      <Screen.Body>
        <Screen.ScrollView>
          <Text variant="lg">HTML Test Screen</Text>

          <Text variant="xs" mt={1} color="mono60">
            This screen provides a kitchen sink test of the HTML component used throughout the app.
          </Text>

          <Text variant="xs" mt={1} color="mono60">
            Adapted from{" "}
            <LinkText variant="xs" accessibilityRole="link" onPress={() => navigate(CREDIT.url)}>
              {CREDIT.repo}
            </LinkText>
          </Text>

          <Section title="Headings" html={headings} />
          <Section title="Paragraphs" html={paragraphs} />
          <Section title="Blockquote" html={blockquote} />
        </Screen.ScrollView>
      </Screen.Body>
    </Screen>
  )
}

interface SectionProps {
  title: string
  html: string
}

const Section: React.FC<SectionProps> = ({ title, html }) => {
  return (
    <Box my={2} borderTopWidth={1} borderTopColor="mono10" pt={2}>
      <Text variant="xl" color="brand" pb={1}>
        {title}
      </Text>

      <HTML html={html} />
    </Box>
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

const paragraphs = `
<p>These paragraphs are rendered via plain &lt;p&gt; tags.</p>
<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Non labore optio natus quas accusamus facilis id quae. Ducimus ullam quibusdam qui impedit at maxime illum est? Ipsa incidunt nihil cumque.</p>
<p>Ab tenetur, labore, dolore molestias vitae similique doloremque porro sed officiis, nihil fugit? Id soluta unde odit minima? Esse laudantium est quas!</p>
`

const blockquote = `
<blockquote>
  <p>A block quotation (also known as a long quotation or extract) is a quotation in a written document, that is set off from the main text as a paragraph, or block of text.</p>
  <p>It is typically distinguished visually using indentation and a different typeface or smaller size quotation. It may or may not include a citation, usually placed at the bottom.</p>
  <cite>—Example citation</cite>
</blockquote>
`
