import { LinkText, Separator, Text, TextProps } from "@artsy/palette-mobile"
import { ThemeAwareClassTheme } from "app/Components/DarkModeClassTheme"
import { navigate } from "app/system/navigation/navigate"
import { decode } from "html-entities"
import { map } from "lodash"
import { Text as RNText, View } from "react-native"
import SimpleMarkdown, { ParserRule, ParserRules, ReactNodeOutput } from "simple-markdown"
import { sendEmailWithMailTo } from "./sendEmail"

interface OurReactRule extends Partial<ParserRule> {
  // simpler typings here, for better intellisense
  react?: ReactNodeOutput
}

export type MarkdownRules = Partial<{ [k in keyof SimpleMarkdown.DefaultRules]: OurReactRule }>

// just to get better intellisense when creating the rules
function createReactRules(rules: MarkdownRules): ParserRules {
  const result: any = {}
  for (const key of Object.keys(SimpleMarkdown.defaultRules)) {
    if (rules[key]) {
      result[key] = {
        ...SimpleMarkdown.defaultRules[key],
        ...rules[key],
      }
    } else {
      result[key] = SimpleMarkdown.defaultRules[key]
    }
  }
  return result
}

// Rules for rendering parsed markdown. Currently only handles links and text. Add rules similar to
// https://github.com/CharlesMangwa/react-native-simple-markdown/blob/next/src/rules.js for new functionalities.
//
// Default rules: https://github.com/Khan/simple-markdown/blob/f1a75785703832bbff146d0b98e76cd7ac74b8e8/simple-markdown.js#L806
export function defaultRules({
  modal = false,
  ruleOverrides = {},
  useNewTextStyles = false,
}: {
  modal?: boolean
  ruleOverrides?: MarkdownRules
  useNewTextStyles?: boolean
}): ParserRules {
  return createReactRules({
    link: {
      react: (node, output, state) => {
        state.withinText = true
        const openUrl = (url: string) => {
          if (node?.target?.startsWith("mailto:")) {
            sendEmailWithMailTo(url)
          } else if (modal) {
            navigate(url, { modal: true })
          } else {
            navigate(url)
          }
        }

        return (
          <LinkText
            key={state.key}
            testID={`linktext-${state.key}`}
            onPress={() => openUrl(node.target)}
            variant="xs"
          >
            {output(node.content, state)}
          </LinkText>
        )
      },
    },
    text: {
      react: (node) => {
        return decode(node.content)
      },
    },

    paragraph: {
      match: SimpleMarkdown.blockRegex(/^((?:[^\n]|\n(?! *\n))+)(?:\n *)/),
      react: (node, output, state) => {
        return useNewTextStyles ? (
          <Text variant="sm" key={state.key}>
            {output(node.content, state)}
          </Text>
        ) : (
          <Text variant="sm" color="mono60" key={state.key} textAlign="center">
            {output(node.content, state)}
          </Text>
        )
      },
    },

    strong: {
      react: (node, output, state) => {
        return (
          <Text variant="sm" weight="medium" key={state.key}>
            {output(node.content, state)}
          </Text>
        )
      },
    },

    em: {
      react: (node, output, state) => {
        return (
          <Text variant="xs" italic key={state.key}>
            {output(node.content, state)}
          </Text>
        )
      },
    },

    br: {
      react: (_node, _output, state) => {
        return <RNText key={state.key} />
      },
    },

    newline: {
      react: (_node, _output, state) => {
        return <RNText key={state.key} />
      },
    },

    list: {
      react: (node, output, state) => {
        const items = map(node.items, (item, i) => {
          let bullet
          if (node.ordered) {
            bullet = <Text variant="sm" key={state.key}>{`${i + 1} . `}</Text>
          } else {
            bullet = (
              <Text variant="sm" key={state.key}>
                -{" "}
              </Text>
            )
          }

          const listItemText = useNewTextStyles ? (
            <Text variant="sm" key={String(state.key) + 1}>
              {output(node.content, state)}
            </Text>
          ) : (
            <Text variant="sm" key={String(state.key) + 1}>
              {output(item, state)}
            </Text>
          )
          return (
            <View key={i} style={{ flexDirection: "row" }}>
              <RNText>
                {bullet} {listItemText}
              </RNText>
            </View>
          )
        })
        return <View>{items}</View>
      },
    },

    codeBlock: {
      react: (node, _output, state) => {
        return (
          <Text variant="sm" key={state.key}>
            {node.content}
          </Text>
        )
      },
    },

    inlineCode: {
      react: (node, _output, state) => {
        return (
          <Text variant="sm" key={state.key}>
            {node.content}
          </Text>
        )
      },
    },

    heading: {
      react: (node, output, state) => {
        const map: Record<number, TextProps["variant"]> = {
          1: "lg",
          2: "lg",
          3: "md",
          4: "md",
        }

        const variant = map[node.level] || "md"
        return (
          <Text mb={1} key={state.key} variant={variant}>
            {output(node.content, state)}
          </Text>
        )
      },
    },
    u: {
      react: (node, output, state) => output(node.content, state),
    },
    del: {
      react: (node, output, state) => output(node.content, state),
    },
    image: {
      react: () => null,
    },
    table: {
      react: () => null,
    },
    tableSeparator: {
      react: () => null,
    },
    blockQuote: {
      react: (node, output, state) => (
        <ThemeAwareClassTheme>
          {({ color, space }) => (
            <View
              style={{
                borderLeftColor: color("mono10"),
                borderLeftWidth: 2,
                paddingLeft: space(1),
              }}
            >
              {output(node.content, state)}
            </View>
          )}
        </ThemeAwareClassTheme>
      ),
    },
    hr: {
      react: () => <Separator mb={2} />,
    },
    ...ruleOverrides,
  })
}

export function renderMarkdown(
  markdown: string,
  rules: any = defaultRules({})
): React.ReactElement {
  const parser = SimpleMarkdown.parserFor(rules)
  const writer = SimpleMarkdown.outputFor<any, any>(rules, "react")

  const ast = parser(markdown, { inline: false })

  return writer(ast)
}
