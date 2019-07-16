import { Flex, Sans, Serif } from "@artsy/palette"
import { plainTextFromTree } from "lib/utils/plainTextFromTree"
import { defaultRules, renderMarkdown } from "lib/utils/renderMarkdown"
import _ from "lodash"
import React, { useState } from "react"
import { Text } from "react-native"
import { LinkText } from "./Text/LinkText"

interface Props {
  content: string
  maxChars: number
  presentLinksModally?: boolean
}

export const ReadMore = React.memo(({ content, maxChars, presentLinksModally }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const basicRules = defaultRules(presentLinksModally)
  const rules = {
    ...basicRules,
    paragraph: {
      ...basicRules.paragraph,
      react: (node, output, state) => {
        return (
          <Serif size="3t" color="black100" key={state.key}>
            {output(node.content, state)}
          </Serif>
        )
      },
    },
  }
  const root = renderMarkdown(content, rules)
  // Removes the last empty space in the markdown array
  if (Array.isArray(root)) {
    while (root.length && root[root.length - 1] && root[root.length - 1].type === Text) {
      root.pop()
    }
  }

  const plainTextVersion = plainTextFromTree(root)
  const isAlreadyExpanded = isExpanded || plainTextVersion.length <= maxChars

  return isAlreadyExpanded ? (
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
}): React.ReactNode {
  // keep track of how many characters we have seen
  let offset = 0
  // keep track of how many text nodes deep we are
  let textDepth = 0

  function traverse(node: React.ReactNode) {
    if (offset === maxChars) {
      return null
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
          truncatedChildren.push(
            <>
              {"... "}
              <LinkText onPress={onExpand}>
                <Sans size="3" weight="medium">
                  Read&nbsp;more
                </Sans>
              </LinkText>
            </>
          )
        }
        textDepth -= 1
      }

      return React.cloneElement(node, null, ...truncatedChildren)
    }

    if (node === null || typeof node === "boolean" || typeof node === "undefined") {
      return ""
    }

    let text = node.toString()
    if (text.length > maxChars - offset) {
      text = text.slice(0, maxChars - offset) as string
    }

    offset += text.length

    return text
  }

  return traverse(root)
}
