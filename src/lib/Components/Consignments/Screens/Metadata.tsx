import * as React from "react"

import {
  Keyboard,
  LayoutAnimation,
  NativeMethodsMixinStatic,
  NavigatorIOS,
  Picker,
  Route,
  ScrollView,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
  ViewProperties,
} from "react-native"
import { ConsignmentMetadata, SearchResult } from "../"
import { Fonts } from "../../../../data/fonts"
import TODO from "../Components/ArtworkConsignmentTodo"
import ConsignmentBG from "../Components/ConsignmentBG"
import DoneButton from "../Components/DoneButton"
import { Form, Label, Row } from "../Components/FormElements"
import Text from "../Components/TextInput"
import Toggle from "../Components/Toggle"
import { BodyText, LargeHeadline, Subtitle } from "../Typography"
import Artist from "./Artist"
import Provenance from "./Provenance"
import SelectFromPhotoLibrary from "./SelectFromPhotoLibrary"
import Welcome from "./Welcome"

interface Props extends ViewProperties {
  navigator: NavigatorIOS
  route: Route // this gets set by NavigatorIOS
  updateWithMetadata?: (result: ConsignmentMetadata) => void
  metadata: ConsignmentMetadata
}

// See: https://github.com/artsy/force/blob/814a03a579290eaac74f910a0db28c2afd9b1753/desktop/apps/consign/client/reducers.js#L22-L38
const categoryOptions = [
  { name: "Painting", value: "PAINTING" },
  { name: "Sculpture", value: "SCULPTURE" },
  { name: "Photography", value: "PHOTOGRAPHY" },
  { name: "Print", value: "PRINT" },
  { name: "Drawing, Collage or other Work on Paper", value: "DRAWING_COLLAGE_OR_OTHER_WORK_ON_PAPER" },
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
]

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
  private yearInput: LiveStyledTextInput
  private mediumInput: LiveStyledTextInput
  private widthInput: LiveStyledTextInput
  private heightInput: LiveStyledTextInput
  private depthInput: LiveStyledTextInput

  constructor(props) {
    super(props)
    this.state = props.metadata || {}
  }

  doneTapped = () => {
    this.props.updateWithMetadata(this.state)
    this.props.navigator.pop()
  }

  updateUnit = () => this.setState({ unit: this.state.unit === "CM" ? "IN" : "CM" })
  updateTitle = title => this.setState({ title })
  updateYear = year => this.setState({ year })
  updateMedium = medium => this.setState({ medium })
  updateWidth = width => this.setState({ width })
  updateHeight = height => this.setState({ height })
  updateDepth = depth => this.setState({ depth })

  animateStateChange = newState => {
    const animate = LayoutAnimation.easeInEaseOut as any
    animate()
    this.setState(newState)
  }

  showCategorySelection = () => {
    Keyboard.dismiss()
    this.animateStateChange({ showSelector: true })
  }
  hideCategorySelection = () => this.animateStateChange({ showSelector: false })
  changeCategoryValue = (value, index) => {
    this.setState({
      categoryName: categoryOptions[index].name,
      category: categoryOptions[index].value,
    })
  }

  selectNextInput = () => {
    const inputs = [this.yearInput, this.mediumInput, this.widthInput, this.heightInput, this.depthInput]
    for (const input of inputs) {
      if (input && input.root && input.root.focus && !input.root.props.value) {
        return input.root.focus()
      }
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ConsignmentBG>
          <DoneButton onPress={this.doneTapped}>
            <ScrollView keyboardShouldPersistTaps="handled">
              <View style={{ padding: 10 }}>
                <Row>
                  <Text
                    text={{
                      placeholder: "Title",
                      onFocus: this.hideCategorySelection,
                      onChangeText: this.updateTitle,
                      value: this.state.title,
                      onSubmitEditing: this.selectNextInput,
                    }}
                    style={{ margin: 10 }}
                  />
                </Row>

                <Row>
                  <Text
                    text={{
                      placeholder: "Year",
                      onChangeText: this.updateYear,
                      value: this.state.year,
                      onFocus: this.hideCategorySelection,
                      onSubmitEditing: this.selectNextInput,
                      ref: component => (this.yearInput = component),
                    }}
                    style={{ margin: 10 }}
                  />
                </Row>

                <TouchableWithoutFeedback onPress={this.showCategorySelection}>
                  <Row>
                    <Text
                      text={{
                        placeholder: "Category",
                        value: this.state.categoryName,
                      }}
                      readonly={true}
                      style={{ margin: 10 }}
                    />
                  </Row>
                </TouchableWithoutFeedback>

                <Row>
                  <Text
                    text={{
                      placeholder: "Medium",
                      onChangeText: this.updateMedium,
                      value: this.state.medium,
                      onFocus: this.hideCategorySelection,
                      onSubmitEditing: this.selectNextInput,
                      ref: component => (this.mediumInput = component),
                    }}
                    style={{ margin: 10 }}
                  />
                </Row>

                <Row>
                  <Text
                    text={{
                      placeholder: "Width",
                      onChangeText: this.updateWidth,
                      value: this.state.width,
                      onFocus: this.hideCategorySelection,
                      onSubmitEditing: this.selectNextInput,
                      ref: component => (this.widthInput = component),
                    }}
                    style={{ margin: 10 }}
                  />
                  <Text
                    text={{
                      placeholder: "Height",
                      onChangeText: this.updateHeight,
                      value: this.state.height,
                      onFocus: this.hideCategorySelection,
                      onSubmitEditing: this.selectNextInput,
                      ref: component => (this.heightInput = component),
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
                    }}
                    style={{ margin: 10 }}
                  />
                  <View style={{ flex: 1, flexDirection: "row", alignItems: "center", margin: 10 }}>
                    <Label>Units</Label>
                    <Toggle selected={this.state.unit === "CM"} left="CM" right="IN" onPress={this.updateUnit} />
                  </View>
                </Row>
              </View>
            </ScrollView>
          </DoneButton>
        </ConsignmentBG>
        {
          //  When we want to show a picker, it should replace the keyboard, so move the
          //  keyboard down and push up the ConsignmentBG to fill in the space
        }
        {this.state.showPicker
          ? <Picker
              style={{ height: 220, backgroundColor: "black", marginTop: 40 }}
              key="picker"
              selectedValue={this.state.category}
              onValueChange={this.changeCategoryValue}
            >
              {categoryOptions.map(opt =>
                <Picker.Item color="white" label={opt.name} value={opt.value} key={opt.value} />
              )}
            </Picker>
          : null}
      </View>
    )
  }
}
