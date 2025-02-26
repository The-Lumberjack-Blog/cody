
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userInput, threadId } = await req.json();
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch all workflows from the database
    const { data: workflows, error: workflowError } = await supabaseClient
      .from('workflow')
      .select('workflow_name, workflow_description');

    if (workflowError) {
      console.error('Error fetching workflows:', workflowError);
      throw workflowError;
    }

    // Create workflow catalog string
    const workflowCatalog = workflows
      ?.map(w => `Workflow Name: ${w.workflow_name}\nDescription: ${w.workflow_description}\n---`)
      .join('\n');

    // Construct system prompt with workflow catalog
    const systemPrompt = `You are an AI assistant designed to help users find the right workflow for their needs. Your role is to:

1. Ask 3-4 clarifying questions to understand their specific requirements and use case
2. Based on their responses, suggest 2-3 most relevant workflows from our catalog
3. Explain why each suggested workflow would be beneficial for their needs

Here is our complete catalog of available workflows:

${workflowCatalog}

Keep your responses friendly and conversational. If you're not sure about their needs, ask clarifying questions before making suggestions.
Always reference workflows by their exact names when suggesting them.`;

    // Fetch previous messages if threadId exists
    let previousMessages = [];
    if (threadId) {
      const { data: chatHistory, error: historyError } = await supabaseClient
        .from('chat_sessions')
        .select('user_input, assistant_response')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });

      if (historyError) {
        console.error('Error fetching chat history:', historyError);
        throw historyError;
      }

      previousMessages = chatHistory?.map(msg => ({
        role: 'user',
        parts: [{ text: msg.user_input }]
      })).concat(chatHistory?.map(msg => ({
        role: 'model',
        parts: [{ text: msg.assistant_response }]
      }))) ?? [];
    }

    // Make request to Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': Deno.env.get('GEMINI_API_KEY') ?? '',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: systemPrompt }]
          },
          ...previousMessages,
          {
            role: 'user',
            parts: [{ text: userInput }]
          }
        ],
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
          topP: 0.8,
          topK: 40
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Gemini API error:', error);
      throw new Error('Failed to get response from Gemini');
    }

    const data = await response.json();
    const assistantResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that request.";

    // Generate new threadId if it doesn't exist
    const newThreadId = threadId || crypto.randomUUID();

    // Store the conversation in the database
    const { error: insertError } = await supabaseClient
      .from('chat_sessions')
      .insert({
        thread_id: newThreadId,
        user_input: userInput,
        assistant_response: assistantResponse
      });

    if (insertError) {
      console.error('Error inserting chat session:', insertError);
      throw insertError;
    }

    return new Response(
      JSON.stringify({
        response: assistantResponse,
        threadId: newThreadId
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
