import Foundation
import UIKit

// http "https://api.artsy.net/api/v1/artwork/618bee1f7fe317000c0c3e04?access_token=$USER_TOKEN" | jq "._id, .id, .title, .artist.name, .images[0].image_urls.larger"
//"618bee1f7fe317000c0c3e04"
//"alex-katz-brisk-day-iii-5"
//"Brisk Day III"
//"Alex Katz"
//"https://d32dm0rphc51dk.cloudfront.net/pd7rW3I1mXhW0vbAJDVm3Q/larger.jpg"

// http "https://api.artsy.net/api/v1/artwork/61797b9e78605d000c85a1df?access_token=$USER_TOKEN" | jq "._id, .id, .title, .artist.name, .images[0].image_urls.larger"
//"61797b9e78605d000c85a1df"
//"rene-magritte-les-valeurs-personnelles-2"
//"Les Valeurs Personnelles"
//"René Magritte"
//"https://d32dm0rphc51dk.cloudfront.net/qX0FwYdx5eGxF7cx8V6fkw/larger.jpg"

// http "https://api.artsy.net/api/v1/artwork/60be8961cbd491000fdfbeb5?access_token=$USER_TOKEN" | jq "._id, .id, .title, .artist.name, .images[0].image_urls.larger"
//"60be8961cbd491000fdfbeb5"
//"judy-chicago-through-the-flower-2-1"
//"Through the Flower 2"
//"Judy Chicago"
//"https://d32dm0rphc51dk.cloudfront.net/wh7YA3qtmGFEwC611OklJQ/larger.jpg"

// http "https://api.artsy.net/api/v1/artwork/61780dd9909685000b266e1d?access_token=$USER_TOKEN" | jq "._id, .id, .title, .artist.name, .images[0].image_urls.larger"
//"61780dd9909685000b266e1d"
//"francis-picabia-leglise-de-montigny-effet-dautomne-2"
//"L'église de Montigny, effet d'automne"
//"Francis Picabia"
//"https://d32dm0rphc51dk.cloudfront.net/ZjpYFZIoBhhLCzQow6V7DA/larger.jpg"

enum Fixtures {}

extension Fixtures {
    static var primaryArticle: Article {
        let image = UIImage(named: "PrimaryArticleImage")!
        let url = URL(string: "https://www.artsy.net/article/artsy-editorial-5-things-collecting-figurative-paintings")!
        
        let article = Article(
            image: image,
            pubDate: "Sep 8",
            title: "5 Things to Know about Collecting Figurative Paintings",
            url: url
        )
        
        return article
    }
    
    static var secondaryArticle: Article {
        let image = UIImage(named: "SecondaryArticleImage")!
        let url = URL(string: "https://www.artsy.net/article/artsy-editorial-new-collectors-guide-understanding-art-pricing")!
        
        let article = Article(
            image: image,
            pubDate: "Apr 3",
            title: "The New Collector’s Guide to Understanding Art Pricing",
            url: url
        )
        
        return article
    }
    
    static var tertiaryArticle: Article {
        let image = UIImage(named: "TertiaryArticleImage")!
        let url = URL(string: "https://www.artsy.net/article/artsy-editorial-9-artsy-vanguard-alumni-leading-contemporary-artists")!
        
        let article = Article(
            image: image,
            pubDate: "Nov 15",
            title: "How 9 Artsy Vanguard Alumni Have Become Leading Contemporary Artists",
            url: url
        )
        
        return article
    }
    
    static var quaternaryArticle: Article {
        let image = UIImage(named: "QuaternaryArticleImage")!
        let url = URL(string: "https://www.artsy.net/article/artsy-editorial-artsy-insider-frieze-weeks-breakout-artists")!
        
        let article = Article(
            image: image,
            pubDate: "Oct 24",
            title: "Artsy Insider: Frieze Week’s Breakout Artists",
            url: url
        )
        
        return article
    }
    
    static var primaryArtwork: Artwork {
        let artist = Artist(name: "Alex Katz")
        let artworkImage = ArtworkImage(geminiToken: "pd7rW3I1mXhW0vbAJDVm3Q")
        let image = UIImage(named: "PrimaryArtworkImage")!
        let artwork = Artwork(
            artist: artist,
            artworkImages: [artworkImage],
            id: "alex-katz-brisk-day-iii-5",
            title: "Brisk Day III",
            image: image
        )
        
        return artwork
    }
    
    static var secondaryArtwork: Artwork {
        let artist = Artist(name: "René Magritte")
        let artworkImage = ArtworkImage(geminiToken: "qX0FwYdx5eGxF7cx8V6fkw")
        let image = UIImage(named: "SecondaryArtworkImage")!
        let artwork = Artwork(
            artist: artist,
            artworkImages: [artworkImage],
            id: "mickalene-thomas-tiffona-lisa",
            title: "Les Valeurs Personnelles",
            image: image
        )
        
        return artwork
    }
    
    static var tertiaryArtwork: Artwork {
        let artist = Artist(name: "Judy Chicago")
        let artworkImage = ArtworkImage(geminiToken: "wh7YA3qtmGFEwC611OklJQ")
        let image = UIImage(named: "TertiaryArtworkImage")!
        let artwork = Artwork(
            artist: artist,
            artworkImages: [artworkImage],
            id: "judy-chicago-through-the-flower-2-1",
            title: "Through the Flower 2",
            image: image
        )
        
        return artwork
    }
    
    static var quaternaryArtwork: Artwork {
        let artist = Artist(name: "Francis Picabia")
        let artworkImage = ArtworkImage(geminiToken: "ZjpYFZIoBhhLCzQow6V7DA")
        let image = UIImage(named: "QuaternaryArtworkImage")!
        let artwork = Artwork(
            artist: artist,
            artworkImages: [artworkImage],
            id: "francis-picabia-leglise-de-montigny-effet-dautomne-2",
            title: "L'église de Montigny, effet d'automne",
            image: image
        )
        
        return artwork
    }
}
