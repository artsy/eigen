#!/usr/bin/env yarn ts-node

/**
 * example location-based queries against Algolia
 */

declare var process: {
  argv: string[]
  env: {
    ALGOLIA_API_KEY: string
    ALGOLIA_APP_ID: string
  }
  exit(code: number): void
}

interface GalleryHit {
  partner: {
    name: string
    href: string
  }
  _geoloc: {
    lat: number
    lng: number
  }
}

import algoliasearch from "algoliasearch"
import fetch from "node-fetch"
import cities from "../data/cityDataSortedByDisplayPreference.json"

const main = async () => {
  const { ALGOLIA_API_KEY, ALGOLIA_APP_ID } = process.env
  const client = algoliasearch(ALGOLIA_APP_ID!, ALGOLIA_API_KEY!)

  const lng = process.argv[3]
  const citySlugOrLat = process.argv[2]
  const city = cities.find((c) => c.slug === citySlugOrLat)

  let options

  if (lng) {
    options = {
      aroundLatLng: `${citySlugOrLat}, ${lng}`,
      aroundRadius: 100000,
    }
  } else if (city) {
    const { coordinates } = city
    options = {
      aroundLatLng: `${coordinates.lat}, ${coordinates.lng}`,
      aroundRadius: 100000,
    }
  } else {
    const response = await fetch("https://api.ipify.org")
    const ipAddress = await response.text()
    console.log("Your IP Address is:", ipAddress)
    options = {
      aroundRadius: 100000,
      aroundLatLngViaIP: true,
      headers: {
        "X-Forwarded-For": ipAddress,
      },
    }
  }

  const galleryIndex = client.initIndex("PartnerLocation_staging")
  const results = await galleryIndex.search<GalleryHit>("", options)
  const { hits, nbHits } = results
  console.log("Total: %s galleries\n", nbHits)

  console.log("Closest %s gallery locations:", hits.length)
  hits.forEach((hit) => {
    console.log(
      "- %s (%s, %s) -- https://artsy.net%s",
      hit.partner.name,
      hit._geoloc.lat,
      hit._geoloc.lng,
      hit.partner.href
    )
  })
}

main().catch(console.error)
