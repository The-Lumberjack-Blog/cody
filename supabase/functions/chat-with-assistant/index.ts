
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import OpenAI from "https://esm.sh/openai@4";

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

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

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

      previousMessages = chatHistory?.flatMap(msg => [
        { role: 'user', content: msg.user_input },
        { role: 'assistant', content: msg.assistant_response }
      ]) ?? [];
    }

    // Create chat completion
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...previousMessages,
        { role: "user", content: userInput }
      ],
    });

    const assistantResponse = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that request.";

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
