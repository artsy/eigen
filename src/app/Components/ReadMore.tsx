import { navigate } from "app/system/navigation/navigate"
import { plainTextFromTree } from "app/utils/plainTextFromTree"
import { defaultRules, renderMarkdown } from "app/utils/renderMarkdown"
import { sendEmailWithMailTo } from "app/utils/sendEmail"
import { Schema } from "app/utils/track"
import _ from "lodash"
import {
  Color,
  emdash,
  Flex,
  LinkText,
  nbsp,
  Text as PaletteText,
  TextProps as PaletteTextProps,
} from "palette"
import React, { useState } from "react"
import { Text } from "react-native"
import { useTracking } from "react-tracking"
import { ResponsiveValue } from "styled-system"

interface Props {
  content: string
  maxChars: number
  presentLinksModally?: boolean
  contextModule?: string
  trackingFlow?: string
  color?: ResponsiveValue<Color>
  textStyle?: "sans" | "new"
  testID?: string
  textVariant?: PaletteTextProps["variant"]
  linkTextVariant?: PaletteTextProps["variant"]
}

export const ReadMore = React.memo(
  ({
    content,
    maxChars,
    presentLinksModally,
    color,
    trackingFlow,
    contextModule,
    textStyle = "sans",
    testID,
    textVariant = "xs",
    linkTextVariant = "xs",
  }: Props) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const tracking = useTracking()
    const useNewTextStyles = textStyle === "new"
    const basicRules = defaultRules({ modal: presentLinksModally, useNewTextStyles })
    const TextComponent: React.ComponentType<PaletteTextProps> = PaletteText
    const textProps: PaletteTextProps = { variant: textVariant }
    const rules = {
      ...basicRules,
      list: {
        ...basicRules.paragraph,
        react: (
          node: SimpleMarkdown.SingleASTNode,
          output: SimpleMarkdown.Output<React.ReactNode>,
          state: SimpleMarkdown.State
        ) => {
          return (
            <TextComponent {...textProps} color={color || "black100"} key={state.key}>
              {!isExpanded && Number(state.key) > 0 ? ` ${emdash} ` : null}
              {output(node.content, state)}
            </TextComponent>
          )
        },
      },
      link: {
        ...basicRules.link,
        react: (
          node: SimpleMarkdown.SingleASTNode,
          output: SimpleMarkdown.Output<React.ReactNode>,
          state: SimpleMarkdown.State
        ) => {
          state.withinText = true
          const openUrl = (url: string) => {
            if (node.target.startsWith("mailto:")) {
              sendEmailWithMailTo(url)
            } else if (presentLinksModally) {
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
              variant={linkTextVariant}
            >
              {output(node.content, state)}
            </LinkText>
          )
        },
      },
      paragraph: {
        ...basicRules.paragraph,
        react: (
          node: SimpleMarkdown.SingleASTNode,
          output: SimpleMarkdown.Output<React.ReactNode>,
          state: SimpleMarkdown.State
        ) => {
          return (
            <TextComponent {...textProps} color={color || "black100"} key={state.key}>
              {!isExpanded && Number(state.key) > 0 ? ` ${emdash} ` : null}
              {output(node.content, state)}
            </TextComponent>
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
      <Flex testID={testID}>
        {truncate({
          linkTextVariant,
          root,
          maxChars,
          onExpand: () => {
            tracking.trackEvent({
              action_name: Schema.ActionNames.ReadMore,
              action_type: Schema.ActionTypes.Tap,
              context_module: contextModule ? contextModule : null,
              flow: trackingFlow ? trackingFlow : null,
            })
            setIsExpanded(true)
          },
        })}
      </Flex>
    )
  }
)

/**
 * In-order traverses the shallowly-rendered markdown returned from SimpleMarkdown's parser
 * keeping track of how many characters have been seen. When it has seen enough, it stops
 * traversing and adds a 'read more' button to the highest text node at that part of the tree.
 */
function truncate({
  root,
  maxChars,
  onExpand,
  linkTextVariant,
}: {
  linkTextVariant: PaletteTextProps["variant"]
  root: React.ReactNode
  maxChars: number
  onExpand(): void
}): React.ReactNode {
  // keep track of how many characters we have seen
  let offset = 0
  // keep track of how many text nodes deep we are
  let textDepth = 0

  function traverse(node: React.ReactNode): React.ReactNode {
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
      // Right now we assume that only PaletteText will be used.
      if (node.type === PaletteText) {
        textDepth += 1
      }
      const children = React.Children.toArray((node.props as any).children)
      const truncatedChildren = traverse(children) as React.ReactNode[]

      if (node.type === PaletteText) {
        if (textDepth === 1 && maxChars === offset) {
          truncatedChildren.push(
            <>
              {"... "}
              <LinkText onPress={onExpand} variant={linkTextVariant}>
                {`Read${nbsp}more`}
              </LinkText>
            </>
          )
        }
        textDepth -= 1
      }

      return React.cloneElement(node, {}, ...truncatedChildren)
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
