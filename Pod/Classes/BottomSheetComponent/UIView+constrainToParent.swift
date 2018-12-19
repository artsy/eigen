//
//  UIView+constrainToParent.swift
//  Emission
//
//  Created by Luc Succes on 12/19/18.
//

import UIKit

extension UIView {
    
    func constrainToParent() {
        constrainToParent(insets: .zero)
    }
    
    func constrainToParent(insets: UIEdgeInsets) {
        guard let parent = superview else { return }
        
        translatesAutoresizingMaskIntoConstraints = false
        let metrics: [String : Any] = ["left" : insets.left, "right" : insets.right, "top" : insets.top, "bottom" : insets.bottom]
        
        parent.addConstraints(["H:|-(left)-[view]-(right)-|", "V:|-(top)-[view]-(bottom)-|"].flatMap {
            NSLayoutConstraint.constraints(withVisualFormat: $0, metrics: metrics, views: ["view": self])
        })
    }
}
