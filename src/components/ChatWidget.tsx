
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
    <div className="fixed inset-0 bg-white">
      <div className="flex flex-col h-full max-w-4xl mx-auto">
        <div className="p-4 border-b bg-black text-white">
          <h3 className="font-semibold text-xl">AI Workflow Assistant</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
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
                        ? 'bg-black text-white ml-4'
                        : 'bg-gray-100 text-black mr-4'
                    }`}
                  >
                    {message.isUser ? (
                      message.text
                    ) : (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="prose prose-sm max-w-none">{children}</p>
                        }}
                      >
                        {message.text}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
                {!message.isUser && extractUrls(message.text).length > 0 && (
                  <div className="pl-4 grid gap-2">
                    {extractUrls(message.text).map((url, urlIndex) => {
                      console.log('Rendering URL card:', url);
                      return (
                        <Card 
                          key={urlIndex}
                          className="p-4 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 hover:border-black"
                          onClick={() => window.open(url, '_blank')}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-800 truncate flex-1">
                              {url}
                            </span>
                            <ExternalLink className="h-4 w-4 ml-2 text-gray-500" />
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-black p-3 rounded-lg mr-4 flex items-center gap-2">
                <Loader className="h-4 w-4 animate-spin" />
                Thinking...
              </div>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
