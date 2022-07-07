import Quick
import Nimble
import Nimble_Snapshots
import Interstellar
import UIKit

@testable
import Artsy

class TextStackTests: QuickSpec {
    override func spec() {
        it("looks like the API spec") {

            let subject = TextStack()
            subject.constrainWidth("280")
            subject.backgroundColor = .white

            subject.addBigHeading("Biggest Heading")
            subject.addThickLineBreak()
            subject.addSmallHeading("Smaller Heading")
            subject.addSmallLineBreak()

            subject.addArtistName("Artist Name")
            subject.addArtworkName("Artwork Name", date: "date")
            subject.addSmallLineBreak()

            subject.addBodyMarkdown("Markdown body text with [link](/link).")
            subject.addSmallLineBreak()

            subject.addBodyText("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.")
            subject.addSmallLineBreak()

            expect(subject) == snapshot()
        }
    }
}
