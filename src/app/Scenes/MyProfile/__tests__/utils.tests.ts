import { normalizeMyProfileBio } from "app/Scenes/MyProfile/utils"

describe("normalizeMyProfileBio", () => {
  it("normalizes a bio", () => {
    expect(normalizeMyProfileBio("The quick brown fox jumps over the lazy dog")).toEqual(
      "The quick brown fox jumps over the lazy dog"
    )
    expect(normalizeMyProfileBio("The sky is blue.\nThe sun is bright")).toEqual(
      "The sky is blue. The sun is bright"
    )

    expect(
      normalizeMyProfileBio(
        `If I can see it, then I can do it
If I just believe it, there's nothing to it
I believe I can fly
I believe I can touch the sky
I think about it every night and day
Spread my wings and fly away`
      )
    ).toEqual(
      "If I can see it, then I can do it. If I just believe it, there's nothing to it. I believe I can fly. I believe I can touch the sky. I think about it every night and day. Spread my wings and fly away"
    )
  })
})
