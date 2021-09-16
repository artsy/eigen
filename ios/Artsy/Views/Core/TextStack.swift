import UIKit

class TextStack: ORStackView {
    @discardableResult
    func addArtistName(_ string: String) -> UILabel {
        let artistNameLabel = UILabel()
        artistNameLabel.text = string
        artistNameLabel.font = UIFont.serifSemiBoldFont(withSize: 16)
        addSubview(artistNameLabel, withTopMargin: "0", sideMargin: "0")
        return artistNameLabel
    }

    @discardableResult
    func addArtworkName(_ string: String, date: String?) -> ARArtworkTitleLabel {
        let title = ARArtworkTitleLabel()
        title.setTitle(string, date: date)
        addSubview(title, withTopMargin: "4", sideMargin: "0")
        return title
    }

    @discardableResult
    func addSmallHeading(_ string: String, sideMargin: String = "0") -> UILabel {
        let heading = ARSansSerifLabel()
        heading.font = .sansSerifFont(withSize: 12)
        heading.text = string
        addSubview(heading, withTopMargin: "10", sideMargin: sideMargin)
        return heading
    }

    @discardableResult
    func addBigHeading(_ string: String, sideMargin: String = "0") -> UILabel {
        let heading = ARSerifLabel()
        heading.font = .serifFont(withSize: 26)
        heading.text = string
        addSubview(heading, withTopMargin: "20", sideMargin:sideMargin)
        return heading
    }

    @discardableResult
    func addSmallLineBreak(_ sideMargin: String = "0") -> UIView {
        let line = UIView()
        line.backgroundColor = .artsyGrayRegular()
        addSubview(line, withTopMargin: "20", sideMargin: sideMargin)
        line.constrainHeight("1")
        return line
    }

    @discardableResult
    func addThickLineBreak(_ sideMargin: String = "0") -> UIView {
        let line = UIView()
        line.backgroundColor = .black
        addSubview(line, withTopMargin: "20", sideMargin: sideMargin)
        line.constrainHeight("2")
        return line
    }

    @discardableResult
    func addBodyText(_ string: String, topMargin: String = "20", sideMargin: String = "0") -> UILabel {
        let serif = ARSerifLabel()
        serif.font = .serifFont(withSize: 16)
        serif.numberOfLines = 0
        serif.text = string
        addSubview(serif, withTopMargin: topMargin, sideMargin: sideMargin)
        return serif
    }

    @discardableResult
    func addBodyMarkdown(_ string: MarkdownString, topMargin: String = "20", sideMargin: String = "0") -> ARTextView {
        let text = ARTextView()
        text.plainLinks = true
        text.setMarkdownString(string)
        addSubview(text, withTopMargin: topMargin, sideMargin: sideMargin)
        return text
    }

    @discardableResult
    func addLinkedBodyMarkdown(_ string: MarkdownString, topMargin: String = "20", sideMargin: String = "0") -> ARTextView {
        let text = ARTextView()
        text.setMarkdownString(string)
        addSubview(text, withTopMargin: topMargin, sideMargin: sideMargin)
        return text
    }
}
