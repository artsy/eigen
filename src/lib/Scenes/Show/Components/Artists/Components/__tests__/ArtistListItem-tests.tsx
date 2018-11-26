import { Sans, Serif, Theme } from "@artsy/palette"
import { mount } from "enzyme"
import InvertedButton from "lib/Components/Buttons/InvertedButton"
import React from "react"
import { ArtistListItem } from "../ArtistListItem"

describe("ArtistListItem", () => {
  it("renders", () => {
    const onPressMock = jest.fn()
    const comp = mount(
      <Theme>
        <ArtistListItem
          name="This is an artist"
          url={"https://d32dm0rphc51dk.cloudfront.net/aewyRIXcvvjpKwpUGywnzw/tall.jpg"}
          isFollowed={false}
          onPress={onPressMock}
          isFollowedChanging={false}
          birthday={"1990"}
          deathday={"2014"}
          nationality={"American"}
        />
      </Theme>
    )

    expect(comp.find(Serif).html()).toContain("This is an artist")
    expect(comp.find(Sans).html()).toContain("American, 1990-2014")

    comp
      .find(InvertedButton)
      .props()
      .onPress()

    expect(onPressMock).toHaveBeenCalled()
  })

  it("Only nationality and birthday", () => {
    const onPressMock = jest.fn()
    const comp = mount(
      <Theme>
        <ArtistListItem
          name="This is an artist"
          url={"https://d32dm0rphc51dk.cloudfront.net/aewyRIXcvvjpKwpUGywnzw/tall.jpg"}
          isFollowed={false}
          onPress={onPressMock}
          isFollowedChanging={false}
          birthday={"1990"}
          deathday={""}
          nationality={"American"}
        />
      </Theme>
    )

    expect(comp.find(Sans).html()).toContain("American, b. 1990")
  })

  it("Only nationality", () => {
    const onPressMock = jest.fn()
    const comp = mount(
      <Theme>
        <ArtistListItem
          name="This is an artist"
          url={"https://d32dm0rphc51dk.cloudfront.net/aewyRIXcvvjpKwpUGywnzw/tall.jpg"}
          isFollowed={false}
          onPress={onPressMock}
          isFollowedChanging={false}
          birthday={""}
          deathday={""}
          nationality={"American"}
        />
      </Theme>
    )

    expect(comp.find(Sans).html()).toContain("American")
  })

  it("Without nationality", () => {
    const onPressMock = jest.fn()
    const comp = mount(
      <Theme>
        <ArtistListItem
          name="This is an artist"
          url={"https://d32dm0rphc51dk.cloudfront.net/aewyRIXcvvjpKwpUGywnzw/tall.jpg"}
          isFollowed={false}
          onPress={onPressMock}
          isFollowedChanging={false}
          birthday={"1990"}
          deathday={"2014"}
          nationality={""}
        />
      </Theme>
    )

    expect(comp.find(Sans).html()).toContain("1990-2014")
  })

  it("Only born date", () => {
    const onPressMock = jest.fn()
    const comp = mount(
      <Theme>
        <ArtistListItem
          name="This is an artist"
          url={"https://d32dm0rphc51dk.cloudfront.net/aewyRIXcvvjpKwpUGywnzw/tall.jpg"}
          isFollowed={false}
          onPress={onPressMock}
          isFollowedChanging={false}
          birthday={"1990"}
          deathday={""}
          nationality={""}
        />
      </Theme>
    )

    expect(comp.find(Sans).html()).toContain("b. 1990")
  })

  it("Only death date", () => {
    const onPressMock = jest.fn()
    const comp = mount(
      <Theme>
        <ArtistListItem
          name="This is an artist"
          url={"https://d32dm0rphc51dk.cloudfront.net/aewyRIXcvvjpKwpUGywnzw/tall.jpg"}
          isFollowed={false}
          onPress={onPressMock}
          isFollowedChanging={false}
          birthday={""}
          deathday={"1990"}
          nationality={""}
        />
      </Theme>
    )

    expect(comp.find(Sans).html()).toContain("")
  })
})
