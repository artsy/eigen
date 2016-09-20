import Foundation

class GeneViewModel: NSObject {
    private let gene: Gene

    init(gene: Gene) {
        self.gene = gene
    }

    var geneHasDescription: Bool {
        return gene.geneDescription.characters.count > 0
    }
    
    var geneDescription: String {
        return gene.geneDescription
    }

    var displayName: String {
        return gene.name
    }
    
    var sharingController: ARSharingController {
        return ARSharingController.init(object: gene, thumbnailImageURL: gene.smallImageURL())
    }
    
    var analyticsDictionary: NSDictionary? {
        guard gene == gene else { return nil }
        return [ "gene" : gene.geneID, "type" : "gene" ]
    }

    var userActivityEntity: Gene {
        return gene
    }
}
