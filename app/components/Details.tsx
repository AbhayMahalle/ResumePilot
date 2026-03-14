import { CheckCircle, AlertCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

const ScoreBadge = ({ score }: { score: number }) => {
  const config = score >= 70
    ? { bg: "bg-success-light", text: "text-green-700" }
    : score >= 50
    ? { bg: "bg-warning-light", text: "text-amber-700" }
    : { bg: "bg-error-light", text: "text-red-700" };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      {score}/100
    </span>
  );
};

const CategoryHeader = ({ title, categoryScore }: { title: string; categoryScore: number }) => (
  <div className="flex items-center gap-3">
    <span className="text-base font-semibold text-text-primary">{title}</span>
    <ScoreBadge score={categoryScore} />
  </div>
);

const CategoryContent = ({
  tips,
}: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => (
  <div className="space-y-3">
    {tips.map((tip, i) => (
      <div
        key={i}
        className={`flex gap-3 rounded-xl p-4 ${
          tip.type === "good"
            ? "bg-success-light/50 border border-green-200"
            : "bg-warning-light/50 border border-amber-200"
        }`}
      >
        {tip.type === "good" ? (
          <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
        )}
        <div>
          <p className={`text-sm font-semibold mb-1 ${tip.type === "good" ? "text-green-700" : "text-amber-700"}`}>
            {tip.tip}
          </p>
          <p className={`text-sm ${tip.type === "good" ? "text-green-600" : "text-amber-600"}`}>
            {tip.explanation}
          </p>
        </div>
      </div>
    ))}
  </div>
);

const Details = ({ feedback }: { feedback: Feedback }) => {
  const categories = [
    { id: "tone-style", title: "Tone & Style", data: feedback.toneAndStyle },
    { id: "content", title: "Content", data: feedback.content },
    { id: "structure", title: "Structure", data: feedback.structure },
    { id: "skills", title: "Skills", data: feedback.skills },
  ];

  return (
    <div className="flex flex-col gap-3 w-full">
      <Accordion allowMultiple>
        {categories.map(({ id, title, data }) => (
          <AccordionItem key={id} id={id}>
            <AccordionHeader itemId={id}>
              <CategoryHeader title={title} categoryScore={data?.score || 0} />
            </AccordionHeader>
            <AccordionContent itemId={id}>
              <CategoryContent tips={data?.tips || []} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Details;
