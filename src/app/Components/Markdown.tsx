import { Flex, FlexProps } from "@artsy/palette-mobile"
import { defaultRules, renderMarkdown } from "app/utils/renderMarkdown"
import { isArray } from "lodash"
import React from "react"

interface Props {
  rules?: { [key: string]: any }
  children?: string | string[]
}

function stringifyChildren(children: any): string {
  return isArray(children) ? children.join("") : children
}

const basicRules = defaultRules({ modal: true })
export class Markdown extends React.Component<Props & FlexProps> {
  // Be agressive with re-rendering this component
  shouldComponentUpdate(newProps: Props & { children: any }) {
    const rules = this.props.rules ?? basicRules
    const newRules = newProps.rules ?? basicRules

    if (newRules !== rules) {
      return true
    }

    const oldChildrenText = stringifyChildren(this.props.children)
    const newChildrenText = stringifyChildren(newProps.children)

    return oldChildrenText !== newChildrenText
  }

  render() {
    const { rules: rulesProp, ...rest } = this.props
    const rules = rulesProp ?? basicRules

    return <Flex {...rest}>{renderMarkdown(stringifyChildren(this.props.children), rules)}</Flex>
  }
}
