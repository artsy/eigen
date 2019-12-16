import { storiesOf } from "@storybook/react-native"
import { ProvideScreenDimensions } from "lib/utils/useScreenDimensions"
import React from "react"
import ImageSelection from "../Components/ImageSelection"
import { Wrapper } from "./"

const uri1 = "https://d32dm0rphc51dk.cloudfront.net/Vq62IJMLbG1TuUjs-2fZCg/large.jpg"
const uri2 = "https://d32dm0rphc51dk.cloudfront.net/WAlGHmjlxTn3USMllNt4rA/large.jpg"
const uri3 = "https://d32dm0rphc51dk.cloudfront.net/8BuMWBuUOBtKVBsGRUoDKw/large.jpg"

storiesOf("Consignments/Image Selection")
  .add("With some images", () => (
    <ProvideScreenDimensions>
      <Wrapper>
        <ImageSelection data={[{ image: { uri: uri1 } }, { image: { uri: uri2 } }, { image: { uri: uri3 } }]} />
      </Wrapper>
    </ProvideScreenDimensions>
  ))
  .add("With no images", () => (
    <ProvideScreenDimensions>
      <Wrapper>
        <ImageSelection data={[]} />
      </Wrapper>
    </ProvideScreenDimensions>
  ))
