# Artsy Widgets

This document provides a side-by-side comparison of widget implementations across iOS and Android platforms.

## Widget Overview

Both platforms support two widget types with identical functionality and visual design. The widgets update automatically and fetch data from the same Artsy APIs.

| Feature              | iOS                 | Android                                            |
| -------------------- | ------------------- | -------------------------------------------------- |
| **Framework**        | SwiftUI + WidgetKit | Android App Widgets                                |
| **Location**         | `ios/ArtsyWidget/`  | `android/app/src/main/java/net/artsy/app/widgets/` |
| **Min OS Version**   | iOS 14+             | As per build.gradle                                |
| **Update Mechanism** | Timeline-based      | AlarmManager-based                                 |

## Widget Types

### FullBleed Widget ("New This Week")

**Common Features:**

- Display Name: "New This Week"
- Description: "A curated selection of newly uploaded works from galleries, fairs, and auctions."
- Background: White
- Design: Full-bleed artwork image with white Artsy logo (20x20) in top-right corner with 16pt/dp padding
- Click Action: Opens artwork page

| Aspect                    | iOS                                           | Android                                                       |
| ------------------------- | --------------------------------------------- | ------------------------------------------------------------- |
| **Identifier**            | `FullBleedWidget`                             | `FullBleedWidgetProvider`                                     |
| **Supported Sizes**       | `.systemSmall` (2x2)<br/>`.systemLarge` (4x4) | Small (110dp min, 2x2 cells)<br/>Large (resizable to 300dp)   |
| **Layout Implementation** | `FullBleed+View.swift`                        | `widget_fullbleed_small.xml`<br/>`widget_fullbleed_large.xml` |
| **Image Scaling**         | `.scaleEffect(1.3)` with `.scaledToFill()`    | `android:scaleType="centerCrop"`                              |
| **Logo Resource**         | `UIImage(named: "WhiteArtsyLogo")`            | `@drawable/artsy_logo_white`                                  |

### LatestArticles Widget ("Editorial")

**Common Features:**

- Display Name: "Editorial"
- Description: "The latest articles from Artsy Editorial."
- Background: Black
- Design: "Editorial" header text (12sp/pt) + white Artsy logo, article titles (14sp/pt, max 4 lines), "Read More" underlined links
- Text Color: White throughout
- Padding: 16pt/dp all around
- Size Behavior: Small shows single article, Medium/Wide shows two articles side by side

| Aspect                       | iOS                                            | Android                                                                    |
| ---------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------- |
| **Identifier**               | `LatestArticlesWidget`                         | `LatestArticlesWidgetProvider`                                             |
| **Supported Sizes**          | `.systemSmall` (2x2)<br/>`.systemMedium` (4x2) | Small (110dp min, 2x2 cells)<br/>Medium (resizable, 2x4 cells)             |
| **Layout Implementation**    | `LatestArticles+View.swift`                    | `widget_latest_articles_small.xml`<br/>`widget_latest_articles_medium.xml` |
| **Underline Implementation** | `.underline()` modifier                        | `android:paintFlags="8"`                                                   |
| **Font Implementation**      | `Font.system(size:, weight:)`                  | `android:textSize` + `android:fontFamily="sans-serif"`                     |

## Implementation Architecture

### File Structure

**Common Pattern:** Both platforms separate widget configuration, view/layout, and data handling into distinct files.

| Component         | iOS                       | Android                                 |
| ----------------- | ------------------------- | --------------------------------------- |
| **Main Entry**    | `ArtsyWidgets.swift`      | Widget providers in separate files      |
| **Widget Config** | `{Widget}+Widget.swift`   | `res/xml/{widget}_widget_info.xml`      |
| **View/Layout**   | `{Widget}+View.swift`     | `res/layout/widget_{widget}_{size}.xml` |
| **Data Provider** | `{Widget}+Provider.swift` | Provider methods in widget class        |
| **Data Entry**    | `{Widget}+Entry.swift`    | Data models in `models/` package        |
| **Timeline**      | `{Widget}+Timeline.swift` | Update logic in widget provider         |

### Data Models

**Common Structure:** Both platforms use identical data models with platform-appropriate types.

| Model                 | iOS                             | Android                             |
| --------------------- | ------------------------------- | ----------------------------------- |
| **Artwork**           | `image: UIImage?`               | `image: Bitmap?`                    |
| **Image Collections** | `artworkImages: [ArtworkImage]` | `artworkImages: List<ArtworkImage>` |
| **Date Handling**     | DateFormatter with RSS patterns | SimpleDateFormat with RSS patterns  |

### Data Fetching

**Common Sources:**

- Daily Artworks: `https://artsy-public.s3.amazonaws.com/artworks-of-the-day/{date}.json`
- Editorial RSS: `https://www.artsy.net/rss/news`
- Image Proxy: `https://d7hftxdivxxvm.cloudfront.net/?{params}` (Gemini)

| Aspect                     | iOS                          | Android                       |
| -------------------------- | ---------------------------- | ----------------------------- |
| **HTTP Client**            | URLSession.dataTaskPublisher | HttpURLConnection             |
| **Async Pattern**          | Combine Publishers           | Kotlin Coroutines             |
| **JSON Parsing**           | JSONDecoder                  | JSONArray/JSONObject          |
| **XML Parsing**            | XMLParser + ArticleParser    | SAXParser with DefaultHandler |
| **Parallel Image Loading** | Combine Zip4                 | Suspend functions             |

## Update Scheduling

**Common Behavior:** Both platforms update widgets periodically to show fresh content while preserving battery life.

| Platform    | Schedule                                                                | Configuration                                      |
| ----------- | ----------------------------------------------------------------------- | -------------------------------------------------- |
| **iOS**     | Custom times: 8am, 12pm, 4pm, 8pm<br/>Next update: +20 hours from first | `Schedule.swift`<br/>`.after(schedule.nextUpdate)` |
| **Android** | Every 4 hours (14400000ms)                                              | `android:updatePeriodMillis="14400000"`            |

## Configuration & Registration

### iOS Configuration

```swift
@main
struct ArtsyWidgets: WidgetBundle {
    var body: some Widget {
        FullBleed.Widget()
        LatestArticles.Widget()
    }
}
```

### Android Configuration

```xml
<receiver android:name=".widgets.FullBleedWidgetProvider" android:exported="true">
  <intent-filter>
    <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
  </intent-filter>
  <meta-data android:name="android.appwidget.provider"
    android:resource="@xml/fullbleed_widget_info" />
</receiver>
```

## Error Handling & Fallbacks

**Common Strategy:** Both platforms provide fallback content when network requests fail or data is unavailable.

| Scenario            | iOS                               | Android                                             |
| ------------------- | --------------------------------- | --------------------------------------------------- |
| **No Network**      | `Fixtures.primaryArtwork/Article` | `Artwork.fallback()` / `generateFallbackArticles()` |
| **API Failure**     | Timeline with fallback entries    | Default RemoteViews with fallback data              |
| **Image Load Fail** | Widget renders without image      | Keeps default background                            |

## Platform-Specific Features

### iOS Only

- SwiftUI Previews for development
- Container Background API (iOS 17+)
- Volley analytics integration
- Multiple tap targets with Link views

### Android Only

- Resize constraints with min/max dimensions
- Vector drawable logo asset
- Separate layout files per widget size
- Fine-grained PendingIntent click handling

## Installation Process

**Common Flow:** Both platforms allow users to add widgets from the home screen widget picker.

| Platform    | User Flow                                                                            |
| ----------- | ------------------------------------------------------------------------------------ |
| **iOS**     | Long-press home screen → "+" → Search "Artsy" → Select widget → Choose size          |
| **Android** | Long-press home screen → "Widgets" → Find "Artsy" → Select widget → Resize and place |
