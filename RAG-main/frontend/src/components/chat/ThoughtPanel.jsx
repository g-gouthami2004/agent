import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Collapsible "Thought for Ns" panel — renders the reasoning/status trace
 * ABOVE the final answer, the same way Claude's UI shows a dropdown
 * "Thought for Ns" summary that expands into a step-by-step list.
 *
 * - While streaming (isStreaming=true): stays expanded, auto-scrolls as new
 *   steps arrive, always renders (even with 0 steps yet) so there's never a
 *   blank gap while waiting for the first status message.
 * - The moment the first answer token lands (isStreaming flips to false):
 *   auto-collapses into the "Thought for Ns" header.
 * - On finalized historical messages: stays collapsed by default, but the
 *   header remains clickable to re-expand and inspect the trace.
 */
export function ThoughtPanel({ steps, isStreaming, seconds, defaultExpanded }) {
  const [expanded, setExpanded] = useState(!!defaultExpanded);
  const bodyRef = useRef(null);
  const userToggledRef = useRef(false);

  useEffect(() => {
    if (userToggledRef.current) return;
    setExpanded(!!isStreaming);
  }, [isStreaming]);

  useEffect(() => {
    if (expanded && bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [steps, expanded]);

  const hasSteps = steps && steps.length > 0;

  // Nothing to show at all: not currently streaming and no recorded trace.
  if (!isStreaming && !hasSteps) return null;

  const handleToggle = () => {
    userToggledRef.current = true;
    setExpanded((v) => !v);
  };

  const label = isStreaming ? 'Thinking…' : `Thought for ${seconds ?? 1}s`;

  return (
    <div className={`thought-panel ${expanded ? 'is-expanded' : ''}`}>
      <button
        type="button"
        className="thought-header"
        onClick={handleToggle}
        aria-expanded={expanded}
      >
        <ChevronDown size={14} className="thought-chevron" />
        <span className="thought-label">{label}</span>
      </button>
      {expanded && (
        <div className="thought-body" ref={bodyRef}>
          {hasSteps ? (
            <ul className="thought-list">
              {steps.map((step, i) => (
                <li key={`${step}-${i}`} className="thought-item">
                  <span className="thought-bullet" />
                  <span className="thought-text">{step}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="thought-item thought-placeholder">
              <span className="thought-bullet" />
              <span className="thought-text">Getting started…</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}