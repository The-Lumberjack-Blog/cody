
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader, ExternalLink } from "lucide-react";
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
    console.log('Extracted URLs:', urls);
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

      console.log('Assistant response:', data.response);
      
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
      <div className="flex flex-col h-full max-w-4xl mx-auto">
        <div className="p-4 border-b border-gray-700 bg-messagebg">
          <h3 className="font-semibold text-xl text-white">AI Workflow Assistant</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              Ask me about your workflow needs and I'll help you find the right solution!
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className="space-y-4">
                <div
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isUser
                        ? 'bg-messagebg border border-gray-700 text-white'
                        : 'bg-messagebg border border-gray-700 text-white'
                    }`}
                  >
                    {message.isUser ? (
                      message.text
                    ) : (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="prose prose-sm max-w-none text-gray-100">{children}</p>
                        }}
                      >
                        {message.text}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
                {!message.isUser && extractUrls(message.text).length > 0 && (
                  <div className="pl-4 grid gap-2">
                    {extractUrls(message.text).map((url, urlIndex) => (
                      <Card 
                        key={urlIndex}
                        className="p-4 hover:shadow-lg transition-shadow cursor-pointer bg-messagebg border-gray-700 hover:border-gray-500"
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
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-messagebg border border-gray-700 text-white p-3 rounded-lg mr-4 flex items-center gap-2">
                <Loader className="h-4 w-4 animate-spin" />
                Thinking...
              </div>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 bg-messagebg flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 bg-chatbg border-gray-700 text-white placeholder:text-gray-400"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            size="icon"
            className="bg-gray-700 hover:bg-gray-600 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
