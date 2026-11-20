import { DppDocument } from '../types/dpp';

export const STARTER_DPP: DppDocument = {
  title: 'Daily Practice Problem Sheet — Mechanics & Aromatic Chemistry',
  subtitle: 'Sample Live Preview · Select Class, Board/Exam & Topic to Generate Custom PYQ Sheets',
  isStarterPreview: true,
  metadata: {
    classLevel: '12',
    boardOrExam: 'JEE Advanced',
    tierOrLevel: 'JEE Advanced',
    subject: 'Physics & Chemistry (Preview)',
    chapter: 'Laws of Motion & Hydrocarbons',
    topic: 'Pulley-Wedge Dynamics & Benzene Reactions',
    referenceBooks: ['H.C. Verma', 'Cengage', 'M.S. Chouhan', 'JEE Adv PYQs'],
    medium: 'English',
  },
  questions: [
    {
      id: 'preview-q1',
      number: 1,
      type: 'mcq',
      marks: 4,
      negativeMarks: 1,
      pyqTag: 'HC Verma / JEE Adv Pattern',
      stem: 'A block of mass $m = 2\\text{ kg}$ rests on a smooth inclined plane of angle $\\theta = 30^\\circ$ and is connected by a light inextensible string passing over a massless, frictionless pulley to a hanging mass $M = 3\\text{ kg}$ as shown in the figure. Find the acceleration $a$ of the system (take $g = 10\\text{ m/s}^2$).',
      diagram: {
        kind: 'svg',
        caption: 'Fig 1. Smooth incline ($\\theta = 30^\\circ$) with pulley-block system',
        svgCode: `<svg viewBox="0 0 360 190" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="currentColor" />
    </marker>
  </defs>
  <!-- Ground & Incline -->
  <line x1="30" y1="165" x2="310" y2="165" stroke="currentColor" stroke-width="2" />
  <polygon points="50,165 245,165 245,52" fill="none" stroke="currentColor" stroke-width="2" />
  <!-- Angle arc -->
  <path d="M 92 165 A 42 42 0 0 0 86 144" fill="none" stroke="currentColor" stroke-width="1.5" />
  <text x="98" y="158" font-size="13" font-family="serif" font-style="italic" fill="currentColor">30°</text>
  <!-- Pulley at top -->
  <line x1="245" y1="52" x2="257" y2="40" stroke="currentColor" stroke-width="2" />
  <circle cx="258" cy="40" r="11" fill="none" stroke="currentColor" stroke-width="2" />
  <circle cx="258" cy="40" r="2.5" fill="currentColor" />
  <!-- Block m on incline -->
  <g transform="translate(150, 107) rotate(-30)">
    <rect x="-20" y="-26" width="40" height="26" fill="none" stroke="currentColor" stroke-width="2" />
    <text x="-7" y="-8" font-size="13" font-family="serif" font-style="italic" fill="currentColor">m</text>
  </g>
  <!-- String -->
  <line x1="161" y1="86" x2="251" y2="33" stroke="currentColor" stroke-width="1.6" />
  <line x1="269" y1="40" x2="269" y2="104" stroke="currentColor" stroke-width="1.6" />
  <!-- Hanging block M -->
  <rect x="251" y="104" width="36" height="32" fill="none" stroke="currentColor" stroke-width="2" />
  <text x="263" y="125" font-size="13" font-family="serif" font-style="italic" fill="currentColor">M</text>
  <!-- Acceleration arrow -->
  <line x1="296" y1="104" x2="296" y2="138" stroke="currentColor" stroke-width="1.6" marker-end="url(#arr)" />
  <text x="304" y="125" font-size="13" font-family="serif" font-style="italic" fill="currentColor">a</text>
</svg>`,
      },
      options: [
        { label: 'A', text: '$2\\text{ m/s}^2$' },
        { label: 'B', text: '$4\\text{ m/s}^2$' },
        { label: 'C', text: '$5\\text{ m/s}^2$' },
        { label: 'D', text: '$6\\text{ m/s}^2$' },
      ],
      correctAnswer: 'B',
      solutionSteps: [
        'For block $M = 3\\text{ kg}$ moving downward: $Mg - T = Ma \\implies 30 - T = 3a$.',
        'For block $m = 2\\text{ kg}$ moving up the smooth incline: $T - mg\\sin 30^\\circ = ma \\implies T - 2(10)(0.5) = 2a \\implies T - 10 = 2a$.',
        'Adding both equations eliminates tension $T$: $30 - 10 = (3 + 2)a \\implies 20 = 5a \\implies a = 4\\text{ m/s}^2$.',
      ],
    },
    {
      id: 'preview-q2',
      number: 2,
      type: 'mcq',
      marks: 4,
      negativeMarks: 1,
      pyqTag: 'MS Chouhan / JEE Main PYQ Pattern',
      stem: 'Consider the following two-step aromatic transformation starting from Benzene ($\\ce{C6H6}$). Identify the major product $(P)$ formed at the end of the sequence:',
      diagram: {
        kind: 'chemistry_reaction',
        caption: 'Fig 2. Nitration followed by Friedel-Crafts / Reduction pathway',
        reaction: {
          reactants: ['c1ccccc1'],
          reagentsAbove: '1. Conc. HNO₃ + Conc. H₂SO₄',
          reagentsBelow: '2. Sn / HCl, then Ac₂O',
          products: ['CC(=O)Nc1ccccc1'],
        },
      },
      options: [
        { label: 'A', text: 'Nitrobenzene ($\\ce{C6H5NO2}$)' },
        { label: 'B', text: 'Acetanilide ($\\ce{C6H5NHCOCH3}$)' },
        { label: 'C', text: 'Anilinium chloride ($\\ce{C6H5NH3+Cl-}$)' },
        { label: 'D', text: 'm-Nitroacetophenone' },
      ],
      correctAnswer: 'B',
      solutionSteps: [
        'Step 1: Benzene undergoes electrophilic aromatic nitration with $\\ce{HNO3 + H2SO4}$ via $\\ce{NO2+}$ electrophile to yield Nitrobenzene ($\\ce{C6H5NO2}$).',
        'Step 2: Reduction with $\\ce{Sn/HCl}$ converts the nitro group to Aniline ($\\ce{C6H5NH2}$), which upon acetylation with acetic anhydride ($\\ce{Ac2O}$) yields **Acetanilide** ($\\ce{C6H5NHCOCH3}$).',
      ],
    },
    {
      id: 'preview-q3',
      number: 3,
      type: 'match_following',
      marks: 4,
      negativeMarks: 0,
      pyqTag: 'JEE Adv Matrix Match Pattern',
      stem: 'Match the thermodynamic processes in **Column I** with their characteristic mathematical relations in **Column II**:',
      matchColumns: {
        leftHeader: 'Column I (Process)',
        rightHeader: 'Column II (Relation)',
        leftItems: [
          { key: 'P', text: 'Isothermal Ideal Gas' },
          { key: 'Q', text: 'Adiabatic Reversible' },
          { key: 'R', text: 'Isochoric Heating' },
          { key: 'S', text: 'Free Expansion (Vacuum)' },
        ],
        rightItems: [
          { key: '1', text: '$W = 0, \\Delta U = 0, Q = 0$' },
          { key: '2', text: '$PV^\\gamma = \\text{constant}$' },
          { key: '3', text: '$\\Delta U = nC_V\\Delta T, W = 0$' },
          { key: '4', text: '$W = nRT\\ln(V_2/V_1)$' },
        ],
      },
      correctAnswer: 'P → 4, Q → 2, R → 3, S → 1',
      solutionSteps: [
        'Isothermal reversible expansion of an ideal gas: $\\Delta T = 0 \\implies W = nRT\\ln(V_2/V_1)$ ($P \\to 4$).',
        'Adiabatic reversible process: $Q = 0$ and $PV^\\gamma = \\text{constant}$ ($Q \\to 2$).',
        'Isochoric process: $\\Delta V = 0 \\implies W = 0$, hence $Q = \\Delta U = nC_V\\Delta T$ ($R \\to 3$).',
        'Free expansion against vacuum: $P_{\\text{ext}} = 0 \\implies W = 0$, and for an ideal gas $\\Delta U = 0, Q = 0$ ($S \\to 1$).',
      ],
    },
    {
      id: 'preview-q4',
      number: 4,
      type: 'subjective',
      marks: 5,
      negativeMarks: 0,
      pyqTag: 'Cengage / Board Proof Pattern',
      stem: 'Evaluate the definite integral $I = \\displaystyle\\int_0^{\\pi/2} \\frac{\\sin^3 x}{\\sin^3 x + \\cos^3 x}\\,dx$ using King’s property of definite integration, and verify why $I$ is independent of the exponent $n$ for $\\sin^n x$.',
      correctAnswer: '$I = \\dfrac{\\pi}{4}$',
      solutionSteps: [
        'Let $I = \\int_0^{\\pi/2} \\frac{\\sin^3 x}{\\sin^3 x + \\cos^3 x}\\,dx \\quad \\text{--- (1)}$',
        'Using $\\int_0^a f(x)\\,dx = \\int_0^a f(a - x)\\,dx$, replace $x$ with $\\frac{\\pi}{2} - x$: $I = \\int_0^{\\pi/2} \\frac{\\cos^3 x}{\\cos^3 x + \\sin^3 x}\\,dx \\quad \\text{--- (2)}$',
        'Adding (1) and (2): $2I = \\int_0^{\\pi/2} \\frac{\\sin^3 x + \\cos^3 x}{\\sin^3 x + \\cos^3 x}\\,dx = \\int_0^{\\pi/2} 1\\,dx = \\frac{\\pi}{2}$.',
        'Therefore, $I = \\frac{\\pi}{4}$, and for any real exponent $n$, $\\sin^n(\\pi/2 - x) = \\cos^n x$, yielding the same symmetric sum $2I = \\pi/2$.',
      ],
    },
  ],
};
