# DrSecondOpinion
[APP Demo](https://studio--drsecondopinion.us-central1.hosted.app/)

This project is a DrSecondOpinion app built with NextJS. It provides users with the ability to upload and analyze medical documents, and interact with an AI assistant to ask questions and receive information related to their documents.

## Features

Based on the blueprint and the available AI flows, the key features of the DrSecondOpinion app include:

*   **Document Analysis:** The core function is to analyze uploaded medical documents. This likely involves extracting key information, understanding medical terminology, and potentially identifying important findings or diagnoses. (Refer to `docs/blueprint.md` and `src/ai/flows/analyze-medical-documents.ts`)
*   **Answering User Questions:** Users can ask medical questions in general, or related to the uploaded documents, and the AI assistant will provide relevant answers based on the analysis. Web search for better grounding the answer is also implemented. (Refer to `docs/blueprint.md`)
*   **AI-Powered Follow-up Questions:** The AI assistant can suggest relevant follow-up questions based on the conversation and the document analysis, helping users explore their medical information more thoroughly. (Refer to `src/ai/flows/ai-powered-follow-up-questions.ts`)
*   **Generate Advice in Layman's Terms:** The application can translate complex medical information into understandable language, making it easier for users to grasp their medical reports and conditions. (Refer to `src/ai/flows/generate-advice-in-laymans-terms.ts`)
*   **Summarize Chat History:** The AI can provide summaries of the conversation history, allowing users to quickly review previous interactions and key points discussed. (Refer to `src/ai/flows/summarize-chat-history.ts`)

## Getting Started

To get started with this project, you can explore the code starting with `src/app/page.tsx`. The AI functionalities are defined and configured in the `src/ai` directory, particularly in `src/ai/dev.ts` and the flow files within `src/ai/flows`.

This application leverages AI to provide a valuable tool for users seeking to better understand their medical information.

### Prerequisites

1.  **Node.js and npm:** Ensure you have Node.js (v18 or later) and npm installed.
2.  **Gemini API Key:** You need a Gemini API key to use the AI features. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Step-by-Step Instructions for deployment


If you are not deploying to Firebase App Hosting, you can deploy this Node.js application to a variety of hosting providers that support Node.js. The general steps are as follows:

1.  Clone the project repository and install the necessary npm packages.
    ```bash
    git clone <your-repo-url>
    cd <project-directory>
    npm install
    ```

2. Create an environment-specific configuration file: Create a new file named apphosting.<ENVIRONMENT_NAME>.yaml where <ENVIRONMENT_NAME> is the name of your new environment (e.g., apphosting.staging.yaml).

Add environment-specific overrides: In the newly created file, add any environment-specific configuration overrides you need. This might include API keys, database URLs, or other settings that differ from your default apphosting.yaml.

Add environment variables: If you need to set custom environment variables for your Node.js application, you can use a .env file. Add your key-value pairs to this file (e.g., PLANET=Earth, AUDIENCE=Humans).

3. Deploy with the environment configuration: When deploying, ensure your deployment process or command recognizes and uses the environment-specific configuration file and loads the environment variables from the .env file. The context suggests that for Firebase, deploying functions with firebase deploy --only functions will load environment variables from .env. For other hosting providers, you'll need to follow their specific instructions for loading environment variables.

Access environment variables in your code: In your Node.js code, you can access the environment variables using process.env.<VARIABLE_NAME> (e.g., process.env.PLANET).