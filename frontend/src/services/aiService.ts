import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function sendChat(messages: { role: string; parts: { text: string }[] }[]) {
  try {
    const response = await axios.post(`${API_URL}/ai/chat`, { history: messages });
    return response.data;
  } catch (error) {
    console.error("AI Chat Error:", error);
    throw error;
  }
}

export async function sendVoice(transcript: string) {
  try {
    const response = await axios.post(`${API_URL}/ai/voice-claim`, { transcript });
    return response.data;
  } catch (error) {
    console.error("AI Voice Error:", error);
    throw error;
  }
}

export async function sendImage(imageUrl: string) {
  try {
    const response = await axios.post(`${API_URL}/ai/image-analysis`, { imageUrl });
    return response.data;
  } catch (error) {
    console.error("AI Image Analysis Error:", error);
    throw error;
  }
}
