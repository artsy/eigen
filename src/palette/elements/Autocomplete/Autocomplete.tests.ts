import { Autocomplete, AutocompleteEntry } from "./Autocomplete"

const artists: Array<AutocompleteEntry<string>> = [
  {
    key: "Pablo Picasso",
    importance: 100,
    searchTerms: ["Pablo Picasso"],
  },
  {
    key: "Grayson Perry",
    importance: 10,
    searchTerms: ["Grayson Perry"],
  },
  {
    key: "Prince",
    importance: 50,
    searchTerms: ["Prince", "The artist formerly known as 'Prince'"],
  },
  {
    key: "James Brown",
    importance: 100,
    searchTerms: ["JB", "The King of Funk"],
  },
]

describe(Autocomplete, () => {
  it(`lets you search for individual words in search terms`, async () => {
    const auto = new Autocomplete(artists)
    expect(auto.getSuggestions("formerly")).toEqual(["Prince"])
  })
  it(`doesn't care about capitalization`, async () => {
    const auto = new Autocomplete(artists)
    expect(auto.getSuggestions("fOrMerly")).toEqual(["Prince"])
  })
  it(`doesn't care about punctuation`, async () => {
    const auto = new Autocomplete([
      ...artists,
      {
        key: "Dog",
        importance: +Infinity,
        searchTerms: ["Santa's little helper"],
      },
    ])
    expect(auto.getSuggestions("fOrMerl,y")).toEqual(["Prince"])
    expect(auto.getSuggestions("santas")).toEqual(["Dog"])
  })
  it(`doesn't care about diacritics`, async () => {
    const auto = new Autocomplete([
      ...artists,
      {
        key: "Nordic",
        importance: +Infinity,
        searchTerms: ["Jón Jønssön"],
      },
    ])

    expect(auto.getSuggestions("Jon")).toEqual(["Nordic"])
    expect(auto.getSuggestions("Jonsson")).toEqual(["Nordic"])
  })
  it(`orders results according to importance`, async () => {
    const auto = new Autocomplete(artists)
    expect(auto.getSuggestions("p")).toEqual(["Pablo Picasso", "Prince", "Grayson Perry"])
  })
  it(`returns nothing when there are no matches`, async () => {
    const auto = new Autocomplete(artists)
    expect(auto.getSuggestions("z")).toEqual([])
  })
  it(`ignores stop words which don't appear at the beginning of a search term`, async () => {
    const auto = new Autocomplete(
      [
        ...artists,
        {
          key: "PaRappa the Rapper",
          importance: +Infinity * 2,
          searchTerms: ["PaRappa the Rapper"],
        },
      ],
      10,
      ["the"]
    )
    expect(auto.getSuggestions("the")).toContain("James Brown")
    expect(auto.getSuggestions("the")).not.toContain("PaRappa the Rapper")
    expect(auto.getSuggestions("Rapper")).toEqual(["PaRappa the Rapper"])
  })
})
