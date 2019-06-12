import { Flex, FlexProps } from "@artsy/palette"
import { defaultRules, renderMarkdown } from "lib/utils/renderMarkdown"
import _ from "lodash"
import React from "react"

interface Props {
  rules?: { [key: string]: any }
  children?: string | string[]
}

function stringifyChildren(children: any): string {
  return _.isArray(children) ? children.join("") : children
}

export class Markdown extends React.Component<Props & FlexProps> {
  static defaultProps = {
    rules: defaultRules,
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

    return <Flex {...rest}>{renderMarkdown(stringifyChildren(this.props.children), rules)}</Flex>
  }
}
