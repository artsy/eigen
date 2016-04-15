import UIKit
import ORStackView
import Foundation

class ModernGeneViewController: UIViewController {
    let geneID: String
    var viewModel: GeneViewModel!
    
    var headerStack: ORStackView!
    
    private var artworksViewController: ARModelInfiniteScrollViewController!
    private var activeModule: ARArtworkMasonryModule?
    
    lazy var networkModel: ARGeneArtworksNetworkModel = {
        return ARGeneArtworksNetworkModel(geneID: self.geneID)
    }()
    
    init(geneID: String) {
        self.geneID = geneID
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder aDecoder: NSCoder) {
        return nil
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.ar_presentIndeterminateLoadingIndicatorAnimated(ARPerformWorkAsynchronously.boolValue)
        
        headerStack = ORStackView()
        
        self.view.addSubview(headerStack)
        headerStack.alignTop("20", leading: "30", toView: view)
        
//         suggestions for error handling anyone?
        self.networkModel.viewModel({ [weak self] viewModel in
            self?.viewModel = viewModel
            self?.headerStack.addPageTitleWithString(viewModel.displayName)

        })
        
    }
}