import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuthStore } from "~/lib/store";
import { api } from "~/lib/api";
import Navbar from "~/components/Navbar";
import toast from "react-hot-toast";

const WipeApp = () => {
    const { isAuthenticated, user, isLoading: authLoading } = useAuthStore();
    const navigate = useNavigate();
    const [resumes, setResumes] = useState<any[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate("/auth?next=/wipe");
        }
    }, [authLoading, isAuthenticated, navigate]);

    const loadResumes = async () => {
        setIsLoading(true);
        try {
            const data = await api.resumes.getAll();
            setResumes(data.resumes || []);
        } catch (error) {
            toast.error("Failed to load resumes");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            loadResumes();
        }
    }, [isAuthenticated]);

    const handleDeleteAll = async () => {
        if (!confirm("Are you sure you want to delete ALL your resumes and analysis data? This action cannot be undone.")) {
            return;
        }

        setIsDeleting(true);
        let successCount = 0;
        let failCount = 0;

        for (const resume of resumes) {
            try {
                await api.resumes.delete(resume.id);
                successCount++;
            } catch (error) {
                console.error(`Failed to delete resume ${resume.id}`, error);
                failCount++;
            }
        }

        setIsDeleting(false);
        
        if (failCount === 0) {
            toast.success(`Successfully deleted ${successCount} resumes.`);
        } else {
            toast.error(`Deleted ${successCount} resumes, but ${failCount} failed.`);
        }
        
        loadResumes();
    };

    const handleDeleteOne = async (id: string, name: string) => {
        if (!confirm(`Delete analysis for ${name}?`)) return;
        
        try {
            await api.resumes.delete(id);
            toast.success("Resume deleted");
            loadResumes();
        } catch (error) {
            toast.error("Failed to delete resume");
        }
    };

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50">
            <Navbar />
            
            <div className="max-w-3xl mx-auto p-8 mt-10 bg-white rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Manage Data</h1>
                        <p className="text-slate-500 mt-2">Authenticated as: <span className="font-semibold text-slate-700">{user?.name || user?.email}</span></p>
                    </div>
                    <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
                        &larr; Back to Home
                    </Link>
                </div>

                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-slate-700">Stored Resumes ({resumes.length})</h2>
                    
                    {resumes.length > 0 && (
                        <button
                            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            onClick={handleDeleteAll}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "⚠️ Delete All Data"}
                        </button>
                    )}
                </div>

                {resumes.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                        <p className="text-slate-500">No resumes found in your account.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {resumes.map((resume) => (
                            <div key={resume.id} className="flex flex-row justify-between items-center p-5 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors bg-white">
                                <div>
                                    <p className="font-bold text-slate-800 text-lg">{resume.companyName}</p>
                                    <p className="text-slate-500">{resume.jobTitle}</p>
                                    <p className="text-xs text-slate-400 mt-2">
                                        File: {resume.resumeFileName || "Unknown"} &bull; Score: {resume.overallScore || 0}/100
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDeleteOne(resume.id, resume.companyName)}
                                    className="text-red-500 hover:text-white hover:bg-red-500 p-2 rounded-lg transition-all border border-transparent hover:border-red-600"
                                    title="Delete this resume"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default WipeApp;
