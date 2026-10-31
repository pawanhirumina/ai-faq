# 🤖 AI FAQ Component (`@pawanhirumina/ai-faq`)

An interactive FAQ accordion component featuring an integrated AI query box with smooth layout animations (Powered by Framer Motion, Tailwind CSS, and Lucide Icons). Inspired by React Bits.

[demo.webm](https://github.com/user-attachments/assets/d2c5ba97-ba6d-499e-aaab-82eb831616a6)

---

## ✨ Features

- **Accordion FAQs**: Smooth expand/collapse animation for standard questions.
- **AI Prompt Box**: Built-in input box to query custom AI questions directly inside the FAQ list.
- **API Integration**: Automatically calls `/api/ask` (or a custom endpoint via props) with `useEffect` and handles cleanup via `AbortController`.
- **Fully Customizable Props**: Pass your own list of FAQs via the `faqs` prop, custom endpoints, and placeholders.
- **Multiple Flavors Available**: Choose between TypeScript/JavaScript with Tailwind CSS or plain CSS.

---

## 📦 Installation & Usage

### 1. Install Package
```bash
npm install @pawanhirumina/ai-faq
```

### 2. Requirements (Peer Dependencies)
Ensure you have the required peer dependencies installed in your project:
```bash
npm install framer-motion lucide-react
```

## 📋 Passing Custom Data via Props

You can easily pass your own array of custom FAQ questions and answers using the `faqs` prop. Each item in the array must follow the `FaqItem` structure (`id`, `q`, and `a`).

### Custom FAQs Example

```tsx
import React from "react";
import { FaqAI, FaqItem } from "@pawanhirumina/ai-faq";

const myCustomFaqs: FaqItem[] = [
  { 
    id: "1", 
    q: "What is your return policy?", 
    a: "You can return any item within 30 days of purchase with receipt." 
  },
  { 
    id: "2", 
    q: "How do I track my order?", 
    a: "Once shipped, you will receive an email with tracking details." 
  },
];

export default function App() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <FaqAI 
        faqs={myCustomFaqs} 
        aiEndpoint="/api/ask" 
        aiPlaceholder="Ask anything about our store..." 
      />
    </div>
  );
}
```

---

## ⚡ CLI Usage (Direct Component Installation)

If you prefer to copy the source files directly into your project codebase instead of importing via NPM package:

```bash
npx @pawanhirumina/ai-faq [flavor]
```

### Available Flavors:
- `ts-tw` (Default) - TypeScript with Tailwind CSS (`src/components/FaqAI.tsx`)
- `js-tw` - JavaScript with Tailwind CSS (`src/components/FaqAI.jsx`)
- `ts-css` - TypeScript with Plain CSS (`src/components/FaqAI.tsx` & `FaqAI.css`)
- `js-css` - JavaScript with Plain CSS (`src/components/FaqAI.jsx` & `FaqAI.css`)

---

## 🔌 AI Endpoint Backend Contract

When a user submits a query in the AI input box, the component automatically sends a `POST` request to your `aiEndpoint` (default: `/api/ask`).

### Request Format
Your backend endpoint will receive a JSON payload:
```json
{
  "query": "What is the warranty period for this product?"
}
```

### Response Format
- **Success Response (Status `200 OK`)**:
  ```json
  {
    "answer": "All products come with a standard 1-year limited warranty."
  }
  ```

- **Error Response (Status `4xx` / `5xx`)**:
  ```json
  {
    "error": "Failed to process AI query."
  }
  ```

### Example Backend Handler (Node.js / Express)
```js
app.post('/api/ask', async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }
  
  // Call your AI model / service here
  const answer = `Here is the answer to: "${query}"`;
  
  res.json({ answer });
});
```

---

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `faqs` | `Array<{ id: string \| number, q: string, a: string }>` | Default sample questions | Array of FAQ items to render. |
| `aiEndpoint` | `string` | `import.meta.env.VITE_AI_API_URL \|\| "/api/ask"` | Custom backend API endpoint for AI queries. |
| `aiPlaceholder` | `string` | `"Ask AI"` | Placeholder text for the AI input box. |
| `loadingVariant` | `"text-shimmer" \| "skeleton"` | `"text-shimmer"` | Loading indicator animation style. |
| `loadingText` | `string` | `"Thinking..."` | Text displayed during loading when using `"text-shimmer"`. |

---

## 📜 License

MIT © [Pawan Hirumina](https://github.com/pawanhirumina)
