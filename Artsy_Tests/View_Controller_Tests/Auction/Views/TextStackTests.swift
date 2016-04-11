import Quick
import Nimble
import Nimble_Snapshots
import Interstellar
import UIKit

@testable
import Artsy

class TextStackTests: QuickSpec {
    override func spec() {
        it("looks as expected") {

            let subject = TextStack()
            subject.constrainWidth("280")
            subject.backgroundColor = .whiteColor()

            subject.addBigHeading("Biggest Heading")
            subject.addThickLineBreak()
            subject.addSmallHeading("Smaller Heading")
            subject.addSmallLineBreak()

            subject.addArtistName("Artist Name")
            subject.addArtworkName("Artwork Name", date: "date")
            subject.addSmallLineBreak()

            subject.addBodyMarkdown("Markdown body text with [link](/link).")
            subject.addSmallLineBreak()

            subject.addBodyText("Plain Body text")
            subject.addSmallLineBreak()

            expect(subject) == snapshot()
        }
    }
}
