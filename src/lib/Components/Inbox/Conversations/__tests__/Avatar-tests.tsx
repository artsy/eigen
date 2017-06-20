import "jest-snapshots-svg"
import * as React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import Avatar from "../Avatar"

it("looks correct for a user with two initials", () => {
  const avatar = renderer.create(<Avatar isUser={true} senderName={"Maxim Cramer"} />).toJSON()
  expect(avatar).toMatchSnapshot()
})

it("looks correct for a user with three initials", () => {
  const avatar = renderer.create(<Avatar isUser={true} senderName={"Amazing Person Name"} />).toJSON()
  expect(avatar).toMatchSnapshot()
})

it("looks correct for a user with many initials", () => {
  const avatar = renderer
    .create(<Avatar isUser={true} senderName={"Amazing Person With Very Very Long Name"} />)
    .toJSON()
  expect(avatar).toMatchSnapshot()
})

it("looks correct for a gallery with two initials", () => {
  const avatar = renderer.create(<Avatar isUser={false} senderName={"Best Gallery"} />).toJSON()
  expect(avatar).toMatchSnapshot()
})

it("looks correct for a gallery with many initials", () => {
  const avatar = renderer
    .create(<Avatar isUser={false} senderName={"Best Gallery Ever But Has Very Long Name"} />)
    .toJSON()
  expect(avatar).toMatchSnapshot()
})

it("looks correct for a gallery with lowercase initials", () => {
  const avatar = renderer.create(<Avatar isUser={false} senderName={"all lower case though"} />).toJSON()
  expect(avatar).toMatchSnapshot()
})
