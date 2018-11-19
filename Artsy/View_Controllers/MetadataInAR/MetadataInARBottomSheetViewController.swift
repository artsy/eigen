//
//  MetadataInARBottomSheetViewController.swift
//  Artsy
//
//  Created by Luc Succes on 11/15/18.
//  Copyright © 2018 Artsy. All rights reserved.
//

import UIKit

@available(iOS 10.0, *)
class MetadataInARBottomSheetViewController: UIViewController {
    var artworkMetadataView: MetadataInARArtworkView!
    var artwork: Artwork

    init(artwork: Artwork) {
        self.artwork = artwork
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        view.backgroundColor = nil
        view.layer.cornerRadius = 10
        view.clipsToBounds = true
        
        artworkMetadataView = MetadataInARArtworkView(artwork: artwork)
        artworkMetadataView.frame = view.bounds
        view.addSubview(artworkMetadataView)
        
        
//        let gesture = UIPanGestureRecognizer.init(target: self, action: #selector(MetadataInARBottomSheetViewController.panGesture))
//        view.addGestureRecognizer(gesture)
        
        let tapGesture = UITapGestureRecognizer.init(target: self, action: #selector(MetadataInARBottomSheetViewController.tapGesture(recognizer:)))
        artworkMetadataView.addGestureRecognizer(tapGesture)
        artworkMetadataView.updateWithArtwork(artwork: artwork)
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        prepareBackgroundView()
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        UIView.animate(withDuration: 0.3) { [weak self] in
            let frame = self?.view.frame
            let yComponent = UIScreen.main.bounds.height - 260
            self?.view.frame = CGRect(x: 0, y: yComponent, width: frame!.width, height: frame!.height)
        }
    }
    
    func prepareBackgroundView(){
        let blurEffect = UIBlurEffect.init(style: .dark)
        let blurredView = UIVisualEffectView.init(effect: blurEffect)
        blurredView.frame = UIScreen.main.bounds
        
        view.insertSubview(blurredView, at: 0)
    }
    
    @objc func panGesture(recognizer: UIPanGestureRecognizer) {
        let translation = recognizer.translation(in: self.view)
        let y = self.view.frame.minY

        view.frame = CGRect(x: 0, y: y + translation.y, width: view.frame.width, height: view.frame.height)
        recognizer.setTranslation(CGPoint.zero, in: view)
    }
    
    @objc func tapGesture(recognizer: UITapGestureRecognizer) {
        if let artworkVC = ARSwitchBoard.sharedInstance().loadArtwork(withID: artwork.artworkID, in: artwork.fair()) {
            navigationController?.pushViewController(artworkVC, animated: true)
        }
    }
}
