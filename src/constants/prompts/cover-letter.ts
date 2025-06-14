import { certifications } from "src/data/certifications";
import compagnies from "src/data/compagnies";
import contributions from "src/data/contributions";
import { diplomas } from "src/data/diplomas";
import { technologies } from "src/data/technologies";
import calculateAge from "src/utils/calculateAge";

export const coverLetterPrompt = (
  companyData: object,
  language: string,
) => `You are writing a professional cover letter for Antoine Kingue using a natural 5W2H narrative approach.

<CANDIDATE_PROFILE>
- Age: ${calculateAge("2001-03-10")} years old
- Born in Paris, currently lives in the countryside near Rouen with 2 dogs and 1 cat
- Car and motorcycle enthusiast - perfect balance to decompress after long coding sessions
- Started coding at age 11 with Java Minecraft plugins - never really stopped since
- Available from September 2025, ready to relocate to Paris
</CANDIDATE_PROFILE>

<NATURAL_5W2H_NARRATIVE_STRUCTURE>
Use this proven storytelling approach (like Antoine's freelance pitch):

WHO: Antoine, ${calculateAge("2001-03-10")} years old, born in Paris, lives authentically in Rouen countryside with pets, car and motorcycle enthusiast

WHAT: Helps companies solve concrete technical problems, transforms technical challenges into working solutions

WHERE: Born in Paris, lives in countryside near Rouen, works in R&D at Arkée, co-founded onRuntime Studio

WHEN: Started at 11 with Minecraft plugins → today expert developer → onRuntime since 2015 → available September 2025

WHY: Genuine passion for transforming technical challenges into solutions that work, driven by concrete results

HOW: Modern tech stack (TypeScript, React, Rust), participated in massive open source projects, R&D innovation, agency experience

HOW MUCH: Impressive concrete numbers (98% cost reduction, 0 to 100k impressions in 3 months, billions of downloads on projects participated in)

NARRATIVE FLOW: Personal story → Technical journey → Concrete results → Company alignment → Clear next steps
</NATURAL_5W2H_NARRATIVE_STRUCTURE>

<CURRENT_ROLES>
- R&D Developer at Arkée by Jaws: Develops tools that save time and money - 98% cost reduction on some production processes
- Co-founder onRuntime Studio (2015): Dev & design agency, accompanied dozens of projects since 2015
- Founder Tonight Pass: Nightlife platform with adaptive recommendation algorithms, regional partnerships
</CURRENT_ROLES>

<MAJOR_ACHIEVEMENTS>
OPEN SOURCE CONTRIBUTIONS (participated in massive-scale projects):
- Next.js: Over 1 billion downloads - participated in React framework development
- styled-components: Over 1 billion downloads - contributed to CSS-in-JS library
- Turborepo: Over 300 million downloads - contributed to monorepo build system
- Gatsby: Over 100 million downloads - participated in static site generator development  
- Renovate: Over 30 million downloads - contributed to dependency management

PROFESSIONAL IMPACT:
- Tonight Pass: Applied SEO strategies from Arkée experience, grew from 0 to 100k impressions in less than 3 months
- Arkée R&D: Develops internal tools and automation that save time and money, 98% cost reduction on some processes
- onRuntime: Dozens of projects since 2015, full-stack development and design
- Expertise: TypeScript, React, Rust, modern technologies that deliver results
</MAJOR_ACHIEVEMENTS>

<AUTHENTIC_TONE_GUIDELINES>
- Be genuine and personal (mention Paris origins, countryside life, pets, car/motorcycle passion if relevant for culture fit)
- Use concrete, specific numbers rather than vague claims (0 to 100k impressions in 3 months)
- Focus on practical results and problem-solving
- Show progression: 11 years old → today expert
- Mention "modern technologies that deliver results" 
- Emphasize transformation: "transform technical challenges into working solutions"
- Be humble about open source contributions: "participated in" or "contributed to" not "led" or "main contributor"
- Use rounded, natural numbers (over 1 billion, over 300 million, etc.)
- Use active voice and direct language
</AUTHENTIC_TONE_GUIDELINES>

<JOB_TITLE_ADAPTATION>
Adapt technical emphasis based on exact job title:
- Frontend/React/JavaScript/TypeScript → Lead with Next.js, styled-components, React expertise
- Backend/API/Server → Lead with Rust, Turborepo, server optimization, automation
- Product Engineer → Lead with business impact, user-focused solutions, Tonight Pass growth metrics (0 to 100k impressions)
- Full Stack → Balance frontend (Next.js/React) and backend (Rust/optimization) experience
- AI/ML → Mention Tonight Pass algorithms, data-driven optimization at Arkée
- Senior/Lead → Emphasize open source participation scale, team leadership at onRuntime, R&D innovation
</JOB_TITLE_ADAPTATION>

<EDUCATION_CONTEXT>
Education: ${JSON.stringify(diplomas)}
Certifications: ${JSON.stringify(certifications)}
Technologies: ${JSON.stringify(technologies)}
</EDUCATION_CONTEXT>

<CRITICAL_RULES>
- NEVER start with a title or header like "Job application for X at Y"
- NEVER mention specific company partnerships, recent news, or tactical announcements
- Use EXACT job title provided - never change or interpret it
- Follow natural 5W2H narrative flow (personal → technical → results → alignment)
- Start directly with authentic personal story (coding since 11, current life context)
- Lead with most impressive relevant achievements (billion+ downloads when applicable)
- Be concrete and specific with numbers and results
- 70% about Antoine's story and value, 30% company connection
- Professional but authentic tone (not overly formal)
- No headers, dates, contact info, signature lines, or job application titles
- Do not end with any signature
- Length: 250-350 words
- Respond in ${language}
</CRITICAL_RULES>

<DATA_SOURCES>
Target Company: ${JSON.stringify(companyData)}
All Companies: ${JSON.stringify(compagnies)}
Contributions: ${JSON.stringify(contributions)}
</DATA_SOURCES>

<TASK>
Write a cover letter using the natural 5W2H narrative approach that:
1. Opens directly with authentic personal context (NO TITLE/HEADER)
2. Shows technical journey and passion (11 years old → today)
3. Highlights concrete results with specific numbers
4. Connects to company mission and values (high-level, no specific news/partnerships)
5. Closes with clear availability and next steps
6. Provides both raw text and HTML formatted versions
</TASK>`;
