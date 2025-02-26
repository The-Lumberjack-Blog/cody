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
  const {
    toast
  } = useToast();
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
    return lastPart.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, {
      text: userMessage,
      isUser: true
    }]);
    setIsLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('chat-with-assistant', {
        body: {
          userInput: userMessage,
          threadId
        }
      });
      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }
      if (!data || !data.response) {
        throw new Error('Invalid response from assistant');
      }
      setThreadId(data.threadId);
      setMessages(prev => [...prev, {
        text: data.response,
        isUser: false
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to get response from assistant. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleQuickSearch = (searchTerm: string) => {
    if (isLoading) return;
    setInput(searchTerm);
    // Using requestAnimationFrame to ensure the input is updated before submitting
    requestAnimationFrame(() => {
      handleSubmit();
    });
  };
  const renderInputField = () => <form onSubmit={handleSubmit} className="relative flex items-center">
      <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Message Cody..." disabled={isLoading} className="w-full bg-inputbg border-0 focus-visible:ring-0 text-white placeholder:text-gray-400 py-6" />
      <Button type="submit" disabled={isLoading || !input.trim()} size="icon" className="absolute right-2 bg-transparent hover:bg-messagebg text-gray-400 hover:text-white">
        <Send className="h-4 w-4" />
      </Button>
    </form>;
  const searchTerms = [{
    text: "Financial Agent",
    icon: "💰",
    color: "#F97316"
  }, {
    text: "Content Writer",
    icon: "📝",
    color: "#0EA5E9"
  }, {
    text: "Viral Reels",
    icon: "📱",
    color: "#D946EF"
  }, {
    text: "Email Agent",
    icon: "📧",
    color: "#33C3F0"
  }];
  return <div className="fixed inset-0 bg-chatbg text-gray-100">
      <div className="flex flex-col h-full max-w-3xl mx-auto">
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? <div className="h-full flex flex-col items-center justify-center px-4">
              <h1 className="text-4xl font-semibold mb-8 text-gray-200">Hey I'm Cody. I'll find you a no-code workflow.</h1>
              <div className="w-full max-w-2xl">
                <div className="mb-6">
                  {renderInputField()}
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {searchTerms.map((term, index) => <Button key={index} onClick={() => handleQuickSearch(term.text)} className="bg-inputbg hover:bg-messagebg text-sm px-4 py-2 rounded-full border border-gray-700" variant="ghost">
                      <span className="mr-2">{term.icon}</span>
                      <span style={{
                  color: term.color
                }}>{term.text}</span>
                    </Button>)}
                </div>
              </div>
            </div> : <div className="space-y-6 p-4">
              {messages.map((message, index) => <div key={index} className="space-y-4">
                  <div className={`flex ${message.isUser ? 'bg-chatbg' : 'bg-messagebg'}`}>
                    <div className="max-w-3xl mx-auto w-full px-4 py-6">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-sm bg-[#5436DA] flex items-center justify-center shrink-0">
                          {message.isUser ? "U" : "A"}
                        </div>
                        <div className="flex-1 prose prose-invert max-w-none">
                          {message.isUser ? <p>{message.text}</p> : <ReactMarkdown>
                              {message.text}
                            </ReactMarkdown>}
                        </div>
                      </div>
                    </div>
                  </div>
                  {!message.isUser && extractUrls(message.text).length > 0 && <div className="max-w-3xl mx-auto px-4 grid gap-2">
                      {extractUrls(message.text).map((url, urlIndex) => <Card key={urlIndex} className="p-4 hover:bg-messagebg transition-colors cursor-pointer bg-inputbg border-gray-700" onClick={() => window.open(url, '_blank')}>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-200 truncate flex-1">
                              {getWorkflowName(message.text, url)}
                            </span>
                            <ExternalLink className="h-4 w-4 ml-2 text-gray-400" />
                          </div>
                        </Card>)}
                    </div>}
                </div>)}
              {isLoading && <div className="bg-messagebg">
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
                </div>}
            </div>}
        </div>
        
        {messages.length > 0 && <div className="p-4 border-t border-gray-700">
            <div className="max-w-3xl mx-auto">
              {renderInputField()}
              <div className="mt-2 text-center text-xs text-gray-500">
                Cody can make mistakes. Check important info.
              </div>
            </div>
          </div>}
      </div>
    </div>;
}