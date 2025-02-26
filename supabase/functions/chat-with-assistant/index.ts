
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@4.11.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { userInput, threadId } = await req.json()
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch all workflows from the database
    const { data: workflows, error: workflowError } = await supabaseClient
      .from('workflow')
      .select('workflow_name, workflow_description')

    if (workflowError) {
      console.error('Error fetching workflows:', workflowError)
      throw workflowError
    }

    // Create workflow catalog string
    const workflowCatalog = workflows
      ?.map(w => `Workflow Name: ${w.workflow_name}\nDescription: ${w.workflow_description}\n---`)
      .join('\n')

    // Construct system prompt with workflow catalog
    const systemPrompt = `You are a helpful AI assistant that helps users find the right workflow for their needs. 
Here is our complete catalog of available workflows:

${workflowCatalog}

Use Socratic questioning to understand the user's needs and suggest relevant workflows from the catalog above. 
When suggesting a workflow, reference it by exact name and explain why it would be helpful for their specific needs.
If you're not sure about the user's needs, ask clarifying questions.
Keep your responses friendly and conversational.`

    // Fetch previous messages if threadId exists
    let previousMessages = []
    if (threadId) {
      const { data: chatHistory, error: historyError } = await supabaseClient
        .from('chat_sessions')
        .select('user_input, assistant_response')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true })

      if (historyError) {
        console.error('Error fetching chat history:', historyError)
        throw historyError
      }

      previousMessages = chatHistory?.flatMap(msg => [
        { role: 'user', content: msg.user_input },
        { role: 'assistant', content: msg.assistant_response }
      ]) ?? []
    }

    // Initialize OpenAI
    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })
    const openai = new OpenAIApi(configuration)

    // Create chat completion
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        ...previousMessages,
        { role: "user", content: userInput }
      ],
    })

    const assistantResponse = completion.data.choices[0]?.message?.content || "I'm sorry, I couldn't process that request."

    // Generate new threadId if it doesn't exist
    const newThreadId = threadId || crypto.randomUUID()

    // Store the conversation in the database
    const { error: insertError } = await supabaseClient
      .from('chat_sessions')
      .insert({
        thread_id: newThreadId,
        user_input: userInput,
        assistant_response: assistantResponse
      })

    if (insertError) {
      console.error('Error inserting chat session:', insertError)
      throw insertError
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
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
})
