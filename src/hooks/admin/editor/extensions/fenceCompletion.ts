import { autocompletion, snippetCompletion } from '@codemirror/autocomplete';

const fenceCompletion = snippetCompletion('```\n\n```', {
  label: '```',
  detail: 'Code block',
  type: 'keyword',
});

export const markdownFenceCompletion = autocompletion({
  activateOnTyping: true,
  override: [
    (context) => {
      const before = context.matchBefore(/```$/);
      if (!before) return null;

      return {
        from: before.from,
        options: [fenceCompletion],
      };
    },
  ],
});
