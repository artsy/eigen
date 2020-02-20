import { sectionsToTree, toSectionHeirarchy } from "../utils"

const stubbedStories = [
  { kind: "Artist/Articles", stories: [{ name: "Single Item" }, { name: "Multiple Items" }] },
  {
    kind: "Artist/Header",
    stories: [{ name: "Real Artist - Glenn Brown" }],
  },
  {
    kind: "App Style/Buttons",
    stories: [{ name: "Flat White" }, { name: "Inverted Button" }, { name: "Navigation Button" }],
  },
  {
    kind: "Consignments/_Screens",
    stories: [{ name: "Consignments" }, { name: "Welcome Page" }],
  },
  {
    kind: "Consignments/Styling",
    stories: [{ name: "Type Reference" }, { name: "Boolean selector" }, { name: "Form items" }],
  },
  {
    kind: "Consignments/Search",
    stories: [{ name: "No query" }, { name: "Looking for new results" }, { name: "Found no results" }],
  },
  {
    kind: "Consignments/BottomButton",
    stories: [{ name: "With a Text element" }, { name: "With an Artist Search Results Component" }],
  },
  {
    kind: "Consignments/TODO Component",
    stories: [{ name: "Empty Metadata" }, { name: "With Artist" }, { name: "With Photos" }],
  },
  { kind: "Consignments/Image Selection", stories: [{ name: "With some images" }, { name: "With no images" }] },
  { kind: "Conversations/Artwork Preview", stories: [{ name: "Basic" }, { name: "With a long title" }] },
  { kind: "Conversations/Avatar", stories: [{ name: "User with Two Initials" }] },
  { kind: "Conversations/Composer", stories: [{ name: "With no pre-existing thread" }] },
  { kind: "Conversations/Snippet", stories: [{ name: "Single row" }, { name: "A few threads" }] },
  {
    kind: "Conversations/Overview",
    stories: [{ name: "With live data" }, { name: "With dummy data" }, { name: "With no data" }],
  },
  { kind: "Conversations/ZeroStateInbox", stories: [{ name: "No conversations" }] },
  { kind: "App Style/Typography", stories: [{ name: "App Headline" }, { name: "App Serif Text" }] },
  {
    kind: "Artist/Relay",
    stories: [{ name: "Glenn Brown" }, { name: "Leda Catunda" }, { name: "Jorge Vigil" }, { name: "Rita Maas" }],
  },
  {
    kind: "Inbox",
    stories: [{ name: "Empty" }, { name: "Open" }, { name: "Closed" }],
  },
] as any

it("creates a heirarchy for the stories", () => {
  const section: any = {
    kind: "App Style/Buttons",
    stories: [{ name: "Flat White" }, { name: "Inverted Button" }, { name: "Navigation Button" }],
  }

  expect(toSectionHeirarchy(section)).toEqual({
    kind: "App Style",
    sections: [
      {
        kind: "Buttons",
        stories: [{ name: "Flat White" }, { name: "Inverted Button" }, { name: "Navigation Button" }],
      },
    ],
  })
})

it("merges multiple  stories", () => {
  const mapped = stubbedStories.map(toSectionHeirarchy)
  const toTree = sectionsToTree(mapped)

  const results = {
    kind: "Stories",
    sections: [
      {
        kind: "Artist",
        sections: [
          { kind: "Articles", stories: [{ name: "Single Item" }, { name: "Multiple Items" }] },
          { kind: "Header", stories: [{ name: "Real Artist - Glenn Brown" }] },
          {
            kind: "Relay",
            stories: [
              { name: "Glenn Brown" },
              { name: "Leda Catunda" },
              { name: "Jorge Vigil" },
              { name: "Rita Maas" },
            ],
          },
        ],
      },
      {
        kind: "App Style",
        sections: [
          {
            kind: "Buttons",
            stories: [{ name: "Flat White" }, { name: "Inverted Button" }, { name: "Navigation Button" }],
          },
          { kind: "Typography", stories: [{ name: "App Headline" }, { name: "App Serif Text" }] },
        ],
      },
      {
        kind: "Consignments",
        sections: [
          { kind: "_Screens", stories: [{ name: "Consignments" }, { name: "Welcome Page" }] },
          {
            kind: "Styling",
            stories: [{ name: "Type Reference" }, { name: "Boolean selector" }, { name: "Form items" }],
          },
          {
            kind: "Search",
            stories: [{ name: "No query" }, { name: "Looking for new results" }, { name: "Found no results" }],
          },
          {
            kind: "BottomButton",
            stories: [{ name: "With a Text element" }, { name: "With an Artist Search Results Component" }],
          },
          {
            kind: "TODO Component",
            stories: [{ name: "Empty Metadata" }, { name: "With Artist" }, { name: "With Photos" }],
          },
          { kind: "Image Selection", stories: [{ name: "With some images" }, { name: "With no images" }] },
        ],
      },
      {
        kind: "Conversations",
        sections: [
          { kind: "Artwork Preview", stories: [{ name: "Basic" }, { name: "With a long title" }] },
          { kind: "Avatar", stories: [{ name: "User with Two Initials" }] },
          { kind: "Composer", stories: [{ name: "With no pre-existing thread" }] },
          { kind: "Snippet", stories: [{ name: "Single row" }, { name: "A few threads" }] },
          {
            kind: "Overview",
            stories: [{ name: "With live data" }, { name: "With dummy data" }, { name: "With no data" }],
          },
          { kind: "ZeroStateInbox", stories: [{ name: "No conversations" }] },
        ],
      },
      { kind: "Inbox", stories: [{ name: "Empty" }, { name: "Open" }, { name: "Closed" }] },
    ],
  }

  expect(toTree).toEqual(results)
})
