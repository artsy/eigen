import SwiftUI

struct PrimaryText: View {
    let name: String
    var color: Color = .black
    
    var body: some View {
        let font = Font.system(size: 12, weight: .medium)
        
        Text(name)
            .font(font)
            .foregroundColor(color)
    }
}
