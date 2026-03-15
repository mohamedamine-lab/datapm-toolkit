import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const PROMPTS: Record<string, (name: string, ctx: string) => string> = {
  'Project Charter': (name, ctx) =>
    `You are a senior Data Project Manager. Generate a comprehensive Project Charter for the project "${name}".

Context: ${ctx}

Structure the charter with these sections:
1. Project Title & Version
2. Executive Summary
3. Business Objectives & Success Criteria
4. Scope (In-Scope / Out-of-Scope)
5. Key Stakeholders & Roles (RACI)
6. Data Sources & Systems
7. High-Level Timeline & Milestones
8. Risks & Mitigation Strategies
9. Dependencies & Assumptions
10. Approval Sign-off Section

Be specific, professional, and actionable. Use the context provided to tailor every section.`,

  'KPI Framework': (name, ctx) =>
    `You are a senior BI Manager. Generate a KPI Framework for the project "${name}".

Context: ${ctx}

Structure the framework with:
1. Framework Overview & Objectives
2. Strategic KPIs (3-5) with: Name, Definition, Formula, Target, Data Source, Owner, Frequency
3. Operational KPIs (3-5) with same detail
4. Leading vs Lagging Indicators mapping
5. Data Quality KPIs
6. Measurement Methodology
7. Dashboard Recommendations
8. Review Cadence & Governance

Be specific and data-driven. Tailor to the context provided.`,

  'Data Specification': (name, ctx) =>
    `You are a senior Data Architect. Generate a Data Specification document for the project "${name}".

Context: ${ctx}

Structure the spec with:
1. Document Purpose & Scope
2. Data Sources Inventory (source, type, format, refresh frequency)
3. Data Model Overview (key entities & relationships)
4. Field-Level Specifications (table format: field, type, description, nullable, constraints)
5. Data Quality Rules & Validation
6. Transformation Logic (key business rules)
7. Security & Access Controls
8. Data Lineage
9. Integration Patterns (batch/streaming/API)
10. Glossary of Business Terms

Be thorough and technically precise. Use the context to make it project-specific.`,

  'Stakeholder Deck Outline': (name, ctx) =>
    `You are a senior Data PM preparing a stakeholder presentation. Generate a detailed Stakeholder Deck Outline for the project "${name}".

Context: ${ctx}

Structure the deck outline with:
1. Title Slide (project name, date, presenter)
2. Agenda (1 slide)
3. Executive Summary (1 slide — key message, status, ask)
4. Problem Statement & Opportunity (1-2 slides)
5. Solution Overview & Architecture (1-2 slides)
6. Timeline & Progress (1 slide — Gantt/milestone view)
7. Key Metrics & Early Results (1 slide)
8. Risks & Mitigations (1 slide)
9. Resource & Budget Overview (1 slide)
10. Next Steps & Asks (1 slide)
11. Appendix suggestions

For each slide, provide: title, key talking points (3-4 bullets), and suggested visual/chart type. Be specific to the project context.`,
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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const promptBuilder = PROMPTS[artifactType];
    if (!promptBuilder) {
      return NextResponse.json({ error: 'Invalid artifact type' }, { status: 400 });
    }

    const prompt = promptBuilder(projectName, context);
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ content: text });
  } catch (err: unknown) {
    console.error('Generate error:', err);
    const message = err instanceof Error ? err.message : 'Generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
