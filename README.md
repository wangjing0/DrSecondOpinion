# DrSecondOpinion
[APP Demo](https://studio--drsecondopinion.us-central1.hosted.app/)

This project is a DrSecondOpinion app built with NextJS. It provides users with the ability to upload and analyze medical documents, and interact with an AI assistant to ask questions and receive information related to their documents.

## Features

Based on the blueprint and the available AI flows, the key features of the DrSecondOpinion app include:

*   **Document Analysis:** The core function is to analyze uploaded medical documents. This likely involves extracting key information, understanding medical terminology, and potentially identifying important findings or diagnoses. (Refer to `docs/blueprint.md` and `src/ai/flows/analyze-medical-documents.ts`)
*   **Answering User Questions:** Users can ask questions related to the uploaded documents, and the AI assistant will provide relevant answers based on the analysis. (Refer to `docs/blueprint.md`)
*   **AI-Powered Follow-up Questions:** The AI assistant can suggest relevant follow-up questions based on the conversation and the document analysis, helping users explore their medical information more thoroughly. (Refer to `src/ai/flows/ai-powered-follow-up-questions.ts`)
*   **Generate Advice in Layman's Terms:** The application can translate complex medical information into understandable language, making it easier for users to grasp their medical reports and conditions. (Refer to `src/ai/flows/generate-advice-in-laymans-terms.ts`)
*   **Summarize Chat History:** The AI can provide summaries of the conversation history, allowing users to quickly review previous interactions and key points discussed. (Refer to `src/ai/flows/summarize-chat-history.ts`)

## Getting Started

To get started with this project, you can explore the code starting with `src/app/page.tsx`. The AI functionalities are defined and configured in the `src/ai` directory, particularly in `src/ai/dev.ts` and the flow files within `src/ai/flows`.

This application leverages AI to provide a valuable tool for users seeking to better understand their medical information.

## Deployment

This project is configured for deployment using Firebase App Hosting. Follow these steps to deploy it to your own Firebase project.

### Prerequisites

1.  **Node.js and npm:** Ensure you have Node.js (v18 or later) and npm installed.
2.  **Firebase Account:** You need a Firebase account and a new Firebase project. You can create one at the [Firebase Console](https://console.firebase.google.com/).
3.  **Gemini API Key:** You need a Gemini API key to use the AI features. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Step-by-Step Instructions

1.  **Install Firebase CLI:**
    If you don't have it installed, open your terminal and run:
    ```bash
    npm install -g firebase-tools
    ```

2.  **Clone and Install Dependencies:**
    Clone the project repository and install the necessary npm packages.
    ```bash
    git clone <your-repo-url>
    cd <project-directory>
    npm install
    ```

3.  **Set Up Environment Variables:**
    Create a new file named `.env.local` in the root of your project directory. Add your Gemini API key to this file:
    ```
    GEMINI_API_KEY=your_gemini_api_key_here
    ```

4.  **Login to Firebase:**
    Authenticate with Firebase using your Google account.
    ```bash
    firebase login
    ```

5.  **Initialize Firebase App Hosting:**
    Run the `init` command to connect your local project to your Firebase project.
    ```bash
    firebase init apphosting
    ```
    - Select your existing Firebase project when prompted.
    - Choose a backend name (e.g., `dr-second-opinion`).
    - The CLI will automatically detect the Next.js framework.

6.  **Deploy to Firebase:**
    Once initialization is complete, deploy your application.
    ```bash
    firebase deploy
    ```

After the deployment is successful, the Firebase CLI will provide you with the URL to your live application.
