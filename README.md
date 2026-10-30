# 🤖 AI FAQ Component (`@pawanhirumina/ai-faq`)

An interactive FAQ accordion component featuring an integrated AI query box with smooth layout animations (Powered by Framer Motion, Tailwind CSS, and Lucide Icons). Inspired by React Bits.

---

## ✨ Features

- **Accordion FAQs**: Smooth expand/collapse animation for standard questions.
- **AI Prompt Box**: Built-in input box to query custom AI questions directly inside the FAQ list.
- **API Integration**: Automatically calls `/api/ask` (or a custom endpoint via props) with `useEffect` and handles cleanup via `AbortController`.
- **Fully Customizable Props**: Pass your own list of FAQs and custom endpoints.
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

### 3. Example Usage (NPM Package / React Component)

```tsx
import React from "react";
import { FaqAI } from "@pawanhirumina/ai-faq";

const customFaqs = [
  { id: 1, q: "What is your return policy?", a: "You can return any item within 30 days." },
  { id: 2, q: "Do you offer international shipping?", a: "Yes, we ship worldwide!" },
];

export default function App() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <FaqAI 
        faqs={customFaqs} 
        aiEndpoint="/api/custom-ai-endpoint" 
        aiPlaceholder="Ask our AI assistant..." 
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

## ⚙️ Component Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `faqs` | `Array<{ id: string \| number, q: string, a: string }>` | Default sample questions | Array of FAQ items to render. |
| `aiEndpoint` | `string` | `import.meta.env.VITE_AI_API_URL \|\| "/api/ask"` | Custom backend API endpoint for AI queries. |
| `aiPlaceholder` | `string` | `"Ask AI"` | Placeholder text for the AI input box. |

---

## 📜 License

MIT © [Pawan Hirumina](https://github.com/pawanhirumina)
