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

    func displayName() -> String {
        return gene.name
    }
}
