# iOS Widget Architecture Documentation

## Overview

The Artsy iOS app implements native widgets using Apple's WidgetKit framework. There are two main widgets: **FullBleed** (Featured Artworks) and **LatestArticles** (Editorial). This document outlines the architecture, data sources, and data flow for these widgets.

## Entry Point

**Main Entry Point:** `ios/ArtsyWidget/ArtsyWidgets.swift:4`
The app registers widgets using SwiftUI's `@main` WidgetBundle:

```swift
@main
struct ArtsyWidgets: WidgetBundle {
    var body: some Widget {
        FullBleed.Widget()
        LatestArticles.Widget()
    }
}
```

## Widget Architecture

### 1. FullBleed Widget (Featured Artworks)

**Location:** `ios/ArtsyWidget/FullBleed/`

#### Key Components:

- **Widget Configuration:** `FullBleed+Widget.swift:11` - Defines widget metadata and supported families
- **Timeline Provider:** `FullBleed+Provider.swift:5` - Implements `TimelineProvider` protocol
- **Timeline Generator:** `FullBleed+Timeline.swift:5` - Creates widget update schedule
- **View:** `FullBleed+View.swift` - SwiftUI view implementation

#### Data Flow:

1. **Widget Request:** iOS calls `getTimeline()` in `FullBleed+Provider.swift:15`
2. **Timeline Generation:** `FullBleed+Timeline.swift:5` triggers `ArtworkStore.fetch()`
3. **Data Fetching:**
   - **Source:** S3-hosted JSON feed at `https://artsy-public.s3.amazonaws.com/artworks-of-the-day/{YYYY-MM-DD}.json`
   - **Implementation:** `ArtworkStore.swift:42`
   - **Format:** Array of `Artwork` objects with metadata and image tokens
4. **Image Processing:**
   - **Token Processing:** Extracts `geminiToken` from artwork images (`Artwork.swift:21`)
   - **Image URLs:** Constructs optimized image URLs via Gemini CDN (`ImageUrl.swift:6`)
   - **CDN Endpoint:** `https://d7hftxdivxxvm.cloudfront.net/`
   - **Image Fetching:** Downloads 4 artwork images concurrently using Combine (`ArtworkStore.swift:68`)
5. **Timeline Creation:**
   - **Update Schedule:** 4 times daily at 8am, 12pm, 4pm, 8pm (`Schedule.swift:10`)
   - **Next Update:** 20 hours after morning update (`Schedule.swift:31`)

### 2. LatestArticles Widget (Editorial)

**Location:** `ios/ArtsyWidget/LatestArticles/`

#### Key Components:

- **Widget Configuration:** `LatestArticles+Widget.swift` - Widget metadata
- **Timeline Provider:** `LatestArticles+Provider.swift:5` - Timeline provider implementation
- **Timeline Generator:** `LatestArticles+Timeline.swift:6` - Creates article timeline
- **View:** `LatestArticles+View.swift` - Article display view

#### Data Flow:

1. **Widget Request:** iOS calls `getTimeline()` in `LatestArticles+Provider.swift:15`
2. **Data Fetching:**
   - **Source:** RSS feed at `https://www.artsy.net/rss/news`
   - **Implementation:** `ArticleStore.swift:27`
   - **Parser:** XML parsing using `XMLParser` and `ArticleParser` delegate
3. **Timeline Creation:** Generates entries from parsed RSS articles

## Data Sources Summary

| Widget             | Data Source                                                             | Format  | Update Frequency    |
| ------------------ | ----------------------------------------------------------------------- | ------- | ------------------- |
| **FullBleed**      | `https://artsy-public.s3.amazonaws.com/artworks-of-the-day/{date}.json` | JSON    | 4x daily            |
| **LatestArticles** | `https://www.artsy.net/rss/news`                                        | RSS/XML | On timeline refresh |

## Image Processing Pipeline

### FullBleed Widget Images:

1. **Source:** Artwork metadata contains `geminiToken` for each image
2. **CDN Processing:** `ImageUrl.swift:6` constructs URLs with:
   - Gemini CDN base: `https://d7hftxdivxxvm.cloudfront.net/`
   - Dynamic sizing based on widget dimensions and device scale
   - WebP conversion for optimization (`convert_to=webp`)
   - Quality compression (`quality=50`)
3. **Concurrent Download:** Uses Combine's `Publishers.Zip4` to fetch 4 images simultaneously
4. **Widget Display:** Images cycle through the day based on update schedule

## Analytics & Monitoring

**Analytics Service:** Volley reporting system (`VolleyClient.swift:5`)

- **Endpoint:** `https://volley.artsy.net/report`
- **Metrics:** Tracks widget timeline requests with widget type and family tags
- **Implementation:** Called on every `getTimeline()` request

## Key Files Reference

| Component            | File Path                                      | Purpose                |
| -------------------- | ---------------------------------------------- | ---------------------- |
| **Main Bundle**      | `ios/ArtsyWidget/ArtsyWidgets.swift:4`         | Widget registration    |
| **Artwork Data**     | `ios/ArtsyWidget/Models/ArtworkStore.swift:11` | S3 data fetching       |
| **Article Data**     | `ios/ArtsyWidget/Models/ArticleStore.swift:8`  | RSS feed parsing       |
| **Image Processing** | `ios/ArtsyWidget/Shared/ImageUrl.swift:6`      | CDN image optimization |
| **Update Schedule**  | `ios/ArtsyWidget/Shared/Schedule.swift:6`      | Timeline generation    |
| **Analytics**        | `ios/ArtsyWidget/Models/VolleyClient.swift:7`  | Usage reporting        |

## Widget Update Mechanism

iOS widgets use a timeline-based update system:

1. **Provider Pattern:** Each widget implements `TimelineProvider`
2. **Timeline Entries:** Each entry contains data + display date
3. **Update Policy:** Specifies next refresh time
4. **Background Execution:** iOS manages widget updates based on usage patterns

The system is designed for efficiency, pre-fetching content and scheduling updates to minimize battery impact while keeping content fresh.
