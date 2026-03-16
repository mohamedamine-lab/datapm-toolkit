import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_INSTRUCTION = `You are an expert Data & BI project management consultant with 15+ years of experience at Fortune 500 companies. 
Output ONLY in clean Markdown format. Use proper headings (##, ###), bullet points, bold for emphasis, and tables where appropriate. 
Be specific, professional, and immediately actionable. Never use placeholder text — fill in realistic, context-appropriate content.
Write as if this will be presented to a C-suite executive tomorrow.`;

const PROMPTS: Record<string, (name: string, ctx: string) => string> = {
  'Project Charter': (name, ctx) =>
    `Generate a comprehensive **Project Charter** for: "${name}"

**Project Context:** ${ctx}

Use this exact structure with all sections fully populated:

## 📋 Project Charter: ${name}
**Version:** 1.0 | **Date:** [today's date] | **Status:** Draft

## 1. Executive Summary
(2-3 sentences capturing the what, why, and expected impact)

## 2. Business Objectives & Success Criteria
(Table format: Objective | Success Metric | Target | Timeline)

## 3. Scope
### In-Scope
### Out-of-Scope

## 4. Stakeholders & RACI Matrix
(Table: Role | Person/Team | R/A/C/I for key activities)

## 5. Data Sources & Systems
(Table: Source | Type | Format | Refresh | Owner)

## 6. Timeline & Milestones
(Table: Phase | Milestone | Target Date | Dependencies)

## 7. Risks & Mitigation
(Table: Risk | Probability | Impact | Mitigation | Owner)

## 8. Dependencies & Assumptions

## 9. Budget & Resources

## 10. Approval & Sign-off
(Table with signature lines)

Make every section specific to the project context. No generic filler.`,

  'KPI Framework': (name, ctx) =>
    `Generate a detailed **KPI Framework** for: "${name}"

**Project Context:** ${ctx}

Use this structure:

## 📊 KPI Framework: ${name}
**Version:** 1.0 | **Review Cadence:** Monthly

## 1. Framework Overview
(Purpose, alignment with business goals)

## 2. Strategic KPIs
(For each KPI, use this format:)
### KPI: [Name]
- **Definition:** What it measures
- **Formula:** Exact calculation
- **Target:** Specific number/percentage
- **Data Source:** Where the data comes from
- **Owner:** Who is accountable
- **Frequency:** How often measured
- **Visualization:** Recommended chart type

(Include 4-5 strategic KPIs)

## 3. Operational KPIs
(Same detailed format, 4-5 operational KPIs)

## 4. Leading vs Lagging Indicators
(Table mapping leading indicators to lagging outcomes)

## 5. Data Quality KPIs
(Completeness, accuracy, timeliness, consistency metrics)

## 6. Dashboard Blueprint
(Recommended layout with specific visualizations per KPI)

## 7. Governance & Review Process

Be specific with formulas, targets, and data sources based on the context.`,

  'Data Specification': (name, ctx) =>
    `Generate a thorough **Data Specification** document for: "${name}"

**Project Context:** ${ctx}

Use this structure:

## 🗄️ Data Specification: ${name}
**Version:** 1.0 | **Status:** Draft

## 1. Purpose & Scope
(What this spec covers and its boundaries)

## 2. Data Sources Inventory
| Source | Type | Format | Refresh Frequency | Volume | Owner |
|--------|------|--------|-------------------|--------|-------|
(Fill with realistic sources based on context)

## 3. Data Model
### Key Entities
(List main entities with descriptions)
### Entity Relationships
(Describe key relationships)

## 4. Field-Level Specifications
### [Table/Entity Name]
| Field | Data Type | Description | Nullable | Constraints | Example |
|-------|-----------|-------------|----------|-------------|---------|
(Include realistic fields with examples)

## 5. Data Quality Rules
| Rule | Field(s) | Logic | Action on Failure |
|------|----------|-------|-------------------|

## 6. Transformation & Business Rules
(Specific transformation logic, calculations, derivations)

## 7. Security & Access Control
(Classification levels, access matrix)

## 8. Data Lineage
(Source → Staging → Transform → Target flow)

## 9. Integration Architecture
(Batch/streaming/API patterns with specifics)

## 10. Glossary
(Business terms with precise definitions)

Be technically precise. Include realistic example data.`,

  'Stakeholder Deck Outline': (name, ctx) =>
    `Generate a detailed **Stakeholder Deck Outline** for: "${name}"

**Project Context:** ${ctx}

Create a slide-by-slide outline:

## 🎯 Stakeholder Deck: ${name}

### Slide 1: Title
- **Title:** ${name}
- **Subtitle:** [compelling subtitle]
- **Date & Presenter**

### Slide 2: Agenda
- Key topics (5-6 items)

### Slide 3: Executive Summary
- **Key Message:** (1 sentence)
- **Status:** (RAG indicator)
- **The Ask:** (what you need from stakeholders)
- **Visual:** Summary dashboard mockup

### Slide 4-5: Problem & Opportunity
- Current pain points (3-4 data-backed points)
- Market/business opportunity
- Cost of inaction
- **Visual:** Before/after comparison or impact chart

### Slide 6-7: Solution Overview
- Architecture diagram description
- Key components
- Technology stack
- **Visual:** Solution architecture diagram

### Slide 8: Timeline & Progress
- Phase breakdown with milestones
- Current position highlighted
- **Visual:** Gantt chart or milestone timeline

### Slide 9: Key Metrics
- Early wins or projected impact
- **Visual:** KPI dashboard with targets

### Slide 10: Risks & Mitigations
- Top 3-5 risks with mitigation plans
- **Visual:** Risk heat map

### Slide 11: Budget & Resources
- Investment summary
- ROI projection
- **Visual:** Budget breakdown pie chart

### Slide 12: Next Steps & Asks
- Concrete next actions
- What you need from each stakeholder
- Decision timeline

### Appendix Suggestions
(List 3-4 backup slides)

For each slide, include specific talking points and speaker notes based on the project context.`,
};

export async function POST(req: NextRequest) {
  try {
    const { projectName, context, artifactType } = await req.json();

    if (!projectName || !context || !artifactType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const promptBuilder = PROMPTS[artifactType];
    if (!promptBuilder) {
      return NextResponse.json({ error: 'Invalid artifact type' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const prompt = promptBuilder(projectName, context);

    // Retry logic with exponential backoff for rate limits
    const MAX_RETRIES = 3;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: 'gemini-2.0-flash',
          systemInstruction: SYSTEM_INSTRUCTION,
        });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return NextResponse.json({ content: text });
      } catch (retryErr: unknown) {
        const errMsg = retryErr instanceof Error ? retryErr.message : '';
        if (errMsg.includes('429') && attempt < MAX_RETRIES) {
          // Wait with exponential backoff: 2s, 4s, 8s
          await new Promise(r => setTimeout(r, Math.pow(2, attempt + 1) * 1000));
          continue;
        }
        throw retryErr;
      }
    }

    return NextResponse.json({ error: 'Generation failed after retries' }, { status: 500 });
  } catch (err: unknown) {
    console.error('Generate error:', err);
    const errMsg = err instanceof Error ? err.message : 'Generation failed';
    
    if (errMsg.includes('429')) {
      return NextResponse.json({ 
        error: 'The AI service is temporarily at capacity. Please wait a moment and try again.' 
      }, { status: 429 });
    }
    
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
