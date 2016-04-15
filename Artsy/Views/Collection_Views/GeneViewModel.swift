import Foundation

class GeneViewModel: NSObject {
    private let gene: Gene

    init(gene: Gene) {
        self.gene = gene
    }
}


extension GeneViewModel {
    func geneHasDescription() -> Bool {
        return gene.geneDescription.characters.count > 0
    }
    
    func geneDescription() -> String {
        return gene.geneDescription
    }

    func displayName() -> String {
        return gene.name
    }
    
    func getFollowState(success: ARHeartStatus -> Void, failure: ((NSError!)) -> Void) {
        gene.getFollowState(success, failure: failure)
    }
    
    func sharingController() -> ARSharingController {
        return ARSharingController.init(object: gene, thumbnailImageURL: gene.smallImageURL())
    }
    
    func analyticsDictionary() -> NSDictionary? {
        guard gene == gene else { return nil }
        return [ "gene" : gene.geneID, "type" : "gene" ]
    }
    
    func userActivityEntity() -> Gene {
        return gene
    }
}
