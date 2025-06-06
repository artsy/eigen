import { sendEmail } from "app/utils/sendEmail"
import { Alert, Linking } from "react-native"

describe("sendEmail", () => {
  beforeEach(() => {
    Alert.alert = jest.fn()
    Linking.openURL = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  // When a user does not have mail set up on their device
  describe("when a user cannot open the URL starting with mailto:", () => {
    it("does not call LinkinglopenURL and calls Alert.alert with correct argument", async () => {
      Linking.canOpenURL = jest.fn().mockReturnValue(Promise.resolve(false))
      await sendEmail("specialist@artsy.net")
      expect(Linking.openURL).toHaveBeenCalledTimes(0)
      expect(Alert.alert).toHaveBeenCalledTimes(1)
      expect(Alert.alert).toHaveBeenCalledWith(
        "No email configured",
        "Please email specialist@artsy.net for assistance."
      )
    })
  })

  // When a user has mail set up on their device
  describe("when a user can open the URL starting with mailto:", () => {
    beforeEach(() => {
      Linking.canOpenURL = jest.fn().mockReturnValue(Promise.resolve(true))
    })
    describe("when there is only an email address", () => {
      it("calls Linking.openURL with the correct argument", async () => {
        await sendEmail("specialist@artsy.net")
        expect(Linking.openURL).toHaveBeenCalledTimes(1)
        expect(Linking.openURL).toHaveBeenCalledWith("mailto:specialist@artsy.net")
      })
    })

    describe("when there is an email address with a subject line", () => {
      it("calls Linking.openURL with the correct argument", async () => {
        await sendEmail("specialist@artsy.net", { subject: "Greetings" })
        expect(Linking.openURL).toHaveBeenCalledTimes(1)
        expect(Linking.openURL).toHaveBeenCalledWith(
          "mailto:specialist@artsy.net?subject=Greetings"
        )
      })
    })

    describe("when there is an email address with a subject line and a ", () => {
      it("calls Linking.openURL with the correct argument", async () => {
        await sendEmail("specialist@artsy.net", {
          subject: "Greetings",
          body: "Hello, I need help.",
        })
        expect(Linking.openURL).toHaveBeenCalledTimes(1)
        expect(Linking.openURL).toHaveBeenCalledWith(
          "mailto:specialist@artsy.net?subject=Greetings&body=Hello, I need help."
        )
      })
    })
  })
})
