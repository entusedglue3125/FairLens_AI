import { ContainerScroll } from '@/components/ui/container-scroll-animation';

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Hero Section with Scroll Animation */}
      <div className="flex flex-col overflow-hidden pb-10 pt-10">
        <ContainerScroll
          titleComponent={
            <>
              <div className="flex items-center justify-center mb-8">
                <span className="px-8 py-3 rounded-full text-3xl font-extrabold tracking-tighter bg-blue-500/10 text-[var(--text-primary)] border-2 border-blue-500/30 shadow-lg">
                  Fair<span className="text-blue-500">Lens</span> AI
                </span>
              </div>
              <h1 className="text-4xl font-semibold text-[var(--text-primary)] mb-4 text-center">
                Uncover hidden bias with <br />
                <span className="text-4xl md:text-[5rem] font-bold mt-1 leading-none text-blue-500">
                  Precision & Clarity
                </span>
              </h1>
            </>
          }
        >
          <img
            src="/image.png"
            alt="FairLens AI Dashboard Mockup"
            className="mx-auto rounded-2xl object-cover h-full object-left-top w-full"
            draggable={false}
          />
        </ContainerScroll>
      </div>

      {/* Original About Content */}
      <div className="page-container mt-[-10rem] md:mt-[-20rem] relative z-10 bg-transparent">
        <div className="about-page mx-auto bg-[var(--bg-card)] p-8 md:p-12 rounded-2xl border border-[var(--border)] shadow-2xl">
          <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">About FairLens AI</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
            FairLens AI is a professional bias detection system designed to identify and explain
            discriminatory language in hiring decisions, loan approvals, educational statements,
            and general communications.
          </p>

          <hr className="section-divider border-[var(--border)]" />

          <h3 className="text-xl font-bold mb-4 text-[var(--text-primary)] flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
            Advanced Analysis Capabilities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="capability-item p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-2)]/50">
              <h4 className="font-semibold text-blue-400 mb-2">Multi-Dimensional Detection</h4>
              <p className="text-sm text-[var(--text-secondary)]">Identifies nuanced bias across gender, race, age, socioeconomic status, and intersectional identities using advanced NLP pattern matching.</p>
            </div>
            <div className="capability-item p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-2)]/50">
              <h4 className="font-semibold text-blue-400 mb-2">Contextual Semantic Analysis</h4>
              <p className="text-sm text-[var(--text-secondary)]">Analyzes the intent and impact of phrases within the specific context of your communication, avoiding false positives from common industry terms.</p>
            </div>
            <div className="capability-item p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-2)]/50">
              <h4 className="font-semibold text-blue-400 mb-2">Bias Quantification</h4>
              <p className="text-sm text-[var(--text-secondary)]">Generates a weighted 0–100 Bias Score based on the severity, frequency, and potential real-world impact of the detected language.</p>
            </div>
            <div className="capability-item p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-2)]/50">
              <h4 className="font-semibold text-blue-400 mb-2">Fair Reconstruction</h4>
              <p className="text-sm text-[var(--text-secondary)]">Leverages Generative AI to suggest equitable alternatives that preserve your original meaning while removing discriminatory triggers.</p>
            </div>
          </div>

          <hr className="section-divider border-[var(--border)] my-8" />

          <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Modern Technology Stack</h3>
          <div className="about-stack flex flex-wrap gap-3 mb-4">
            {[
              { name: 'React 18', type: 'Frontend Core' },
              { name: 'Vite', type: 'Build Tool' },
              { name: 'Tailwind CSS', type: 'Styling' },
              { name: 'Framer Motion', type: 'Animations' },
              { name: 'Node.js/Express', type: 'API Backend' },
              { name: 'Google Gemini Flash', type: 'AI Intelligence' },
              { name: 'Zod', type: 'Data Validation' }
            ].map(t => (
              <div key={t.name} className="flex flex-col p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] min-w-[140px]">
                <span className="text-xs text-blue-500 font-bold uppercase tracking-wider">{t.type}</span>
                <span className="text-sm text-[var(--text-primary)] font-medium">{t.name}</span>
              </div>
            ))}
          </div>

          <hr className="section-divider border-[var(--border)] my-8" />

          <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">The Engineering Workflow</h3>
          <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed text-sm">
            <div className="flex gap-4">
              <span className="font-bold text-blue-500">01</span>
              <p><strong className="text-[var(--text-primary)]">Ingestion & Sanitization:</strong> Input text is tokenized and sanitized on the client before being transmitted via a secure POST request to our Node.js microservice.</p>
            </div>
            <div className="flex gap-4">
              <span className="font-bold text-blue-400">02</span>
              <p><strong className="text-[var(--text-primary)]">Prompt Orchestration:</strong> The backend constructs a complex multi-shot prompt that enforces a strict JSON schema, ensuring the AI output is always valid, predictable, and parseable.</p>
            </div>
            <div className="flex gap-4">
              <span className="font-bold text-blue-300">03</span>
              <p><strong className="text-[var(--text-primary)]">AI Processing & Validation:</strong> Google Gemini Flash processes the text through several attention layers to detect subtle exclusionary patterns. Our backend then validates the response against a 12-point fairness rubric.</p>
            </div>
            <div className="flex gap-4">
              <span className="font-bold text-blue-200">04</span>
              <p><strong className="text-[var(--text-primary)]">Result Delivery:</strong> Data is returned as a structured JSON object, allowing the frontend to highlight biased terms in real-time and provide interactive explanations to the user.</p>
            </div>
          </div>

          <hr className="section-divider border-[var(--border)] my-8" />

          <div className="bg-blue-500/5 p-6 rounded-2xl border border-blue-500/10">
            <h3 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-2 text-center">Ethics & Methodology</h3>
            <p className="text-xs text-[var(--text-muted)] text-center max-w-lg mx-auto leading-relaxed">
              FairLens AI follows the Google AI Principles and focuses on minimizing bias in language models. 
              Our system is designed for assistive auditing, not automated decision-making. 
              Always review AI suggestions to ensure they align with your specific ethical standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
