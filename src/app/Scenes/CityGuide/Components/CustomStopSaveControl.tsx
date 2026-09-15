import { FollowIconButton } from "app/Components/FollowIconButton"
import { useToast } from "app/Components/Toast/toastHook"
import {
  CustomStopInput,
  useCityItineraryStops,
} from "app/Scenes/CityGuide/hooks/useCityItineraryStops"
import { useEffect, useRef, useState } from "react"

interface Props {
  /** What gets copied. The same shape `addStop` and `removeStop` take. */
  stop: CustomStopInput
  citySlug: string
  /** The city's own name, which is what a new itinerary and its section are called. */
  cityName: string
  size?: number
}

/**
 * Copies a custom stop onto your own itinerary, and takes it back off. Fields are copied, not
 * referenced — except the image, which `imageURL` won't accept except as an S3 upload URL.
 */
export const CustomStopSaveControl: React.FC<Props> = ({ stop, citySlug, cityName, size }) => {
  const toast = useToast()
  const { addStop, removeStop } = useCityItineraryStops({ citySlug, cityName })
  // Reflects what you did on this visit only. Reading your itinerary to seed it would put the
  // screen's own data in the path of its mutations, which blanked the screen; `addStop`
  // already refuses a duplicate, so a stale plus costs nothing.
  const [isAdded, setIsAdded] = useState(false)
  const [isInFlight, setIsInFlight] = useState(false)

  // Guards against setting state or toasting after the screen has gone away.
  const isMounted = useRef(true)
  useEffect(
    () => () => {
      isMounted.current = false
    },
    []
  )

  const toggle = async () => {
    setIsInFlight(true)

    try {
      if (isAdded) {
        await removeStop(stop)

        if (!isMounted.current) return

        setIsAdded(false)
        toast.show(`Removed ${stop.title} from your itinerary`, "bottom")
      } else {
        await addStop(stop)

        if (!isMounted.current) return

        setIsAdded(true)
        toast.show(`Added ${stop.title} to your itinerary`, "bottom")
      }
    } catch {
      if (isMounted.current) toast.show("Something went wrong. Please try again.", "bottom")
    } finally {
      if (isMounted.current) setIsInFlight(false)
    }
  }

  return (
    <FollowIconButton
      testID="custom-stop-save-button"
      isFollowed={isAdded}
      isInFlight={isInFlight}
      name={stop.title}
      size={size}
      onPress={toggle}
    />
  )
}
