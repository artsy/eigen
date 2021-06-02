import { goBack, switchTab } from "lib/navigation/navigate"
import { GlobalStore } from "lib/store/GlobalStore"
import React, { useEffect, useRef } from "react"
import { BackHandler } from "react-native"
import { Image as RNCImage } from "react-native-image-crop-picker"
import { BottomTabType } from "../../Scenes/BottomTabs/BottomTabType"
import { ConsignmentsHomeQueryRenderer } from "./ConsignmentsHome/ConsignmentsHome"

/** The metadata for a consigned work */
export interface ConsignmentMetadata {
  title: string | null
  year: string | null
  category: string | null
  categoryName: string | null
  medium: string | null
  width: string | null
  height: string | null
  depth: number | null
  unit: string | null
  displayString: string | null // This would look something like "1/5", "5/5"
}

export interface LocationResult {
  id: string
  name: string
}

export interface ArtistResult {
  internalID: string
  name: string
  image?: {
    url: string
  }
}

export type SearchResult = LocationResult | ArtistResult

export interface Photo {
  image: RNCImage
  uploaded?: boolean
  uploading?: boolean
}

export interface ConsignmentSetup {
  submissionID?: string
  state?: "DRAFT" | "SUBMITTED"
  artist?: ArtistResult
  photos?: Photo[]
  metadata?: ConsignmentMetadata
  provenance?: string
  editionInfo?: {
    size?: string
    number?: string
  }
  signed?: boolean
  certificateOfAuth?: boolean
  location?: {
    city: string
    state: string
    country: string
  }
  editionScreenViewed?: boolean
}

export interface GlobalStoreData {
  initialGoBackPath?: BottomTabType
}

export const Consignments: React.FC = () => {
  const globalStoreData = GlobalStore.useAppState((state) => {
    return state.bottomTabs.sessionState.tabProps.sell ?? {}
  }) as GlobalStoreData

  const initialGoPackPathString = globalStoreData?.initialGoBackPath ?? null

  const globalStoreDataRef = useRef<BottomTabType | null>(null)

  useEffect(() => {
    globalStoreDataRef.current = initialGoPackPathString
  }, [initialGoPackPathString])

  useEffect(
    React.useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", handleBackButton)

      return () => BackHandler.removeEventListener("hardwareBackPress", handleBackButton)
    }, [])
  )

  const handleBackButton = () => {
    if (globalStoreDataRef.current !== null) {
      switchTab(globalStoreDataRef.current)
      GlobalStore.actions.bottomTabs.setTabProps({ tab: "sell", props: {} })
    } else {
      goBack()
    }

    return true
  }

  return <ConsignmentsHomeQueryRenderer />
}
