import { defaultRules, renderMarkdown } from "app/utils/renderMarkdown"
import { Sans } from "palette"
import React from "react"
import { Text } from "react-native"
import SimpleMarkdown from "simple-markdown"

export const FeatureMarkdown: React.FC<{
  content: string
  sansProps?: Partial<React.ComponentProps<typeof Sans>>
}> = ({ content, sansProps }) => {
  const rendered = renderMarkdown(content, {
    ...defaultRules({
      modal: false,
      ruleOverrides: {
        paragraph: {
          match: SimpleMarkdown.blockRegex(/^((?:[^\n]|\n(?! *\n))+)(?:\n *)/),
          react: (node, output, state) => {
            return (
              <Sans size="3" key={state.key} {...sansProps}>
                {output(node.content, state)}
              </Sans>
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
