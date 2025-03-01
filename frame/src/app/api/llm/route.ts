import { NextRequest, NextResponse } from 'next/server'

import Replicate from 'replicate'

const replicate = new Replicate({
  // get your token from https://replicate.com/account/api-tokens
  // auth: "my api token", // defaults to process.env.REPLICATE_API_TOKEN
})

const model =
  'meta/meta-llama-3-8b-instruct'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const seed = searchParams.get('seed')
  const loneliness = searchParams.get('score')

  const prompt = `We have a form where user reports loneliness score from 1 to 100, user has reported score of ${loneliness}. 
Your task is to now create a JSON based on their loneliness score, be creative 
JSON must contain: name - name of the personality, description - describe the personality and prompt - this will be used as initial personality for AI agent ("you are an assistant with a personality" and do not metion the score) also do not forget to add JSON closing bracket in the end.`

  const input = {
    prompt,
    system_prompt: "You are a assistant that respond only with valid JSON. Do not write an introduction or summary.",
    max_tokens: 512,
    temperature: 0, // seed won't work with temperature,
    seed: seed ? parseInt(seed) : undefined,
    prompt_template: "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>",
    stop_sequences: "<|end_of_text|>,<|eot_id|>",
    log_performance_metrics: false,
    presence_penalty: 0,
    // guidance_scale: 7,
    // num_inference_steps: 50,
  }
  
  // const prediction = await replicate.predictions.create({
  //   version: model.split(':')[1],
  //   input,
  // })
  
  // const model = "google/imagen-3-fast"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const output = await replicate.run(model, { input }) as any
  const parsed = output.join(',').replace('\n', '') // skip the first line
  console.log(output.join(',').replace('\n', ''))
  // const output = await replicate.run(model, { input })

  return NextResponse.json(parsed)
  // return new NextResponse(output, { headers: { 'Content-Type': 'application/json' } })
}
