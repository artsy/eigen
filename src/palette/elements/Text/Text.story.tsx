import { storiesOf } from "@storybook/react"
import { themeGet } from "@styled-system/theme-get"
import React from "react"
import styled from "styled-components"
import { Color } from "../../Theme"
import { Flex } from "../Flex"
import { Text, TEXT_TREATMENTS, TEXT_VARIANTS } from "./"

const Table = styled.table`
  width: 100%;
  border: 1px solid ${themeGet("colors.black10")};
  border-collapse: collapse;

  > thead > tr > th {
    text-align: left;
    font-weight: normal;
  }

  > thead > tr > th,
  > tbody > tr > td {
    border-bottom: 1px solid ${themeGet("colors.black10")};
    border-left: 1px solid ${themeGet("colors.black10")};
    padding: ${themeGet("space.1")};
  }
`

const Specification: React.FC<{
  size?: "small" | "large"
  treatment: any
}> = ({ size, treatment }) => {
  const textColor =
    {
      small: ["purple100", "black60"] as Color[],
      large: ["black60", "purple100"] as Color[],
    }[size] || "black60"

  return (
    <>
      {Object.entries(treatment).map(([property, value]) => {
        return (
          value && (
            <Flex key={property}>
              <Text variant="small" textColor={textColor}>
                {property}:&nbsp;
              </Text>

              <Text variant="small" textColor={textColor}>
                {value}
              </Text>
            </Flex>
          )
        )
      })}
    </>
  )
}

storiesOf("Components/Text", module)
  .add("Variants", () => {
    return (
      <Table>
        <thead>
          <tr>
            <th>
              <Text variant="small">Variant</Text>
            </th>
            <th>
              <Text variant="small">Large (&gt;&nbsp;767)</Text>
            </th>
            <th>
              <Text variant="small">Small (&lt;&nbsp;767)</Text>
            </th>
            <th>
              <Text variant="small">Example</Text>
            </th>
          </tr>
        </thead>

        <tbody>
          {TEXT_TREATMENTS.map(key => (
            <tr key={key}>
              <td>
                <Text variant="small">{key}</Text>
              </td>
              <td>
                <Specification
                  size="large"
                  treatment={TEXT_VARIANTS.large[key]}
                />
              </td>
              <td>
                <Specification
                  size="small"
                  treatment={TEXT_VARIANTS.small[key]}
                />
              </td>
              <td>
                <Text variant={key}>
                  All their equipment and instruments are alive
                </Text>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    )
  })
  .add("As", () => {
    const ELEMENTS = ["h1", "h2", "h3", "p"] as Array<
      keyof JSX.IntrinsicElements
    >

    return (
      <>
        {ELEMENTS.map(element => {
          return (
            <Text key={element} as={element} variant="text">
              This is a text component with an element set to {element}
            </Text>
          )
        })}
      </>
    )
  })
  .add("Custom typography", () => {
    const SPECIFICATIONS = [
      {
        fontFamily: "sans",
        fontSize: "size12",
        lineHeight: "solid",
        letterSpacing: "tightest",
      },
      {
        fontFamily: "serif",
        fontSize: "70px",
        lineHeight: "solid",
        letterSpacing: "tight",
      },
      {
        fontFamily: "sans",
        fontSize: "48px",
        lineHeight: "solid",
        letterSpacing: "tightest",
      },
      {
        fontFamily: "serif",
        fontSize: "55px",
        lineHeight: "solid",
        letterSpacing: "tightest",
      },
      {
        fontFamily: "serif",
        variant: "text",
        lineHeight: "solid",
      },
    ] as const

    return (
      <Table>
        <thead>
          <tr>
            <th>
              <Text variant="small">Specifications</Text>
            </th>
            <th>
              <Text variant="small">Example</Text>
            </th>
          </tr>
        </thead>

        <tbody>
          {SPECIFICATIONS.map((specification, i) => (
            <tr key={i}>
              <td>
                <Specification treatment={specification} />
              </td>
              <td>
                <Text {...specification}>
                  All their equipment and instruments are alive
                </Text>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    )
  })
  .add("overflowEllipsis", () => {
    return (
      <Text variant="text" overflowEllipsis>
        All their equipment and instruments are alive. All their equipment and
        instruments are alive. All their equipment and instruments are alive.
        All their equipment and instruments are alive. All their equipment and
        instruments are alive. All their equipment and instruments are alive.
        All their equipment and instruments are alive. All their equipment and
        instruments are alive. All their equipment and instruments are alive.
      </Text>
    )
  })
