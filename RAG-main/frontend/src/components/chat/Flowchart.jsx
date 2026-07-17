import { useState, useEffect } from 'react';

const STEPS = [
  {
    title: 'Analyze & Rewrite',
    description: 'Inspects conversation history and sanitizes the input query, rewriting pronoun references (like "it" or "the previous page") to build a standalone search query.',
  },
  {
    title: 'Decompose Question',
    description: 'Breaks complex or compound user questions into multiple independent sub-questions to ensure target context can be retrieved for all facets of the query.',
    
  },
  {
    title: 'Milvus Retrieval',
    description: 'Generates dense vector embeddings for each sub-question and runs high-dimensional semantic search queries against the Milvus database.',
  },
  {
    title: 'Context Merging',
    description: 'Deduplicates retrieved source chunks, resolves same-page overlap, maps document name and page number metadata, and structures context passages.',
  },
  {
    title: 'LLM Synthesis',
    description: 'Combines merged context and original question to synthesize the final factual, citation-linked response.',
  }
];

export function Flowchart({ currentStatus, isCompleted }) {
  const [selectedStep, setSelectedStep] = useState(null);

  // Status mapping
  const getStepStatus = (index) => {
    if (isCompleted || currentStatus === 'streaming' || currentStatus === 'completed') {
      return 'completed';
    }

    const statusMap = {
      'analyzing': 0,
      'decomposing': 1,
      'searching': 2,
      'Reading through your documents': 2,
      'merging': 3,
      'synthesizing': 4,
      'Putting together a response': 4
    };

    const activeIndex = statusMap[currentStatus] !== undefined ? statusMap[currentStatus] : 0;

    if (index < activeIndex) return 'completed';
    if (index === activeIndex) return 'running';
    return 'pending';
  };

  // Automatically select the active step during generation
  useEffect(() => {
    if (isCompleted || currentStatus === 'streaming' || currentStatus === 'completed') {
      setSelectedStep(0); // Default to first step for completed flows
      return;
    }

    const statusMap = {
      'analyzing': 0,
      'decomposing': 1,
      'searching': 2,
      'Reading through your documents': 2,
      'merging': 3,
      'synthesizing': 4,
      'Putting together a response': 4
    };

    const activeIndex = statusMap[currentStatus] !== undefined ? statusMap[currentStatus] : 0;
    setSelectedStep(activeIndex);
  }, [currentStatus, isCompleted]);

  return (
    <div className="flowchart-container">
      <div className="flowchart-steps-row">
        {STEPS.map((step, index) => {
          const status = getStepStatus(index);
          const isSelected = selectedStep === index;

          return (
            <div 
              key={index} 
              className={`flowchart-step-item ${status} ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedStep(index)}
              title="Click to see what this process does"
            >
              {/* Connector Line */}
              {index < STEPS.length - 1 && (
                <div className={`flowchart-connector-line ${getStepStatus(index + 1) === 'completed' || getStepStatus(index + 1) === 'running' ? 'active' : ''}`} />
              )}
              
              {/* Icon Circle */}
              <div className={`flowchart-step-circle ${status}`}>
                {status === 'completed' ? (
                  <span className="step-check-mark">✓</span>
                ) : status === 'running' ? (
                  <span className="step-running-pulse"></span>
                ) : (
                  <span className="step-number">{index + 1}</span>
                )}
              </div>

              {/* Step Title */}
              <span className="flowchart-step-title">{step.title}</span>
            </div>
          );
        })}
      </div>

      {/* Description Panel */}
      {selectedStep !== null && (
        <div className="flowchart-details-panel">
          <div className="flowchart-details-header">
            <span className="flowchart-details-icon">{STEPS[selectedStep].icon}</span>
            <h4 className="flowchart-details-title">{STEPS[selectedStep].title}</h4>
            <span className={`flowchart-details-badge ${getStepStatus(selectedStep)}`}>
              {getStepStatus(selectedStep).toUpperCase()}
            </span>
          </div>
          <p className="flowchart-details-description">
            {STEPS[selectedStep].description}
          </p>
        </div>
      )}
    </div>
  );
}
