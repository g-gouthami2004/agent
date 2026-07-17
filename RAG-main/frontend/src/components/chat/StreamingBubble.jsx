import { renderMarkdown } from '../../utils/utils';
import DOMPurify from 'dompurify';
import { useSessionStore } from '../../stores/sessionStore';
import { ThoughtPanel } from './ThoughtPanel';

export function StreamingBubble({ text, status }) {
  const streamingStatusLog = useSessionStore((s) => s.streamingStatusLog);

  const thoughtPanel = (
    <ThoughtPanel
      steps={streamingStatusLog}
      isStreaming={!text}
      defaultExpanded
    />
  );

  if (text) {
    const preview = DOMPurify.sanitize(
      renderMarkdown(text.replace(/\[\[cite:[^\]]+\]\]/g, '')),
      {
        ALLOWED_TAGS: ['strong', 'em', 'code', 'pre', 'br', 'table', 'tbody', 'tr', 'td', 'th', 'sup'],
        ALLOWED_ATTR: ['class', 'data-index'],
      }
    );

    return (
      <>
        {thoughtPanel}
        <div
          className="chat-bubble ai-align"
          dangerouslySetInnerHTML={{ __html: preview }}
        />
      </>
    );
  }

  return (
    <>
      {thoughtPanel}
      <div className="chat-bubble ai-align">
        <span className="status-indicator">
          {status}
          {status && (
            <span className="status-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          )}
        </span>
      </div>
    </>
  );
}