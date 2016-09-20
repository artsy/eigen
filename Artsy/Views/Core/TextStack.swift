import UIKit
import ORStackView
import Artsy_UIFonts

class TextStack: ORStackView {
    func addArtistName(string: String) -> UILabel {
        let artistNameLabel = UILabel()
        artistNameLabel.text = string
        artistNameLabel.font = UIFont.serifSemiBoldFontWithSize(16)
        addSubview(artistNameLabel, withTopMargin: "0", sideMargin: "0")
        return artistNameLabel
    }

    func addArtworkName(string: String, date: String?) -> ARArtworkTitleLabel {
        let title = ARArtworkTitleLabel()
        title.setTitle(string, date: date)
        addSubview(title, withTopMargin: "4", sideMargin: "0")
        return title
    }

    func addSmallHeading(string: String, sideMargin: String = "0") -> UILabel {
        let heading = ARSansSerifLabel()
        heading.font = .sansSerifFontWithSize(12)
        heading.text = string
        addSubview(heading, withTopMargin: "10", sideMargin: sideMargin)
        return heading
    }

    func addBigHeading(string: String, sideMargin: String = "0") -> UILabel {
        let heading = ARSerifLabel()
        heading.font = .serifFontWithSize(26)
        heading.text = string
        addSubview(heading, withTopMargin: "20", sideMargin:sideMargin)
        return heading
    }

    func addSmallLineBreak(sideMargin: String = "0") -> UIView {
        let line = UIView()
        line.backgroundColor = .artsyGrayRegular()
        addSubview(line, withTopMargin: "20", sideMargin: sideMargin)
        line.constrainHeight("1")
        return line
    }

    func addThickLineBreak(sideMargin: String = "0") -> UIView {
        let line = UIView()
        line.backgroundColor = .blackColor()
        addSubview(line, withTopMargin: "20", sideMargin: sideMargin)
        line.constrainHeight("2")
        return line
    }

    func addBodyText(string: String, topMargin: String = "20", sideMargin: String = "0") -> UILabel {
        let serif = ARSerifLabel()
        serif.font = .serifFontWithSize(16)
        serif.numberOfLines = 0
        serif.text = string
        addSubview(serif, withTopMargin: topMargin, sideMargin: sideMargin)
        return serif
    }

    func addBodyMarkdown(string: MarkdownString, topMargin: String = "20", sideMargin: String = "0") -> ARTextView {
        let text = ARTextView()
        text.plainLinks = true
        text.setMarkdownString(string)
        addSubview(text, withTopMargin: topMargin, sideMargin: sideMargin)
        return text
    }

    func addLinkedBodyMarkdown(string: MarkdownString, topMargin: String = "20", sideMargin: String = "0") -> ARTextView {
        let text = ARTextView()
        text.setMarkdownString(string)
        addSubview(text, withTopMargin: topMargin, sideMargin: sideMargin)
        return text
    }

}
