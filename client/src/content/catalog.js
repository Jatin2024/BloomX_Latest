/**
 * Structured catalogue of what BloomX offers and what it has built.
 * Copy here is deliberately concrete: no metrics, awards, client counts or
 * testimonials are claimed anywhere, because none have been supplied.
 */

export const services = [
  {
    slug: 'websites',
    title: 'Website Design & Development',
    summary:
      'Responsive marketing and business websites that load fast, read clearly and are straightforward to update.',
    description:
      'We design and build the site your business is judged by — structure, copy layout, visual system and front-end code. Everything is responsive from 360px upward, built with semantic markup, and handed over with a component structure your team can extend instead of fight.',
    deliverables: [
      'Information architecture and page-level wireframes',
      'A visual design system: colour, type, spacing and components',
      'Responsive front-end build with semantic, accessible markup',
      'Performance pass: image sizing, lazy loading, no layout shift',
      'Basic on-page SEO — titles, descriptions, Open Graph, sitemap'
    ],
    stack: ['React', 'Vite', 'HTML & CSS', 'JavaScript'],
    mediaKey: 'codeOnLaptop',
    indexTags: ['Responsive', 'Design system', 'SEO-ready']
  },
  {
    slug: 'web-apps',
    title: 'Custom Web Applications',
    summary:
      'React applications for the work your business actually does — dashboards, portals, admin tools and internal systems.',
    description:
      'When a spreadsheet or an off-the-shelf tool stops fitting, we build the application around your process instead of the other way round. Roles and permissions, data tables that stay usable at volume, forms that validate properly, and an admin view that makes the system easy to run day to day.',
    deliverables: [
      'Interface design for the screens your team uses most',
      'Component library and shared state structure',
      'Authentication, roles and permission handling',
      'Data tables, filtering, search and exports',
      'Admin views and reporting screens'
    ],
    stack: ['React', 'Angular', 'Node.js', 'MongoDB'],
    mediaKey: 'dashboardScreen',
    indexTags: ['Dashboards', 'Portals', 'Role-based access']
  },
  {
    slug: 'full-stack',
    title: 'Full-Stack Development',
    summary:
      'One team for interface, server and database, so there is no gap between what was designed and what ships.',
    description:
      'We take features end to end: the screen, the endpoint behind it, the data model underneath, and the tests around the parts that matter. Working this way keeps scope honest — we can tell you early when something is expensive, and why.',
    deliverables: [
      'Data modelling and schema design',
      'REST endpoints with validation and error handling',
      'File upload, storage and document handling',
      'Server-side rate limiting and input sanitisation',
      'Environment configuration kept out of the codebase'
    ],
    stack: ['Node.js', 'Express', '.NET', 'MongoDB'],
    mediaKey: 'codeDetail',
    indexTags: ['Frontend + backend', 'Data modelling', 'Secure by default']
  },
  {
    slug: 'apis',
    title: 'API Development & Integrations',
    summary:
      'Clean APIs for your own product, and reliable connections to the payment, email and CRM tools you already use.',
    description:
      'Most systems fail at the seams. We build and document APIs that other teams can consume without guesswork, and we integrate third-party services with retries, sensible timeouts and failure states that surface in the interface rather than disappearing into a log file.',
    deliverables: [
      'REST API design and documentation',
      'Payment gateway integration (Stripe, Razorpay)',
      'Transactional email, storage and notification services',
      'Webhook handling with retry and idempotency',
      'Authentication tokens and API key management'
    ],
    stack: ['Express', 'REST', 'JWT', 'Webhooks'],
    mediaKey: 'devtools',
    indexTags: ['REST', 'Payments', 'Third-party services']
  },
  {
    slug: 'cloud',
    title: 'Deployment & Cloud Infrastructure',
    summary:
      'Getting the build onto real infrastructure, with a deployment path your team can repeat without us.',
    description:
      'We set up hosting, domains, certificates and environment configuration, then wire a deployment pipeline so shipping a change is a push rather than an event. Where it helps, we add uptime checks and log access so problems are visible before a customer reports them.',
    deliverables: [
      'Hosting, DNS, SSL and environment setup',
      'CI/CD pipelines for automated build and deploy',
      'Staging and production environment separation',
      'Log access, uptime checks and alerting',
      'Handover documentation for your team'
    ],
    stack: ['AWS', 'Azure', 'GCP', 'CI/CD'],
    mediaKey: 'serverRoom',
    indexTags: ['CI/CD', 'Hosting', 'Monitoring']
  },
  {
    slug: 'support',
    title: 'Website Maintenance & Support',
    summary:
      'Ongoing care for a site or application that is already live — fixes, updates, improvements and dependency hygiene.',
    description:
      'Software decays if nobody tends it. We pick up existing projects, fix what is broken, keep dependencies current, and work through a prioritised list of improvements at a pace that suits your budget rather than a retainer you cannot justify.',
    deliverables: [
      'Bug fixes and content or layout updates',
      'Dependency and security patch updates',
      'Performance and accessibility improvements',
      'New sections, pages and features as you need them',
      'Takeover of projects started elsewhere'
    ],
    stack: ['Audits', 'Patching', 'Refactoring'],
    mediaKey: 'typingHands',
    indexTags: ['Fixes', 'Updates', 'Takeovers']
  }
];

export function getService(slug) {
  return services.find((service) => service.slug === slug);
}

/**
 * Platforms designed and built by BloomX. Described by scope and technology
 * only — no client names, outcomes or performance figures are claimed.
 */
export const projects = [
  {
    slug: 'laser-art-store',
    name: 'Laser Art Store',
    kind: 'E-commerce platform',
    summary:
      'A multi-vendor storefront for personalised gifting and laser engraving: catalogue and filtering, wishlist, cart and checkout, order tracking, reviews and coupons, with an admin side for inventory, orders and analytics.',
    scope: ['Storefront UX', 'Checkout & payments', 'Vendor and admin tooling'],
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Stripe', 'Razorpay', 'Cloudinary'],
    mediaKey: 'retailCheckout',
    // `nature` labels where a project came from. Left deliberately neutral
    // here — switch to 'Client project' once that is confirmed.
    nature: 'Platform build'
  },
  {
    slug: 'bloomhr',
    name: 'BloomHR',
    kind: 'HR management system',
    summary:
      'An HRMS covering the operational side of a workforce — attendance and leave, payroll runs, departments, roles and permissions, reporting and notifications — with separate employee, HR and admin experiences.',
    scope: ['Role-based access', 'Attendance & payroll', 'Reporting dashboards'],
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Charting'],
    mediaKey: 'officeTeam',
    nature: 'BloomX product'
  },
  {
    slug: 'bloombookings',
    name: 'BloomBookings',
    kind: 'Appointment management SaaS',
    summary:
      'A booking platform built to work across clinics, salons, gyms and independent consultants: calendar and slot management, services and staff, payments, reminders, and per-branch revenue reporting.',
    scope: ['Multi-tenant scheduling', 'Payments & reminders', 'Branch analytics'],
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Payments'],
    mediaKey: 'scheduleScreen',
    nature: 'BloomX product'
  }
];

export const processSteps = [
  {
    title: 'Understand the business',
    text: 'A short discovery conversation about what the business does, who it serves, and what the site or system has to achieve.'
  },
  {
    title: 'Plan the experience',
    text: 'Structure, page flow and scope agreed in writing before any visual work starts — so nothing is a surprise later.'
  },
  {
    title: 'Design and develop',
    text: 'Design and build run together in short cycles. You see working screens, not static mockups, as they come together.'
  },
  {
    title: 'Test and launch',
    text: 'Cross-device checks, form and integration testing, accessibility and performance passes, then deployment to your infrastructure.'
  },
  {
    title: 'Improve and maintain',
    text: 'Post-launch fixes, dependency updates and the next round of improvements, at whatever cadence suits you.'
  }
];

export const whyPoints = [
  {
    title: 'Built around your business, not a template',
    text: 'Scope starts from how your business actually operates. You get the features that earn their place, and a clear reason for each one.'
  },
  {
    title: 'Front-end code your next developer can read',
    text: 'A single design system, shared components and consistent naming. Whoever picks the project up next — us or someone else — can work in it.'
  },
  {
    title: 'Responsive from 360px upward',
    text: 'Layouts are recomposed for small screens rather than shrunk. Tap targets, forms and navigation are tested on real device widths.'
  },
  {
    title: 'Accessibility and performance are part of the build',
    text: 'Semantic markup, keyboard support, visible focus, reduced-motion handling, sized images and lazy loading — not a retrofit at the end.'
  },
  {
    title: 'Direct, written communication',
    text: 'You talk to the people doing the work. Scope, timeline and progress are written down, and we flag problems while they are still cheap.'
  },
  {
    title: 'We stay available after launch',
    text: 'Deployment is not the handover cliff. Maintenance, fixes and new features continue on the same terms, with no minimum retainer.'
  }
];

export const technologyGroups = [
  { label: 'Frontend', items: ['React.js', 'Angular', 'JavaScript', 'HTML', 'CSS'] },
  { label: 'Backend', items: ['Node.js', 'Express.js', '.NET'] },
  { label: 'Data', items: ['MongoDB', 'REST APIs'] },
  { label: 'Cloud & delivery', items: ['AWS', 'Azure', 'GCP', 'CI/CD'] }
];

export const industries = [
  'Healthcare',
  'Education',
  'Finance',
  'SaaS',
  'Real Estate',
  'Logistics',
  'Manufacturing',
  'Hospitality',
  'Retail',
  'Startups'
];

export const jobOpenings = [
  {
    title: 'Frontend Developer',
    description:
      'Build React and Angular interfaces against a shared design system, with real ownership of the screens you ship.'
  },
  {
    title: 'Backend Engineer',
    description:
      'Design and build Node.js and .NET APIs — data modelling, validation, authentication and the integrations around them.'
  },
  {
    title: 'Cloud Specialist',
    description:
      'Set up and maintain deployment pipelines and infrastructure across AWS, Azure and GCP for client and in-house systems.'
  }
];
