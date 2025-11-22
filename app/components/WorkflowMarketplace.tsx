import { useState } from "react";
import { WorkflowCard } from "./WorkflowCard";
import { runAgentWorkflow } from "../services/agent";

const WORKFLOWS = [
    {
        id: "ai-agent-chat",
        title: "AI agent chat",
        description: "A powerful chat interface connected to your custom knowledge base.",
        price: 1,
        inputType: "text" as const,
        author: "n8n Team"
    },
    {
        id: "rag-chatbot",
        title: "RAG Chatbot for Company Documents",
        description: "Use Google Drive and Gemini to answer questions about your internal docs.",
        price: 2,
        inputType: "text" as const,
        author: "Mihai Farcas"
    },
    {
        id: "web-search-bot",
        title: "AI chatbot that can search the web",
        description: "An agent that browses the internet to find real-time information for you.",
        price: 1.5,
        inputType: "text" as const,
        author: "n8n Team"
    },
    {
        id: "auto-crawler",
        title: "Autonomous AI crawler",
        description: "Scrape websites automatically and extract structured data into spreadsheets.",
        price: 3,
        inputType: "text" as const,
        author: "Oskar"
    },
    {
        id: "sheet-chat",
        title: "Chat with a Google Sheet using AI",
        description: "Interact with your spreadsheet data using natural language.",
        price: 1,
        inputType: "text" as const,
        author: "David Roberts"
    },
    {
        id: "web-scraper",
        title: "AI agent that can scrape webpages",
        description: "Extract content from any URL and summarize it using LLMs.",
        price: 1.2,
        inputType: "text" as const,
        author: "Eduard"
    }
];

export function WorkflowMarketplace() {
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [results, setResults] = useState<Record<string, { blobId: string; url: string }>>({});

    const handleRun = async (workflowId: string, inputBlobId: string) => {
        const workflow = WORKFLOWS.find(w => w.id === workflowId);
        if (!workflow) return;

        setProcessingId(workflowId);

        try {
            const result = await runAgentWorkflow(workflowId, inputBlobId);
            setResults(prev => ({
                ...prev,
                [workflowId]: result
            }));
        } catch (error) {
            console.error("Workflow failed:", error);
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="container mx-auto py-10 px-4">
            {/* Grid Section */}
            <div className="space-y-10">
                <div className="flex justify-center">
                    <button className="px-8 py-3 rounded-md bg-[#2D1B4E] text-white font-medium hover:bg-[#3D2B5E] transition-colors border border-white/10">
                        Browse all AI agent templates
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {WORKFLOWS.map((workflow) => (
                        <WorkflowCard
                            key={workflow.id}
                            {...workflow}
                            onRun={(blobId) => handleRun(workflow.id, blobId)}
                            isProcessing={processingId === workflow.id}
                            result={results[workflow.id] || null}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
