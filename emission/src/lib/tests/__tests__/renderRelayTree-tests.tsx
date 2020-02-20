import * as React from "react"
import { Image, Text, View } from "react-native"
import { renderRelayTree } from "../renderRelayTree"
import { Artwork, query, renderToString } from "./MockRelayRendererFixtures"

jest.unmock("react-relay")

describe("renderRelayTree", () => {
  it("resolves a promise once the full tree (including nested query renderers) has been rendered", async () => {
    const tree = await renderRelayTree({
      Component: Artwork,
      query,
      mockResolvers: {
        Artwork: () => ({
          title: "Mona Lisa",
          image: {
            url: "http://test/image.jpg",
          },
          artist: {
            id: "leonardo-da-vinci",
          },
        }),
        Artist: () => ({
          name: "Leonardo da Vinci",
        }),
      },
    })
    expect(tree.html()).toEqual(
      renderToString(
        <View>
          <Image source={{ uri: "http://test/image.jpg" }} />
          <Text>Mona Lisa</Text>
          <Text>Leonardo da Vinci</Text>
        </View>
      )
    )
  })

  it("resolves a promise once the optional `until` callback matches", async () => {
    class Component extends React.Component {
      state = {
        data: "",
      }

      componentDidMount() {
        setTimeout(() => {
          this.setState({ data: "ohai" })
        }, 1000)
      }

      render() {
        return (
          <View>
            <Text testID="much-later">{this.state.data}</Text>
            <View>{this.props.children}</View>
          </View>
        )
      }
    }

    const tree = await renderRelayTree({
      renderUntil: wrapper =>
        // FIXME: Why does this need `first`? Only a single Text component has this prop.
        wrapper
          .find({ testID: "much-later" })
          .first()
          .text().length > 0,
      Component: Artwork,
      query,
      mockResolvers: {
        Artwork: () => ({
          title: "Mona Lisa",
          image: {
            url: "http://test/image.jpg",
          },
        }),
      },
      wrapper: renderer => <Component>{renderer}</Component>,
    })

    expect(
      tree
        .find({ testID: "much-later" })
        .first()
        .text()
    ).toEqual("ohai")
  })
})
