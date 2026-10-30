# FAQ AI Component

An interactive FAQ accordion component featuring an integrated AI query box with smooth layout animations (Powered by Framer Motion, Tailwind CSS, and Lucide Icons). Inspired by React Bits.

---

## Features
- Accordion FAQs: Smooth expand/collapse animation for standard questions.
- AI Prompt Box: Built-in input box to query custom AI questions directly inside the FAQ list.
- API Integration: Automatically calls `/api/ask` (or a custom endpoint via props) with `useEffect` and handles cleanup via `AbortController`.
- Fully Customizable Props: Pass your own list of FAQs and endpoints.
- Flavors available: Choose between TypeScript/JavaScript with Tailwind CSS or plain CSS.

---

## Component Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `faqs` | `Array<{ id: string \| number, q: string, a: string }>` | Default sample questions | Array of FAQ items to render. |
| `aiEndpoint` | `string` | `import.meta.env.VITE_AI_API_URL \|\| "/api/ask"` | Custom backend API endpoint for AI queries. |
| `aiPlaceholder` | `string` | `"Ask AI"` | Placeholder text for the AI input box. |

---

## Installation & Usage

### 1. Requirements
Ensure you have the required peer dependencies installed in your project:
```bash
npm install framer-motion lucide-react
```

### 2. Example Usage (With Custom Props)

```tsx
import { FaqAI } from "ai-faq";

const customFaqs = [
  { id: 1, q: "What is your return policy?", a: "You can return any item within 30 days." },
  { id: 2, q: "Do you offer international shipping?", a: "Yes, we ship worldwide!" },
];

export default function App() {
  return (
    <FaqAI 
      faqs={customFaqs} 
      aiEndpoint="/api/custom-ai-endpoint" 
      aiPlaceholder="Ask our AI assistant..." 
    />
  );
}
```
