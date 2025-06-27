# Artsy Widgets

This document provides a side-by-side comparison of widget implementations across iOS and Android platforms.

## Widget Overview

The Artsy app includes a "Featured Artworks" widget that displays curated artwork from galleries, fairs, and auctions. The widget updates automatically every 30 minutes and fetches data from Artsy's S3-hosted artwork feeds.

**Note:** iOS has another widget (LatestArticles/Editorial) that is not yet implemented on Android.

| Feature              | iOS                 | Android                                            |
| -------------------- | ------------------- | -------------------------------------------------- |
| **Framework**        | SwiftUI + WidgetKit | Android App Widgets                                |
| **Location**         | `ios/ArtsyWidget/`  | `android/app/src/main/java/net/artsy/app/widgets/` |
| **Min OS Version**   | iOS 14+             | As per build.gradle                                |
| **Update Mechanism** | Timeline-based      | Periodic updates                                   |

## Widget Implementation

### Featured Artworks Widget

**Common Features:**

- Display Name: "Featured Artworks"
- Description: "A curated selection of newly uploaded works from galleries, fairs, and auctions."
- Background: Full-bleed artwork image
- Design: Artwork image fills entire widget with round Artsy app icon (20x20) in top-right corner with 16dp padding
- Click Action: Opens artwork page in Artsy app
- Rotation: Cycles through daily artwork feed on each update

| Aspect                    | iOS                                           | Android                             |
| ------------------------- | --------------------------------------------- | ----------------------------------- |
| **Identifier**            | `FullBleedWidget`                             | `FullBleedWidgetProvider`           |
| **Supported Sizes**       | `.systemSmall` (2x2)<br/>`.systemLarge` (4x4) | Fully resizable (minimum 2x2 cells) |
| **Layout Implementation** | `FullBleed+View.swift`                        | `widget_fullbleed.xml`              |
| **Image Scaling**         | `.scaleEffect(1.3)` with `.scaledToFill()`    | Custom top-crop bitmap processing   |

### LatestArticles Widget (iOS Only)

**iOS Implementation:**

- Display Name: "Editorial"
- Description: "The latest articles from Artsy Editorial"
- Background: Black with white text
- Design: Shows article titles with "Read More" links
