import { Flex, Join, Pill, Screen, Separator, Spacer, Text } from "@artsy/palette-mobile"
import { Markdown } from "app/Components/Markdown"
import { MarkdownReadMore } from "app/Components/MarkdownText/MarkdownReadMore"
import { MarkdownText } from "app/Components/MarkdownText/MarkdownText"
import { LegacyReadMore } from "app/Components/ReadMore"
import { goBack } from "app/system/navigation/navigate"
import { defaultRules, renderMarkdown } from "app/utils/renderMarkdown"
import React, { Component, useState } from "react"
import { Platform, ScrollView } from "react-native"
import { blockRegex } from "simple-markdown"

/**
 * Dev-menu-only screen comparing the legacy simple-markdown rendering ("Before") with
 * react-native-enriched-markdown ("After") for every call site gated by `AREnableEnrichedMarkdown`.
 *
 * Both sides render regardless of the flag. The legacy rule sets below mirror the ones used at each
 * call site (they can't be imported from Scenes) — keep them in sync while the spike is running.
 */

const EXAMPLES: { name: string; markdown: string }[] = [
  {
    name: "Paragraphs",
    markdown:
      "First paragraph with a soft\nline break in the middle.\n\nSecond paragraph after a blank line.\n\nThird paragraph.",
  },
  {
    name: "Emphasis",
    markdown:
      "Some **bold text**, some _italic text_, some ***bold italic*** and ~~strikethrough~~.\n\nInline `code` too.",
  },
  {
    name: "Links",
    markdown:
      "An [Artsy link](https://www.artsy.net/artist/banksy), a relative [route](/auctions), an external [site](https://example.com) and an email [support@artsy.net](mailto:support@artsy.net).\n\nBare URL: https://www.artsy.net",
  },
  {
    name: "Lists",
    markdown:
      "Unordered:\n\n- First item\n- Second item with **bold**\n- Third item with a [link](https://www.artsy.net)\n\nOrdered:\n\n1. One\n2. Two\n3. Three",
  },
  {
    name: "Headings",
    markdown: "# Heading 1\n\n## Heading 2\n\n### Heading 3\n\nBody text under the headings.",
  },
  {
    name: "Quote & rule",
    markdown:
      "> A blockquote that spans\n> a couple of lines.\n\n---\n\nText after a horizontal rule.",
  },
  {
    name: "Image",
    markdown:
      "Text before an image.\n\n![Alt text](https://files.artsy.net/images/og_image.jpeg)\n\nText after.",
  },
  {
    name: "Sale info",
    markdown:
      "**Conditions of Sale**\n\nBy placing a bid you agree to the [Conditions of Sale](https://www.artsy.net/conditions-of-sale).\n\n**Buyer's Premium**\n\n- 25% up to $500,000\n- 20% above $500,000\n\nFor questions email [specialist@artsy.net](mailto:specialist@artsy.net).",
  },
  {
    name: "Opening hours",
    markdown:
      "**Tuesday – Saturday** 10am – 6pm\n**Sunday** 12pm – 5pm\nClosed Mondays and public holidays.",
  },
  {
    name: "Long text",
    markdown:
      "Born in 1960 in Brooklyn, **Jean-Michel Basquiat** rose to prominence in the late 1970s as part of the graffiti duo SAMO, before moving into the neo-expressionist painting that defined his career. His work draws on a wide range of sources — _comics, anatomy textbooks, jazz, and African diasporic history_ — layered into dense compositions of text and image.\n\nHe collaborated with [Andy Warhol](https://www.artsy.net/artist/andy-warhol) in the mid-1980s and exhibited widely in the United States and Europe. Today his paintings are held in major museum collections and regularly set auction records.\n\nRead more on [Artsy](https://www.artsy.net/artist/jean-michel-basquiat).",
  },
]

// Legacy rule sets, mirrored from each call site

const NEW_TEXT_STYLES_RULES = defaultRules({ useNewTextStyles: true })
const MODAL_RULES = defaultRules({
  ruleOverrides: {
    paragraph: {
      match: blockRegex(/^((?:[^\n]|\n(?! *\n))+)(?:\n *)/),
      react: (node, output, state) => (
        <Text variant="sm" color="mono60" key={state.key}>
          {output(node.content, state)}
        </Text>
      ),
    },
  },
})

const REGISTRATION_RESULT_RULES = defaultRules({
  modal: true,
  ruleOverrides: {
    paragraph: {
      match: blockRegex(/^((?:[^\n]|\n(?! *\n))+)(?:\n *)/),
      react: (node, output, state) => (
        <Text variant="sm-display" key={state.key} textAlign="center">
          {output(node.content, state)}
        </Text>
      ),
    },
  },
})

const featuredCollectionsRules = (titleLength: number) =>
  defaultRules({
    modal: true,
    ruleOverrides: {
      paragraph: {
        react: (node, output, state) => (
          <Text
            variant="sm"
            color="mono100"
            key={state.key}
            numberOfLines={titleLength > 32 ? 3 : 4}
          >
            {output(node.content, state)}
          </Text>
        ),
      },
    },
  })

const FEATURE_RULES = defaultRules({
  modal: false,
  ruleOverrides: {
    paragraph: {
      match: blockRegex(/^((?:[^\n]|\n(?! *\n))+)(?:\n *)/),
      react: (node, output, state) => (
        <Text variant="sm" key={state.key}>
          {output(node.content, state)}
        </Text>
      ),
    },
    em: {
      react: (node, output, state) => (
        <Text variant="sm" italic key={state.key}>
          {output(node.content, state)}
        </Text>
      ),
    },
    strong: {
      react: (node, output, state) => (
        <Text variant="sm" weight="medium" key={state.key}>
          {output(node.content, state)}
        </Text>
      ),
    },
  },
})

interface CallSite {
  name: string
  before: (markdown: string) => React.ReactNode
  after: (markdown: string) => React.ReactNode
}

const CALL_SITES: CallSite[] = [
  {
    name: "SaleInfo",
    before: (md) => <Markdown rules={NEW_TEXT_STYLES_RULES}>{md}</Markdown>,
    after: (md) => <MarkdownText markdown={md} />,
  },
  {
    name: "FairMoreInfo",
    before: (md) => <Markdown rules={NEW_TEXT_STYLES_RULES}>{md}</Markdown>,
    after: (md) => <MarkdownText markdown={md} />,
  },
  {
    name: "ShowLocationHours",
    before: (md) => <Markdown rules={NEW_TEXT_STYLES_RULES}>{md}</Markdown>,
    after: (md) => <MarkdownText markdown={md} />,
  },
  {
    name: "BidResult",
    before: (md) => <Markdown>{md}</Markdown>,
    after: (md) => (
      <MarkdownText markdown={md} color="mono60" textAlign="center" presentLinksModally />
    ),
  },
  {
    name: "RegistrationResult",
    before: (md) => <Markdown rules={REGISTRATION_RESULT_RULES}>{md}</Markdown>,
    after: (md) => (
      <MarkdownText markdown={md} variant="sm-display" textAlign="center" presentLinksModally />
    ),
  },
  {
    name: "Modal",
    before: (md) => <Markdown rules={MODAL_RULES}>{md}</Markdown>,
    after: (md) => <MarkdownText markdown={md} color="mono60" />,
  },
  {
    name: "FeatureMarkdown",
    before: (md) => <>{renderMarkdown(md, FEATURE_RULES)}</>,
    after: (md) => <MarkdownText markdown={md} />,
  },
  {
    name: "FeaturedCollectionsRail (short title → 4 lines)",
    before: (md) => <>{renderMarkdown(md, featuredCollectionsRules(10))}</>,
    after: (md) => (
      <MarkdownText markdown={md} color="mono100" numberOfLines={4} presentLinksModally />
    ),
  },
  {
    name: "ReadMore (maxChars 200)",
    before: (md) => <LegacyReadMore content={md} maxChars={200} showReadLessButton />,
    after: (md) => <MarkdownReadMore content={md} maxChars={200} showReadLessButton />,
  },
]

class RenderErrorBoundary extends Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <Text variant="xs" color="red100">
          Render error: {this.state.error.message}
        </Text>
      )
    }
    return this.props.children
  }
}

const Comparison: React.FC<{ callSite: CallSite; markdown: string }> = ({ callSite, markdown }) => {
  return (
    <Flex>
      <Text variant="sm-display" weight="medium" mb={1}>
        {callSite.name}
      </Text>

      <Text variant="xs" color="mono60" mb={0.5}>
        BEFORE · simple-markdown
      </Text>
      <Flex borderWidth={1} borderColor="mono10" p={1}>
        <RenderErrorBoundary key={markdown}>{callSite.before(markdown)}</RenderErrorBoundary>
      </Flex>

      <Spacer y={1} />

      <Text variant="xs" color="blue100" mb={0.5}>
        AFTER · enriched-markdown
      </Text>
      <Flex borderWidth={1} borderColor="blue10" p={1}>
        <RenderErrorBoundary key={markdown}>{callSite.after(markdown)}</RenderErrorBoundary>
      </Flex>
    </Flex>
  )
}

export const MarkdownPlayground: React.FC = () => {
  const [selectedExample, setSelectedExample] = useState(EXAMPLES[0])

  return (
    <Screen>
      <Screen.Header title="Markdown Playground" onBack={goBack} />
      <Screen.Body fullwidth>
        <Flex>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
          >
            <Join separator={<Spacer x={1} />}>
              {EXAMPLES.map((example) => (
                <Pill
                  key={example.name}
                  selected={example.name === selectedExample.name}
                  onPress={() => setSelectedExample(example)}
                >
                  {example.name}
                </Pill>
              ))}
            </Join>
          </ScrollView>
        </Flex>

        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
          <Text variant="xs" color="mono60" mb={0.5}>
            SOURCE
          </Text>
          <Flex bg="mono5" p={1} mb={4}>
            <Text variant="xs" fontFamily={Platform.select({ ios: "Menlo", default: "monospace" })}>
              {selectedExample.markdown}
            </Text>
          </Flex>

          <Join separator={<Separator my={4} />}>
            {CALL_SITES.map((callSite) => (
              <Comparison
                key={callSite.name}
                callSite={callSite}
                markdown={selectedExample.markdown}
              />
            ))}
          </Join>
        </ScrollView>
      </Screen.Body>
    </Screen>
  )
}
