
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TextToSpeechOptions {
  text: string;
  voiceId?: string;
}

export const DEFAULT_VOICE_ID = "EXAVITQu4vr4xnSDxMaL"; // Sarah voice

let audioContext: AudioContext | null = null;
let audioSource: AudioBufferSourceNode | null = null;

// Function to stop any currently playing audio
export const stopSpeech = () => {
  if (audioSource) {
    audioSource.stop();
    audioSource = null;
  }
};

export const speakText = async ({ text, voiceId = DEFAULT_VOICE_ID }: TextToSpeechOptions): Promise<void> => {
  try {
    // Stop any currently playing audio
    stopSpeech();
    
    // Get the API key from Supabase
    const { data: supabaseData, error: keyError } = await supabase.functions.invoke("get-api-key", {
      body: { key: "ELEVEN_LABS_API_KEY" }
    });
    
    if (keyError || !supabaseData?.apiKey) {
      toast({
        title: "API Key Error",
        description: "Failed to retrieve ElevenLabs API key. Please check your configuration.",
        variant: "destructive",
      });
      return;
    }
    
    const apiKey = supabaseData.apiKey;
    
    // Make API request to ElevenLabs
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `ElevenLabs API error: ${errorData.detail?.message || response.statusText}`
      );
    }
    
    // Get audio data as ArrayBuffer
    const audioArrayBuffer = await response.arrayBuffer();
    
    // Create AudioContext if it doesn't exist
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Decode the audio data
    const audioBuffer = await audioContext.decodeAudioData(audioArrayBuffer);
    
    // Create and play the audio source
    audioSource = audioContext.createBufferSource();
    audioSource.buffer = audioBuffer;
    audioSource.connect(audioContext.destination);
    audioSource.start(0);
    
    // Clean up after playback ends
    audioSource.onended = () => {
      audioSource = null;
    };
    
  } catch (error) {
    console.error("Text-to-speech error:", error);
    toast({
      title: "Speech Generation Failed",
      description: error.message || "An error occurred while generating speech",
      variant: "destructive",
    });
  }
};
