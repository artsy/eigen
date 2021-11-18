import Foundation
import SwiftUI
import Combine

typealias ZippedOutputs = (URLSession.DataTaskPublisher.Output, URLSession.DataTaskPublisher.Output, URLSession.DataTaskPublisher.Output, URLSession.DataTaskPublisher.Output)
typealias PublisherCompletionStatus = Subscribers.Completion<URLSession.DataTaskPublisher.Failure>
typealias StoreCompletionHandler = ([Artwork]) -> Void

class ArtworkStore {
    static func fetch(completion: @escaping StoreCompletionHandler) {
        let store = ArtworkStore()
        store.fetch(completion: completion)
    }
    
    var artworks: [Artwork]?
    var cancellable: AnyCancellable?
    var completion: StoreCompletionHandler?
    
    let dateFormatter: DateFormatter
    let decoder: JSONDecoder
    let urlSession: URLSession
    
    init() {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd"
        self.dateFormatter = dateFormatter
        
        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        self.decoder = decoder
        
        self.urlSession = URLSession.shared
    }
    
    func fetch(completion: @escaping StoreCompletionHandler) {
        self.completion = completion
        
        let feedDate = dateFormatter.string(from: Date())
        let feedUrl = "https://artsy-public.s3.amazonaws.com/artworks-of-the-day/\(feedDate).json"
        
        guard
            let dayEndpoint = URL(string: feedUrl)
        else { return }
        
        let dayTask = urlSession.dataTask(with: URLRequest(url: dayEndpoint), completionHandler: handleDayTask)
        dayTask.resume()
    }
    
    func handleDayTask(data: Data?, response: URLResponse?, error: Error?) {
        guard
            let data = data,
            let artworks = try? decoder.decode([Artwork].self, from: data)
        else { return }
        
        self.artworks = artworks
        
        let imageUrls = artworks.map(\.firstImageUrl)
        
        let publishers: [URLSession.DataTaskPublisher] = imageUrls.map() { imageUrl in
            let publisher = self.urlSession.dataTaskPublisher(for: imageUrl)
            return publisher
        }
        
        let cancellable = Publishers.Zip4(publishers[0], publishers[1], publishers[2], publishers[3])
            .sink(receiveCompletion: self.imagesComplete, receiveValue: self.parseOutputs)
        
        self.cancellable = cancellable
    }
    
    func parseOutputs(outputs: ZippedOutputs) {
        guard
            let completion = completion,
            let artworks = artworks
        else { return }
        
        let values = [outputs.0, outputs.1, outputs.2, outputs.3]
        let enhancedArtworks: [Artwork] = values.compactMap() { (data, response) in
            guard
                var artwork = artworks.first(where: { $0.firstImageUrl == response.url }),
                let image = UIImage(data: data)
            else { return nil }
            
            artwork.image = image
            
            return artwork
        }
        
        completion(enhancedArtworks)
    }
    
    func imagesComplete(status: PublisherCompletionStatus) {
        // i should be evaluating the two cases and doing something with failures...
        print(status)
    }
}
