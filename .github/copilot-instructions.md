<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Python List Learning Platform

This is a Next.js learning platform for Python programming with split-screen layout using shadcn/ui components.

## Key Technologies
- Next.js 14 with TypeScript and App Router
- Tailwind CSS for styling
- shadcn/ui for UI components (Card, Button, Badge, Separator, Sonner)
- Monaco Editor for Python code editing with syntax highlighting
- Framer Motion for animations
- Lucide React for icons

## Architecture
- `/src/components/CodeEditor.tsx` - Monaco editor wrapped in shadcn/ui Card
- `/src/components/ListVisualizer.tsx` - Animated Python list visualization using Framer Motion
- `/src/components/LearningPlatform.tsx` - Main container with split-screen layout
- `/src/lib/pythonParser.ts` - Python list operations parser and executor
- `/src/types/index.ts` - TypeScript interfaces for the application

## Features
- Real-time Python code editing with syntax highlighting
- Step-by-step animated visualization of list operations
- Support for: append(), remove(), pop(), insert()
- Toast notifications for operation feedback
- Responsive split-screen layout using shadcn/ui components

## Styling Guidelines
- Use shadcn/ui components consistently throughout the application
- Follow the established design system with Card components for panels
- Use Badge components for list indices and status indicators
- Implement smooth animations with Framer Motion
- Maintain responsive design patterns
