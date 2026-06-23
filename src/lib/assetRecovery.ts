const ASSET_RECOVERY_KEY = 'neuromaps:asset-recovery-url'

export function hasRetriedCurrentUrl() {
  if (typeof window === 'undefined') {
    return true
  }

  return sessionStorage.getItem(ASSET_RECOVERY_KEY) === window.location.href
}

export function markCurrentUrlRetried() {
  sessionStorage.setItem(ASSET_RECOVERY_KEY, window.location.href)
}

export function clearAssetRecoveryMarker() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(ASSET_RECOVERY_KEY)
  }
}
