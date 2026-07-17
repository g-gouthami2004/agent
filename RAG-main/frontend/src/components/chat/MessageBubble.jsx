import { renderMarkdown, parseCitations } from '../../utils/utils';
import { ThoughtPanel } from './ThoughtPanel';

export function MessageBubble({ text, classType, citationChunks, thoughtLog, thinkingSeconds }) {
  let html;
  if (classType === 'ai-align') {
    const { cleanText } = parseCitations(text, citationChunks);
    html = renderMarkdown(cleanText);
  } else {
    html = renderMarkdown(text);
  }

  return (
    <>
      {classType === 'ai-align' && thoughtLog && thoughtLog.length > 0 && (
        <ThoughtPanel
          steps={thoughtLog}
          isStreaming={false}
          seconds={thinkingSeconds}
          defaultExpanded={false}
        />
      )}
      <div
        className={`chat-bubble ${classType}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}