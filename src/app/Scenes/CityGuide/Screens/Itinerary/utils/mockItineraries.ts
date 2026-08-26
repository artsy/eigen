import { Itinerary } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"

// TODO: Replace with data from the API once the itinerary schema lands.
//
// Every slug below is real, taken from artsy.net on 2026-08-26:
// shows from artsy.net/shows/london-united-kingdom, partners from their show pages.
// Coordinates are the galleries' actual London locations, so the map view is plausible.
//
// Show slugs keep resolving after a show closes, and the save queries pass
// includeAllShows: true, so these stay valid. Titles are the guide author's framing and
// deliberately need not match the entity's own name — see the spec on editorial curation.
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
            title: "Splash: Sea, Beach and Pool",
            displayTime: "11am-4pm",
            note: "🥂 🧀",
            imageUrl: "https://picsum.photos/id/1040/200/200.jpg",
            // Atlas Gallery, Marylebone
            coordinates: { lat: 51.5185, lng: -0.156 },
            saveTarget: { type: "SHOW", slug: "atlas-gallery-splash-sea-beach-and-pool" },
          },
          {
            id: "stop-3",
            title: "Georg Baselitz: Back Again",
            displayTime: "3pm-4pm",
            imageUrl: "https://picsum.photos/id/1033/200/200.jpg",
            // White Cube Bermondsey
            coordinates: { lat: 51.4995, lng: -0.081 },
            saveTarget: { type: "SHOW", slug: "white-cube-georg-baselitz-back-again" },
          },
        ],
      },
      {
        id: "day-2",
        title: "Day 2 — London Frieze",
        stops: [
          {
            id: "stop-4",
            title: "Like Music in the Blood",
            displayTime: "12pm - 1pm",
            note: "🎤",
            imageUrl: "https://picsum.photos/id/1084/200/200.jpg",
            // Thaddaeus Ropac, Ely House, Mayfair
            coordinates: { lat: 51.5085, lng: -0.143 },
            saveTarget: { type: "SHOW", slug: "thaddaeus-ropac-like-music-in-the-blood" },
          },
          {
            id: "stop-5",
            title: "Evening reception at Victoria Miro",
            displayTime: "6pm-9pm",
            note: "🥂 🧀",
            imageUrl: "https://picsum.photos/id/1074/200/200.jpg",
            // Victoria Miro, Wharf Road, N1
            coordinates: { lat: 51.532, lng: -0.095 },
            saveTarget: { type: "PARTNER", slug: "victoria-miro" },
          },
        ],
      },
      {
        id: "day-3",
        title: "Day 3 — Fair day",
        stops: [
          {
            id: "stop-6",
            title: "Frieze London",
            // Real runs are Oct 2025 / May 2026; these read as open so the guide has
            // something live to show.
            displayTime: "Aug 24 - Aug 30",
            note: "🥂",
            imageUrl: "https://picsum.photos/id/1043/200/200.jpg",
            // The Regent's Park
            coordinates: { lat: 51.5268, lng: -0.1533 },
            saveTarget: { type: "FAIR", slug: "frieze-london-2025" },
          },
          {
            id: "stop-7",
            title: "Photo London",
            displayTime: "Aug 20 - Sep 6",
            imageUrl: "https://picsum.photos/id/1050/200/200.jpg",
            // Somerset House
            coordinates: { lat: 51.511, lng: -0.117 },
            saveTarget: { type: "FAIR", slug: "photo-london-2026" },
          },
          {
            id: "stop-8",
            title: "London Original Print Fair",
            displayTime: "Aug 25 - Aug 31",
            note: "🖨️",
            imageUrl: "https://picsum.photos/id/1062/200/200.jpg",
            // Somerset House as well, a few metres along the courtyard
            coordinates: { lat: 51.5114, lng: -0.1176 },
            saveTarget: { type: "FAIR", slug: "london-original-print-fair-2026" },
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
            title: "The Language of Glaze",
            displayTime: "10am-12pm",
            imageUrl: "https://picsum.photos/id/1025/200/200.jpg",
            // Carpenters Workshop Gallery, Mayfair
            coordinates: { lat: 51.512, lng: -0.14 },
            saveTarget: {
              type: "SHOW",
              slug: "carpenters-workshop-gallery-the-language-of-glaze",
            },
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
            title: "An afternoon at White Cube",
            displayTime: "2pm-5pm",
            imageUrl: "https://picsum.photos/id/1035/200/200.jpg",
            // White Cube Bermondsey
            coordinates: { lat: 51.4995, lng: -0.081 },
            saveTarget: { type: "PARTNER", slug: "white-cube" },
          },
        ],
      },
    ],
  },
]

/** Keys on both params so /city-guide/paris/... cannot render a London itinerary. */
export const getMockItinerary = (citySlug: string, itineraryId: string): Itinerary | undefined =>
  MOCK_ITINERARIES.find(
    (itinerary) => itinerary.id === itineraryId && itinerary.citySlug === citySlug
  )
