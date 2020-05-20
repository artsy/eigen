import { Flex, FlexProps } from "@artsy/palette"
import { defaultRules, renderMarkdown } from "lib/utils/renderMarkdown"
import _ from "lodash"
import React from "react"

interface Props {
  rules?: { [key: string]: any }
  children?: string | string[]
}

export function stringifyChildren(children: any): string {
  return _.isArray(children) ? children.join("") : children
}

const basicRules = defaultRules(true)
export class Markdown extends React.Component<Props & FlexProps> {
  static defaultProps = {
    rules: basicRules,
  }

  // Be agressive with re-rendering this component
  shouldComponentUpdate(newProps: Props & { children: any }) {
    if (newProps.rules !== this.props.rules) {
      return true
    }

    const oldChildrenText = stringifyChildren(this.props.children)
    const newChildrenText = stringifyChildren(newProps.children)

    return oldChildrenText !== newChildrenText
  }

  render() {
    const { rules, ...rest } = this.props
    const children = stringifyChildren(this.props.children)

    if (rules?.truncationLimit) {
      // an end limit of undefined on the slice method will return the full string
      const truncationLimit: number | undefined =
        children.length <= rules.truncationLimit ? undefined : rules.truncationLimit
      const ellipsis: string = !truncationLimit ? "" : "..."

      return <Flex {...rest}>{renderMarkdown(children.slice(0, truncationLimit) + ellipsis, rules)}</Flex>
    }

    return <Flex {...rest}>{renderMarkdown(children, rules)}</Flex>
  }
}
