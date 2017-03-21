import Quick
import Nimble

@testable
import Artsy

class RefineGeneSettingsTests: QuickSpec {
    func jsonForStub(_ name: String) -> [String: AnyObject] {
        let url = Bundle(for: RefineGeneSettingsTests.self).url(forResource: name, withExtension: "json")
        let data = try? Data(contentsOf: url!)
        return try! JSONSerialization.jsonObject(with: data!, options: []) as! [String: AnyObject]
    }

    override func spec() {

        it("Creates a Gene with rich data") {
            let json = self.jsonForStub("gene_refine_example_full")
            guard let gene = GeneRefineSettings.refinementFromAggregationJSON(json, initial: true) else { return fail() }

            expect(gene.medium?.id) == "photography"
            expect(gene.sort).to( equal(GeneSortingOrder.MostExpensive) )
            expect(gene.mediums.map({ $0.id })) == ["*", "prints", "painting", "work-on-paper", "photography", "sculpture", "design", "drawing", "installation", "film-slash-video", "performance-art", "jewelry"]
            expect(gene.priceRange?.min) == 0
            expect(gene.priceRange?.max) == 50_000_00
        }

        // JSON can have no prices ( see the gene with ID "500-1000-ce" )
        // https://www.artsy.net/gene/500-1000-ce

        it("Does not create a Gene with zero price data") {
            let json = self.jsonForStub("gene_refine_example_short_no_prize_medium")
            let gene = GeneRefineSettings.refinementFromAggregationJSON(json, initial: true)
            expect(gene).to(beNil())
        }

        // JSON can have no prices ( see the gene with ID "500-1000-ce" )
        // https://www.artsy.net/gene/500-1000-ce

        it("Creates a Gene with less data") {
            let json = self.jsonForStub("gene_refine_example_medium_price")
            guard let gene = GeneRefineSettings.refinementFromAggregationJSON(json, initial: true) else { return fail() }

            expect(gene.medium?.id) == "prints"
            expect(gene.sort).to( equal(GeneSortingOrder.RecentlyUpdated) )
            expect(gene.mediums.map({ $0.id })) == ["*", "prints"]
            expect(gene.priceRange?.min) == 0
            expect(gene.priceRange?.max) == 10_000_00
        }
      
        it("Creates a Gene with a price range that spans the full price spectrum") {
            let json = self.jsonForStub("gene_refine_example_medium_price")
            guard let gene = GeneRefineSettings.refinementFromAggregationJSON(json, initial: false) else { return fail() }
            
            expect(gene.priceRange?.min) == 0
            expect(gene.priceRange?.max) == 10_000_00
        }
    }
}
