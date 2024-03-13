import { RouteProp } from "@react-navigation/native"
import React, { cloneElement, ReactElement } from "react"

// TODO: Should this be a stricter type?
type RouteParamsType = Record<string, any>

interface NewNavComponentWrapperProps {
  children: ReactElement
  route: RouteProp<{ [key: string]: RouteParamsType }, string> // Adjust based on your actual route params structure
}

export const NewNavComponentWrapper: React.FC<NewNavComponentWrapperProps> = ({
  children,
  route,
}) => {
  // TODO: Implement useRouteParser
  const routeProps = {} // useRouteParser(route) // Custom hook to parse route params
  return cloneElement(children, routeProps)
}
