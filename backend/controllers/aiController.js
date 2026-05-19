const Anthropic = require("@anthropic-ai/sdk");
const Complaint = require("../models/Complaint");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// @desc    Analyze a complaint using Claude AI
// @route   POST /api/ai/analyze
// @access  Private
const analyzeComplaint = async (req, res) => {
  try {
    const { complaintId } = req.body;

    if (!complaintId) {
      return res.status(400).json({ message: "complaintId is required" });
    }

    // Fetch the complaint from DB
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Build the prompt for Claude
    const prompt = `
You are an AI assistant for a government complaint management system in India.

Analyze the following citizen complaint and respond ONLY with a valid JSON object (no markdown, no extra text):

Complaint Details:
- Title: ${complaint.title}
- Description: ${complaint.description}
- Category: ${complaint.category}
- Location: ${complaint.location}

Return this exact JSON structure:
{
  "priority": "High" | "Medium" | "Low",
  "department": "name of the responsible government department",
  "summary": "2-3 sentence summary of the complaint",
  "autoResponse": "a polite, professional response message to send to the citizen acknowledging their complaint and outlining next steps"
}

Priority rules:
- High: safety hazards, medical emergencies, major infrastructure failure
- Medium: civic issues affecting daily life (water, electricity disruptions)
- Low: minor inconveniences, general feedback
`;

    // Call Claude API
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    // Extract text response
    const rawText = message.content[0].text.trim();

    // Parse JSON safely
    let aiResult;
    try {
      // Remove any accidental markdown fences
      const cleaned = rawText.replace(/```json|```/g, "").trim();
      aiResult = JSON.parse(cleaned);
    } catch (parseErr) {
      return res.status(500).json({
        message: "AI response could not be parsed. Raw response: " + rawText,
      });
    }

    // Save AI results back to the complaint document
    complaint.aiAnalysis = {
      priority: aiResult.priority,
      department: aiResult.department,
      summary: aiResult.summary,
      autoResponse: aiResult.autoResponse,
    };
    await complaint.save();

    res.json({
      message: "AI analysis complete",
      complaintId: complaint._id,
      aiAnalysis: complaint.aiAnalysis,
    });
  } catch (error) {
    console.error("AI Analysis Error:", error.message);
    res.status(500).json({ message: "AI analysis failed: " + error.message });
  }
};

// @desc    Quick analyze without saving (for preview)
// @route   POST /api/ai/quick-analyze
// @access  Private
const quickAnalyze = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "title, description, and category are required" });
    }

    const prompt = `
You are an AI assistant for a government complaint management system in India.

Analyze the following citizen complaint and respond ONLY with a valid JSON object:

- Title: ${title}
- Description: ${description}
- Category: ${category}
- Location: ${location || "Not specified"}

Return this exact JSON:
{
  "priority": "High" | "Medium" | "Low",
  "department": "responsible government department name",
  "summary": "2-3 sentence summary",
  "autoResponse": "professional acknowledgement message to the citizen"
}
`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const rawText = message.content[0].text.trim();
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const aiResult = JSON.parse(cleaned);

    res.json({ aiAnalysis: aiResult });
  } catch (error) {
    res.status(500).json({ message: "AI analysis failed: " + error.message });
  }
};

module.exports = { analyzeComplaint, quickAnalyze };
