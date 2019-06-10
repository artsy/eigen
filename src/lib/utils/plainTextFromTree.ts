import React from "react"

export function plainTextFromTree(root: React.ReactNode): string | any {
  function traverse(node: React.ReactNode, currentProgress: string): string {
    if (typeof node === "string") {
      return node
    }

    if (Array.isArray(node)) {
      let result = ""
      for (const child of node) {
        result += traverse(child, currentProgress)
      }
      return result
    }

    if (React.isValidElement(node)) {
      const children = React.Children.toArray((node.props as any).children)
      return traverse(children, currentProgress)
    }
  }

  return traverse(root, "")
}
