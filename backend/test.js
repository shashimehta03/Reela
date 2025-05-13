import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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",
});

const completion = openai.chat.completions.create({
  model: "gpt-4o-mini",
  store: true,
  messages: [
    {"role": "user", "content": "write a haiku about ai"},
  ],
});

completion.then((result) => console.log(result.choices[0].message));