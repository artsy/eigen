// swift-tools-version:4.2

import PackageDescription

let package = Package(
    name: "Eigen",
    products: [
        .library(name: "DangerDepsEigen", type: .dynamic, targets: ["eigen"])
    ],
    dependencies: [
      .package(url: "https://github.com/danger/swift.git", from: "1.0.0"),
      .package(url: "https://github.com/jpsim/Yams", from: "1.0.0")
    ],
    targets: [
        // This is just an arbitrary Swift file in the app, that has
        // no dependencies outside of Foundation, the dependencies section
        // ensures that the library for Danger gets build also.
        .target(name: "eigen", dependencies: ["Danger", "Yams"], path: "Artsy", sources: ["Stringify.swift"]),
    ]
)
