# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary evaluators (who the product must convince):** recruiters and tech leads reviewing a portfolio piece. They sign in with the demo accounts, walk the three roles in a few minutes and judge product sense, visual craft and code quality. They switch roles often and have no patience for empty screens or dead ends.
- **In-product roles (the fiction the demo must hold up):** a design agency's workflow.
  - **Client:** submits design requests (title, brief, reference files) and follows their progress. Sees only their own projects.
  - **Project Manager (PM):** triages every incoming request, assigns designers, edits and deletes. Sees everything.
  - **Designer:** works on the projects assigned to them. Sees only those; cannot edit or delete projects.

## Product Purpose

A project-intake and tracking tool for a design agency: clients request work, the PM routes it to designers, and everyone sees where each project stands. It exists as a portfolio case study (it started as a technical test for Grayola, a design-as-a-service company) and must look and behave like a real SaaS product built with production discipline.

Success: an evaluator who spends five minutes with it can tell what each role does, sees role-appropriate dashboards with realistic data, and finds nothing broken, generic or insecure.

## Positioning

Role-aware from the database up: each role gets its own first screen and the permissions are enforced in Postgres RLS and server actions, not just hidden buttons. The case study shows the whole path from a technical test to a hardened product.

## Operating Context

- Demo accounts (password `123456`): pm@gmail.com, cliente1@gmail.com, cliente2@gmail.com, designer@gmail.com, designer2@gmail.com, designer3@gmail.com. Demo data is synthetic (seed.sql).
- Deployed on Vercel; backend is Supabase (Auth, Postgres with RLS, Storage).
- Interface language: Spanish (Rioplatense voseo: "Ingresá", "Creá").

## Capabilities and Constraints

- Confirmed: auth (login/register/logout), project CRUD by role, designer assignment by the PM, file attachments, dark/light theme.
- Approved for the redesign: project status workflow (pending → in progress → in review → delivered), due dates, search/filters and a board view for the PM, private file storage with signed URLs and a proper file manager, per-project activity history, one-click demo sign-in per role.
- Business rules must not change silently: clients create and view their own; designers view assigned; only the PM edits, assigns and deletes. Any rule change is proposed first.
- Every database change ships as a reversible migration in `supabase/migrations` with its rollback.
- New accounts are always created as `client`; roles are assigned outside the app.

## Brand Commitments

- Independent visual identity. "Grayola" is kept as the product/case name, but the product must not use Grayola's real logo, palette or typography, and must not present itself as an official Grayola tool.
- The animated particle background is part of the product's identity: keep it and improve it, never remove or replace it.

## Evidence on Hand

- No real clients, testimonials, metrics or customer logos exist. Never fabricate them; demo content is labeled as demo where a visitor could mistake it for real.
- Original backup (2025-06) contains real third-party accounts and personal files: never restore or display them.

## Product Principles

1. Each role lands on what it needs first; no role sees a screen designed for another.
2. Status is always visible: anyone looking at a project knows where it stands and who is on it.
3. Permissions are real: what the UI hides, the server also refuses.
4. A demo is a first impression: realistic data, no empty dead ends, fast role switching.
5. Quiet, precise tooling with craft in the details; atmosphere (particles) never competes with the work.

## Accessibility & Inclusion

WCAG 2.2 AA in both themes: contrast, visible focus, full keyboard use, labelled controls, 44px targets, and `prefers-reduced-motion` respected everywhere (including the particle background and Framer Motion).
