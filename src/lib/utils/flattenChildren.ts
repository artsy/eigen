import React from "react"

/**
 * Convert a fragment or nested fragment into an array of elements
 */
export const flattenChildren = (children: React.ReactNode): React.ReactElement[] => {
  const xs = React.Children.toArray(children).filter(React.isValidElement)

  return xs.reduce((acc: React.ReactElement[], child: React.ReactElement) => {
    if (child.type === React.Fragment) {
      return [...acc, ...flattenChildren(child.props.children)]
    }

    return [...acc, child]
  }, [])
}
