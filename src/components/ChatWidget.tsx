
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader, ExternalLink, Mic, Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import { Card } from "@/components/ui/card";

interface ChatMessage {
  text: string;
  isUser: boolean;
}

export function ChatWidget() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const extractUrls = (text: string) => {
    const urlRegex = /https:\/\/n8n\.io\/[^\s\n)]+/g;
    const urls = text.match(urlRegex) || [];
    return urls;
  };

  const getWorkflowName = (text: string, url: string) => {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const matches = [...text.matchAll(boldRegex)];
    
    const urlIndex = text.indexOf(url);
    for (let i = matches.length - 1; i >= 0; i--) {
      const match = matches[i];
      if (match.index && match.index < urlIndex) {
        return match[1];
      }
    }
    
    const cleanUrl = url.replace(/[.,]$/, '');
    const parts = cleanUrl.split('/');
    const lastPart = parts[parts.length - 1];
    return lastPart
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-with-assistant', {
        body: { userInput: userMessage, threadId }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (!data || !data.response) {
        throw new Error('Invalid response from assistant');
      }

      setThreadId(data.threadId);
      setMessages(prev => [...prev, { text: data.response, isUser: false }]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to get response from assistant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-chatbg text-gray-100">
      <div className="flex flex-col h-full max-w-3xl mx-auto">
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center px-4">
              <h1 className="text-4xl font-semibold mb-8 text-gray-200">
                What can I help with?
              </h1>
              <div className="w-full max-w-2xl">
                <div className="flex items-center gap-2 p-4 bg-inputbg rounded-lg mb-6">
                  <Plus className="h-5 w-5 text-gray-400" />
                  <Search className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-400">Ask anything</span>
                  <Mic className="h-5 w-5 text-gray-400 ml-auto" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="text-left p-4 bg-inputbg hover:bg-messagebg rounded-lg transition-colors">
                    <span className="block text-sm font-medium mb-2">Solve</span>
                    <span className="text-xs text-gray-400">Get step-by-step guidance</span>
                  </button>
                  <button className="text-left p-4 bg-inputbg hover:bg-messagebg rounded-lg transition-colors">
                    <span className="block text-sm font-medium mb-2">Deep research</span>
                    <span className="text-xs text-gray-400">Find detailed insights</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 p-4">
              {messages.map((message, index) => (
                <div key={index} className="space-y-4">
                  <div className={`flex ${message.isUser ? 'bg-chatbg' : 'bg-messagebg'}`}>
                    <div className="max-w-3xl mx-auto w-full px-4 py-6">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-sm bg-[#5436DA] flex items-center justify-center shrink-0">
                          {message.isUser ? "U" : "A"}
                        </div>
                        <div className="flex-1 prose prose-invert max-w-none">
                          {message.isUser ? (
                            <p>{message.text}</p>
                          ) : (
                            <ReactMarkdown>
                              {message.text}
                            </ReactMarkdown>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {!message.isUser && extractUrls(message.text).length > 0 && (
                    <div className="max-w-3xl mx-auto px-4 grid gap-2">
                      {extractUrls(message.text).map((url, urlIndex) => (
                        <Card 
                          key={urlIndex}
                          className="p-4 hover:bg-messagebg transition-colors cursor-pointer bg-inputbg border-gray-700"
                          onClick={() => window.open(url, '_blank')}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-200 truncate flex-1">
                              {getWorkflowName(message.text, url)}
                            </span>
                            <ExternalLink className="h-4 w-4 ml-2 text-gray-400" />
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="bg-messagebg">
                  <div className="max-w-3xl mx-auto px-4 py-6">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-sm bg-[#5436DA] flex items-center justify-center shrink-0">
                        A
                      </div>
                      <div className="flex gap-2 items-center text-gray-300">
                        <Loader className="h-4 w-4 animate-spin" />
                        Thinking...
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-700">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="relative flex items-center">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message AI Workflow Assistant..."
                disabled={isLoading}
                className="w-full bg-inputbg border-0 focus-visible:ring-0 text-white placeholder:text-gray-400 py-6"
              />
              <Button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                size="icon"
                className="absolute right-2 bg-transparent hover:bg-messagebg text-gray-400 hover:text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
          <div className="mt-2 text-center text-xs text-gray-500">
            AI Workflow Assistant can make mistakes. Check important info.
          </div>
        </div>
      </div>
    </div>
  );
}
