import axios from "axios";
export const fetchChatResponse = async (message) => {
  const API_URL = "https://deepseek-v3.p.rapidapi.com/chat";
  const API_KEY = "d13f18f98emshca5e9f3475cf468p119f1cjsn16c88f005752";
  const data = {
    messages: [
      {
        role: 'user',
        content: message,
      },
    ],
  };

  const headers = {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': 'deepseek-v3.p.rapidapi.com',
    'Content-Type': 'application/json',
  };
  try {
    const response = await axios.post(API_URL, data, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching chat response:', error);
    throw error;
  }
}