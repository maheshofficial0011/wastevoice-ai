import { supabase } from './supabase'

export type ReportCategory =
    | 'plastic'
    | 'paper'
    | 'food'
    | 'mixed'
    | 'other'
    | 'unknown'

export interface ReportStructure {
    category: ReportCategory
    location: string
    summary: string
    missingFields: string[]
    needsConfirmation: true
}

export interface ReportAssistantResponse {
    source: 'openai' | 'gemini' | 'fallback'
    providerConfigured: boolean
    model?: string
    data: ReportStructure
    notice: string
}

export async function structureWasteReport(input: {
    location: string
    description: string
    additionalInfo?: string
}): Promise<ReportAssistantResponse> {
    const { data, error } = await supabase.functions.invoke('structure-report', {
        body: input,
    })

    if (error) {
        throw new Error(error.message || 'Unable to reach the report assistant.')
    }

    if (!data?.data) {
        throw new Error('The report assistant returned an incomplete response.')
    }

    return data as ReportAssistantResponse
}
