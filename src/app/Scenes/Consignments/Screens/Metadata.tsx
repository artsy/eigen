import React from "react"

import { ConsignmentSubmissionCategoryAggregation } from "__generated__/createConsignmentSubmissionMutation.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import NavigatorIOS from "lib/utils/__legacy_do_not_use__navigator-ios-shim"
import { ScreenDimensionsContext } from "lib/utils/useScreenDimensions"
import { Sans } from "palette"
import { Select } from "palette/elements/Select"
import { ScrollView, View, ViewProps } from "react-native"
import { ConsignmentMetadata } from "../"
import { BottomAlignedButton } from "../Components/BottomAlignedButton"
import { Row } from "../Components/FormElements"
import Text from "../Components/TextInput"
import Toggle from "../Components/Toggle"

interface Props extends ViewProps {
  navigator: NavigatorIOS
  updateWithMetadata?: (result: ConsignmentMetadata) => void
  metadata: ConsignmentMetadata
}

// See: https://github.com/artsy/force/blob/814a03a579290eaac74f910a0db28c2afd9b1753/desktop/apps/consign/client/reducers.js#L22-L38
const categoryOptions = [
  { name: "Painting", value: "PAINTING" },
  { name: "Sculpture", value: "SCULPTURE" },
  { name: "Photography", value: "PHOTOGRAPHY" },
  { name: "Print", value: "PRINT" },
  {
    name: "Drawing, Collage or other Work on Paper",
    value: "DRAWING_COLLAGE_OR_OTHER_WORK_ON_PAPER",
  },
  { name: "Mixed Media", value: "MIXED_MEDIA" },
  { name: "Performance Art", value: "PERFORMANCE_ART" },
  { name: "Installation", value: "INSTALLATION" },
  { name: "Video/Film/Animation", value: "VIDEO_FILM_ANIMATION" },
  { name: "Architecture", value: "ARCHITECTURE" },
  { name: "Fashion Design and Wearable Art", value: "FASHION_DESIGN_AND_WEARABLE_ART" },
  { name: "Jewelry", value: "JEWELRY" },
  { name: "Design/Decorative Art", value: "DESIGN_DECORATIVE_ART" },
  { name: "Textile Arts", value: "TEXTILE_ARTS" },
  { name: "Other", value: "OTHER" },
] as Array<{ name: string; value: ConsignmentSubmissionCategoryAggregation }>

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
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  private yearInput: LiveStyledTextInput
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  private mediumInput: LiveStyledTextInput
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  private widthInput: LiveStyledTextInput
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  private heightInput: LiveStyledTextInput
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  private depthInput: LiveStyledTextInput

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  constructor(props) {
    super(props)
    this.state = props.metadata || {}
  }

  doneTapped = () => {
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    this.props.updateWithMetadata(this.state)
    this.props.navigator.pop()
  }

  updateUnit = () => this.setState({ unit: this.state.unit === "CM" ? "IN" : "CM" })
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  updateTitle = (title) => {
    const value = title.replace(/^ +/gm, "")

    return this.setState({ title: value })
  }
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  updateYear = (year) => {
    if (year.length > 4) {
      return
    }
    const value = year.replace(/[^0-9]/g, "")

    return this.setState({ year: value })
  }
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  updateMedium = (medium) => {
    const value = medium.replace(/^ +/gm, "")

    return this.setState({ medium: value })
  }
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  updateWidth = (width) => {
    const value = width.match(/\d*[\.\,]?\d*/g)

    return this.setState({ width: value[0] })
  }
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  updateHeight = (height) => {
    const value = height.match(/\d*[\.\,]?\d*/g)

    return this.setState({ height: value[0] })
  }
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  updateDepth = (depth) => {
    const value = depth.match(/\d*[\.\,]?\d*/g)

    return this.setState({ depth: value[0] })
  }

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  changeCategoryValue = (_value, index) => {
    this.setState({
      categoryName: categoryOptions[index].name,
      category: categoryOptions[index].value,
    })
  }

  selectNextInput = () => {
    const inputs = [
      this.yearInput,
      this.mediumInput,
      this.widthInput,
      this.heightInput,
      this.depthInput,
    ]
    for (const input of inputs) {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      if (input && input.root && input.root.focus && !input.root.props.value) {
        return input.root.focus()
      }
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <BottomAlignedButton onPress={this.doneTapped} buttonText="Done">
          <FancyModalHeader onLeftButtonPress={this.doneTapped}>Work details</FancyModalHeader>
          <ScrollView keyboardShouldPersistTaps="handled" centerContent style={{ flex: 1 }}>
            <View style={{ padding: 10 }}>
              <Row>
                <Text
                  testID="consigments-metatdata-title"
                  text={{
                    placeholder: "Title",
                    onChangeText: this.updateTitle,
                    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                    value: this.state.title,
                    onSubmitEditing: this.selectNextInput,
                    returnKeyType: "next",
                    autoFocus: this.state.title
                      ? false
                      : typeof jest ===
                        "undefined" /* TODO: https://github.com/facebook/jest/issues/3707 */,
                  }}
                  style={{ margin: 10 }}
                />
              </Row>

              <Row>
                <Text
                  text={{
                    placeholder: "Year",
                    onChangeText: this.updateYear,
                    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                    value: this.state.year,
                    onSubmitEditing: this.selectNextInput,
                    ref: (component) => (this.yearInput = component),
                    keyboardType: "numeric",
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
                    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                    value: this.state.medium,
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
                    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                    value: this.state.width,
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
                    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                    value: this.state.height,
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
                  <Sans size="4">Units</Sans>
                  <Toggle
                    selected={this.state.unit === "CM"}
                    left="cm"
                    right="in"
                    onPress={this.updateUnit}
                  />
                </View>
              </Row>
              <View style={{ paddingHorizontal: 10 }}>
                <ScreenDimensionsContext.Consumer>
                  {({ height }) => (
                    <Select
                      title="Category"
                      maxModalHeight={height * 0.75}
                      options={categoryOptions.map((o) => ({
                        label: o.name,
                        value: o.value,
                      }))}
                      onSelectValue={this.changeCategoryValue}
                      value={this.state.category}
                    />
                  )}
                </ScreenDimensionsContext.Consumer>
              </View>
            </View>
          </ScrollView>
        </BottomAlignedButton>
      </View>
    )
  }
}
