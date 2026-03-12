import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "~/lib/store";
import { api } from "~/lib/api";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export const meta = () => ([
    { title: 'Resumind | Review ' },
    { name: 'description', content: 'Detailed overview of your resume' },
])

const Resume = () => {
    const { isAuthenticated, isLoading } = useAuthStore();
    const { id } = useParams();
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [fetchError, setFetchError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading, isAuthenticated, navigate, id])

    useEffect(() => {
        if (!id || !isAuthenticated) return;

        let resumeObjUrl = '';

        const loadResume = async () => {
            try {
                // 1. Fetch metadata & feedback
                const data = await api.resumes.getById(id);
                setFeedback(data.resume.feedback as Feedback);

                // 2. Fetch the actual PDF blob securely
                const pdfBlob = await api.resumes.download(id);
                resumeObjUrl = URL.createObjectURL(pdfBlob);
                setResumeUrl(resumeObjUrl);

            } catch (error: any) {
                console.error('Failed to load resume data', error);
                setFetchError(error.message || "Failed to load resume");
            }
        }

        loadResume();

        return () => {
            if (resumeObjUrl) URL.revokeObjectURL(resumeObjUrl);
        };
    }, [id, isAuthenticated]);

    if (fetchError) {
        return (
            <main className="!pt-0 flex items-center justify-center h-screen flex-col">
                <h2 className="text-2xl font-bold text-red-600 mb-4">{fetchError}</h2>
                <Link to="/" className="primary-button">Back to Home</Link>
            </main>
        );
    }

    return (
        <main className="!pt-0">
            <nav className="resume-nav">
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
                    <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                </Link>
            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center p-4">
                    {resumeUrl ? (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-full w-full max-w-[800px] overflow-hidden rounded-2xl bg-white/50 backdrop-blur-sm">
                            <embed 
                                src={resumeUrl + "#toolbar=0&navpanes=0&scrollbar=0"} 
                                type="application/pdf" 
                                className="w-full h-full rounded-xl"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                           <p className="mt-4 text-gray-600 font-medium">Loading PDF...</p>
                        </div>
                    )}
                </section>
                <section className="feedback-section overflow-y-auto h-[100vh] pb-20">
                    <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
                    {feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedback={feedback} />
                            <ATS score={feedback.ATS?.score || 0} suggestions={feedback.ATS?.tips || []} />
                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full w-full mt-20">
                            <img src="/images/resume-scan-2.gif" className="w-[300px]" alt="Scanning resume" />
                            <p className="mt-4 text-gray-500 font-medium text-lg animate-pulse">Analyzing feedback...</p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}
export default Resume
