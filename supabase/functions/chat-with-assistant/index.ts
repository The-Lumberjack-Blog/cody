
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userInput, threadId, consultingMode } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch chat history if threadId exists
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

    // In consulting mode, we only include workflow data after a certain number of exchanges
    const shouldIncludeWorkflows = !consultingMode || 
      (consultingMode && previousMessages.length >= 4); // 2 user messages + 2 assistant responses

    let systemPrompt = `You are an AI assistant designed to help users find the right workflow for their needs.`;

    if (shouldIncludeWorkflows) {
      // Fetch workflows only when needed
      const { data: workflows, error: workflowError } = await supabaseClient
        .from('workflow')
        .select('workflow_name, workflow_description, workflow_url');

      if (workflowError) {
        console.error('Error fetching workflows:', workflowError);
        throw workflowError;
      }

      const workflowCatalog = workflows
        ?.map(w => `Workflow Name: ${w.workflow_name}\nDescription: ${w.workflow_description}\nURL: ${w.workflow_url}\n---`)
        .join('\n');

      systemPrompt += `\n\nYour role is to:
1. Suggest 2-3 most relevant workflows from our catalog
2. Explain why each suggested workflow would be beneficial for their needs
3. ALWAYS include the direct URL that belongs to the workflow
4. NEVER ask anything. assume the user's request is complete and search based on that

Here is our complete catalog of available workflows:

${workflowCatalog}`;
    }

    if (consultingMode) {
      if (!shouldIncludeWorkflows) {
        systemPrompt += `\n\nThe user needs help figuring out what they need. Ask follow-up questions to better understand their requirements. DO NOT suggest any workflows yet - focus on understanding their needs first. Ask questions about their specific use case, goals, and challenges.`;
      } else {
        systemPrompt += `\n\nNow that you understand the user's needs better, provide workflow suggestions based on the previous conversation.`;
      }
    }

    systemPrompt += `\nKeep your responses friendly and conversational.`;

    // Make request to Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
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
