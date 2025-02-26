
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import OpenAI from "https://esm.sh/openai@4.28.0";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Initializing OpenAI client...');
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY')!,
      defaultHeaders: {
        'OpenAI-Beta': 'assistants=v2'
      }
    });

    const { userInput, threadId } = await req.json();
    console.log('Received request:', { userInput, threadId });

    // Create a new thread if none exists
    let thread;
    try {
      if (!threadId) {
        thread = await openai.beta.threads.create();
        console.log('Created new thread:', thread.id);
      } else {
        thread = { id: threadId };
        console.log('Using existing thread:', thread.id);
      }
    } catch (error) {
      console.error('Error with thread creation/retrieval:', error);
      throw error;
    }

    // Get the assistant configuration from the database
    const { data: assistantConfig, error: configError } = await supabase
      .from('assistant_config')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (configError) {
      console.error('Error fetching assistant config:', configError);
      throw new Error(`Error fetching assistant config: ${configError.message}`);
    }

    let assistantId;
    try {
      if (!assistantConfig) {
        // Create a new assistant if none exists
        console.log('Creating new assistant...');
        const assistant = await openai.beta.assistants.create({
          name: "Workflow Guide",
          instructions: `You are a helpful assistant that uses Socratic questioning to understand the user's needs and then suggests relevant workflows from a database. Ask 3-4 clarifying questions to better understand the user's needs before making any suggestions. Once you have a clear understanding, provide 2-3 relevant workflow suggestions. Analyze workflow descriptions and titles to provide relevant suggestions. Always maintain a friendly and helpful tone.`,
          model: "gpt-4-turbo-preview",
        });

        // Save the assistant configuration
        const { error: insertError } = await supabase
          .from('assistant_config')
          .insert({
            assistant_id: assistant.id,
            name: assistant.name,
            instructions: assistant.instructions,
          });

        if (insertError) {
          console.error('Error saving assistant config:', insertError);
          throw new Error(`Error saving assistant config: ${insertError.message}`);
        }

        assistantId = assistant.id;
      } else {
        assistantId = assistantConfig.assistant_id;
      }
    } catch (error) {
      console.error('Error with assistant creation/retrieval:', error);
      throw error;
    }

    // Add the user's message to the thread
    try {
      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: userInput,
      });
    } catch (error) {
      console.error('Error adding message to thread:', error);
      throw error;
    }

    // Run the assistant
    let run;
    try {
      run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistantId,
      });
    } catch (error) {
      console.error('Error creating run:', error);
      throw error;
    }

    // Wait for the run to complete
    let runStatus;
    try {
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      while (runStatus.status === "queued" || runStatus.status === "in_progress") {
        console.log('Waiting for assistant response...', runStatus.status);
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      }

      if (runStatus.status === "failed") {
        console.error('Assistant run failed:', runStatus.last_error);
        throw new Error(`Assistant run failed: ${runStatus.last_error?.message || "Unknown error"}`);
      }

      if (runStatus.status === "requires_action") {
        console.error('Assistant requires action:', runStatus);
        throw new Error('Assistant requires action - not implemented');
      }

      if (runStatus.status !== "completed") {
        console.error('Unexpected run status:', runStatus);
        throw new Error(`Unexpected run status: ${runStatus.status}`);
      }

      console.log('Run completed with status:', runStatus.status);
    } catch (error) {
      console.error('Error during run execution:', error);
      throw error;
    }

    // Get the assistant's response
    let lastMessage;
    try {
      const messages = await openai.beta.threads.messages.list(thread.id);
      lastMessage = messages.data[0];
    } catch (error) {
      console.error('Error retrieving messages:', error);
      throw error;
    }

    // Save the interaction in the database
    try {
      const { error: chatError } = await supabase
        .from('chat_sessions')
        .insert({
          user_input: userInput,
          assistant_response: lastMessage.content[0].text.value,
          assistant_id: assistantId,
          thread_id: thread.id,
        });

      if (chatError) {
        console.error('Error saving chat session:', chatError);
        // Don't throw here, as we still want to return the response to the user
      }
    } catch (error) {
      console.error('Error saving chat session:', error);
      // Don't throw here, as we still want to return the response to the user
    }

    return new Response(JSON.stringify({
      response: lastMessage.content[0].text.value,
      threadId: thread.id,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
