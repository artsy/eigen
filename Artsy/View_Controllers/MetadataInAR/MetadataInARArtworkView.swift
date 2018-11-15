//
//  MetadataInARArtworkView.swift
//  Artsy
//
//  Created by Luc Succes on 11/14/18.
//  Copyright © 2018 Artsy. All rights reserved.
//

import UIKit

class MetadataInARArtworkView: UIView {
    var artwork: Artwork
    
    var artworkImage: UIImageView!
    var titleLabel: UILabel!
    var subtitleLabel: UILabel!

    init(artwork: Artwork) {
        self.artwork = artwork
        
        super.init(frame: CGRect.zero)
        
        addArtworkImage()
        addTitleLabel()
        addSubtitleLabel()
        updateWithArtwork(artwork: artwork)
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    func addTitleLabel() {
        let titleLabel = ARSerifLabel().then {
            $0.text = artwork.title
            $0.font = UIFont.serifFont(withSize: 20)
            $0.backgroundColor = .clear
            $0.textColor = .white
            $0.textAlignment = .left
        }
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        addSubview(titleLabel)
        titleLabel.alignTopEdge(withView: self, predicate: "10")
        titleLabel.alignLeadingEdge(withView: artworkImage, predicate: "90")
        titleLabel.constrainHeight("30")
        
        self.titleLabel = titleLabel
    }
    
    func addSubtitleLabel() {
        let subtitleLabel = ARSansSerifLabel().then {
            $0.text = artwork.artist?.name
            $0.font = UIFont.sansSerifFont(withSize: 14)
            $0.backgroundColor = .clear
            $0.textColor = UIColor.artsyGrayLight()
            $0.textAlignment = .left
        }
        subtitleLabel.translatesAutoresizingMaskIntoConstraints = false
        addSubview(subtitleLabel)
        subtitleLabel.alignTopEdge(withView: titleLabel, predicate: "30")
        subtitleLabel.alignLeadingEdge(withView: artworkImage, predicate: "90")
        subtitleLabel.constrainHeight("20")
        
        self.subtitleLabel = subtitleLabel
    }
    
    func addArtworkImage() {
        let imageView = UIImageView()
        imageView.translatesAutoresizingMaskIntoConstraints = false
        
        if let url = artwork.defaultImage.imageURL(withFormatName: "square") {
            imageView.ar_setImage(with: url)
        }
        
        addSubview(imageView)
        imageView.constrainWidth("80")
        imageView.constrainHeight("80")
        imageView.alignTopEdge(withView: self, predicate: "20")
        imageView.alignLeadingEdge(withView: self, predicate: "10")
        
        self.artworkImage = imageView
    }
    
    func updateWithArtwork(artwork: Artwork) {
        self.artwork = artwork
        
        artwork.onArtworkUpdate({
            self.titleLabel.text = artwork.title
            self.subtitleLabel.text = artwork.artist?.name
            
            if let url = artwork.defaultImage.imageURL(withFormatName: "square") {
                self.artworkImage.ar_setImage(with: url)
            }
        }, failure: { err in
            
        })
        
        artwork.update()
    }
}
