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
    var heartButton: ARHeartButton!
    
    var metadataView: ARArtworkDetailView!

    init(artwork: Artwork) {
        self.artwork = artwork
        
        super.init(frame: CGRect.zero)
        
        addArtworkImage()
        addHeartView()
        addTitleLabel()
        addSubtitleLabel()
        addPriceLabel()
        updateWithArtwork(artwork: artwork)
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    func addTitleLabel() {
        let titleLabel = ARSansSerifLabel().then {
            $0.text = artwork.title
            $0.font = UIFont.sansSerifFont(withSize: 16)
            $0.backgroundColor = .clear
            $0.textColor = .white
            $0.textAlignment = .left
        }
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        addSubview(titleLabel)
        titleLabel.alignTopEdge(withView: self, predicate: "10")
        titleLabel.alignLeadingEdge(withView: artworkImage, predicate: "90")
        titleLabel.alignTrailingEdge(withView: heartButton, predicate: "-40")
        titleLabel.constrainHeight("30")
        
        self.artistName = titleLabel
    }
    
    func addSubtitleLabel() {
        let subtitleLabel = ARSerifLabel().then {
            $0.text = artwork.artist?.name
            $0.font = UIFont.serifItalicFont(withSize: 14)
            $0.backgroundColor = .clear
            $0.textColor = UIColor.artsyGrayLight()
            $0.textAlignment = .left
        }
        subtitleLabel.translatesAutoresizingMaskIntoConstraints = false
        addSubview(subtitleLabel)
        subtitleLabel.alignTopEdge(withView: artistName, predicate: "30")
        subtitleLabel.alignLeadingEdge(withView: artworkImage, predicate: "90")
        subtitleLabel.constrainHeight("20")
        
        self.artworkTitle = subtitleLabel
    }
    
    func addPriceLabel() {
        let priceLabel = ARSansSerifLabel().then {
            $0.text = artwork.price
            $0.font = UIFont.displaySansSerifFont(withSize: 20)
            $0.backgroundColor = .clear
            $0.textColor = UIColor.artsyGrayLight()
            $0.textAlignment = .left
        }
        priceLabel.translatesAutoresizingMaskIntoConstraints = false
        addSubview(priceLabel)
        priceLabel.alignTopEdge(withView: artworkTitle, predicate: "30")
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
    
    func addHeartView() {
        let heartView = ARHeartButton()
        heartView.translatesAutoresizingMaskIntoConstraints = false
        heartView.addTarget(self, action: #selector(MetadataInARArtworkView.didTapHeartButton(sender:)), for: .touchUpInside)
        addSubview(heartView)
        
//        heartView.constrainTrailingSpace(toView: self, predicate: "10")
        heartView.alignTopEdge(withView: self, predicate: "40")
//        heartView.constrainTopSpace(toView: self, predicate: "20")
        heartView.alignTrailingEdge(withView: self, predicate: "-10")
        heartView.constrainWidth("40")
        heartView.constrainHeight("40")
        
        self.heartButton = heartView
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
        }, failure: { err in
            
        })
        
        artwork.update()
    }
    
    @objc func didTapHeartButton(sender: UIButton) {
        let status: ARHeartStatus = heartButton.status == .yes ? ARHeartStatus.no : .yes
        heartButton.setStatus(status, animated: true)
        artwork.setFollowState(true, success: nil, failure: nil)
    }
}

