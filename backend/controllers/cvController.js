// controllers/cvController.js
// Contains the core logic for processing the CV.

const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- EHS Formatting Rules ---
// This function applies the specific formatting rules to the AI's output.
const applyEhsFormatting = (data) => {
    if (!data) return null;

    // Rule: Capitalize job titles
    if (data.header && data.header.jobTitle) {
        data.header.jobTitle = data.header.jobTitle
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    // Rule: Clean up experience descriptions
    if (data.experience && Array.isArray(data.experience)) {
        data.experience.forEach(exp => {
            if (exp.duties) {
                exp.duties = exp.duties.replace(/I am responsible for/gi, "Responsible for");
                exp.duties = exp.duties.replace(/Principle/g, "Principal");
                exp.duties = exp.duties.replace(/Discrete/g, "Discreet");
            }
        });
    }
    return data;
};


// --- Main Controller Function ---
const formatCvController = async (req, res) => {
    // 1. Get the raw CV text from the request body sent by the frontend
    const { cvText } = req.body;

    if (!cvText) {
        return res.status(400).json({ error: 'CV text is required.' });
    }

    try {
        // 2. Initialize the Google Generative AI client
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // Switched back to the 'gemini-1.5-flash' model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 3. Define the prompt for the AI
        const prompt = `Based on the following CV text, extract the information and structure it into a JSON object.
        Follow these rules strictly:
        1.  The JSON object must follow this exact schema:
            {
              "header": { "name": "string", "jobTitle": "string" },
              "personalDetails": { "nationality": "string", "languages": "string", "dob": "string", "maritalStatus": "string" },
              "profile": "string",
              "experience": [{ "title": "string", "company": "string", "dates": "string", "duties": "string" }],
              "education": [{ "degree": "string", "institution": "string", "dates": "string" }],
              "keySkills": "string",
              "interests": "string"
            }
        2.  Format all dates as "Mon YYYY" (e.g., "Jan 2020", "Aug 2025").
        3.  For the "duties" field in the experience section, combine all responsibilities into a single string, using the newline character '\\n' to separate each bullet point.
        4.  Completely ignore and do not include any fields for "Age" or "Dependants".
        5.  Ensure the final output is only a valid JSON object and nothing else.

        CV Text: """${cvText}"""`;

        // 4. Call the AI model to generate the content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let jsonText = response.text();
        
        // ** START: Robust JSON Cleaning **
        // Find the start and end of the JSON object in the response text
        const startIndex = jsonText.indexOf('{');
        const endIndex = jsonText.lastIndexOf('}');
        if (startIndex !== -1 && endIndex !== -1) {
            jsonText = jsonText.substring(startIndex, endIndex + 1);
        }
        // ** END: Robust JSON Cleaning **
        
        // 5. Parse the AI's JSON response
        const parsedJson = JSON.parse(jsonText);

        // 6. Apply the specific EHS formatting rules
        const formattedCv = applyEhsFormatting(parsedJson);

        // 7. Send the final formatted CV back to the frontend
        res.status(200).json(formattedCv);

    } catch (error) {
        console.error('Error processing CV with AI:', error);
        res.status(500).json({ error: 'Failed to process CV.' });
    }
};

// Export the controller.
module.exports = { formatCvController };
