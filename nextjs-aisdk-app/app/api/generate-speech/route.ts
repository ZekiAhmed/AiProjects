import { elevenlabs } from '@ai-sdk/elevenlabs';
import { experimental_generateSpeech as generateSpeech } from "ai";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const { audio } = await generateSpeech({
      model: elevenlabs.speech('eleven_multilingual_v2'),
      text: text,
      providerOptions: { elevenlabs: {} },
    });

    // return new Response(audio.uint8Array, {
    //   headers: {
    //     "Content-Type": audio.mediaType || "audio/mpeg",
    //   },
    // });

    // 🔒 Force a real ArrayBuffer (no SharedArrayBuffer)
    const safeUint8 = new Uint8Array(audio.uint8Array.byteLength);
    safeUint8.set(audio.uint8Array);

    return new Response(safeUint8.buffer, {
      headers: {
        "Content-Type": audio.mediaType || "audio/mpeg",
      },
    });

    // clean streaming version
    // const stream = new ReadableStream<Uint8Array>({
    //   start(controller) {
    //     controller.enqueue(audio.uint8Array);
    //     controller.close();
    //   },
    // });

    // return new Response(stream, {
    //   headers: {
    //     "Content-Type": audio.mediaType || "audio/mpeg",
    //   },
    // });

  } catch (error) {
    console.error("Error generating image:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
