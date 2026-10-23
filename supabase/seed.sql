-- Seed data for local and preview environments.
-- This mirrors the typed sample content the public site ships with so the
-- database and the frontend tell the same story while content is migrated.
--
-- Do not run this against production with illustrative copy in place: replace
-- project outcomes, biography, and employment details with verifiable records.

begin;

-- ---------------------------------------------------------------------------
-- Profile
-- ---------------------------------------------------------------------------

insert into public.profiles (
  full_name, headline, bio, long_bio, location, social_links
)
select
  'Jahno Paul',
  'Software, design, and technology education',
  'I work across software engineering, interface design, blockchain, and technology education. The through-line is the same: make complex systems intelligible, useful, and carefully presented.',
  'Jahno Paul is a multidisciplinary practitioner working at the intersection of software, design, and teaching. The work is equally concerned with how a system is built and how it is explained.

Projects tend to start with a communication problem: a team cannot see the work, a learner cannot enter the subject, or a product cannot describe its own decisions. The response is usually a combination of research, interface design, and implementation.

The values that shape the studio are clarity, restraint, and accountability. If a page, a product, or a lesson cannot say what it is for, it is not finished.',
  'Building remotely',
  '{"github": "https://github.com/Jahnojnr"}'::jsonb
where not exists (select 1 from public.profiles);

-- ---------------------------------------------------------------------------
-- Classification
-- ---------------------------------------------------------------------------

insert into public.categories (name, slug) values
  ('Engineering', 'engineering'),
  ('Product design', 'product-design'),
  ('Education', 'education'),
  ('Blockchain', 'blockchain')
on conflict (slug) do nothing;

insert into public.technologies (name, slug) values
  ('Next.js', 'nextjs'),
  ('TypeScript', 'typescript'),
  ('PostgreSQL', 'postgres'),
  ('Figma', 'figma'),
  ('Solidity', 'solidity'),
  ('Tailwind CSS', 'tailwind')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Projects
-- ---------------------------------------------------------------------------

insert into public.projects (
  title, slug, summary, problem, solution, role, content, outcomes,
  cover_label, status, featured, sort_order, published_at
) values
  (
    'Curriculum Studio',
    'curriculum-studio',
    'A structured environment for designing, sequencing, and publishing technology education programmes.',
    'Course teams were assembling lessons across disconnected documents, which made quality review slow and outcomes difficult to measure.',
    'A shared studio for modules, assessments, and publishing workflow, with a public catalogue that stays aligned to the latest approved version.',
    'Product design and full-stack engineering',
    'Curriculum Studio started as a response to a practical teaching problem: strong material existed, but it lived in too many places to review, reuse, or improve with any discipline.

The work combined information architecture, editorial interface design, and a publishing model that treats a course as a versioned product rather than a folder of files.

The result is a quieter production environment for educators and a clearer reading experience for learners.',
    array[
      'Reduced course assembly time from several days to a single review cycle',
      'Gave reviewers a consistent place to comment on structure, not just copy',
      'Published a public catalogue that stays in sync with approved modules'
    ],
    'Education platform',
    'published',
    true,
    1,
    '2025-09-12T09:00:00Z'
  ),
  (
    'Ledger Brief',
    'ledger-brief',
    'An explanatory product that turns on-chain activity into readable operational summaries for non-specialist teams.',
    'Stakeholders needed to understand blockchain activity without reading raw transaction data or relying on informal screenshots.',
    'A brief-style interface that groups events, names counterparties, and presents a narrative summary with links back to source records.',
    'Interface design and product engineering',
    'Ledger Brief is an exercise in translation. The data is technical; the audience is not always technical. The design problem was to keep the source of truth intact while making the story readable.

The interface uses an editorial layout rather than a dense dashboard: a headline, a period, a sequence of events, and supporting detail that can be opened when needed.

That restraint is the point. The product is useful because it refuses to show everything at once.',
    array[
      'Cut weekly reporting preparation from a half-day task to a short review',
      'Gave legal and operations teams a shared language for on-chain events',
      'Preserved an audit path from each summary back to source records'
    ],
    'Blockchain briefing',
    'published',
    true,
    2,
    '2025-06-03T09:00:00Z'
  ),
  (
    'Atelier OS',
    'atelier-os',
    'An internal operating system for a small studio: projects, proposals, and delivery notes in one editorial workspace.',
    'Delivery notes, proposals, and project history were scattered, which made it hard to brief new work or learn from previous engagements.',
    'A calm workspace that treats each engagement as a case file, with status, artefacts, and decisions kept in a single record.',
    'Design lead and application engineering',
    'Atelier OS is the kind of tool a studio actually uses: not a generic project board, but a place to hold the thinking around a piece of work.

Each engagement has a brief, a record of decisions, and a closing note. The visual language is closer to a publication than a kanban wall.

Building it clarified a wider design principle for this portfolio: software can be quiet, structured, and still feel considered.',
    array[
      'Created a repeatable briefing format for new work',
      'Made previous decisions searchable instead of buried in chat',
      'Shortened the time needed to assemble a proposal from prior work'
    ],
    'Studio operations',
    'published',
    true,
    3,
    '2025-02-18T09:00:00Z'
  ),
  (
    'Field Notes for Builders',
    'field-notes-for-builders',
    'A public writing and workshop series on software craft, product judgement, and teaching technical ideas clearly.',
    'Technical explanations were either too abstract for newcomers or too informal to reuse as teaching material.',
    'A set of long-form notes and workshop outlines with a consistent structure: context, decision, method, and what to try next.',
    'Author, curriculum design, and facilitation',
    'Field Notes for Builders is the public teaching practice behind the studio work. It is not a dump of tutorials. Each note is written to be used in a room, then revised after it has been taught.

The project sits at the intersection of writing, education, and product thinking. The measure of success is whether a reader can act, not whether the page looks busy.',
    array[
      'Produced a reusable outline for workshops and independent study',
      'Turned classroom feedback into a public editorial standard',
      'Created a body of writing that supports the project case studies'
    ],
    'Teaching series',
    'published',
    true,
    4,
    '2024-11-08T09:00:00Z'
  ),
  (
    'Studio notes (draft)',
    'studio-notes',
    'An unpublished working note used to verify that drafts never appear in public listings.',
    'Draft content must remain invisible until it is intentionally published.',
    'Public queries filter on the published state, and Row Level Security enforces the same rule at the database.',
    'Internal verification',
    'This record exists so the platform can prove draft filtering with both the application query and the database policy.',
    array['Confirms unpublished work is excluded from public routes'],
    'Draft',
    'draft',
    false,
    99,
    null
  )
on conflict (slug) do nothing;

insert into public.project_categories (project_id, category_id)
select p.id, c.id
from (values
  ('curriculum-studio', 'education'),
  ('curriculum-studio', 'engineering'),
  ('ledger-brief', 'blockchain'),
  ('ledger-brief', 'product-design'),
  ('atelier-os', 'product-design'),
  ('atelier-os', 'engineering'),
  ('field-notes-for-builders', 'education'),
  ('studio-notes', 'engineering')
) as links (project_slug, category_slug)
join public.projects p on p.slug = links.project_slug
join public.categories c on c.slug = links.category_slug
on conflict do nothing;

insert into public.project_technologies (project_id, technology_id)
select p.id, t.id
from (values
  ('curriculum-studio', 'nextjs'),
  ('curriculum-studio', 'typescript'),
  ('curriculum-studio', 'postgres'),
  ('ledger-brief', 'nextjs'),
  ('ledger-brief', 'typescript'),
  ('ledger-brief', 'solidity'),
  ('atelier-os', 'nextjs'),
  ('atelier-os', 'tailwind'),
  ('atelier-os', 'figma'),
  ('field-notes-for-builders', 'nextjs'),
  ('field-notes-for-builders', 'figma'),
  ('studio-notes', 'nextjs')
) as links (project_slug, technology_slug)
join public.projects p on p.slug = links.project_slug
join public.technologies t on t.slug = links.technology_slug
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Writing
-- ---------------------------------------------------------------------------

insert into public.posts (
  title, slug, excerpt, body, status, published_at
) values
  (
    'Teaching software without flattening the idea',
    'teaching-software-without-flattening-the-idea',
    'A method for explaining technical systems so that beginners can enter and practitioners still find the argument worth reading.',
    'Technical writing often fails in one of two ways. It becomes so gentle that the idea disappears, or so compressed that only people who already know the subject can follow it.

The more useful approach is to keep the structure of the idea intact and change the order of entry. Start with the decision a reader has to make. Then show the model. Then show the implementation.

That sequence is slower to write and much faster to teach. It is the editorial standard behind the notes and workshops on this site.',
    'published',
    '2026-03-14T09:00:00Z'
  ),
  (
    'The shape of a useful case study',
    'the-shape-of-a-useful-case-study',
    'Role, problem, solution, and outcome are not a template to decorate. They are a way to keep a project honest.',
    'A case study is not a gallery caption. It should tell a reader what was at stake, what was chosen, and what changed because of that choice.

If an outcome cannot be measured, it can still be described precisely: a shorter path, a clearer brief, a decision that no longer has to be remade.

The projects on this site are written to that standard. The visual treatment is secondary to the argument.',
    'published',
    '2025-12-02T09:00:00Z'
  ),
  (
    'Quiet interfaces for serious work',
    'quiet-interfaces-for-serious-work',
    'Restraint is not a lack of ambition. It is a way of keeping attention on the content a product is meant to carry.',
    'Many products add motion, cards, and colour because they are afraid of looking unfinished. The unfinished feeling usually comes from weak hierarchy, not from missing decoration.

A serious interface needs readable type, a stable grid, and a small number of actions that are obviously the next step.

That is the visual direction of this portfolio, and it is the same direction applied to the products documented here.',
    'published',
    '2025-08-21T09:00:00Z'
  )
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Career
-- ---------------------------------------------------------------------------

insert into public.experiences (
  organization, role, description, start_date, end_date, is_current, sort_order
)
select * from (values
  (
    'Independent practice',
    'Software, design, and education',
    'Lead end-to-end work on products, teaching programmes, and editorial platforms: research, interface design, engineering, and publishing.',
    '2022-01-01'::date,
    null::date,
    true,
    1
  ),
  (
    'Product and platform work',
    'Engineer and product designer',
    'Designed and built internal tools and public-facing products with an emphasis on information architecture, typed systems, and readable interfaces.',
    '2019-01-01'::date,
    '2021-12-01'::date,
    false,
    2
  ),
  (
    'Technology education',
    'Instructor and curriculum contributor',
    'Taught software and design fundamentals, wrote course material, and helped teams turn informal knowledge into structured programmes.',
    '2017-01-01'::date,
    '2019-12-01'::date,
    false,
    3
  )
) as rows (organization, role, description, start_date, end_date, is_current, sort_order)
where not exists (select 1 from public.experiences);

-- ---------------------------------------------------------------------------
-- Skills
-- ---------------------------------------------------------------------------

insert into public.skill_groups (name, sort_order) values
  ('Technical', 1),
  ('Design', 2),
  ('Professional', 3)
on conflict (name) do nothing;

insert into public.skills (group_id, name, sort_order)
select g.id, s.name, s.sort_order
from (values
  ('Technical', 'TypeScript', 1),
  ('Technical', 'Next.js', 2),
  ('Technical', 'PostgreSQL', 3),
  ('Technical', 'System design', 4),
  ('Technical', 'Blockchain fundamentals', 5),
  ('Design', 'Editorial interface design', 1),
  ('Design', 'Information architecture', 2),
  ('Design', 'Design systems', 3),
  ('Design', 'Prototyping', 4),
  ('Professional', 'Curriculum design', 1),
  ('Professional', 'Technical writing', 2),
  ('Professional', 'Workshop facilitation', 3),
  ('Professional', 'Product discovery', 4)
) as s (group_name, name, sort_order)
join public.skill_groups g on g.name = s.group_name
on conflict (group_id, name) do nothing;

-- ---------------------------------------------------------------------------
-- Services
-- ---------------------------------------------------------------------------

insert into public.services (title, summary, details, sort_order)
select * from (values
  (
    'Product and interface design',
    'Shape the structure, language, and visual system of a digital product.',
    array[
      'Research and positioning',
      'Information architecture',
      'Interface design for complex content',
      'Design-to-engineering handoff'
    ],
    1
  ),
  (
    'Software engineering',
    'Build typed, maintainable web applications with a clear content model.',
    array[
      'Next.js application architecture',
      'Content systems and publishing workflows',
      'Integration with PostgreSQL-backed services',
      'Accessible, performant frontends'
    ],
    2
  ),
  (
    'Technology education',
    'Turn specialist knowledge into programmes, workshops, and public writing.',
    array[
      'Curriculum and workshop design',
      'Technical explanation and editorial standards',
      'Teaching for mixed-experience groups',
      'Review of existing learning material'
    ],
    3
  )
) as rows (title, summary, details, sort_order)
where not exists (select 1 from public.services);

-- ---------------------------------------------------------------------------
-- Education and achievements
-- ---------------------------------------------------------------------------

insert into public.education (institution, credential, period, description, sort_order)
select * from (values
  (
    'Independent study and studio practice',
    'Software engineering, design, and teaching',
    'Ongoing',
    'Continuous practice across application engineering, editorial design, and the teaching of technical subjects.',
    1
  ),
  (
    'Professional training',
    'Selected certifications and short programmes',
    '2018 — 2025',
    'Targeted training in web platforms, design methods, and blockchain fundamentals, recorded as they become relevant to the work.',
    2
  )
) as rows (institution, credential, period, description, sort_order)
where not exists (select 1 from public.education);

insert into public.achievements (title, year, description, sort_order)
select * from (values
  (
    'Independent studio established',
    '2022',
    'Opened a practice covering software, design, and technology education rather than treating them as separate careers.',
    1
  ),
  (
    'Published teaching programmes',
    '2024',
    'Turned workshop material into a reusable curriculum with a public writing series attached.',
    2
  ),
  (
    'Portfolio platform in public build',
    '2026',
    'Began the public, phased build of this editorial portfolio, with content and admin systems introduced in sequence.',
    3
  )
) as rows (title, year, description, sort_order)
where not exists (select 1 from public.achievements);

-- ---------------------------------------------------------------------------
-- Site settings
-- ---------------------------------------------------------------------------

insert into public.site_settings (key, value, is_public) values
  ('contact.to_email', '"hello@example.com"'::jsonb, false),
  ('seo.default_description', '"A multidisciplinary portfolio exploring software engineering, interface design, blockchain, and technology education."'::jsonb, true),
  ('navigation.hidden', '[]'::jsonb, true)
on conflict (key) do nothing;

commit;
