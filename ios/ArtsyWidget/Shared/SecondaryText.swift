import SwiftUI

struct SecondaryText: View {
    let title: String
    var color: Color = Color(white: 0.40)
    
    var body: some View {
        let font = Font.system(size: 12, weight: .regular)
        
        Text(title)
            .font(font)
            .foregroundColor(color)
    }
}
