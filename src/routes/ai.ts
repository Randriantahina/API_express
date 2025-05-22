import express, { Request, Response } from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/chat', async (req: Request, res: Response) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/gpt2', // ou un autre modèle
      {
        inputs: prompt,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
      }
    );

    const generatedText = response.data[0]?.generated_text;
    res.json({ response: generatedText || 'No response' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Something went wrong with the Hugging Face API' });
  }
});

export default router;
