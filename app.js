require('isomorphic-fetch');
const { MemoryStorage } = require("botbuilder");
const { Client } = require("@microsoft/microsoft-graph-client");
const { TokenCredentialAuthenticationProvider } = require("@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials");
const { DefaultAzureCredential } = require("@azure/identity");
const path = require("path");
const config = require("./config");

// Graph API permissions required
const graphScopes = ["OnlineMeetings.Read.All", "Calls.Read.All"];

// Initialize Azure Credential for Graph API
const credential = new DefaultAzureCredential();

// Create Graph client
const authProvider = new TokenCredentialAuthenticationProvider(credential, { scopes: graphScopes });
const graphClient = Client.initWithMiddleware({ authProvider: authProvider });


// See https://aka.ms/teams-ai-library to learn more about the Teams AI library.
const { Application, ActionPlanner, OpenAIModel, PromptManager } = require("@microsoft/teams-ai");

// Create AI components
const model = new OpenAIModel({
  // Use Manus model via OpenAI-compatible API
  apiKey: process.env.OPENAI_API_KEY, // Assumes OPENAI_API_KEY is set in environment
  endpoint: process.env.OPENAI_API_BASE, // Assumes OPENAI_API_BASE is set in environment
  defaultModel: "gemini-2.5-flash", // Using a Manus supported model slug




  useSystemMessages: true,
  logRequests: true,
});
const prompts = new PromptManager({
  promptsFolder: path.join(__dirname, "../src/prompts"),
});
const planner = new ActionPlanner({
  model,
  prompts,
  defaultPrompt: "chat",
});

// Define storage and application
const storage = new MemoryStorage();
function getMeetingIdFromContext(context) {
  const meeting = context.activity.channelData?.meeting;
  if (meeting && meeting.id) {
    return meeting.id;
  } else if (context.activity.conversation?.id && context.activity.conversation.id.includes("_")) {
    // For channel meetings, the conversation ID might contain the meeting ID
    return context.activity.conversation.id.split("_")[1];
  }
  return null;
}

const app = new Application({
  storage,
  ai: {
    planner,
  },
});

app.action("getMeetingTranscripts", async (context, state) => {
  try {
    // Implement Graph API call to fetch transcripts
    const meetingId = getMeetingIdFromContext(context);
    if (!meetingId) {
      return "No meeting ID found in context.";
    }

    console.log(`Fetching transcripts for meeting ID: ${meetingId}`);
    const response = await graphClient.api(`/me/onlineMeetings/${meetingId}/transcripts`).get();
    const transcripts = response.value;

    if (transcripts && transcripts.length > 0) {
      // Assuming we want the latest transcript
      const latestTranscriptId = transcripts[0].id;
      const transcriptContentResponse = await graphClient.api(`/me/onlineMeetings/${meetingId}/transcripts/${latestTranscriptId}/content?$format=text/vtt`).get();
      const transcriptText = transcriptContentResponse; // Assuming VTT content is directly returned as text
    // Now, send this transcriptText to the AI model for summarization and extraction
    const aiResponse = await planner.completePrompt(context, "meetingSummary", { input: transcriptText });
    return aiResponse;

    } else {
      return "No transcripts found for this meeting.";
    }
  } catch (error) {
    console.error("Error fetching meeting transcripts:", error);
    return "Error fetching transcripts.";
  }
});

app.message("resumir reunião", async (context, state) => {
  await context.sendActivity("Buscando e resumindo a transcrição da reunião...");
  const summary = await app.ai.planner.doAction(context, "getMeetingTranscripts");
  await context.sendActivity(summary);
});

module.exports = app;
