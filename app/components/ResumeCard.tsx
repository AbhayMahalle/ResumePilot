import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";

const ResumeCard = ({ resume: { id, companyName, jobTitle, overallScore } }: { resume: any }) => {
    // If the backend has already extracted the overallScore to the top level, use it.
    // Otherwise fallback to feedback.overallScore if populated in the frontend type.
    const score = overallScore || 0;

    return (
        <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000 p-6 flex items-center justify-between bg-white border border-slate-200 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all">
            <div className="flex flex-col gap-2">
                {companyName && <h2 className="!text-slate-800 font-bold break-words text-xl">{companyName}</h2>}
                {jobTitle && <h3 className="text-lg break-words text-slate-500 font-medium">{jobTitle}</h3>}
                {!companyName && !jobTitle && <h2 className="!text-slate-800 font-bold text-xl">Resume Analysis</h2>}
                
                <p className="text-sm text-blue-600 font-medium mt-2 flex items-center gap-1 hover:underline">
                    View detailed feedback 
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </p>
            </div>
            <div className="flex-shrink-0 ml-4">
                <ScoreCircle score={score} />
            </div>
        </Link>
    )
}

export default ResumeCard;
