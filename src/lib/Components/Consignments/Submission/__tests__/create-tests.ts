jest.mock("../../../../metaphysics", () => ({ metaphysics: jest.fn() }))

import { metaphysics } from "../../../../metaphysics"
import { withPhotos } from "../../__stories__/consignmentSetups"

import create from "../create"

const mockphysics = metaphysics as jest.Mock<any>

it("makes a graphQL request to metaphysics", async () => {
  mockphysics.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        createConsignmentSubmission: {
          submission: {
            id: "1234",
            artist_id: "asdasd",
          },
        },
      },
    })
  )

  const response = await create(withPhotos)
  const query = mockphysics.mock.calls[0][0].query

  expect(query).toContain("mutation")
  expect(query).toContain("createConsignmentSubmission")
})
