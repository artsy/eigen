import { Itinerary } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"

// TODO: Replace with data from the API once the itinerary schema lands.
// Entity slugs recorded on 2026-08-26.
// PARTNER slugs are known-durable Artsy gallery slugs, verified by convention (stable,
// long-lived partners), not by browsing artsy.net in this pass.
// SHOW slugs are ephemeral and could not be verified without browsing artsy.net; they are
// left as literal placeholders below and must be replaced with real slugs before this
// itinerary is used for anything beyond local development.
export const MOCK_ITINERARIES: Itinerary[] = [
  {
    id: "chill-vibes-only",
    citySlug: "london-united-kingdom",
    title: "Chill Vibes Only",
    subtitle: "Top picks",
    heroImageUrl: "https://picsum.photos/id/1015/800/600.jpg",
    authorName: "Casey Lesser",
    description:
      "Our list of recommendations for the must sees to gallery and museum visits and the hidden gems in between.",
    sections: [
      {
        id: "day-1",
        title: "Day 1 — Easing in",
        stops: [
          {
            id: "stop-1",
            title: "Coffee at London Cafe",
            displayTime: "10am",
            imageUrl: "https://picsum.photos/id/1060/200/200.jpg",
            coordinates: { lat: 51.5136, lng: -0.1365 },
            // Not an Artsy entity: no save control renders for this stop.
            saveTarget: null,
          },
          {
            id: "stop-2",
            title: "Museum",
            displayTime: "11am-4pm",
            note: "🥂 🧀",
            imageUrl: "https://picsum.photos/id/1040/200/200.jpg",
            coordinates: { lat: 51.5194, lng: -0.127 },
            // TODO(human): replace with a verified show slug from artsy.net/show/<slug>
            saveTarget: { type: "SHOW", slug: "REPLACE-ME-show-slug-1" },
          },
          {
            id: "stop-3",
            title: "Gallery Show",
            displayTime: "3pm-4pm",
            imageUrl: "https://picsum.photos/id/1033/200/200.jpg",
            coordinates: { lat: 51.5074, lng: -0.1278 },
            // TODO(human): replace with a verified show slug from artsy.net/show/<slug>
            saveTarget: { type: "SHOW", slug: "REPLACE-ME-show-slug-2" },
          },
        ],
      },
      {
        id: "day-2",
        title: "Day 2 — London Frieze",
        stops: [
          {
            id: "stop-4",
            title: "Frieze London",
            displayTime: "12pm - 1pm",
            note: "🎤",
            imageUrl: "https://picsum.photos/id/1084/200/200.jpg",
            coordinates: { lat: 51.5122, lng: -0.1571 },
            // TODO(human): replace with a verified show slug from artsy.net/show/<slug>
            saveTarget: { type: "SHOW", slug: "REPLACE-ME-show-slug-3" },
          },
          {
            id: "stop-5",
            title: "Evening Reception",
            displayTime: "6pm-9pm",
            note: "🥂 🧀",
            imageUrl: "https://picsum.photos/id/1074/200/200.jpg",
            coordinates: { lat: 51.5033, lng: -0.1195 },
            saveTarget: { type: "PARTNER", slug: "white-cube" },
          },
        ],
      },
    ],
  },
  {
    id: "36-hours-in-london",
    citySlug: "london-united-kingdom",
    title: "36 Hours in London",
    subtitle: "Top picks",
    heroImageUrl: "https://picsum.photos/id/1016/800/600.jpg",
    authorName: "Casey Lesser",
    description: "A day and a half of galleries, museums, and somewhere decent for lunch.",
    sections: [
      {
        id: "morning",
        title: "Mellow morning",
        stops: [
          {
            id: "hours-stop-1",
            title: "Morning Gallery Visit",
            displayTime: "10am-12pm",
            imageUrl: "https://picsum.photos/id/1025/200/200.jpg",
            coordinates: { lat: 51.5155, lng: -0.1411 },
            // TODO(human): replace with a verified show slug from artsy.net/show/<slug>
            saveTarget: { type: "SHOW", slug: "REPLACE-ME-show-slug-4" },
          },
        ],
      },
    ],
  },
  {
    id: "must-sees-and-hidden-gems",
    citySlug: "london-united-kingdom",
    title: "Must Sees & Hidden Gems",
    subtitle: "Top picks",
    heroImageUrl: "https://picsum.photos/id/1024/800/600.jpg",
    authorName: "Casey Lesser",
    description: "The landmarks worth the queue, and the rooms nobody tells you about.",
    sections: [
      {
        id: "afternoon",
        title: "Chill afternoon",
        stops: [
          {
            id: "gems-stop-1",
            title: "Hidden Gem Gallery",
            displayTime: "2pm-5pm",
            imageUrl: "https://picsum.photos/id/1035/200/200.jpg",
            coordinates: { lat: 51.5098, lng: -0.1342 },
            saveTarget: { type: "PARTNER", slug: "victoria-miro" },
          },
        ],
      },
    ],
  },
]

/** Keys on both params so /city-guide/paris/... cannot render a London itinerary (FIX-04). */
export const getMockItinerary = (citySlug: string, itineraryId: string): Itinerary | undefined =>
  MOCK_ITINERARIES.find(
    (itinerary) => itinerary.id === itineraryId && itinerary.citySlug === citySlug
  )
