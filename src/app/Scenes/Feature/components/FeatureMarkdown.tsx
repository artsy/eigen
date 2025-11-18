import { Text } from "@artsy/palette-mobile"
import { defaultRules, renderMarkdown } from "app/utils/renderMarkdown"
import SimpleMarkdown from "simple-markdown"

export const FeatureMarkdown: React.FC<{
  content: string
  textProps?: Partial<React.ComponentProps<typeof Text>>
}> = ({ content, textProps }) => {
  // eslint-disable-next-line testing-library/render-result-naming-convention
  const rendered = renderMarkdown(content, {
    ...defaultRules({
      modal: false,
      ruleOverrides: {
        paragraph: {
          match: SimpleMarkdown.blockRegex(/^((?:[^\n]|\n(?! *\n))+)(?:\n *)/),
          react: (node, output, state) => {
            return (
              <Text variant="sm" key={state.key} {...textProps}>
                {output(node.content, state)}
              </Text>
            )
          },
        },
        em: {
          react: (node, output, state) => {
            return (
              <Text variant="sm" italic key={state.key} {...textProps}>
                {output(node.content, state)}
              </Text>
            )
          },
        },
        strong: {
          react: (node, output, state) => {
            return (
              <Text variant="sm" weight="medium" key={state.key} {...textProps}>
                {output(node.content, state)}
              </Text>
            )
          },
        },
      },
    }),
  })

  // remove empty final paragraph
  if (Array.isArray(rendered)) {
    while (
      rendered.length &&
      rendered[rendered.length - 1] &&
      rendered[rendered.length - 1].type === Text
    ) {
      rendered.pop()
    }
  }

  return rendered
}
