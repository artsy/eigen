import Quick
import Nimble

@testable
import Artsy

class RefineGeneSettingsTests: QuickSpec {
    func jsonForStub(name: String) -> [String: AnyObject] {
        let url = NSBundle(forClass: RefineGeneSettingsTests.self).URLForResource(name, withExtension: "json")
        let data = NSData(contentsOfURL: url!)
        return try! NSJSONSerialization.JSONObjectWithData(data!, options: []) as! [String: AnyObject]
    }

    override func spec() {

        it("Creates a Gene with rich data") {
            let json = self.jsonForStub("gene_refine_example_full")
            guard let gene = GeneRefineSettings.refinementFromAggregationJSON(json ) else { return fail() }

            expect(gene.medium.id) == "photography"
            expect(gene.sort).to( equal(GeneSortingOrder.LeastExpensive) )
            expect(gene.mediums.map({ $0.id })) == ["prints", "painting", "work-on-paper", "photography", "sculpture", "design", "drawing", "installation", "film-slash-video", "performance-art", "jewelry"]
            expect(gene.priceRange?.min) == 0
            expect(gene.priceRange?.max) == 50_000
        }

        // JSON can have no prices ( see the gene with ID "500-1000-ce" )
        // https://www.artsy.net/gene/500-1000-ce

        it("Creates a Gene with less data") {
            let json = self.jsonForStub("gene_refine_example_short_medium")
            guard let gene = GeneRefineSettings.refinementFromAggregationJSON(json ) else { return fail() }

            expect(gene.medium.id) == "prints"
            expect(gene.sort).to( equal(GeneSortingOrder.RecentlyAdded) )
            expect(gene.mediums.map({ $0.id })) == ["prints"]
            expect(gene.priceRange).to(beFalsy())
        }
    }
}