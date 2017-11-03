import * as React from "react"
import { createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"

import { Animated, Easing, ScrollView, StyleSheet, View, ViewProperties, ViewStyle } from "react-native"

import Separator from "../../../../../Components/Separator"
import SectionTitle from "./SectionTitle"

class FairsRail extends React.Component<RelayProps, any> {}

interface RelayProps {
  fairs_module: {
    results: Array<{
      id: string
      name: string
    } | null> | null
  }
}
