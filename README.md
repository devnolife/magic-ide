# Python List Learning Platform

A Next.js learning platform for Python programming with interactive split-screen layout using shadcn/ui components. Learn Python list operations through real-time code editing and animated visualizations.

![Python List Learning Platform](https://via.placeholder.com/800x400/4F46E5/ffffff?text=Python+List+Learning+Platform)

## Features

- **Interactive Code Editor**: Monaco Editor with Python syntax highlighting
- **Real-time Visualization**: Animated list operations using Framer Motion
- **Split-screen Layout**: Code editor on the left, visualization on the right
- **Supported Operations**: append(), remove(), pop(), insert()
- **Toast Notifications**: Feedback for each operation
- **Responsive Design**: Built with shadcn/ui components

## Technologies Used

- **Next.js 14** with TypeScript and App Router
- **shadcn/ui** for UI components (Card, Button, Badge, Separator, Sonner)
- **Tailwind CSS** for styling
- **Monaco Editor** for code editing
- **Framer Motion** for animations
- **Lucide React** for icons

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Example Code

Try running this Python code in the editor:

```python
my_list = [1, 2, 3]
my_list.append(4)
my_list.append(5)
my_list.insert(0, 0)
my_list.remove(2)
my_list.pop()
```

## Project Structure

```text
src/
├── app/
│   ├── layout.tsx          # Root layout with Sonner provider
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── CodeEditor.tsx      # Monaco editor wrapped in Card
│   ├── ListVisualizer.tsx  # Animated list visualization
│   └── LearningPlatform.tsx # Main container component
├── lib/
│   ├── utils.ts            # shadcn/ui utilities
│   └── pythonParser.ts     # Python list operations parser
└── types/
    └── index.ts            # TypeScript interfaces
```

## How It Works

1. **Code Parsing**: The Python parser identifies list operations in your code
2. **Step-by-step Execution**: Each operation is applied with animation delays
3. **Visual Feedback**: List elements are rendered as animated cards with indices
4. **Toast Notifications**: Success/error messages for each operation

## Supported Python Operations

- `my_list.append(value)` - Add element to the end
- `my_list.remove(value)` - Remove first occurrence of value
- `my_list.pop()` - Remove last element
- `my_list.pop(index)` - Remove element at index
- `my_list.insert(index, value)` - Insert element at index

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Framer Motion](https://www.framer.com/motion/)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
