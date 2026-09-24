import { useSyncExternalStore } from "react"

interface Queue {
  tail: Promise<void>
  pending: number
  lastSeq: number
}

const queues = new Map<string, Queue>()
const deletedItineraries = new Set<string>()
const listeners = new Set<() => void>()

const notify = () => listeners.forEach((listener) => listener())

/**
 * Runs `task` after every save queued before it for the same itinerary, so the last save made
 * is the last one Gravity sees. `isLatest` tells the task whether a newer save has been queued
 * since, so a superseded save can skip its rollback.
 */
export const queueItinerarySave = (
  itineraryID: string,
  task: (isLatest: () => boolean) => Promise<void>
) => {
  const queue = queues.get(itineraryID) ?? { tail: Promise.resolve(), pending: 0, lastSeq: 0 }
  const seq = ++queue.lastSeq

  queue.pending++
  queue.tail = queue.tail
    .then(() => task(() => queue.lastSeq === seq))
    .catch((error) => console.error("Itinerary save failed", error))
    .finally(() => {
      queue.pending--

      if (!queue.pending) {
        queues.delete(itineraryID)
      }

      notify()
    })

  queues.set(itineraryID, queue)
  notify()

  return queue.tail
}

export const hasPendingItinerarySave = (itineraryID: string) =>
  (queues.get(itineraryID)?.pending ?? 0) > 0

export const markItineraryDeleted = (itineraryID: string) => {
  deletedItineraries.add(itineraryID)
}

export const isItineraryDeleted = (itineraryID: string) => deletedItineraries.has(itineraryID)

const subscribe = (listener: () => void) => {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

export const useHasPendingItinerarySave = (itineraryID: string) =>
  useSyncExternalStore(subscribe, () => hasPendingItinerarySave(itineraryID))
