import { supabase } from './supabase'

export const EVIDENCE_BUCKET = 'waste-evidence'
export const EVIDENCE_URL_TTL_SECONDS = 60 * 60

const ALLOWED_EVIDENCE_BUCKETS = new Set([
    'waste-evidence',
    'report-evidence',
])

export function isHttpUrl(value: string | null | undefined) {
    return Boolean(
        value &&
        (value.startsWith('http://') || value.startsWith('https://')),
    )
}

type StorageReference = {
    bucket: string
    path: string
}

function parseSupabasePublicStorageReference(reference: string): StorageReference | null {
    if (!isHttpUrl(reference)) return null

    try {
        const url = new URL(reference)
        const marker = '/storage/v1/object/public/'
        const markerIndex = url.pathname.indexOf(marker)

        if (markerIndex < 0) return null

        const encodedReference = url.pathname.slice(
            markerIndex + marker.length,
        )
        const separatorIndex = encodedReference.indexOf('/')

        if (separatorIndex <= 0 || separatorIndex === encodedReference.length - 1) {
            return null
        }

        const bucket = encodedReference.slice(0, separatorIndex)
        const encodedPath = encodedReference.slice(separatorIndex + 1)

        if (!ALLOWED_EVIDENCE_BUCKETS.has(bucket)) return null

        return {
            bucket,
            path: decodeURIComponent(encodedPath),
        }
    } catch {
        return null
    }
}

export function resolveEvidenceReference(
    reference: string | null | undefined,
    signedUrls: Record<string, string>,
) {
    if (!reference) return null
    return signedUrls[reference] ?? null
}

export async function createEvidenceUrlMap(references: string[]) {
    const uniqueReferences = [...new Set(references.filter(Boolean))]

    if (uniqueReferences.length === 0) return {}

    const groups = new Map<
        string,
        Array<{ reference: string; path: string }>
    >()

    for (const reference of uniqueReferences) {
        const parsed = parseSupabasePublicStorageReference(reference)
        const bucket = parsed?.bucket ?? EVIDENCE_BUCKET
        const path = parsed?.path ?? reference

        const items = groups.get(bucket) ?? []
        items.push({ reference, path })
        groups.set(bucket, items)
    }

    const signedUrls: Record<string, string> = {}

    for (const [bucket, items] of groups) {
        const uniquePaths = [...new Set(items.map((item) => item.path))]

        const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUrls(uniquePaths, EVIDENCE_URL_TTL_SECONDS)

        if (error) throw error

        for (const item of items) {
            const pathIndex = uniquePaths.indexOf(item.path)
            const signedUrl = data?.[pathIndex]?.signedUrl

            if (typeof signedUrl === 'string') {
                signedUrls[item.reference] = signedUrl
            }
        }
    }

    return signedUrls
}
