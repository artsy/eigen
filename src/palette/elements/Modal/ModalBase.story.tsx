import { storiesOf } from "@storybook/react"
import React, { useState } from "react"
import { Box } from "../Box"
import { Button } from "../Button"
import { Input } from "../Input"
import { Join } from "../Join"
import { Spacer } from "../Spacer"
import { Sans } from "../Typography"
import { ModalBase, ModalBaseProps } from "./ModalBase"

const Example: React.FC<
  ModalBaseProps & { dialogChildren?: JSX.Element; bodyChildren?: JSX.Element }
> = ({ bodyChildren, dialogChildren, ...rest } = {}) => {
  const [open, setOpen] = useState(false)
  const label = open ? "opened" : "open"
  const handleClose = () => setOpen(false)

  return (
    <>
      <Button variant="secondaryGray" onClick={() => setOpen(true)}>
        {label}
      </Button>

      {bodyChildren}

      {open && (
        <ModalBase onClose={handleClose} {...rest}>
          <Box
            background="black"
            p={4}
            width="100%"
            height="100%"
            style={{ border: "2px solid red" }}
          >
            <Box textAlign="center">
              <Sans size="6" color="white100">
                <Join separator={<Spacer my={1} />}>
                  <>Some example content. Click outside to close.</>
                  <Button variant="primaryWhite" onClick={handleClose}>
                    Or click here to close.
                  </Button>
                  <Input placeholder="Just an example for focusing" />
                  <Input placeholder="Just an example for focusing" />
                  {dialogChildren}
                </Join>
              </Sans>
            </Box>
          </Box>
        </ModalBase>
      )}
    </>
  )
}

storiesOf("Components/ModalBase", module)
  .add("Default", () => <Example />)
  .add("Fullscreen", () => (
    <Example
      dialogProps={{
        width: "100%",
        height: "100%",
        background: "black",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  ))
  .add("Scrolling", () => (
    <Example
      bodyChildren={
        <>
          {[...new Array(100)].map((_, i) => (
            <div key={i}>content should not scroll when modal is open</div>
          ))}
        </>
      }
      dialogChildren={
        <>
          {[...new Array(100)].map((_, i) => (
            <div key={i}>content should be scrollable</div>
          ))}
        </>
      }
    />
  ))
