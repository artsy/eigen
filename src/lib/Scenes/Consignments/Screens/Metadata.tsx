import React from "react"

import {
  Keyboard,
  LayoutAnimation,
  Picker,
  Route,
  ScrollView,
  TouchableWithoutFeedback,
  View,
  ViewProperties,
} from "react-native"
import NavigatorIOS from "react-native-navigator-ios"

import { artworkMediumCategories } from "lib/utils/artworkMediumCategories"
import { Serif, Theme } from "palette"
import { ConsignmentMetadata } from "../"
import { BottomAlignedButton } from "../Components/BottomAlignedButton"
import { Row } from "../Components/FormElements"
import Text from "../Components/TextInput"
import Toggle from "../Components/Toggle"

interface Props extends ViewProperties {
  navigator: NavigatorIOS
  route: Route // this gets set by NavigatorIOS
  updateWithMetadata?: (result: ConsignmentMetadata) => void
  metadata: ConsignmentMetadata
}

interface State extends ConsignmentMetadata {
  showPicker?: boolean
}

// TODO: write a blog post about the refs

// This is the interface for what a component looks like when it's been set via `ref`.
// We do this so that pressing return can loop through text inputs and move on to the
// next empty one.
interface LiveStyledTextInput {
  /** The object which styled components wraps */
  root?: {
    /** A focus function for the text input */
    focus?: () => void
    props?: {
      /** The text value */
      value?: string
    }
  }
}

export default class Metadata extends React.Component<Props, State> {
  // @ts-ignore STRICTNESS_MIGRATION
  private yearInput: LiveStyledTextInput
  // @ts-ignore STRICTNESS_MIGRATION
  private mediumInput: LiveStyledTextInput
  // @ts-ignore STRICTNESS_MIGRATION
  private widthInput: LiveStyledTextInput
  // @ts-ignore STRICTNESS_MIGRATION
  private heightInput: LiveStyledTextInput
  // @ts-ignore STRICTNESS_MIGRATION
  private depthInput: LiveStyledTextInput

  // @ts-ignore STRICTNESS_MIGRATION
  constructor(props) {
    super(props)
    this.state = props.metadata || {}
  }

  doneTapped = () => {
    // @ts-ignore STRICTNESS_MIGRATION
    this.props.updateWithMetadata(this.state)
    this.props.navigator.pop()
  }

  updateUnit = () => this.setState({ unit: this.state.unit === "CM" ? "IN" : "CM" })
  // @ts-ignore STRICTNESS_MIGRATION
  updateTitle = (title) => this.setState({ title })
  // @ts-ignore STRICTNESS_MIGRATION
  updateYear = (year) => this.setState({ year })
  // @ts-ignore STRICTNESS_MIGRATION
  updateMedium = (medium) => this.setState({ medium })
  // @ts-ignore STRICTNESS_MIGRATION
  updateWidth = (width) => this.setState({ width })
  // @ts-ignore STRICTNESS_MIGRATION
  updateHeight = (height) => this.setState({ height })
  // @ts-ignore STRICTNESS_MIGRATION
  updateDepth = (depth) => this.setState({ depth })

  // @ts-ignore STRICTNESS_MIGRATION
  animateStateChange = (newState) => {
    const animate = LayoutAnimation.easeInEaseOut as any
    animate()
    this.setState(newState)
  }

  showCategorySelection = () => {
    Keyboard.dismiss()

    const category = this.state.category || artworkMediumCategories[0].value
    const categoryName = this.state.categoryName || artworkMediumCategories[0].label
    this.animateStateChange({ showPicker: true, categoryName, category })
  }

  hideCategorySelection = () => this.animateStateChange({ showPicker: false })
  // @ts-ignore STRICTNESS_MIGRATION
  changeCategoryValue = (_value, index) => {
    this.setState({
      categoryName: artworkMediumCategories[index].label,
      category: artworkMediumCategories[index].value,
    })
  }

  selectNextInput = () => {
    const inputs = [this.yearInput, this.mediumInput, this.widthInput, this.heightInput, this.depthInput]
    for (const input of inputs) {
      // @ts-ignore STRICTNESS_MIGRATION
      if (input && input.root && input.root.focus && !input.root.props.value) {
        return input.root.focus()
      }
    }
  }

  render() {
    return (
      <Theme>
        <View style={{ flex: 1 }}>
          <BottomAlignedButton onPress={this.doneTapped} buttonText="Done">
            <ScrollView keyboardShouldPersistTaps="handled" centerContent style={{ flex: 1 }}>
              <View style={{ padding: 10 }}>
                <Row>
                  <Text
                    testID="consigments-metatdata-title"
                    text={{
                      placeholder: "Title",
                      onFocus: this.hideCategorySelection,
                      onChangeText: this.updateTitle,
                      // @ts-ignore STRICTNESS_MIGRATION
                      value: this.state.title,
                      onSubmitEditing: this.selectNextInput,
                      returnKeyType: "next",
                      autoFocus: this.state.title
                        ? false
                        : typeof jest === "undefined" /* TODO: https://github.com/facebook/jest/issues/3707 */,
                    }}
                    style={{ margin: 10 }}
                  />
                </Row>

                <Row>
                  <Text
                    text={{
                      placeholder: "Year",
                      onChangeText: this.updateYear,
                      // @ts-ignore STRICTNESS_MIGRATION
                      value: this.state.year,
                      onFocus: this.hideCategorySelection,
                      onSubmitEditing: this.selectNextInput,
                      ref: (component) => (this.yearInput = component),
                      returnKeyType: "next",
                    }}
                    style={{ margin: 10 }}
                  />
                </Row>

                <Row>
                  <Text
                    text={{
                      placeholder: "Medium",
                      onChangeText: this.updateMedium,
                      // @ts-ignore STRICTNESS_MIGRATION
                      value: this.state.medium,
                      onFocus: this.hideCategorySelection,
                      onSubmitEditing: this.selectNextInput,
                      ref: (component) => (this.mediumInput = component),
                      returnKeyType: "next",
                    }}
                    style={{ margin: 10 }}
                  />
                </Row>

                <Row>
                  <Text
                    text={{
                      keyboardType: "numeric",
                      placeholder: "Width",
                      onChangeText: this.updateWidth,
                      // @ts-ignore STRICTNESS_MIGRATION
                      value: this.state.width,
                      onFocus: this.hideCategorySelection,
                      onSubmitEditing: this.selectNextInput,
                      ref: (component) => (this.widthInput = component),
                      returnKeyType: "next",
                    }}
                    style={{ margin: 10 }}
                  />
                  <Text
                    text={{
                      keyboardType: "numeric",
                      placeholder: "Height",
                      onChangeText: this.updateHeight,
                      // @ts-ignore STRICTNESS_MIGRATION
                      value: this.state.height,
                      onFocus: this.hideCategorySelection,
                      onSubmitEditing: this.selectNextInput,
                      ref: (component) => (this.heightInput = component),
                      returnKeyType: "next",
                    }}
                    style={{ margin: 10 }}
                  />
                </Row>

                <Row>
                  <Text
                    text={{
                      keyboardType: "numeric",
                      placeholder: "Depth",
                      onChangeText: this.updateDepth,
                      onFocus: this.hideCategorySelection,
                      onSubmitEditing: this.selectNextInput,
                      value: this.state.depth ? this.state.depth.toString() : "",
                      returnKeyType: "next",
                    }}
                    style={{ margin: 10 }}
                  />
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      margin: 10,
                      justifyContent: "space-between",
                    }}
                  >
                    <Serif size="4">Units</Serif>
                    <Toggle selected={this.state.unit === "CM"} left="cm" right="in" onPress={this.updateUnit} />
                  </View>
                </Row>
                <TouchableWithoutFeedback onPress={this.showCategorySelection}>
                  <Row>
                    <Text
                      text={{
                        placeholder: "Category",
                        // @ts-ignore STRICTNESS_MIGRATION
                        value: this.state.categoryName,
                      }}
                      readonly={true}
                      style={{ margin: 10 }}
                    />
                  </Row>
                </TouchableWithoutFeedback>
              </View>
            </ScrollView>
          </BottomAlignedButton>
          {this.state.showPicker ? (
            <Picker
              style={{ height: 220, backgroundColor: "white" }}
              key="picker"
              selectedValue={this.state.category}
              onValueChange={this.changeCategoryValue}
            >
              {artworkMediumCategories.map((category) => (
                <Picker.Item color="black" label={category.label} value={category.value} key={category.value} />
              ))}
            </Picker>
          ) : null}
        </View>
      </Theme>
    )
  }
}
