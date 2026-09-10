import { useState } from 'react'

function CreateReportPage() {
    const [location, setLocation] = useState('')
    const [description, setDescription] = useState('')
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [error, setError] = useState('')

    function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]

        if (!file) {
            return
        }

        const imageUrl = URL.createObjectURL(file)
        setImagePreview(imageUrl)
    }

    function handleContinue() {
        if (!location.trim() || !description.trim()) {
            setError('Please enter both the waste location and description.')
            return
        }

        if (!imagePreview) {
            setError('Please upload a before-cleaning evidence image.')
            return
        }

        setError('')

        alert(
            'Report information is ready for the AI review step. AI processing will be connected in the next phase.',
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
                        Reporter Workflow
                    </p>

                    <h1 className="mt-3 text-4xl font-bold tracking-tight">
                        Report Unmanaged Waste
                    </h1>

                    <p className="mt-3 text-slate-300">
                        Submit information and before-cleaning evidence so the waste issue
                        can enter the review and resolution workflow.
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
                    <div className="space-y-6">
                        <div>
                            <label
                                htmlFor="location"
                                className="mb-2 block text-sm font-medium text-slate-200"
                            >
                                Waste Location
                            </label>

                            <input
                                id="location"
                                type="text"
                                value={location}
                                onChange={(event) => setLocation(event.target.value)}
                                placeholder="Example: Campus Park near the walking path"
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="mb-2 block text-sm font-medium text-slate-200"
                            >
                                Describe the Waste Problem
                            </label>

                            <textarea
                                id="description"
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                placeholder="Describe what you observed..."
                                rows={6}
                                className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="beforeEvidence"
                                className="mb-2 block text-sm font-medium text-slate-200"
                            >
                                Before-Cleaning Evidence
                            </label>

                            <input
                                id="beforeEvidence"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="block w-full cursor-pointer rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300"
                            />

                            <p className="mt-2 text-sm text-slate-400">
                                Upload an image showing the waste before cleaning.
                            </p>
                        </div>

                        {imagePreview && (
                            <div>
                                <p className="mb-3 text-sm font-medium text-slate-200">
                                    Evidence Preview
                                </p>

                                <img
                                    src={imagePreview}
                                    alt="Before-cleaning waste evidence preview"
                                    className="max-h-96 w-full rounded-xl border border-slate-700 object-cover"
                                />
                            </div>
                        )}

                        {error && (
                            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                {error}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleContinue}
                            className="w-full rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
                        >
                            Continue to AI Review
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateReportPage