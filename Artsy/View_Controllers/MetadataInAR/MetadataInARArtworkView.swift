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
    var artworkTitle: UILabel!
    var artistName: UILabel!
    var price: UILabel!
    
    var metadataView: ARArtworkDetailView!

    init(artwork: Artwork) {
        self.artwork = artwork
        
        super.init(frame: CGRect.zero)
        
        addArtworkImage()
        addTitleLabel()
        addSubtitleLabel()
        addPriceLabel()
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
        
        self.artworkTitle = titleLabel
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
        subtitleLabel.alignTopEdge(withView: artworkTitle, predicate: "30")
        subtitleLabel.alignLeadingEdge(withView: artworkImage, predicate: "90")
        subtitleLabel.constrainHeight("20")
        
        self.artistName = subtitleLabel
    }
    
    func addPriceLabel() {
        let priceLabel = ARSansSerifLabel().then {
            $0.text = artwork.price
            $0.font = UIFont.displaySansSerifFont(withSize: 14)
            $0.backgroundColor = .clear
            $0.textColor = UIColor.artsyGrayLight()
            $0.textAlignment = .left
        }
        priceLabel.translatesAutoresizingMaskIntoConstraints = false
        addSubview(priceLabel)
        priceLabel.alignTopEdge(withView: artistName, predicate: "30")
        priceLabel.alignLeadingEdge(withView: artworkImage, predicate: "90")
        priceLabel.constrainHeight("20")
        
        self.price = priceLabel
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
    
    func addArtworkDetailView() {
        guard let metadataView = ARArtworkDetailView(artwork: artwork, andFair: artwork.fair()) else {
            return
        }
        metadataView.translatesAutoresizingMaskIntoConstraints = false
        addSubview(metadataView)
        metadataView.constrainTopSpace(toView: price, predicate: "10")
        metadataView.constrainWidth(toView: self, predicate: "0")
        metadataView.constrainHeight("200")
        metadataView.alignCenterX(withView: self, predicate: "0")
        
        self.metadataView = metadataView
    }
    
    func updateWithArtwork(artwork: Artwork) {
        self.artwork = artwork
        
        artwork.onArtworkUpdate({
            self.artworkTitle.text = artwork.title
            self.artistName.text = artwork.artist?.name
            self.price.text = artwork.price
            
            if let url = artwork.defaultImage.imageURL(withFormatName: "square") {
                self.artworkImage.ar_setImage(with: url)
            }
            
            if self.metadataView == nil {
                self.addArtworkDetailView()
            }
        }, failure: { err in
            
        })
        
        artwork.update()
    }
}

