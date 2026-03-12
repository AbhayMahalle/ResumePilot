import { type FormEvent, useState, useCallback, useEffect } from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { useAuthStore } from "~/lib/store";
import { api } from "~/lib/api";
import { useNavigate } from "react-router";

const Upload = () => {
    const { isAuthenticated, isLoading: authLoading } = useAuthStore();
    const navigate = useNavigate();
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) navigate('/auth?next=/upload');
    }, [authLoading, isAuthenticated, navigate])

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleCancel = useCallback(() => {
        setIsProcessing(false);
        setErrorText('');
        // Note: fetch abort could be added to api.ts, but simple state reset is fine
    }, []);

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File }) => {
        setIsProcessing(true);
        setErrorText('');

        try {
            const formData = new FormData();
            formData.append("companyName", companyName);
            formData.append("jobTitle", jobTitle);
            formData.append("jobDescription", jobDescription);
            formData.append("resume", file);

            const data = await api.resumes.uploadAndAnalyze(formData);
            
            navigate(`/resume/${data.resume.id}`);
        } catch (err: any) {
            console.error('AI analysis error:', err);
            setErrorText(`AI analysis failed: ${err.message || String(err)}`);
            setIsProcessing(false);
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if (!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if (!companyName.trim() || !jobTitle.trim() || !jobDescription.trim() || !file) {
            setErrorText('Please fill all fields and select a PDF file.');
            return;
        }

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <div className="flex flex-col items-center gap-6 w-full max-w-xl mt-4">
                            {/* Status text */}
                            <p className="text-xl text-dark-200 font-medium animate-pulse">
                                Analyzing with Gemini AI... (This usually takes 10-20 seconds)
                            </p>

                            {/* Error message */}
                            {errorText && (
                                <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 w-full">
                                    <img src="/icons/warning.svg" alt="error" className="w-5 h-5" />
                                    <p className="text-red-700 text-sm font-medium">{errorText}</p>
                                </div>
                            )}

                            {/* Animation */}
                            <img src="/images/resume-scan.gif" className="w-full max-w-sm rounded-2xl shadow-xl" alt="Scanning animation" />

                            {/* Cancel button */}
                            <button
                                onClick={handleCancel}
                                className="cancel-button mt-4"
                            >
                                Cancel Analysis
                            </button>
                        </div>
                    ) : (
                        <>
                            {errorText ? (
                                <div className="flex flex-col items-center gap-4 mt-4">
                                    <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 max-w-xl">
                                        <img src="/icons/warning.svg" alt="error" className="w-5 h-5" />
                                        <p className="text-red-700 font-medium">{errorText}</p>
                                    </div>
                                    <p className="text-dark-200">You can fill the form again and retry.</p>
                                </div>
                            ) : (
                                <h2>Drop your resume for an ATS score and improvement tips</h2>
                            )}
                        </>
                    )}
                    
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8 w-full max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <div className="form-div">
                                <label htmlFor="company-name" className="font-semibold text-gray-700 mb-1">Company Name</label>
                                <input type="text" name="company-name" placeholder="E.g. Google, Microsoft" id="company-name" required className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title" className="font-semibold text-gray-700 mb-1">Job Title</label>
                                <input type="text" name="job-title" placeholder="E.g. Senior Software Engineer" id="job-title" required className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description" className="font-semibold text-gray-700 mb-1">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Paste the full job description here..." id="job-description" required className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>

                            <div className="form-div mt-4">
                                <label htmlFor="uploader" className="font-semibold text-gray-700 mb-1">Upload Resume (PDF)</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button className="primary-button mt-6 text-lg py-4 w-full justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all" type="submit">
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}

export default Upload;
