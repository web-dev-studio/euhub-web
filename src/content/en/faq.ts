import type { FaqItem } from '../types';

const faq: FaqItem[] = [
  {
    question: 'Do you only build websites?',
    answer:
      'No. We build websites, landing pages, custom web applications, client portals, internal dashboards, and AI-integrated interfaces. A website is often the entry point; the real work is the system behind it.',
  },
  {
    question: 'Can you build custom web apps or dashboards?',
    answer:
      'Yes. Internal tools, booking systems, operational dashboards, and client portals are a core part of what we build. These are engineered for your business workflows, not bolted onto a template.',
  },
  {
    question: 'Can you integrate with our CRM/ERP?',
    answer:
      'Yes. We integrate with CRM, ERP, payment, email, analytics, logistics, and internal database systems. We handle REST, GraphQL, webhooks, and legacy SOAP APIs when required.',
  },
  {
    question: 'Can you work with legacy SOAP APIs?',
    answer:
      'Yes. If you have legacy systems that only expose SOAP endpoints, we build integration layers that translate between SOAP and modern REST/GraphQL interfaces. We do not force you to rip out working infrastructure.',
  },
  {
    question: 'Do you build AI features?',
    answer:
      'Yes. We build frontends for AI assistants, RAG systems, automation workflows, and internal copilots. We implement streaming, human-in-the-loop review, secure document handling, and model routing with fallbacks.',
  },
  {
    question: 'Can you host and maintain the website?',
    answer:
      'Yes. We offer monthly retainers covering hosting, CI/CD, monitoring, security updates, backups, and iterations. Long-term technical ownership is part of the offer, not an afterthought.',
  },
  {
    question: 'Are you GDPR-aware?',
    answer:
      'Yes. We build with GDPR-aware architecture, EU data residency options, secure forms, role-based access, and audit-friendly logging for business applications. Analytics is cookieless by default.',
  },
  {
    question: 'Do you work with companies outside Slovakia?',
    answer:
      'Yes. We are based in Slovakia and work with companies across the EU. The location gives you EU data residency and GDPR alignment without extra effort.',
  },
  {
    question: 'How long does a website project take?',
    answer:
      'A landing page takes 1–3 weeks. A business website takes 3–8 weeks. A custom web application takes 6–16 weeks depending on scope, integrations, and complexity. We define the timeline during architecture.',
  },
  {
    question: 'What do you need from us to start?',
    answer:
      'A technical web audit is the usual starting point. We need access to your current website, analytics (if any), and a short call about your business goals. We handle the rest.',
  },
  {
    question: 'How do you price projects?',
    answer:
      'We price based on scope, integrations, timeline, and long-term maintenance. Most projects start with a fixed-price technical audit (€500–€1,500), then move to a fixed-scope project or a monthly retainer.',
  },
  {
    question: 'Do you offer ongoing support after launch?',
    answer:
      'Yes. Maintenance and DevOps retainers cover monitoring, security patching, backups, performance tracking, and new features as your business evolves. A website that nobody maintains becomes a liability.',
  },
];

export const faqBundle = { faq };
