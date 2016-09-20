import UIKit
import ORStackView
import Foundation

class ModernGeneViewController: UIViewController {
    let geneID: String
    var viewModel: GeneViewModel!
    
    var headerStack: ORStackView!
    var geneDescriptionView: ARTextView!
    
    private var artworksViewController: AREmbeddedModelsViewController!
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
    
    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated)
        
        ar_presentIndeterminateLoadingIndicatorAnimated(ARPerformWorkAsynchronously.boolValue)
        
        networkModel.getGene { [weak self] viewModel in
            self?.viewModel = viewModel
            self?.setupSubviews()
        }
    }
    
    func setupSubviews() {
        guard viewModel == viewModel else { return; }
                
        headerStack = ORStackView()
        headerStack.bottomMarginHeight = 20
        
        headerStack.addPageTitleWithString(viewModel.displayName)
        headerStack.addWhiteSpaceWithHeight("20")
        
        if self.traitCollection.horizontalSizeClass == UIUserInterfaceSizeClass.Regular {
            geneDescriptionView = ARTextView()
        } else {
            let descriptionView = ARCollapsableTextView()
            descriptionView.expansionBlock = { [weak self] textView in
                self?.viewWillLayoutSubviews()
            }
            geneDescriptionView = descriptionView
        }

        geneDescriptionView.viewControllerDelegate = self
        headerStack.addSubview(geneDescriptionView, withTopMargin: "20", sideMargin: "40")
        
        if viewModel.geneHasDescription {
            geneDescriptionView.setMarkdownString(viewModel.geneDescription)
        }
        
        artworksViewController = AREmbeddedModelsViewController()
        
        ar_addAlignedModernChildViewController(artworksViewController)
        artworksViewController.headerView = headerStack
        artworksViewController.showTrailingLoadingIndicator = false
        artworksViewController.delegate = self
        
        headerStack.setNeedsLayout()
        headerStack.layoutIfNeeded()
        view.setNeedsLayout()
        view.layoutIfNeeded()

    }
}

private typealias TextViewCallbacks = ModernGeneViewController
extension TextViewCallbacks: ARTextViewDelegate {
    func textView(textView: ARTextView!, shouldOpenViewController viewController: UIViewController!) {
        self.navigationController?.pushViewController(viewController, animated: true)
    }
}

private typealias EmbeddedModelCallbacks = ModernGeneViewController
extension EmbeddedModelCallbacks: ARModelInfiniteScrollViewControllerDelegate {
    func embeddedModelsViewController(controller: AREmbeddedModelsViewController!, didTapItemAtIndex index: UInt) {
    }
    
    func embeddedModelsViewController(controller: AREmbeddedModelsViewController!, shouldPresentViewController viewController: UIViewController!) {
        navigationController?.pushViewController(viewController, animated: true)
    }
}
