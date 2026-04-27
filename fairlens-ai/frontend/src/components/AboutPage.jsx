import { ContainerScroll } from '@/components/ui/container-scroll-animation';

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Hero Section with Scroll Animation */}
      <div className="flex flex-col overflow-hidden pb-10 pt-10">
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="text-4xl font-semibold text-black dark:text-white mb-4">
                Uncover hidden bias with <br />
                <span className="text-4xl md:text-[5rem] font-bold mt-1 leading-none text-blue-500">
                  FairLens AI
                </span>
              </h1>
            </>
          }
        >
          <img
            src="/mockup.png"
            alt="FairLens AI Dashboard Mockup"
            className="mx-auto rounded-2xl object-cover h-full object-left-top w-full"
            draggable={false}
          />
        </ContainerScroll>
      </div>

      {/* Original About Content */}
      <div className="page-container mt-[-10rem] md:mt-[-20rem] relative z-10 bg-transparent">
        <div className="about-page mx-auto bg-[#1c2333] p-8 md:p-12 rounded-2xl border border-[#2a3347] shadow-2xl">
          <h2 className="text-2xl font-bold mb-4 text-white">About FairLens AI</h2>
          <p className="text-[#8b96a8] leading-relaxed mb-8">
            FairLens AI is a professional bias detection system designed to identify and explain
            discriminatory language in hiring decisions, loan approvals, educational statements,
            and general communications.
          </p>

          <hr className="section-divider border-[#2a3347]" />

          <h3 className="text-lg font-semibold mb-3 text-white">Capabilities</h3>
          <ul className="about-feature-list text-[#8b96a8] space-y-2">
            <li>Detects gender, racial, age, and socioeconomic bias</li>
            <li>Highlights specific biased phrases in context</li>
            <li>Provides clear or technical explanations</li>
            <li>Generates fair, rewritten alternatives</li>
            <li>Quantifies bias with a 0–100 score</li>
            <li>Maintains full history of past analyses</li>
          </ul>

          <hr className="section-divider border-[#2a3347] my-8" />

          <h3 className="text-lg font-semibold mb-3 text-white">Technology Stack</h3>
          <div className="about-stack flex flex-wrap gap-2">
            {['React', 'Vite', 'Node.js', 'Express', 'Google Gemini', 'gemini-2.5-flash', 'Tailwind CSS', 'Framer Motion'].map(t => (
              <span key={t} className="about-badge px-3 py-1 rounded-full text-xs font-medium border border-[#2a3347] bg-[#161b27] text-[#8b96a8]">{t}</span>
            ))}
          </div>

          <hr className="section-divider border-[#2a3347] my-8" />

          <h3 className="text-lg font-semibold mb-3 text-white">How It Works</h3>
          <p className="text-[#8b96a8] leading-relaxed">
            Text is sent to a local Express API which constructs a structured prompt and
            queries the Google Gemini API. The response is parsed, validated, and returned
            as structured data — bias score, flagged terms, explanation, and a fair rewrite.
            Analysis runs via Gemini 2.5 Flash with exponential-backoff retry on quota errors.
          </p>

          <hr className="section-divider border-[#2a3347] my-8" />

          <p className="text-xs text-[#566075]">
            Powered by Google Gemini AI. Your text is sent to the Gemini API for analysis.
          </p>
        </div>
      </div>
    </div>
  );
}
