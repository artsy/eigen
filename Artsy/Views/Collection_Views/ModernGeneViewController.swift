import Foundation
import UIKit


class ModernGeneViewController: UIViewController {
    let geneID: String
    var viewModel: GeneViewModel!
    
    init(geneID: String) {
        self.geneID = geneID
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder aDecoder: NSCoder) {
        return nil
    }

    
}