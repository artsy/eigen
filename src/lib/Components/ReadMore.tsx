import { Flex, Sans, Serif } from "@artsy/palette"
import { defaultRules, renderMarkdown } from "lib/utils/renderMarkdown"
import _ from "lodash"
import React, { useState } from "react"
import { Text } from "react-native"
import { LinkText } from "./Text/LinkText"

interface Props {
  source: string
  maxChars: number
}

const rules = {
  ...defaultRules,
  paragraph: {
    ...defaultRules.paragraph,
    react: (node, output, state) => {
      return (
        <Serif size="3t" color="black60" key={state.key}>
          {output(node.content, state)}
        </Serif>
      )
    },
  },
}

export const ReadMore = React.memo(({ source, maxChars }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const root = renderMarkdown(source, rules)
  return isExpanded ? (
    root
  ) : (
    <Flex>
      <Text>{truncate({ root, maxChars, onExpand: () => setIsExpanded(true) })}</Text>
    </Flex>
  )
})

/**
 * In-order traverses the shallowly-rendered markdown returned from SimpleMarkdown's parser
 * keeping track of how many characters have been seen. When it has seen enough, it stops
 * traversing and adds a 'read more' button to the highest text node at that part of the tree.
 */
function truncate({
  root,
  maxChars,
  onExpand,
}: {
  root: React.ReactNode
  maxChars: number
  onExpand(): void
}): [React.ReactNode, number] {
  // keep track of how many characters we have seen
  let offset = 0
  // keep track of how many text nodes deep we are
  let textDepth = 0

  function traverse(node: React.ReactNode) {
    if (offset === maxChars) {
      return null
    }

    if (typeof node === "string") {
      let text = node
      if (node.length > maxChars - offset) {
        text = node.slice(0, maxChars - offset) as string
      }

      offset += text.length

      return text
    }

    if (Array.isArray(node)) {
      const result = []
      for (const child of node) {
        const truncated = traverse(child)
        if (truncated) {
          result.push(truncated)
        }
        if (offset === maxChars) {
          return result
        }
      }
      return result
    }

    if (React.isValidElement(node)) {
      // TODO: find a way to make the rendering extensible while allowing textDepth to be tracked.
      // Right now we assume that only these two Text nodes will be used.
      if (node.type === Sans || node.type === Serif) {
        textDepth += 1
      }
      const children = React.Children.toArray((node.props as any).children)
      const truncatedChildren = traverse(children)

      if (node.type === Sans || node.type === Serif) {
        if (textDepth === 1 && maxChars === offset) {
          truncatedChildren.push([
            "... ",
            <LinkText onPress={onExpand}>
              <Sans size="3" weight="medium">
                Read more
              </Sans>
            </LinkText>,
          ])
        }
        textDepth -= 1
      }

      return React.cloneElement(node, null, truncatedChildren)
    }
  }

  return traverse(root)
}
