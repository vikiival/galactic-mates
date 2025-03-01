import { NextRequest, NextResponse } from 'next/server'

import Replicate from 'replicate'

const replicate = new Replicate({
  // get your token from https://replicate.com/account/api-tokens
  // auth: "my api token", // defaults to process.env.REPLICATE_API_TOKEN
})

const model =
  'black-forest-labs/flux-schnell'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const seed = searchParams.get('seed')

  const input = {
    prompt:
      'medium-shot high-definition photo of smiling anime waifu having fox ears, space costume, awaking nature lighting, space in the background',
    negative_prompt:
      'lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, artist name',
    width: 512,
    height: 512,
    num_outputs: 1,
    seed: seed ? parseInt(seed) : undefined,
    // guidance_scale: 7,
    // num_inference_steps: 50,
  }
  
  // const prediction = await replicate.predictions.create({
  //   version: model.split(':')[1],
  //   input,
  // })
  
  // const model = "google/imagen-3-fast"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [,output] = await replicate.run(model, { input }).then(x => Object.entries(x).at(0)) as any;
  // const output = await replicate.run(model, { input })
  console.log(output)
  
  console.log(output.url())
  const blob = await output.blob();

  return new NextResponse(blob, { headers: { 'Content-Type': 'image/png' } })
}
