import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { Image } from "react-native"
import { Avatar, InitialsHolder } from ".."

describe("Avatar", () => {
  it("renders initials if no image url and initials provided", () => {
    const { container, getByText } = renderWithWrappers(<Avatar initials="AB" />)
    expect(container.findAllByType(Image).length).toBe(0)
    expect(container.findAllByType(InitialsHolder).length).toBe(1)

    expect(getByText("AB")).toBeDefined()
  })

  it("returns empty holder if no image url or initials", () => {
    const { container } = renderWithWrappers(<Avatar />)

    expect(container.findAllByType(Image).length).toBe(0)
    expect(container.findAllByType(InitialsHolder).length).toBe(1)
  })

  it("returns correct sizes with initials", () => {
    const getInitialHolder = (size: any) =>
      renderWithWrappers(<Avatar size={size} initials="AB" />).container.findByType(InitialsHolder)

    expect(getInitialHolder("xxs").props.width).toEqual(30)
    expect(getInitialHolder("xs").props.height).toEqual(45)
    expect(getInitialHolder("sm").props.borderRadius).toEqual(70)
    expect(getInitialHolder("md").props.width).toEqual(100)
  })

  it("returns correct sizes with images", () => {
    const getImage = (size: any) =>
      renderWithWrappers(<Avatar size={size} src="/a/b/c.png" />).container.findByType(Image)

    expect(getImage("xxs").props.style.width).toEqual(30)
    expect(getImage("xs").props.style.height).toEqual(45)
    expect(getImage("sm").props.style.borderRadius).toEqual(35)
    expect(getImage("md").props.style.width).toEqual(100)
  })
})
