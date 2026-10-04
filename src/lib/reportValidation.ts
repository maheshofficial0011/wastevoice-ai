export const MAX_FILE_SIZE = 10 * 1024 * 1024
export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return 'Please upload a JPG, PNG or WebP image.'
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'Image must be smaller than 10 MB.'
  }

  return null
}

export function validateReportDetails({
  location,
  description,
  additionalInfo,
}: {
  location: string
  description: string
  additionalInfo: string
}): string | null {
  if (!location.trim()) return 'Please enter the waste location.'
  if (location.trim().length < 3) return 'Please provide a more specific location.'
  if (!description.trim()) return 'Please describe what you observed.'
  if (description.trim().length < 15) {
    return 'Please provide a little more detail about the observed problem.'
  }
  if (additionalInfo.trim().length > 1000) {
    return 'Additional information must be 1000 characters or fewer.'
  }

  return null
}
