const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI = null;
const getGenAI = () => {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

const AIResponseFormat = `
interface Feedback {
  overallScore: number; //max 100
  ATS: {
    score: number; //rate based on ATS suitability
    tips: {
      type: "good" | "improve";
      tip: string; //give 3-4 tips
    }[];
  };
  toneAndStyle: {
    score: number; //max 100
    tips: {
      type: "good" | "improve";
      tip: string; //make it a short "title" for the actual explanation
      explanation: string; //explain in detail here
    }[]; //give 3-4 tips
  };
  content: {
    score: number; //max 100
    tips: {
      type: "good" | "improve";
      tip: string; //make it a short "title" for the actual explanation
      explanation: string; //explain in detail here
    }[]; //give 3-4 tips
  };
  structure: {
    score: number; //max 100
    tips: {
      type: "good" | "improve";
      tip: string; //make it a short "title" for the actual explanation
      explanation: string; //explain in detail here
    }[]; //give 3-4 tips
  };
  skills: {
    score: number; //max 100
    tips: {
      type: "good" | "improve";
      tip: string; //make it a short "title" for the actual explanation
      explanation: string; //explain in detail here
    }[]; //give 3-4 tips
  };
}`;

/**
 * Sleep helper for retry delays
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Analyze a resume PDF using Google Gemini AI with retry logic
 * @param {Buffer} pdfBuffer - The PDF file as a buffer
 * @param {string} jobTitle - The job title being applied for
 * @param {string} jobDescription - The job description
 * @param {number} maxRetries - Maximum number of retries (default: 3)
 * @returns {Object} Parsed feedback JSON
 */
const analyzeResume = async (pdfBuffer, jobTitle, jobDescription, maxRetries = 3) => {
  const model = getGenAI().getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `You are an expert in ATS (Applicant Tracking System) and resume analysis.
Please analyze and rate this resume and suggest how to improve it.
The rating can be low if the resume is bad.
Be thorough and detailed. Don't be afraid to point out any mistakes or areas for improvement.
If there is a lot to improve, don't hesitate to give low scores. This is to help the user to improve their resume.
If available, use the job description for the job user is applying to to give more detailed feedback.
If provided, take the job description into consideration.
The job title is: ${jobTitle}
The job description is: ${jobDescription}
Provide the feedback using the following format:
${AIResponseFormat}
Return the analysis as a JSON object, without any other text and without the backticks.
Do not include any other text or comments.`;

  // Convert PDF buffer to base64 for Gemini
  const base64Pdf = pdfBuffer.toString("base64");

  const requestContent = [
    {
      inlineData: {
        mimeType: "application/pdf",
        data: base64Pdf,
      },
    },
    prompt,
  ];

  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Gemini API attempt ${attempt}/${maxRetries}...`);

      const result = await model.generateContent(requestContent);
      const response = result.response;
      const text = response.text();

      // Clean the response — remove markdown code fences if present
      const cleanedText = text
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/gi, "")
        .trim();

      // Parse the JSON response
      const feedback = JSON.parse(cleanedText);
      console.log(`Gemini analysis completed successfully on attempt ${attempt}`);
      return feedback;
    } catch (error) {
      lastError = error;
      const errorMsg = error.message || String(error);

      // Check if it's a rate limit error (429) — retry with backoff
      if (errorMsg.includes("429") || errorMsg.includes("Resource has been exhausted") || errorMsg.includes("retry")) {
        // Extract retry delay from error message if available
        const retryMatch = errorMsg.match(/retry\s*in\s*([\d.]+)s/i);
        const waitSeconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) + 2 : 15 * attempt;

        console.log(`Rate limited. Waiting ${waitSeconds}s before retry ${attempt + 1}/${maxRetries}...`);

        if (attempt < maxRetries) {
          await sleep(waitSeconds * 1000);
          continue;
        }
      }

      // For non-retryable errors or final attempt, throw
      if (attempt === maxRetries) {
        throw error;
      }

      // Generic retry with exponential backoff
      const backoffMs = Math.min(5000 * Math.pow(2, attempt - 1), 60000);
      console.log(`Error on attempt ${attempt}: ${errorMsg}. Retrying in ${backoffMs / 1000}s...`);
      await sleep(backoffMs);
    }
  }

  throw lastError;
};

module.exports = { analyzeResume };
