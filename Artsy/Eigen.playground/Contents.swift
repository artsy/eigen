import Foundation

let string = "eyJhdWQiOiJhdWN0aW9ucyIsInJvbGUiOiJiaWRkZXIiLCJ1c2VySWQiOiI0ZWM5MmNjYjU2YWU4ODAwMDEwMDAzOGUiLCJzYWxlSWQiOiI1NzU1YjA3YzVmOWY4ZjVjYjYwMDAwMDIiLCJiaWRkZXJJZCI6Ijk0MDIxNiIsImlhdCI6MTQ2NTI0MzkxMzIxMX0"

let stringData = string.data(using: String.Encoding.utf8)

//let decodedData = NSData(base64EncodedString: string, options:[.IgnoreUnknownCharacters])
//let decodedData = NSData(base64EncodedData:stringData!, options:[.IgnoreUnknownCharacters])

let paddedLength = string.characters.count + (4 - (string.characters.count % 4))
let correctBase64String = string.padding(toLength: paddedLength, withPad: "=", startingAt: 0)


let decodedData = NSData(base64Encoded: correctBase64String, options: [.ignoreUnknownCharacters])



//let decodedString = NSString(data: decodedData, encoding: NSUTF8StringEncoding)

if let data = decodedData {
    let result = NSString(data: data as Data, encoding: String.Encoding.utf8.rawValue)
}
