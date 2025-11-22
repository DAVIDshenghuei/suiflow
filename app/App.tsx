"use client";
import { useCurrentAccount, ConnectButton } from "@mysten/dapp-kit";
import { WorkflowMarketplace } from "./components/WorkflowMarketplace";
import { Bot, Zap, Database, Sparkles, Mail, MessageSquare, FileText, Globe, Cloud, Server, Code, Cpu, HardDrive, Share2, Shield, Smartphone, Wifi, Bluetooth, Radio, Tv } from "lucide-react";

// Helper to render colorful icons
const AppIcon = ({ Icon, color }: { Icon: any, color: string }) => (
  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-lg hover:scale-105 transition-transform duration-300">
    <Icon className={`w-10 h-10 md:w-12 md:h-12 ${color}`} />
  </div>
);

function App() {
  const currentAccount = useCurrentAccount();

  // Icons with colors to mimic brands
  const row1Icons = [
    { Icon: Bot, color: "text-blue-600" }, // Jira-ish
    { Icon: Zap, color: "text-orange-500" }, // Zapier-ish
    { Icon: Database, color: "text-green-600" }, // Sheets-ish
    { Icon: Sparkles, color: "text-purple-600" }, // AI
    { Icon: Mail, color: "text-red-500" }, // Gmail-ish
    { Icon: MessageSquare, color: "text-green-500" }, // WhatsApp-ish
    { Icon: FileText, color: "text-blue-500" }, // Docs-ish
    { Icon: Globe, color: "text-cyan-500" }, // Web
    { Icon: Cloud, color: "text-sky-600" }, // OneDrive-ish
    { Icon: Server, color: "text-indigo-600" } // AWS-ish
  ];

  const row2Icons = [
    { Icon: Code, color: "text-gray-800" }, // GitHub-ish
    { Icon: Cpu, color: "text-blue-700" }, // Intel-ish
    { Icon: HardDrive, color: "text-yellow-600" }, // Drive-ish
    { Icon: Share2, color: "text-pink-600" }, // Social
    { Icon: Shield, color: "text-emerald-600" }, // Security
    { Icon: Smartphone, color: "text-slate-700" }, // Mobile
    { Icon: Wifi, color: "text-blue-400" }, // Connectivity
    { Icon: Bluetooth, color: "text-blue-800" }, // Bluetooth
    { Icon: Radio, color: "text-red-600" }, // Broadcast
    { Icon: Tv, color: "text-purple-800" } // Media
  ];

  return (
    <div className="min-h-screen bg-[#0F0F13] font-sans text-white selection:bg-[#FF6D5A] selection:text-white">
      {/* Navigation Bar */}
      <nav className="border-b border-white/5 bg-[#0F0F13]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded bg-[#FF6D5A] flex items-center justify-center">
                <span className="font-bold text-white text-lg">n</span>
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">n8n</span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
              <a href="#" className="hover:text-[#FF6D5A] transition-colors">Product</a>
              <a href="#" className="hover:text-[#FF6D5A] transition-colors">Solutions</a>
              <a href="#" className="hover:text-[#FF6D5A] transition-colors">Docs</a>
              <a href="#" className="hover:text-[#FF6D5A] transition-colors">Community</a>
              <a href="#" className="hover:text-[#FF6D5A] transition-colors">Enterprise</a>
              <a href="#" className="hover:text-[#FF6D5A] transition-colors">Pricing</a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="text-sm font-medium text-white hover:text-[#FF6D5A] transition-colors hidden md:block">Sign in</a>
            <ConnectButton
              className="!bg-[#FF6D5A] !text-white !border-0 !font-bold !px-5 !py-2 !rounded-full hover:!bg-[#FF8F7A] !transition-colors"
              label="Get started"
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pb-20">
        {currentAccount ? (
          <WorkflowMarketplace />
        ) : (
          <div className="container mx-auto px-4 pt-20 pb-32">
            {/* Hero Section */}
            <div className="text-center space-y-10 max-w-6xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-[#FF6D5A] mb-4">
                <Sparkles className="w-4 h-4" />
                <span>Flexible AI workflow automation for technical teams</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1]">
                Plug AI into your own data & <br />
                <span className="text-[#FF6D5A]">over 500 integrations</span>
              </h1>

              {/* Double Marquee of Icons */}
              <div className="relative w-full overflow-hidden space-y-6 mask-linear-fade py-10">
                {/* Row 1 - Left to Right */}
                <div className="flex gap-6 animate-marquee whitespace-nowrap">
                  {[...row1Icons, ...row1Icons, ...row1Icons, ...row1Icons].map((item, i) => (
                    <AppIcon key={i} Icon={item.Icon} color={item.color} />
                  ))}
                </div>

                {/* Row 2 - Right to Left (Reverse) */}
                <div className="flex gap-6 animate-marquee-reverse whitespace-nowrap">
                  {[...row2Icons, ...row2Icons, ...row2Icons, ...row2Icons].map((item, i) => (
                    <AppIcon key={i} Icon={item.Icon} color={item.color} />
                  ))}
                </div>
              </div>

              <div className="pt-6 flex justify-center">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-[#FF6D5A] rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative">
                    <ConnectButton
                      className="!px-10 !py-4 !rounded-lg !bg-[#FF6D5A] !text-white !text-lg !font-bold !hover:bg-[#FF8F7A] !transition-colors !shadow-xl"
                      label="Browse all integrations"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-16 max-w-3xl mx-auto">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-16">
                  The fast way to actually <br />
                  <span className="text-[#FF6D5A]">get AI working in your business</span>
                </h3>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                      <Bot className="w-6 h-6 text-blue-400" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Build multi-step agents</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">Create agentic systems on a single screen. Integrate any LLM into your workflows.</p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                      <Server className="w-6 h-6 text-purple-400" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Self-host everything</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">Protect your data by deploying on-prem. Access the entire source code.</p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                      <MessageSquare className="w-6 h-6 text-green-400" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Chat with your data</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">Use Slack, Teams, or SMS to get accurate answers from your data.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
