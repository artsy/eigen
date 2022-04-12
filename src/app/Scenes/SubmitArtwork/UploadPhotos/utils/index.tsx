import { goBack, switchTab } from "app/navigation/navigate"
import { GlobalStore } from "app/store/GlobalStore"
import React, { useCallback, useEffect, useRef } from "react"
import { BackHandler } from "react-native"
import { Image as RNCImage } from "react-native-image-crop-picker"
import { BottomTabType } from "../../../BottomTabs/BottomTabType"
import { ConsignmentsHomeQueryRenderer } from "../../ConsignmentsHome/ConsignmentsHome"

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
  targetSupply?: {
    isTargetSupply: boolean
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
  utmMedium?: string
  utmSource?: string
  utmTerm?: string
  signed?: boolean
  certificateOfAuth?: boolean
  location?: {
    city: string
    state: string
    country: string
  }
  editionScreenViewed?: boolean
}

export interface SellTabProps {
  overwriteHardwareBackButtonPath?: BottomTabType
}

export const Consignments: React.FC = () => {
  const sellTabProps = GlobalStore.useAppState((state) => {
    return state.bottomTabs.sessionState.tabProps.sell ?? {}
  }) as SellTabProps

  const overwriteHardwareBackButtonPath = sellTabProps?.overwriteHardwareBackButtonPath ?? null

  const sellTabPropsRef = useRef<BottomTabType | null>(null)

  useEffect(() => {
    sellTabPropsRef.current = overwriteHardwareBackButtonPath
  }, [overwriteHardwareBackButtonPath])

  useEffect(
    useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", handleBackButton)

      return () => BackHandler.removeEventListener("hardwareBackPress", handleBackButton)
    }, [])
  )

  const handleBackButton = useCallback(() => {
    if (sellTabPropsRef.current) {
      switchTab(sellTabPropsRef.current)
      GlobalStore.actions.bottomTabs.setTabProps({ tab: "sell", props: {} })
    } else {
      goBack()
    }

    return true
  }, [sellTabPropsRef.current])

  return <ConsignmentsHomeQueryRenderer />
}
