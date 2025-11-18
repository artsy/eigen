import {
  nbsp,
  emdash,
  Flex,
  LinkText,
  Text as PaletteText,
  TextProps as PaletteTextProps,
  Color,
} from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"
import { plainTextFromTree } from "app/utils/plainTextFromTree"
import { defaultRules, renderMarkdown } from "app/utils/renderMarkdown"
import { sendEmailWithMailTo } from "app/utils/sendEmail"
import { Schema } from "app/utils/track"
import React, { useState } from "react"
import { LayoutAnimation, Text, TouchableWithoutFeedback } from "react-native"
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
  showReadLessButton?: boolean
  textVariant?: PaletteTextProps["variant"]
  linkTextVariant?: PaletteTextProps["variant"]
  onExpand?: (isExpanded: boolean) => void
}

export const ReadMore = React.memo(
  ({
    content,
    maxChars,
    presentLinksModally,
    color = "mono100",
    trackingFlow,
    contextModule,
    showReadLessButton = false,
    textStyle = "sans",
    testID,
    textVariant = "xs",
    linkTextVariant = "xs",
    onExpand,
  }: Props) => {
    const [isExpanded, setIsExpandedState] = useState(false)
    const setIsExpanded = (expanded: boolean) => {
      setIsExpandedState(expanded)
      onExpand?.(expanded)
    }

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
            <TextComponent {...textProps} color={color} key={state.key}>
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
            if (node?.target?.startsWith("mailto:")) {
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
              color={color || "mono100"}
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
            <TextComponent {...textProps} color={color || "mono100"} key={state.key}>
              {!isExpanded && Number(state.key) > 0 ? ` ${emdash} ` : null}
              {output(node.content, state)}
            </TextComponent>
          )
        },
      },
      em: {
        ...basicRules.em,
        react: (
          node: SimpleMarkdown.SingleASTNode,
          output: SimpleMarkdown.Output<React.ReactNode>,
          state: SimpleMarkdown.State
        ) => {
          return (
            <TextComponent {...textProps} italic color={color || "mono100"} key={state.key}>
              {output(node.content, state)}
            </TextComponent>
          )
        },
      },
      strong: {
        ...basicRules.strong,
        react: (
          node: SimpleMarkdown.SingleASTNode,
          output: SimpleMarkdown.Output<React.ReactNode>,
          state: SimpleMarkdown.State
        ) => {
          return (
            <TextComponent
              {...textProps}
              weight="medium"
              color={color || "mono100"}
              key={state.key}
            >
              {output(node.content, state)}
            </TextComponent>
          )
        },
      },
    }

    // eslint-disable-next-line testing-library/render-result-naming-convention
    const root = renderMarkdown(content, rules)
    // Removes the last empty space in the markdown array
    if (Array.isArray(root)) {
      while (root.length && root[root.length - 1] && root[root.length - 1].type === Text) {
        root.pop()
      }
    }

    const plainTextVersion = plainTextFromTree(root)
    const isAlreadyExpanded = isExpanded || plainTextVersion.length <= maxChars

    const onExpandPress = () => {
      tracking.trackEvent({
        action_name: Schema.ActionNames.ReadMore,
        action_type: Schema.ActionTypes.Tap,
        context_module: contextModule ? contextModule : null,
        flow: trackingFlow ? trackingFlow : null,
      })
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      setIsExpanded(true)
    }

    return isAlreadyExpanded ? (
      <Flex>
        {root}
        {!!showReadLessButton && !!isExpanded && (
          <LinkText
            mt={0.5}
            mb={1}
            accessibilityRole="button"
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

              setIsExpanded(false)
            }}
            variant={linkTextVariant}
            color={color}
          >
            Read Less
          </LinkText>
        )}
      </Flex>
    ) : (
      <TouchableWithoutFeedback
        accessibilityRole="button"
        accessibilityLabel="Read More"
        onPress={onExpandPress}
      >
        <Flex testID={testID}>
          {truncate({
            color,
            linkTextVariant,
            root,
            maxChars,
          })}
        </Flex>
      </TouchableWithoutFeedback>
    )
  }
)

/**
 * In-order traverses the shallowly-rendered markdown returned from SimpleMarkdown's parser
 * keeping track of how many characters have been seen. When it has seen enough, it stops
 * traversing and adds a 'read more' button to the highest text node at that part of the tree.
 */
function truncate({
  color = "mono0",
  root,
  maxChars,
  linkTextVariant,
}: {
  color?: ResponsiveValue<Color>
  linkTextVariant: PaletteTextProps["variant"]
  root: React.ReactNode
  maxChars: number
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
              <LinkText variant={linkTextVariant} color={color}>
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
