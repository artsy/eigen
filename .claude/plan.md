# Plan: Diagnose Scroll Syncing Issues in Artist Tabs

## Problem Summary
After enabling new architecture and Fabric, there's a scroll syncing issue in the Artist screen tabs:
- When scrolling in one tab (collapsing/expanding the header) and switching to another tab
- The tab content initially renders inset below where it should be
- Simple content doesn't reproduce the issue
- Complex content (FlashList in About tab) does reproduce the issue
- Suspected culprit: `useListenForTabContentScroll` in `Tabs.FlashlistSimplified.tsx`

## Investigation Steps

### 1. Add Logging to `useListenForTabContentScroll`
**File**: `src/app/Components/Artist/ArtistAbout/Tabs.FlashlistSimplified.tsx`

Add logging to track:
- Current tab scroll Y value (`currentTabScrollY.value`)
- Value being set to `currentScrollYAnimated`
- When these updates occur (component mount, scroll events, tab switches)
- Current tab name/context if available

**Why**: This will help us see if the scroll values are being synchronized correctly between tabs and if the timing of updates is causing the inset issue.

### 2. Add Logging for Header State
**File**: `src/app/Scenes/Artist/TabsWithHeader2.tsx`

Investigate and add logging for:
- Header height/offset values
- Header collapse/expand state
- How header state is communicated to tabs

**Why**: The header inset might not be properly calculated or synchronized when switching tabs.

### 3. Add Tab Switch Detection
Add logging to detect when tab switches occur and what the scroll state is at that moment.

**Why**: This will help us understand the timing relationship between tab switches and scroll value updates.

## Expected Findings

We're looking for:
1. Stale scroll values being applied when switching tabs
2. Timing issues where scroll values update before/after tab switch
3. Missing header offset compensation in certain scenarios
4. Race conditions in the animated reaction

## Success Criteria

Once we have logging in place:
1. Reproduce the issue while monitoring logs
2. Identify the exact sequence of events causing the inset problem
3. Determine if the issue is in value synchronization, timing, or header offset calculation
