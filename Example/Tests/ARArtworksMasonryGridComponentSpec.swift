// https://github.com/Quick/Quick

import Quick
import Nimble
import Emission

import React
import SDWebImage

class ARArtworksMasonryGridComponentSpec: QuickSpec {
    override func spec() {
        let testBundle = NSBundle(forClass: ARArtworksMasonryGridComponentSpec.self)

        // Load fixture JSON data once.

        let artworksJSONLoader = { (name: String!) -> (NSDictionary!) in
            let data = NSData(contentsOfURL: testBundle.URLForResource(name, withExtension: "json")!)!
            let artworks = try! NSJSONSerialization.JSONObjectWithData(data, options: NSJSONReadingOptions(rawValue: 0))
            return artworks as! NSDictionary
        }

        let artworksPage1 = artworksJSONLoader("rembrandt-harmensz-van-rijn-1_page-1")
        let artworksPage2 = artworksJSONLoader("rembrandt-harmensz-van-rijn-1_page-2")

        // Ensure the tests do not hit the network for images.

        let cache = SDImageCache.init(namespace: "test-fixtures", diskCacheDirectory:testBundle.resourcePath)
        SDWebImageManager.sharedManager().setValue(cache, forKey: "_imageCache")

        (artworksPage2.valueForKeyPath("data.artist.artworks") as! Array<AnyObject>).forEach { (artwork) -> () in
            let URL = NSURL(string: (artwork as! NSDictionary).valueForKeyPath("image.resized.url") as! String)
            assert(SDWebImageManager.sharedManager().cachedImageExistsForURL(URL))
        }

        // Setup React

        let bridge = RCTBridge(bundleURL: NSURL(string: "http://localhost:8081/index.ios.bundle?platform=ios"),
                          moduleProvider: nil,
                           launchOptions: nil)

        // Tests

        var rootView: RCTRootView?

        beforeEach {
            rootView = RCTRootView(bridge: bridge, moduleName: "ArtworksGrid", initialProperties: nil)
            rootView?.frame = CGRect(x: 0, y: 0, width: 320, height: 640)
        }
        
        it("has data") {
            print(rootView)
        }
    }
}
