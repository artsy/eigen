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
    // Grouped by time of day rather than by day, unlike Chill Vibes Only. Section titles
    // are opaque to the client, so both schemes render without a code change.
    sections: [
      {
        id: "mellow-morning",
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
          {
            id: "hours-stop-2",
            title: "Vestiges",
            displayTime: "12pm-1pm",
            imageUrl: "https://picsum.photos/id/1027/200/200.jpg",
            // Annely Juda Fine Art, Dering Street
            coordinates: { lat: 51.514, lng: -0.1445 },
            saveTarget: { type: "SHOW", slug: "annely-juda-fine-art-vestiges" },
          },
          {
            id: "hours-stop-3",
            title: "The Shape of Heat",
            displayTime: "1pm-2pm",
            note: "☕",
            imageUrl: "https://picsum.photos/id/1029/200/200.jpg",
            // Maddox Gallery, Mayfair
            coordinates: { lat: 51.5135, lng: -0.142 },
            saveTarget: { type: "SHOW", slug: "maddox-gallery-the-shape-of-heat" },
          },
        ],
      },
      {
        id: "chill-afternoon",
        title: "Chill afternoon",
        stops: [
          {
            id: "hours-stop-4",
            title: "Tjukurpa",
            displayTime: "2pm-3pm",
            imageUrl: "https://picsum.photos/id/1031/200/200.jpg",
            // Rebecca Hossack Art Gallery, Fitzrovia
            coordinates: { lat: 51.5215, lng: -0.14 },
            saveTarget: { type: "SHOW", slug: "rebecca-hossack-art-gallery-tjukurpa" },
          },
          {
            id: "hours-stop-5",
            title: "Summer Show 2026",
            displayTime: "3pm-4pm",
            imageUrl: "https://picsum.photos/id/1036/200/200.jpg",
            // Shapero Modern, St George Street
            coordinates: { lat: 51.513, lng: -0.1435 },
            saveTarget: { type: "SHOW", slug: "shapero-modern-summer-show-2026" },
          },
          {
            id: "hours-stop-6",
            title: "Pop Odyssey",
            displayTime: "4pm-5pm",
            note: "🍸",
            imageUrl: "https://picsum.photos/id/1037/200/200.jpg",
            // Halcyon Gallery, Bruton Street
            coordinates: { lat: 51.5105, lng: -0.1445 },
            saveTarget: { type: "SHOW", slug: "halcyon-pop-odyssey" },
          },
        ],
      },
      {
        id: "nighttime-hang",
        title: "Nighttime hang",
        stops: [
          {
            id: "hours-stop-7",
            title: "So This Is Goodbye...",
            displayTime: "6pm-7pm",
            imageUrl: "https://picsum.photos/id/1038/200/200.jpg",
            // Beers London, Little Britain
            coordinates: { lat: 51.5175, lng: -0.0985 },
            saveTarget: { type: "SHOW", slug: "beers-london-so-this-is-goodbye-dot-dot-dot" },
          },
          {
            id: "hours-stop-8",
            title: "12:12",
            displayTime: "7pm-8pm",
            note: "🎤",
            imageUrl: "https://picsum.photos/id/1039/200/200.jpg",
            // Rhodes, Cremer Street, Hoxton
            coordinates: { lat: 51.5305, lng: -0.0785 },
            saveTarget: { type: "SHOW", slug: "rhodes-12-12" },
          },
          {
            id: "hours-stop-9",
            title: "One Fly Makes No Summer",
            displayTime: "8pm-9pm",
            note: "🥂",
            imageUrl: "https://picsum.photos/id/1041/200/200.jpg",
            // Kristin Hjellegjerde Gallery, Melior Place
            coordinates: { lat: 51.5025, lng: -0.0865 },
            saveTarget: {
              type: "SHOW",
              slug: "kristin-hjellegjerde-gallery-one-fly-makes-no-summer",
            },
          },
        ],
      },
      {
        id: "if-you-have-the-energy",
        title: "If you have the energy",
        stops: [
          {
            id: "hours-stop-10",
            title: "House Plant Care",
            displayTime: "Next morning, 10am",
            imageUrl: "https://picsum.photos/id/1044/200/200.jpg",
            // 8 Holland Street, Kensington
            coordinates: { lat: 51.5015, lng: -0.1955 },
            saveTarget: { type: "SHOW", slug: "8-holland-street-david-turley-house-plant-care" },
          },
          {
            id: "hours-stop-11",
            title: "Disruptors",
            displayTime: "11am-12pm",
            imageUrl: "https://picsum.photos/id/1045/200/200.jpg",
            // Ben Uri Gallery and Museum, Boundary Road
            coordinates: { lat: 51.5345, lng: -0.1815 },
            saveTarget: {
              type: "SHOW",
              slug: "ben-uri-gallery-and-museum-disruptors-fractured-images-and-migrant-wordl",
            },
          },
          {
            id: "hours-stop-12",
            title: "Second Nature",
            displayTime: "12pm-1pm",
            note: "🧀",
            imageUrl: "https://picsum.photos/id/1047/200/200.jpg",
            // Open Doors Gallery, Fitzrovia
            coordinates: { lat: 51.5195, lng: -0.1365 },
            saveTarget: { type: "SHOW", slug: "open-doors-gallery-second-nature" },
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
        id: "must-sees",
        title: "The must sees",
        stops: [
          {
            id: "gems-stop-1",
            title: "An afternoon at White Cube",
            displayTime: "11am-1pm",
            imageUrl: "https://picsum.photos/id/1035/200/200.jpg",
            // White Cube Bermondsey
            coordinates: { lat: 51.4995, lng: -0.081 },
            saveTarget: { type: "PARTNER", slug: "white-cube" },
          },
          {
            id: "gems-stop-2",
            title: "Fame, Fashion, McGee",
            displayTime: "1pm-2pm",
            imageUrl: "https://picsum.photos/id/1048/200/200.jpg",
            // Iconic Images, Mayfair
            coordinates: { lat: 51.5115, lng: -0.1425 },
            saveTarget: { type: "SHOW", slug: "iconic-images-fame-fashion-mcgee" },
          },
          {
            id: "gems-stop-3",
            title: "The Last Dolls",
            displayTime: "2pm-3pm",
            note: "🧀",
            imageUrl: "https://picsum.photos/id/1051/200/200.jpg",
            // Atlas Gallery, Marylebone
            coordinates: { lat: 51.5185, lng: -0.156 },
            saveTarget: { type: "SHOW", slug: "atlas-gallery-the-last-dolls" },
          },
        ],
      },
      {
        id: "hidden-gems",
        title: "The hidden gems",
        stops: [
          {
            id: "gems-stop-4",
            title: "Fragments of Place",
            displayTime: "3pm-4pm",
            imageUrl: "https://picsum.photos/id/1052/200/200.jpg",
            // Purdy Hicks Gallery, Bankside
            coordinates: { lat: 51.5065, lng: -0.0995 },
            saveTarget: {
              type: "SHOW",
              slug: "purdy-hicks-gallery-pierre-bergian-fragments-of-place",
            },
          },
          {
            id: "gems-stop-5",
            title: "Forging Forms",
            displayTime: "4pm-5pm",
            imageUrl: "https://picsum.photos/id/1053/200/200.jpg",
            // Contemporary Applied Arts, Southwark Street
            coordinates: { lat: 51.5055, lng: -0.0985 },
            saveTarget: { type: "SHOW", slug: "contemporary-applied-arts-forging-forms" },
          },
          {
            id: "gems-stop-6",
            title: "Inner Weather",
            displayTime: "5pm-6pm",
            note: "🥂",
            imageUrl: "https://picsum.photos/id/1055/200/200.jpg",
            // Artistellar, Shoreditch
            coordinates: { lat: 51.5245, lng: -0.0785 },
            saveTarget: { type: "SHOW", slug: "artistellar-inner-weather" },
          },
        ],
      },
      {
        id: "worth-the-detour",
        title: "Worth the detour",
        stops: [
          {
            id: "gems-stop-7",
            title: "No Ruined Stones",
            displayTime: "Sat, 11am",
            imageUrl: "https://picsum.photos/id/1056/200/200.jpg",
            // Cadogan Gallery, Chelsea
            coordinates: { lat: 51.4925, lng: -0.16 },
            saveTarget: { type: "SHOW", slug: "cadogan-gallery-no-ruined-stones-richard-hearns" },
          },
          {
            id: "gems-stop-8",
            title: "Cat Maquettes",
            displayTime: "Sat, 1pm",
            imageUrl: "https://picsum.photos/id/1057/200/200.jpg",
            // Everard Read, Eastcastle Street
            coordinates: { lat: 51.5175, lng: -0.1385 },
            saveTarget: { type: "SHOW", slug: "everard-read-dylan-lewis-cat-maquettes" },
          },
          {
            id: "gems-stop-9",
            title: "You Should Smile More",
            displayTime: "Sat, 3pm",
            note: "🖨️",
            imageUrl: "https://picsum.photos/id/1059/200/200.jpg",
            // Rhodes, Hoxton
            coordinates: { lat: 51.5305, lng: -0.0785 },
            saveTarget: { type: "SHOW", slug: "rhodes-you-should-smile-more" },
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
