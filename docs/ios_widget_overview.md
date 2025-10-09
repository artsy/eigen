# iOS Widget Product Overview

## What Are Artsy Widgets?

Artsy offers two iOS home screen widgets that allow users to discover art and editorial content without opening the app. These widgets appear on users' iPhone and iPad home screens and update automatically throughout the day.

## Available Widgets

### 1. Featured Artworks Widget ("New This Week")

**What it shows:** A rotating selection of newly uploaded artworks from galleries, fairs, and auctions

**User experience:**

- Displays a full-screen artwork image with the Artsy logo
- Available in small (2x2) and large (4x4) sizes
- Tapping opens the artwork page in the Artsy app
- Shows 4 different artworks throughout the day

**Content updates:**

- Updates 4 times daily: 8am, 12pm, 4pm, and 8pm
- Each update shows a different curated artwork
- Content is refreshed daily with new artwork selections

### 2. Editorial Widget ("Latest Articles")

**What it shows:** Recent articles from Artsy's editorial team

**User experience:**

- Black background with white text showing article titles
- Displays multiple article headlines
- "Read More" links direct users to articles in the app
- Updates when new editorial content is published

## Content Sources & Curation

### Featured Artworks

- **Source:** Daily curated feeds of newly uploaded works
- **Curation:** Artsy's editorial team selects 4 high-quality artworks daily
- **Criteria:** Focus on works from galleries, fairs, and auctions
- **Quality:** Images are optimized for different screen sizes and device types

### Editorial Content

- **Source:** Artsy's editorial RSS feed
- **Content:** Latest published articles, reviews, and art world news
- **Updates:** Real-time as new content is published

## User Benefits

### Discovery

- Passive art discovery without opening the app
- Exposure to new artists and artworks
- Stay current with art world news and insights

### Engagement

- Easy access to artwork details and purchasing information
- Direct path to editorial content
- Maintains connection with Artsy between app sessions

### Convenience

- No manual refresh needed - content updates automatically
- Customizable widget sizes to fit user's home screen layout
- Quick access to art content throughout the day

## Technical Considerations for Product Decisions

### Performance

- Widgets are designed for minimal battery impact
- Images are optimized for fast loading and reduced data usage
- Update schedule balances freshness with system resource usage

### iOS Integration

- Uses Apple's native WidgetKit framework for best performance
- Follows iOS design guidelines for consistent user experience
- Automatically adapts to light/dark mode settings

### Content Pipeline

- Automated daily curation reduces manual content management
- Reliable CDN delivery ensures consistent global performance
- Built-in fallbacks prevent empty or broken widgets

## Analytics & Insights

The system tracks:

- Widget usage patterns (which sizes are most popular)
- Tap-through rates to artwork and article pages
- Update frequency effectiveness

This data helps inform:

- Content curation strategies
- Update timing optimization
- Feature prioritization for future widget enhancements

## Platform Availability

- **iOS only** (Android has similar Featured Artworks widget)
- Requires iOS 14+ for widget support
- Works on iPhone and iPad
- Editorial widget is iOS-exclusive currently

## Future Opportunities

### Content Expansion

- Personalized artwork recommendations based on user preferences
- Artist spotlight widgets
- Auction and fair highlights
- Collection-specific widgets

### Feature Enhancements

- User configuration options (preferred art categories, update frequency)
- Integration with user's saved artworks
- Social features (sharing widget content)
- Interactive elements within widgets

### Platform Growth

- Apple Watch complications
- iPad-specific larger widget formats
- Integration with iOS Focus modes
- Siri shortcuts for widget content

## Business Impact

### User Retention

- Keeps Artsy visible on user's home screen
- Creates multiple daily touchpoints with the brand
- Reduces friction for content discovery

### Revenue Potential

- Direct path from widget to artwork purchase pages
- Increased engagement with gallery and auction content
- Enhanced editorial content consumption

### Brand Presence

- Consistent visual presence on user devices
- Showcases Artsy's curatorial expertise
- Reinforces position as go-to art discovery platform
