// swift-tools-version:4.2

import PackageDescription

let package = Package(
    name: "Eigen",
    dependencies: [
      .package(url: "https://github.com/danger/swift.git", from: "0.8.0")
    ],
    targets: [
        // This is just an arbitrary Swift file in the app, that has
        // no dependencies outside of Foundation, the dependencies section
        // ensures that the library for Danger gets build also.
        .target(name: "eigen", dependencies: ["Danger"], path: "Artsy", sources: ["Stringify.swift"]),
    ]
)
