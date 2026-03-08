import { useEffect } from 'react';
import '@mcp-b/global';
import { tools } from '../lib/webmcp/tools';

export default function WebMCPProvider() {
  useEffect(() => {
    if (!('modelContext' in navigator)) return;
    const mc = navigator.modelContext as {
      provideContext: (ctx: { tools: unknown[] }) => void;
      clearContext: () => void;
    };
    mc.provideContext({
      tools: tools.map(({ name, description, inputSchema, handler }) => ({
        name,
        description,
        inputSchema,
        execute: async (input: Record<string, unknown>) => {
          const result = await handler(input);
          return { content: [{ type: 'text', text: JSON.stringify(result) }] };
        },
      })),
    });
    return () => mc.clearContext();
  }, []);

  return null;
}
