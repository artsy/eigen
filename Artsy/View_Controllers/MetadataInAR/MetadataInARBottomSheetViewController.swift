//
//  MetadataInARBottomSheetViewController.swift
//  Artsy
//
//  Created by Luc Succes on 11/15/18.
//  Copyright © 2018 Artsy. All rights reserved.
//

import UIKit

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
        
        
        let gesture = UIPanGestureRecognizer.init(target: self, action: #selector(MetadataInARBottomSheetViewController.panGesture))
        view.addGestureRecognizer(gesture)
        
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
            let yComponent = UIScreen.main.bounds.height - 240
            self?.view.frame = CGRect(x: 0, y: yComponent, width: frame!.width, height: frame!.height)
        }
    }
    
    func prepareBackgroundView(){
        let blurEffect = UIBlurEffect.init(style: .dark)
        let visualEffect = UIVisualEffectView.init(effect: blurEffect)
        let blurredView = UIVisualEffectView.init(effect: blurEffect)
        blurredView.contentView.addSubview(visualEffect)

        visualEffect.frame = UIScreen.main.bounds
        blurredView.frame = UIScreen.main.bounds
        
        view.insertSubview(blurredView, at: 0)
    }
    
    @objc func panGesture(recognizer: UIPanGestureRecognizer) {
        let translation = recognizer.translation(in: self.view)
        let y = self.view.frame.minY
        self.view.frame = CGRect(x: 0, y: y + translation.y, width: view.frame.width, height: view.frame.height)
        recognizer.setTranslation(CGPoint.zero, in: self.view)
    }
}
