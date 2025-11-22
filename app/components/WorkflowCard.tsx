import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Play, CheckCircle, Bot, Database, Globe, FileText, Check } from "lucide-react";
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { createWalrusService } from "../services";
import { WriteFilesFlow } from "@mysten/walrus";

interface WorkflowCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  inputType: "audio" | "text" | "image";
  author: string;
  onRun: (blobId: string) => Promise<void>;
  isProcessing: boolean;
  result: { blobId: string; url: string } | null;
}

export function WorkflowCard({
  id,
  title,
  description,
  price,
  inputType,
  author,
  onRun,
  isProcessing,
  result,
}: WorkflowCardProps) {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();

  const [uploading, setUploading] = useState(false);
  const [uploadedBlobId, setUploadedBlobId] = useState<string | null>(null);

  const walrus = useMemo(() => {
    if (typeof window === "undefined") return null as any;
    return createWalrusService({ network: "testnet", epochs: 10 });
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentAccount || !walrus) return;

    setUploading(true);
    try {
      const contents = await file.arrayBuffer();
      const flow: WriteFilesFlow = walrus.uploadWithFlow(
        [{
          contents: new Uint8Array(contents),
          identifier: file.name,
          tags: { "content-type": file.type || "application/octet-stream" },
        }],
        { epochs: 10, deletable: true }
      );

      await flow.encode();
      const registerTx = flow.register({ owner: currentAccount.address, epochs: 10, deletable: true });

      let registerDigest: string;
      await new Promise<void>((resolve, reject) => {
        signAndExecute({ transaction: registerTx }, {
          onSuccess: async ({ digest }) => {
            registerDigest = digest;
            await suiClient.waitForTransaction({ digest });
            resolve();
          },
          onError: reject,
        });
      });

      await flow.upload({ digest: registerDigest! });
      const certifyTx = flow.certify();

      await new Promise<void>((resolve, reject) => {
        signAndExecute({ transaction: certifyTx }, {
          onSuccess: async ({ digest }) => {
            await suiClient.waitForTransaction({ digest });
            resolve();
          },
          onError: reject,
        });
      });

      const files = await flow.listFiles();
      const blobId = files[0]?.blobId;

      if (blobId) {
        setUploadedBlobId(blobId);
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  // Mock icons based on the reference image style
  const getIcons = () => {
    return (
      <div className="flex gap-2 mb-6">
        <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
          <Database className="w-4 h-4 text-white" />
        </div>
        <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
          <Globe className="w-4 h-4 text-white" />
        </div>
        <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-xs text-white font-medium">
          +2
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-[#1A1A24] border-0 rounded-2xl overflow-hidden hover:bg-[#22222E] transition-colors duration-300 group">
      <CardContent className="p-6 flex flex-col h-full relative">
        {/* Icons Row */}
        {getIcons()}

        {/* Title & Description */}
        <div className="mb-8 flex-1">
          <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* Author Footer */}
        <div className="flex items-center gap-3 mt-auto">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
            {author.charAt(0)}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-300 font-medium">{author}</span>
            <div className="w-4 h-4 rounded-full bg-[#FF6D5A] flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-black stroke-[3]" />
            </div>
          </div>
        </div>

        {/* Hover Overlay for Action */}
        <div className="absolute inset-0 bg-[#1A1A24]/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
          {!uploadedBlobId ? (
            <div className="w-full space-y-4">
              <p className="text-white font-medium">Upload Input File</p>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading || !currentAccount}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-0">
                  {uploading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <FileText className="mr-2 h-4 w-4" />}
                  {uploading ? "Uploading..." : "Select File"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full space-y-4">
              <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">File Ready</span>
              </div>
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0"
                onClick={() => onRun(uploadedBlobId)}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Run {price} SUI
                  </>
                )}
              </Button>
            </div>
          )}

          {result && (
            <div className="mt-4">
              <Button
                variant="link"
                className="text-purple-400 hover:text-purple-300"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(result.url, '_blank');
                }}
              >
                View Result NFT ↗
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
