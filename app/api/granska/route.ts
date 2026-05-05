import OpenAI from 'openai'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { NextRequest } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

type Message = { role: 'user' | 'assistant'; content: string }

export async function POST(request: NextRequest) {
  const { messages }: { messages: Message[] } = await request.json()

  const systemPrompt = readFileSync(join(process.cwd(), 'system-prompt.md'), 'utf-8')

  console.log('=== /api/granska prompt ===')
  console.log('SYSTEM:', systemPrompt)
  console.log('MESSAGES:', JSON.stringify(messages, null, 2))
  console.log('===========================')

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const openaiStream = await openai.chat.completions.create({
          model: 'gpt-4o',
          max_tokens: 2000,
          stream: true,
          messages: [{ role: 'system', content: systemPrompt }, ...messages],
        })

        for await (const chunk of openaiStream) {
          const text = chunk.choices[0]?.delta?.content ?? ''
          if (text) controller.enqueue(encoder.encode(text))
        }
        controller.close()
      } catch (err) {
        controller.error(err)
      }
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
