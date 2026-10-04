import { supabase } from './supabase'

export const EVIDENCE_BUCKET = 'waste-evidence'
export const EVIDENCE_URL_TTL_SECONDS = 60 * 60

export function isHttpUrl(value: string | null | undefined) {
    return Boolean(
        value &&
        (value.startsWith('http://') || value.startsWith('https://')),
    )
}

export function resolveEvidenceReference(reference: string | null | undefined, signedUrls: Record<string, string>) {
    if (!reference) return null
    if (isHttpUrl(reference)) return reference
    return signedUrls[reference] ?? null
}

export async function createEvidenceUrlMap(paths: string[]) {
    const uniquePaths = [...new Set(paths.filter(Boolean).filter((path) => !isHttpUrl(path)))]
    if (uniquePaths.length === 0) return {}

    const { data, error } = await supabase.storage
        .from(EVIDENCE_BUCKET)
        .createSignedUrls(uniquePaths, EVIDENCE_URL_TTL_SECONDS)

    if (error) throw error

    return Object.fromEntries(
        (data ?? []).map((item, index) => [
            uniquePaths[index],
            item.signedUrl,
        ]),
    )
}
