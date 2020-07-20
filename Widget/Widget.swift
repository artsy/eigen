import WidgetKit
import SwiftUI


struct Provider: TimelineProvider {
    public typealias Entry = SimpleEntry

    public func snapshot(with context: Context, completion: @escaping (SimpleEntry) -> ()) {
        fetch { (dict, error) in
            if (dict != nil) {
//                let entry = SimpleEntry(date: Date())
//                completion(entry)
            }
        }
    }

    public func timeline(with context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        fetch { (dict, error) in
            if (dict != nil) {

                let arr: [NSDictionary] = ((dict!["data"] as! NSDictionary)["homePage"] as! NSDictionary)["artworkModules"] as! [NSDictionary]
                let artworksData = arr.map { (d) -> Dictionary<String, String> in
                    var ret = Dictionary<String, String>()
                    ret["url"] = (d["results"] as! [NSDictionary]).first!["imageUrl"] as? String
                    ret["href"] = (d["results"] as! [NSDictionary]).first!["href"] as? String
                    return ret
                }

                var images = Dictionary<String, UIImage>()

                let imgData = try! Data(contentsOf: URL(string: artworksData.first!["url"]!)!)

                images[artworksData.first!["url"]!] = UIImage(data: imgData)

                var entries: [SimpleEntry] = []

                // Generate a timeline consisting of five entries an hour apart, starting from the current date.
                let currentDate = Date()
                for hourOffset in 0 ..< 5 {
                    let entryDate = Calendar.current.date(byAdding: .hour, value: hourOffset, to: currentDate)!
                    let entry = SimpleEntry(date: entryDate, image: images[artworksData.first!["url"]!]!, href: "artry://\(artworksData.first!["href"]!)")
                    entries.append(entry)
                }

                let timeline = Timeline(entries: entries, policy: .atEnd)
                completion(timeline)
            }
        }
    }
}

struct SimpleEntry: TimelineEntry {
    public let date: Date
    public let image: UIImage
    public let href: String

}

struct PlaceholderView : View {
    var body: some View {
        Text("placeholder")
    }
}

struct widgetEntryView : View {
    var entry: Provider.Entry

    var body: some View {
        Link(destination: URL(string: entry.href)!) {
            Image(uiImage: entry.image)
                .resizable()
        }
    }
}

@main
struct widget: Widget {
    private let kind: String = "widget"

    public var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider(), placeholder: PlaceholderView()) { entry in
            widgetEntryView(entry: entry)
        }
        .configurationDisplayName("My Widget")
        .description("This is an example widget.")
    }
}


var alreadyFetching = false

func fetch(completion: @escaping (NSDictionary?, Error?) -> Void) {
    let headers = ["content-type": "application/json"]
    let parameters = ["query": "query {homePage{artworkModules{results{imageUrl href}}}}"] as [String : Any]

    let postData = try! JSONSerialization.data(withJSONObject: parameters, options: [])

    let request = NSMutableURLRequest(url: NSURL(string: "https://metaphysics-staging.artsy.net/v2")! as URL, cachePolicy: .useProtocolCachePolicy, timeoutInterval: 10.0)
    request.httpMethod = "POST"
    request.allHTTPHeaderFields = headers
    request.httpBody = postData as Data

    let session = URLSession.shared
    let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
        alreadyFetching = false

        if (error != nil) {
            print(error!)
            completion(nil, error)
        } else {
            let dict = try! JSONSerialization.jsonObject(with: data!, options: .allowFragments) as? NSDictionary
            print(dict!)
            completion(dict, nil)
        }
    })

    if (!alreadyFetching) {
        alreadyFetching = true
        dataTask.resume()
    }
}
