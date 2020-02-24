import { StorySection } from "./index"

export const storiesToTree = (stories: StorySection[]) => sectionsToTree(stories.map(toSectionHeirarchy))

export const toSectionHeirarchy = (story: StorySection) => {
  const things = story.kind.split("/")
  const sections = things.map(kind => ({ kind })) as StorySection[]

  const last = sections[things.length - 1]
  last.stories = story.stories

  // const subsections = sections.filter(s => s === last)
  for (let index = 0; index < sections.length; index++) {
    const element = sections[index]
    if (index + 1 < sections.length) {
      const after = sections[index + 1]
      element.sections = [after]
    }
  }
  return sections[0]
}

// This only supports 1 level deep, should be easy to add more
// if it's needed in the future
export const sectionsToTree = (sections: StorySection[]) => {
  const root = {
    kind: "Stories",
    sections: [],
  }

  sections.forEach(section => {
    const sameSection = root.sections.find(s => s.kind === section.kind)
    if (sameSection) {
      sameSection.sections = [...sameSection.sections, ...section.sections]
    } else {
      root.sections.push(section)
    }
  })
  return root
}
