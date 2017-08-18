import * as React from "react"

import { LayoutAnimation, NavigatorIOS, Picker, Route, ScrollView, View, ViewProperties } from "react-native"
import ConsignmentBG from "../Components/ConsignmentBG"
import { BodyText, LargeHeadline, Subtitle } from "../Typography"

import { ArtistResult, ConsignmentMetadata } from "../"
import TODO from "../Components/ArtworkConsignmentTodo"
import DoneButton from "../Components/DoneButton"
import { Form, Label, Row } from "../Components/FormElements"
import Text from "../Components/TextInput"
import Toggle from "../Components/Toggle"
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
  "Painting",
  "Sculpture",
  "Photography",
  "Print",
  "Drawing, Collage or other Work on Paper",
  "Mixed Media",
  "Performance Art",
  "Installation",
  "Video/Film/Animation",
  "Architecture",
  "Fashion Design and Wearable Art",
  "Jewelry",
  "Design/Decorative Art",
  "Textile Arts",
  "Other",
]

export default class Metadata extends React.Component<Props, ConsignmentMetadata> {
  constructor(props) {
    super(props)
    this.state = props
  }

  doneTapped = () => {
    this.props.updateWithMetadata(this.state)
    this.props.navigator.pop()
  }

  updateSigned = () => this.setState({ unit: this.state.unit === "cm" ? "in" : "cm" })
  updateTitle = title => this.setState({ title })
  updateYear = year => this.setState({ year })
  updateCategory = category => this.setState({ category })
  updateMaterials = materials => this.setState({ materials })
  updateWidth = width => this.setState({ width })
  updateHeight = height => this.setState({ height })
  updateDepth = depth => this.setState({ depth })

  render() {
    return (
      <ConsignmentBG>
        <DoneButton onPress={this.doneTapped}>
          <ScrollView>
            <View>
              <Row>
                <Text
                  text={{ placeholder: "Title", onChangeText: this.updateTitle, value: this.state.title }}
                  style={{ margin: 10 }}
                />
              </Row>

              <Row>
                <Text
                  text={{ placeholder: "Year", onChangeText: this.updateYear, value: this.state.year }}
                  style={{ margin: 10 }}
                />
              </Row>

              <Row>
                <Text
                  text={{ placeholder: "Category", onChangeText: this.updateCategory, value: this.state.category }}
                  style={{ margin: 10 }}
                />
              </Row>

              <Row>
                <Text
                  text={{ placeholder: "Materials", onChangeText: this.updateMaterials, value: this.state.materials }}
                  style={{ margin: 10 }}
                />
              </Row>

              <Row>
                <Text
                  text={{ placeholder: "Width", onChangeText: this.updateWidth, value: this.state.width }}
                  style={{ margin: 10 }}
                />
                <Text
                  text={{
                    placeholder: "Height",
                    onChangeText: this.updateHeight,
                    value: this.state.height,
                  }}
                  style={{ margin: 10 }}
                />
              </Row>

              <Picker
                style={{ backgroundColor: "white" }}
                selectedValue={this.state.category}
                onValueChange={(itemValue, itemIndex) => this.setState({ category: itemValue })}
              >
                {categoryOptions.map(category => <Picker.Item label={category} value={category} />)}
              </Picker>

              <Row>
                <Text text={{ placeholder: "Depth" }} style={{ margin: 10 }} />
                <View style={{ flex: 1, flexDirection: "row", alignContent: "center", margin: 10 }}>
                  <Label>Units</Label>
                  <Toggle selected={this.state.unit === "cm"} left="CM" right="IN" onPress={this.updateSigned} />
                </View>
              </Row>
            </View>
          </ScrollView>
        </DoneButton>
      </ConsignmentBG>
    )
  }
}
