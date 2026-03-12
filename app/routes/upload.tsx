import { type FormEvent, useState, useRef, useCallback } from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";

const TOTAL_STEPS = 5;
const AI_TIMEOUT_MS = 120_000; // 2 minutes

const STEP_LABELS: Record<number, string> = {
    1: 'Uploading resume...',
    2: 'Converting to image...',
    3: 'Uploading image...',
    4: 'Preparing data...',
    5: 'Analyzing with AI...',
};

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [statusText, setStatusText] = useState('');
    const [errorText, setErrorText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const cancelledRef = useRef(false);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const resetProcessing = useCallback(() => {
        setIsProcessing(false);
        setCurrentStep(0);
        setStatusText('');
        setErrorText('');
        cancelledRef.current = false;
    }, []);

    const handleCancel = useCallback(() => {
        cancelledRef.current = true;
        resetProcessing();
    }, [resetProcessing]);

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File }) => {
        setIsProcessing(true);
        setErrorText('');
        cancelledRef.current = false;

        // Step 1: Upload file
        setCurrentStep(1);
        setStatusText(STEP_LABELS[1]);
        const uploadedFile = await fs.upload([file]);
        if (cancelledRef.current) return;
        if (!uploadedFile) { setErrorText('Failed to upload file. Please try again.'); setIsProcessing(false); return; }

        // Step 2: Convert PDF to image
        setCurrentStep(2);
        setStatusText(STEP_LABELS[2]);
        const imageFile = await convertPdfToImage(file);
        if (cancelledRef.current) return;
        if (!imageFile.file) { setErrorText('Failed to convert PDF to image.'); setIsProcessing(false); return; }

        // Step 3: Upload image
        setCurrentStep(3);
        setStatusText(STEP_LABELS[3]);
        const uploadedImage = await fs.upload([imageFile.file]);
        if (cancelledRef.current) return;
        if (!uploadedImage) { setErrorText('Failed to upload image.'); setIsProcessing(false); return; }

        // Step 4: Prepare data
        setCurrentStep(4);
        setStatusText(STEP_LABELS[4]);
        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback: '',
        }
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        if (cancelledRef.current) return;

        // Step 5: AI Analysis (with timeout)
        setCurrentStep(5);
        setStatusText(STEP_LABELS[5]);

        let feedback;
        try {
            feedback = await Promise.race([
                ai.feedback(
                    uploadedFile.path,
                    prepareInstructions({ jobTitle, jobDescription })
                ),
                new Promise<never>((_, reject) =>
                    setTimeout(() => reject(new Error('timeout')), AI_TIMEOUT_MS)
                ),
            ]);
        } catch (err) {
            if (cancelledRef.current) return;
            console.error('AI analysis error:', err);
            if (err instanceof Error && err.message === 'timeout') {
                setErrorText('AI analysis timed out (2 min). The service may be busy — please try again.');
            } else {
                const detail = err instanceof Error
                    ? err.message
                    : typeof err === 'object'
                        ? JSON.stringify(err)
                        : String(err);
                setErrorText(`AI analysis failed: ${detail}`);
            }
            setIsProcessing(false);
            return;
        }

        if (cancelledRef.current) return;
        if (!feedback) { setErrorText('Failed to get AI feedback. Please try again.'); setIsProcessing(false); return; }

        const feedbackText = typeof feedback.message.content === 'string'
            ? feedback.message.content
            : feedback.message.content[0].text;

        try {
            data.feedback = JSON.parse(feedbackText);
        } catch {
            setErrorText('Failed to parse AI response. Please try again.');
            setIsProcessing(false);
            return;
        }

        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        if (cancelledRef.current) return;

        setStatusText('Analysis complete! Redirecting...');
        navigate(`/resume/${uuid}`);
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if (!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if (!companyName.trim() || !jobTitle.trim() || !jobDescription.trim() || !file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    const progressPercent = isProcessing ? Math.round((currentStep / TOTAL_STEPS) * 100) : 0;

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <div className="flex flex-col items-center gap-6 w-full max-w-xl mt-4">
                            {/* Step indicator */}
                            <div className="flex items-center gap-3">
                                {Array.from({ length: TOTAL_STEPS }, (_, i) => {
                                    const step = i + 1;
                                    const isActive = step === currentStep;
                                    const isCompleted = step < currentStep;
                                    return (
                                        <div key={step} className="flex items-center gap-2">
                                            <div
                                                className={`
                                                    w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                                                    ${isCompleted
                                                        ? 'bg-green-500 text-white scale-90'
                                                        : isActive
                                                            ? 'primary-gradient text-white scale-110 shadow-lg'
                                                            : 'bg-gray-200 text-gray-400'
                                                    }
                                                `}
                                            >
                                                {isCompleted ? '✓' : step}
                                            </div>
                                            {step < TOTAL_STEPS && (
                                                <div className={`w-6 h-0.5 transition-all duration-300 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Status text */}
                            <p className="text-xl text-dark-200 font-medium">
                                Step {currentStep}/{TOTAL_STEPS}: {statusText}
                            </p>

                            {/* Progress bar */}
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-700 ease-out progress-bar-gradient"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>

                            {/* Error message */}
                            {errorText && (
                                <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 w-full">
                                    <img src="/icons/warning.svg" alt="error" className="w-5 h-5" />
                                    <p className="text-red-700 text-sm font-medium">{errorText}</p>
                                </div>
                            )}

                            {/* Animation */}
                            <img src="/images/resume-scan.gif" className="w-full max-w-sm rounded-2xl" />

                            {/* Cancel button */}
                            <button
                                onClick={handleCancel}
                                className="cancel-button"
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
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company Name" id="company-name" required />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name="job-title" placeholder="Job Title" id="job-title" required />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" required />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button className="primary-button" type="submit">
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload
