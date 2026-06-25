const REVIEW_CHANGE_EVENT = 'neuromaps:reviews-changed'
const REVIEW_CHANGE_STORAGE_KEY = 'neuromaps.reviewsChangedAt'

export function notifyReviewsChanged() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(REVIEW_CHANGE_EVENT))
  try {
    window.localStorage.setItem(REVIEW_CHANGE_STORAGE_KEY, String(Date.now()))
  } catch {
    // Ignore storage failures; the in-tab event above still refreshes the current view.
  }
}

export function subscribeToReviewChanges(callback: () => void) {
  if (typeof window === 'undefined') return () => {}
  const onStorage = (event: StorageEvent) => {
    if (event.key === REVIEW_CHANGE_STORAGE_KEY) callback()
  }
  window.addEventListener(REVIEW_CHANGE_EVENT, callback)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(REVIEW_CHANGE_EVENT, callback)
    window.removeEventListener('storage', onStorage)
  }
}
