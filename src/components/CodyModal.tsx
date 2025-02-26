
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink } from "lucide-react";

interface CodyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApiKeySubmit: () => void;
}

export function CodyModal({ open, onOpenChange, onApiKeySubmit }: CodyModalProps) {
  const [email, setEmail] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleWaitlistSubmit = async () => {
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const { ip } = await response.json();

      const { error } = await supabase.from("cody").insert({
        email,
        ip_address: ip,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You've been added to our waitlist.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting to waitlist:", error);
      toast({
        title: "Error",
        description: "Failed to join waitlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApiKeySubmit = async () => {
    if (!apiKey) {
      toast({
        title: "Invalid API key",
        description: "Please enter your Gemini API key",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const { ip } = await response.json();

      const { error } = await supabase.from("cody").insert({
        ip_address: ip,
        apikey: true,
        gemini_api_key: apiKey,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your API key has been saved.",
      });
      onApiKeySubmit();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving API key:", error);
      toast({
        title: "Error",
        description: "Failed to save API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-chatbg border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to Cody!</DialogTitle>
          <DialogDescription className="text-gray-300">
            To continue using Cody, you can either:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter your Gemini API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-inputbg border-gray-700 text-white"
              disabled={isSubmitting}
            />
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <ExternalLink className="h-4 w-4" />
              <a
                href="https://ai.google.dev/gemini-api/docs/api-key"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                How can I get an API key?
              </a>
            </div>
            <Button
              onClick={handleApiKeySubmit}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              Use Your Own API Key
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-chatbg px-2 text-gray-400">Or</span>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-gray-300">
              Join our waitlist to get early access:
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-inputbg border-gray-700 text-white"
                disabled={isSubmitting}
              />
              <Button
                onClick={handleWaitlistSubmit}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                Join Waitlist
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
