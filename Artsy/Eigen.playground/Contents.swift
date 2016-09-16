import Foundation

let string = "eyJhdWQiOiJhdWN0aW9ucyIsInJvbGUiOiJiaWRkZXIiLCJ1c2VySWQiOiI0ZWM5MmNjYjU2YWU4ODAwMDEwMDAzOGUiLCJzYWxlSWQiOiI1NzU1YjA3YzVmOWY4ZjVjYjYwMDAwMDIiLCJiaWRkZXJJZCI6Ijk0MDIxNiIsImlhdCI6MTQ2NTI0MzkxMzIxMX0"

let stringData = string.dataUsingEncoding(NSUTF8StringEncoding)

//let decodedData = NSData(base64EncodedString: string, options:[.IgnoreUnknownCharacters])
//let decodedData = NSData(base64EncodedData:stringData!, options:[.IgnoreUnknownCharacters])

let paddedLength = string.characters.count + (4 - (string.characters.count % 4))
let correctBase64String = string.stringByPaddingToLength(paddedLength, withString:"=", startingAtIndex:0)


let decodedData = NSData(base64EncodedString: correctBase64String, options: [.IgnoreUnknownCharacters])



//let decodedString = NSString(data: decodedData, encoding: NSUTF8StringEncoding)

if let data = decodedData {
    let result = NSString(data: data, encoding:NSUTF8StringEncoding)
}
