jest.mock("../../../../metaphysics", () => ({ metaphysics: jest.fn() }))

import { metaphysics } from "../../../../metaphysics"
import { withLocation } from "../../__stories__/consignmentSetups"

import update from "../update"

const mockphysics = metaphysics as jest.Mock<any>

it("makes a graphQL request to metaphysics", async () => {
  mockphysics.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        updateConsignmentSubmission: {
          submission: {
            id: "1234",
            artist_id: "asdasd",
          },
        },
      },
    })
  )

  const response = await update(withLocation, "123")
  const query = mockphysics.mock.calls[0][0].query

  expect(query).toContain("mutation")
  expect(query).toContain("updateConsignmentSubmission")
})
