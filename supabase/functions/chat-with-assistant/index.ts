
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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Initializing OpenAI client...');
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY')!,
    });

    const { userInput, threadId } = await req.json();
    console.log('Received request:', { userInput, threadId });

    // Fetch previous messages for this thread
    let previousMessages = [];
    if (threadId) {
      const { data: chatHistory, error: historyError } = await supabase
        .from('chat_sessions')
        .select('user_input, assistant_response')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });

      if (historyError) {
        console.error('Error fetching chat history:', historyError);
        throw historyError;
      }

      previousMessages = chatHistory.flatMap(msg => [
        { role: 'user', content: msg.user_input },
        { role: 'assistant', content: msg.assistant_response }
      ]);
    }

    // System message to define assistant behavior
    const systemMessage = {
      role: 'system',
      content: `You are a helpful assistant that uses Socratic questioning to understand the user's needs and then suggests relevant workflows from a database. Ask 3-4 clarifying questions to better understand the user's needs before making any suggestions. Once you have a clear understanding, provide 2-3 relevant workflow suggestions. Analyze workflow descriptions and titles to provide relevant suggestions. Always maintain a friendly and helpful tone.`
    };

    // Combine all messages
    const messages = [
      systemMessage,
      ...previousMessages,
      { role: 'user', content: userInput }
    ];

    // Get completion from OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const assistantResponse = completion.choices[0].message.content;
    console.log('Assistant response:', assistantResponse);

    // Generate a new thread ID if one doesn't exist
    const newThreadId = threadId || crypto.randomUUID();

    // Save the interaction in the database
    try {
      const { error: chatError } = await supabase
        .from('chat_sessions')
        .insert({
          user_input: userInput,
          assistant_response: assistantResponse,
          thread_id: newThreadId,
        });

      if (chatError) {
        console.error('Error saving chat session:', chatError);
        // Don't throw here, as we still want to return the response to the user
      }
    } catch (error) {
      console.error('Error saving chat session:', error);
    }

    return new Response(JSON.stringify({
      response: assistantResponse,
      threadId: newThreadId,
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
