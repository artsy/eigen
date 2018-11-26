import { Serif } from "@artsy/palette"
import { shallow } from "enzyme"
import InvertedButton from "lib/Components/Buttons/InvertedButton"
import React from "react"
import { ArtistListItem } from "../ArtistListItem"

describe("ArtistListItem", () => {
  it("renders", () => {
    const onPressMock = jest.fn()
    const comp = shallow(
      <ArtistListItem
        name="This is an artist"
        url={"https://d32dm0rphc51dk.cloudfront.net/aewyRIXcvvjpKwpUGywnzw/tall.jpg"}
        isFollowed={false}
        onPress={onPressMock}
        isFollowedChanging={false}
      />
    )

    expect(comp.find(Serif).html()).toContain("This is an artist")

    comp.find(InvertedButton).simulate("press")

    expect(onPressMock).toHaveBeenCalled()
  })
})
