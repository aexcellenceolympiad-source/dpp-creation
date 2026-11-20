import { ClassLevel, DppStyleConfig, JuniorBoard, JuniorTier, QuestionType, SeniorExam } from '../types/dpp';

export const CLASS_LEVELS: { value: ClassLevel; label: string; group: 'junior' | 'senior' }[] = [
  { value: '7', label: 'Class 7', group: 'junior' },
  { value: '8', label: 'Class 8', group: 'junior' },
  { value: '9', label: 'Class 9', group: 'junior' },
  { value: '10', label: 'Class 10', group: 'junior' },
  { value: '11', label: 'Class 11', group: 'senior' },
  { value: '12', label: 'Class 12', group: 'senior' },
];

export const JUNIOR_BOARDS: { value: JuniorBoard; label: string }[] = [
  { value: 'CBSE', label: 'CBSE (NCERT)' },
  { value: 'JAC', label: 'JAC (Jharkhand Board)' },
  { value: 'ICSE', label: 'ICSE (CISCE)' },
];

export const JUNIOR_TIERS: { value: JuniorTier; label: string }[] = [
  { value: 'School Level', label: 'School / Board Level' },
  { value: 'Olympiad Level', label: 'Olympiad Level (IOQM / NSEJS / SOF)' },
];

export const SENIOR_EXAMS: { value: SeniorExam; label: string }[] = [
  { value: 'Board Exams', label: 'Board Exams (CBSE / JAC / ISC)' },
  { value: 'JEE Mains', label: 'JEE Main (NTA Pattern)' },
  { value: 'NEET', label: 'NEET (UG) Medical' },
  { value: 'JEE Advanced', label: 'JEE Advanced (IIT)' },
];

export const JUNIOR_SUBJECTS = [
  'Physics',
  'Chemistry',
  'Biology',
  'Science (Combined)',
  'Mathematics',
  'History',
  'Civics',
  'Geography',
  'Social Science (Combined)',
  'Hindi',
  'English',
  'Sanskrit',
  'Computer Science',
];

export const SENIOR_SUBJECTS = ['Physics', 'Chemistry', 'Mathematics', 'Biology'];

export const QUESTION_TYPE_OPTIONS: { value: QuestionType; label: string; short: string }[] = [
  { value: 'mcq', label: 'MCQ (Single Correct)', short: 'MCQ' },
  { value: 'multiple_correct', label: 'Multiple Correct (1 or More)', short: 'Multi-MCQ' },
  { value: 'assertion_reason', label: 'Assertion & Reason', short: 'A & R' },
  { value: 'true_false', label: 'True / False', short: 'T / F' },
  { value: 'fill_blank', label: 'Fill in the Blanks', short: 'Fill Blanks' },
  { value: 'match_following', label: 'Match the Following (Column I & II)', short: 'Matching' },
  { value: 'subjective', label: 'Subjective / Numerical Proof', short: 'Subjective' },
];

export const REFERENCE_BOOKS_BY_PROFILE: Record<string, string[]> = {
  'JEE Advanced': [
    'H.C. Verma (Concepts of Physics)',
    'Cengage Series (Physics / Maths)',
    'Vikas Gupta (Black Book) & Sameer Bansal',
    'Irodov / Pathfinder',
    'MS Chouhan (Organic) & N. Awasthi',
    'A. Das Gupta / S.L. Loney / Hall & Knight',
  ],
  'JEE Mains': [
    'H.C. Verma',
    'Cengage JEE Main (G. Tewani / BM Sharma)',
    'Arihant PYQ Archive & Skills in Maths',
    'NCERT + Exemplar',
    'MS Chouhan (Elementary) & N. Awasthi',
  ],
  NEET: [
    'NCERT Line-by-Line',
    'NCERT Exemplar',
    'MTG NCERT at Your Fingertips',
    'DC Pandey NEET',
    'Errorless / Arihant NEET PYQs',
  ],
  'Board Exams': [
    'NCERT Textbook',
    'NCERT Exemplar',
    'RD Sharma / SL Arora / ML Aggarwal',
    'JAC Model Question Bank',
    'Oswaal / Arihant Board PYQs',
  ],
  'Olympiad Level': [
    'IOQM / PRMO / RMO Archives',
    'NSEJS / IJSO Past Papers',
    'Pathfinder Olympiad (Maths / Physics)',
    'Hall & Knight / S.L. Loney / Challenges',
    'Pearson IIT Foundation',
  ],
  'School Level': [
    'NCERT / JCERT Textbook',
    'Selina Concise (ICSE)',
    'RD Sharma / RS Aggarwal / ML Aggarwal',
    'Lakhmir Singh & Manjit Kaur',
    'JAC / CBSE Sample Papers',
  ],
};

const SUBJECT_BOOKS: Record<string, Record<string, string[]>> = {
  Mathematics: {
    'JEE Advanced': [
      'Vikas Gupta & Pankaj Joshi (Black Book)',
      'Sameer Bansal (Calculus)',
      'G. Tewani — Cengage Mathematics',
      'A. Das Gupta (IIT Mathematics)',
      'S.L. Loney (Trigonometry & Coordinate)',
      'Hall & Knight (Higher Algebra)',
      'I.A. Maron (Problems in Calculus)',
      'Arihant Skills in Maths (Amit M. Agarwal / S.K. Goyal)',
    ],
    'JEE Mains': [
      'G. Tewani — Cengage JEE Main Maths',
      'Arihant Skills in Mathematics (SK Goyal / Amit Agarwal)',
      'RD Sharma Objective Mathematics',
      'NTA JEE Main Maths PYQ Archive',
      'NCERT + NCERT Exemplar',
    ],
    'Board Exams': [
      'NCERT Mathematics + Exemplar',
      'R.D. Sharma (CBSE / JAC)',
      'M.L. Aggarwal (ISC / ICSE)',
      'JAC Model Question Bank',
      'Arihant / Oswaal Maths PYQs',
    ],
    'Olympiad Level': [
      'IOQM / PRMO / RMO Past Archives',
      'Pathfinder for Olympiad Mathematics',
      'Challenge & Thrill of Pre-College Mathematics',
      'Hall & Knight (Higher Algebra)',
      'S.L. Loney (Plane Trigonometry & Coordinate)',
      'Pearson IIT Foundation Mathematics',
    ],
    'School Level': [
      'NCERT / JCERT Mathematics',
      'R.D. Sharma / R.S. Aggarwal',
      'M.L. Aggarwal / Selina Concise (ICSE)',
      'NCERT Exemplar Mathematics',
      'JAC / CBSE Sample Papers',
    ],
  },
  Physics: {
    'JEE Advanced': [
      'H.C. Verma (Concepts of Physics Vol 1 & 2)',
      'B.M. Sharma — Cengage Physics',
      'I.E. Irodov (General Physics)',
      'Pathfinder for Olympiad & JEE Adv Physics',
      'D.C. Pandey (Arihant Series)',
      'Krotov / Anurag Mishra',
    ],
    'JEE Mains': [
      'H.C. Verma (Concepts of Physics)',
      'D.C. Pandey JEE Main Physics',
      'Cengage JEE Main Physics',
      'NCERT + NCERT Exemplar',
      'NTA JEE Main PYQ Archive',
    ],
    NEET: [
      'NCERT Physics Line-by-Line + Exemplar',
      'D.C. Pandey NEET Objective Physics',
      'MTG NCERT at Your Fingertips Physics',
      'Errorless / Arihant NEET PYQs',
    ],
  },
  Chemistry: {
    'JEE Advanced': [
      'M.S. Chouhan (Advanced Organic Chemistry)',
      'N. Awasthi (Physical Chemistry)',
      'V.K. Jaiswal (Inorganic Chemistry)',
      'Peter Sykes / Paula Bruice (Mechanisms)',
      'Cengage Chemistry (K.S. Verma)',
      'J.D. Lee (Sudarsan Guha Inorganic)',
    ],
    'JEE Mains': [
      'NCERT Chemistry Line-by-Line + Exemplar',
      'M.S. Chouhan (Elementary Organic)',
      'N. Awasthi (Physical Chemistry Level 1)',
      'V.K. Jaiswal / NCERT Inorganic PYQs',
      'Arihant JEE Main Chemistry PYQs',
    ],
    NEET: [
      'NCERT Chemistry Line-by-Line',
      'M.S. Chouhan NEET Organic',
      'N. Awasthi NEET Physical Chemistry',
      'MTG NCERT at Your Fingertips Chemistry',
    ],
  },
  Biology: {
    NEET: [
      'NCERT Biology Line-by-Line (Class 11 & 12)',
      'NCERT Exemplar Biology',
      'MTG NCERT at Your Fingertips Biology',
      'Dr. Ali Objective Biology',
      'Arihant / Disha NEET 37 Years PYQs',
    ],
  },
};

export function getRecommendedBooks(profileKey: string, subject: string): string[] {
  const bySubject = SUBJECT_BOOKS[subject]?.[profileKey];
  if (bySubject && bySubject.length > 0) {
    return bySubject;
  }
  return REFERENCE_BOOKS_BY_PROFILE[profileKey] || [];
}

export interface ChapterEntry {
  chapter: string;
  topics: string[];
}

const CHAPTER_CATALOG: Record<string, Record<string, ChapterEntry[]>> = {
  // Classes 7–10
  junior: {
    Physics: [
      { chapter: 'Motion & Force (Laws of Motion)', topics: ['Distance, Displacement & Speed-Time Graphs', 'Equations of Uniformly Accelerated Motion', 'Newton’s Laws & Momentum Conservation', 'Free Body Diagrams & Friction'] },
      { chapter: 'Gravitation & Floatation', topics: ['Universal Law of Gravitation', 'Acceleration due to Gravity & Mass/Weight', 'Archimedes Principle & Buoyancy'] },
      { chapter: 'Work, Energy & Power', topics: ['Work Done by Variable/Constant Force', 'Kinetic & Potential Energy Conservation', 'Commercial Unit of Energy & Power'] },
      { chapter: 'Light — Reflection & Refraction', topics: ['Spherical Mirrors & Ray Diagrams', 'Mirror Formula & Magnification', 'Refraction through Prism & Lenses', 'Human Eye & Defects of Vision'] },
      { chapter: 'Electricity & Magnetic Effects', topics: ['Ohm’s Law & Combination of Resistors', 'Heating Effect & Electrical Power', 'Magnetic Field Lines & Fleming’s Rules', 'Electromagnetic Induction'] },
      { chapter: 'Heat & Sound', topics: ['Conduction, Convection & Radiation', 'Specific Heat & Latent Heat (ICSE)', 'Echoes, Frequency & Wave Speed'] },
    ],
    Chemistry: [
      { chapter: 'Matter, Atoms & Molecules', topics: ['Laws of Chemical Combination', 'Mole Concept & Molecular Mass', 'Atomic Structure (Bohr Model & Isotopes)'] },
      { chapter: 'Chemical Reactions & Equations', topics: ['Balancing Chemical Equations', 'Combination, Decomposition & Displacement', 'Oxidation, Reduction & Corrosion'] },
      { chapter: 'Acids, Bases & Salts', topics: ['pH Scale & Indicators', 'Properties of Acids & Bases', 'Baking Soda, Washing Soda, POP & Bleaching Powder'] },
      { chapter: 'Metals & Non-Metals', topics: ['Reactivity Series & Ionic Bonding', 'Metallurgy & Extraction of Metals', 'Alloys & Corrosion Prevention'] },
      { chapter: 'Carbon & Its Compounds', topics: ['Covalent Bonding & Allotropes of Carbon', 'IUPAC Nomenclature & Homologous Series', 'Ethanol, Ethanoic Acid & Saponification'] },
      { chapter: 'Periodic Classification & Mole Concept (ICSE)', topics: ['Modern Periodic Trends', 'Stoichiometry & Empirical Formula', 'Electrolysis & Study of Compounds (HCl, NH3, HNO3, H2SO4)'] },
    ],
    Biology: [
      { chapter: 'Cell — Structure & Functions', topics: ['Prokaryotic vs Eukaryotic Cell', 'Cell Organelles (Mitochondria, Plastids, Golgi)', 'Mitosis & Meiosis Cell Division'] },
      { chapter: 'Tissues & Diversity in Living Organisms', topics: ['Plant Tissues (Meristematic & Permanent)', 'Animal Tissues (Epithelial, Connective, Muscular, Nervous)', 'Five Kingdom Classification'] },
      { chapter: 'Life Processes', topics: ['Autotrophic & Heterotrophic Nutrition', 'Aerobic & Anaerobic Respiration', 'Human Circulatory System & Heart', 'Excretion & Nephron Structure'] },
      { chapter: 'Control, Coordination & Reproduction', topics: ['Human Brain & Reflex Arc', 'Plant Hormones (Auxin, Gibberellin)', 'Asexual & Sexual Reproduction in Plants & Humans'] },
      { chapter: 'Heredity, Evolution & Environment', topics: ['Mendel’s Monohybrid & Dihybrid Cross', 'Sex Determination & Evolution', 'Ecosystem, Food Chains & Ozone Depletion'] },
    ],
    'Science (Combined)': [
      { chapter: 'Chemical Reactions, Acids, Bases & Carbon', topics: ['Types of Chemical Reactions', 'pH Scale & Salts', 'Carbon & Functional Groups'] },
      { chapter: 'Light, Electricity & Magnetism', topics: ['Ray Diagrams for Mirrors & Lenses', 'Series & Parallel Circuits', 'Solenoid & Electromagnetic Induction'] },
      { chapter: 'Life Processes, Control & Heredity', topics: ['Photosynthesis & Human Digestion', 'Nervous System & Hormones', 'Mendelian Genetics & Ecosystems'] },
      { chapter: 'Force, Motion, Gravitation & Sound', topics: ['Equations of Motion & Graphs', 'Newton’s Laws of Motion', 'Buoyancy & Sound Waves'] },
    ],
    Mathematics: [
      { chapter: 'Number Systems & Polynomials', topics: ['Rational, Irrational Numbers & Surds', 'Remainder & Factor Theorem', 'Algebraic Identities & Factorization'] },
      { chapter: 'Linear & Quadratic Equations', topics: ['Pair of Linear Equations in Two Variables', 'Quadratic Formula & Nature of Roots', 'Word Problems on Speed, Age & Fractions'] },
      { chapter: 'Arithmetic Progressions', topics: ['nth Term of an AP', 'Sum of n Terms of an AP', 'Olympiad & Word Problems on Series'] },
      { chapter: 'Triangles, Circles & Coordinate Geometry', topics: ['Congruence & Similarity (Thales/BPT, Pythagoras)', 'Circle Theorems, Tangents & Cyclic Quadrilaterals', 'Distance, Section Formula & Area of Triangle'] },
      { chapter: 'Trigonometry & Heights/Distances', topics: ['Trigonometric Ratios & Standard Angles', 'Trigonometric Identities', 'Angles of Elevation & Depression'] },
      { chapter: 'Mensuration, Statistics & Probability', topics: ['Surface Area & Volume of Cones, Spheres, Frustum', 'Mean, Median, Mode (Grouped Data)', 'Classical Probability & Dice/Cards Problems'] },
    ],
    History: [
      { chapter: 'Medieval India & Delhi Sultanate / Mughals', topics: ['Delhi Sultanate Administration', 'Mughal Empire, Akbar & Cultural Synthesis', 'Bhakti & Sufi Movements'] },
      { chapter: 'Colonialism, Revolt of 1857 & Jharkhand Movements', topics: ['British Land Revenue Systems', 'Revolt of 1857 & Birsa Munda Ulgulan (JAC)', 'Santhal Hul & Tribal Resistance'] },
      { chapter: 'Indian National Movement (1885–1947)', topics: ['Partition of Bengal & Swadeshi', 'Gandhian Era: Non-Cooperation, Civil Disobedience & Quit India', 'Subhas Chandra Bose, INA & Independence'] },
      { chapter: 'Rise of Nationalism in Europe & World Wars (ICSE/CBSE)', topics: ['French Revolution & Unification of Italy/Germany', 'First & Second World Wars', 'United Nations & Non-Aligned Movement'] },
    ],
    Civics: [
      { chapter: 'Indian Constitution & Fundamental Rights', topics: ['Making of the Constitution & Preamble', 'Fundamental Rights & Duties', 'Secularism & Directive Principles'] },
      { chapter: 'Parliament, Executive & Judiciary', topics: ['Lok Sabha, Rajya Sabha & Law Making', 'President, Prime Minister & Council of Ministers', 'Supreme Court, High Courts & Judicial Review'] },
      { chapter: 'Federalism, Democracy & Political Parties', topics: ['Centre-State Relations & Panchayati Raj', 'Role of Political Parties & Elections', 'Outcomes & Challenges of Democracy'] },
    ],
    Geography: [
      { chapter: 'Resources, Land, Soil & Water', topics: ['Classification of Resources & Conservation', 'Soil Types of India & Erosion Control', 'Multipurpose River Valley Projects'] },
      { chapter: 'Minerals, Energy & Jharkhand Industries', topics: ['Iron Ore, Coal & Mica Belts of Jharkhand (Chotanagpur)', 'Conventional & Non-Conventional Energy', 'Iron & Steel Industries (TISCO / Bokaro)'] },
      { chapter: 'Climate, Natural Vegetation & Drainage', topics: ['Indian Monsoon Mechanism', 'Himalayan vs Peninsular Rivers', 'Tropical Forests & Wildlife Conservation'] },
    ],
    'Social Science (Combined)': [
      { chapter: 'Nationalism in India & Europe', topics: ['Gandhian Movements & Simon Commission', 'French Revolution & Unification', 'Jharkhand Tribal Movements'] },
      { chapter: 'Resources, Agriculture & Minerals', topics: ['Types of Farming & Cropping Seasons', 'Mineral Belts of Jharkhand & India', 'Manufacturing Industries'] },
      { chapter: 'Power Sharing, Federalism & Economy', topics: ['Federal Structure & Local Government', 'Sectors of Indian Economy', 'Money, Credit & Globalization'] },
    ],
    Hindi: [
      { chapter: 'हिन्दी व्याकरण (Hindi Grammar)', topics: ['संधि, समास एवं उपसर्ग-प्रत्यय', 'वाक्य भेद (रचना और अर्थ के आधार पर)', 'रस, छंद एवं अलंकार', 'पद परिचय एवं वाच्य'] },
      { chapter: 'गद्य एवं पद्य खंड (क्षितिज / कृतिका / वसंत)', topics: ['कबीर की साखियाँ एवं पद', 'तुलसीदास: राम-लक्ष्मण-परशुराम संवाद', 'प्रेमचंद: दो बैलों की कथा / ईदगाह', 'अपठित गद्यांश एवं पत्र-लेखन'] },
    ],
    English: [
      { chapter: 'English Grammar & Applied Usage', topics: ['Tenses, Modals & Subject-Verb Concord', 'Active-Passive Voice & Reported Speech', 'Clauses, Determiners & Prepositions'] },
      { chapter: 'Reading Comprehension & Writing Skills', topics: ['Unseen Discursive & Case-Based Passages', 'Formal Letter, Analytical Paragraph & Notice', 'Transformation of Sentences (ICSE Grammar)'] },
      { chapter: 'Literature & Poetry Analysis', topics: ['Prose Extract-Based Questions', 'Poetic Devices & Central Themes', 'Character Sketches & Long Answer Questions'] },
    ],
    Sanskrit: [
      { chapter: 'संस्कृत व्याकरणम्', topics: ['सन्धिः (स्वर, व्यञ्जन, विसर्ग)', 'समासः (तत्पुरुष, द्वन्द्व, बहुव्रीहि, अव्ययीभाव)', 'लकार एवं धातु रूप', 'प्रत्ययाः (क्त्वा, तुमुन्, ल्यप्, शतृ)'] },
      { chapter: 'शेमुषी / रुचिरा (गद्य-पद्य)', topics: ['श्लोक अन्वयः एवं भावार्थः', 'प्रश्ननिर्माणम् एवं घटनाक्रमः', 'अपठित गद्यांशः'] },
    ],
    'Computer Science': [
      { chapter: 'Programming in Python / Java (ICSE BlueJ)', topics: ['Loops, Conditionals & Functions', 'Arrays, Strings & Searching/Sorting', 'OOP Concepts: Classes, Objects & Constructors'] },
      { chapter: 'Data, SQL & Networking', topics: ['Number Systems (Binary, Octal, Hexadecimal)', 'SQL Queries (SELECT, WHERE, GROUP BY)', 'Cyber Security, Protocols & HTML/CSS'] },
    ],
  },

  // Classes 11–12
  senior: {
    Physics: [
      { chapter: 'Kinematics & Vectors', topics: ['Relative Motion (River-Boat & Rain-Man)', 'Projectile Motion on Horizontal & Inclined Plane', 'Motion Graphs (v-t, a-t, x-t Calculus)'] },
      { chapter: 'Laws of Motion & Friction', topics: ['Constraint Relations & Wedge-Pulley Systems', 'Static & Kinetic Friction on Inclined Planes', 'Pseudo Force & Circular Banking'] },
      { chapter: 'Work, Energy, Power & Rotational Dynamics', topics: ['Work-Energy Theorem & Variable Force', 'Center of Mass & Elastic/Inelastic Collisions', 'Moment of Inertia, Torque & Rolling Motion', 'Angular Momentum Conservation'] },
      { chapter: 'Gravitation, Fluids & Thermodynamics', topics: ['Kepler’s Laws, Escape Velocity & Orbital Motion', 'Bernoulli’s Principle, Viscosity & Surface Tension', 'First Law of Thermodynamics & Carnot Cycle', 'Kinetic Theory of Gases & Degrees of Freedom'] },
      { chapter: 'SHM & Waves', topics: ['Spring-Block & Pendulum SHM Systems', 'Superposition, Standing Waves & Organ Pipes', 'Doppler Effect & Beats'] },
      { chapter: 'Electrostatics & Capacitance', topics: ['Gauss’s Law & Electric Field Calculations', 'Electric Potential, Dipole & Equipotential Surfaces', 'Capacitor Networks with Dielectrics'] },
      { chapter: 'Current Electricity & Circuits', topics: ['Kirchhoff’s Laws, Wheatstone Bridge & Symmetry', 'RC Circuits (Charging & Discharging)', 'Potentiometer, Meter Bridge & Galvanometer'] },
      { chapter: 'Magnetism, EMI & Alternating Current', topics: ['Biot-Savart Law & Ampere’s Circuital Law', 'Lorentz Force & Motion of Charge in B-Field', 'Faraday’s Law, Motional EMF & Self-Inductance', 'LCR Resonance, Power Factor & Transformers'] },
      { chapter: 'Ray & Wave Optics', topics: ['Combination of Lenses, Mirrors & Silvered Lens', 'Prism Minimum Deviation & Dispersion', 'Young’s Double Slit Experiment (YDSE) & Interference'] },
      { chapter: 'Modern Physics & Semiconductors', topics: ['Photoelectric Effect & de Broglie Wavelength', 'Bohr Model, X-Rays & Nuclear Radioactivity', 'PN Junction, Zener Diode & Logic Gates'] },
    ],
    Chemistry: [
      { chapter: 'Mole Concept & Atomic Structure', topics: ['Stoichiometry, Limiting Reagent & Eudiometry', 'Bohr’s Model, Hydrogen Spectrum & Quantum Numbers', 'de Broglie & Heisenberg Uncertainty'] },
      { chapter: 'Chemical Bonding & Molecular Structure', topics: ['VSEPR Theory, Hybridization & Dipole Moment', 'Molecular Orbital Theory (MOT) & Bond Order', 'Hydrogen Bonding & Fajan’s Rules'] },
      { chapter: 'Thermodynamics, Equilibrium & Solutions', topics: ['Enthalpy, Entropy & Gibbs Free Energy', 'Le Chatelier’s Principle, Kp/Kc & Buffer Solutions', 'Solubility Product (Ksp) & Common Ion Effect', 'Raoult’s Law & Colligative Properties (van’t Hoff)'] },
      { chapter: 'Electrochemistry & Chemical Kinetics', topics: ['Nernst Equation, Cell EMF & Conductance', 'Faraday’s Laws of Electrolysis', 'First & Zero Order Kinetics, Arrhenius Equation'] },
      { chapter: 'General Organic Chemistry (GOC) & Isomerism', topics: ['Inductive, Resonance, Hyperconjugation & Aromaticity', 'Acidic & Basic Strength of Organic Compounds', 'Geometrical & Optical Isomerism (R/S, E/Z, Chiral Centers)', 'Carbocation Stability & Rearrangement'] },
      { chapter: 'Hydrocarbons & Aromatic Benzene Chemistry', topics: ['Alkanes Free Radical Halogenation', 'Alkenes Electrophilic Addition, Ozonolysis & Hydroboration', 'Electrophilic Aromatic Substitution on Benzene (Nitration, Friedel-Crafts, Directing Effects)'] },
      { chapter: 'Haloalkanes, Alcohols, Phenols & Ethers', topics: ['SN1, SN2, E1 & E2 Mechanisms with Stereochemistry', 'Reimer-Tiemann, Kolbe’s & Williamson Ether Synthesis', 'Grignard Reagent Reactions'] },
      { chapter: 'Aldehydes, Ketones, Carboxylic Acids & Amines', topics: ['Aldol Condensation, Cannizzaro & Haloform Reactions', 'Nucleophilic Addition & Reduction (Clemmensen/Wolff-Kishner)', 'Diazonium Salts, Hoffmann Bromamide & Coupling Reactions'] },
      { chapter: 'Coordination Compounds & Block Elements', topics: ['Werner’s Theory, IUPAC Naming & Isomerism', 'Crystal Field Theory (CFT), Colour & Magnetic Moment', 'd & f-Block Trends, KMnO4 & K2Cr2O7'] },
    ],
    Mathematics: [
      { chapter: 'Complex Numbers & Quadratic Equations', topics: ['Argand Plane, Rotation Theorem & Cube Roots of Unity', 'Location of Roots & Common Roots', 'Modulus, Argument & Triangle Inequality'] },
      { chapter: 'Sequences, Series, P&C & Binomial Theorem', topics: ['AGP, Telescoping Series & AM-GM Inequality', 'Circular Permutations, Multinomial & Dearrangement', 'General Term, Middle Term & Remainder via Binomial'] },
      { chapter: 'Matrices, Determinants & Probability', topics: ['Adjoint, Inverse & System of Linear Equations', 'Properties of Determinants', 'Conditional Probability, Bayes’ Theorem & Distributions'] },
      { chapter: 'Straight Lines, Circles & Conic Sections', topics: ['Family of Lines, Angle Bisectors & Locus', 'Tangents, Normals & Radical Axis of Circles', 'Parabola, Ellipse & Hyperbola (Focal Chord & Tangents)'] },
      { chapter: 'Functions, Limits, Continuity & Differentiability', topics: ['Domain, Range, Inverse & Functional Equations', 'L’Hôpital, Sandwich Theorem & Expansion Limits', 'Differentiability at Corner/Piecewise Points'] },
      { chapter: 'Application of Derivatives', topics: ['Tangents, Normals & Monotonicity', 'Maxima, Minima & Rolle’s / LMVT Theorem'] },
      { chapter: 'Indefinite & Definite Integration', topics: ['Integration by Parts & Substitution Forms', 'King’s Property, Walli’s & Newton-Leibniz Rule', 'Area Bounded by Curves'] },
      { chapter: 'Differential Equations, Vectors & 3D Geometry', topics: ['Linear & Homogeneous Differential Equations', 'Scalar/Vector Triple Product', 'Skew Lines, Shortest Distance & Plane Intersections'] },
    ],
    Biology: [
      { chapter: 'Cell Biology, Biomolecules & Cell Division', topics: ['Prokaryotic vs Eukaryotic Organelles', 'Enzymes, Proteins & Nucleic Acids', 'Mitosis & Meiosis I/II Stages & Crossing Over'] },
      { chapter: 'Plant Physiology', topics: ['C3, C4 Cycles & Photorespiration', 'Glycolysis, Krebs Cycle & ETS (ATP Yield)', 'Plant Growth Regulators (Auxin, GA, ABA, Ethylene)'] },
      { chapter: 'Human Physiology', topics: ['Breathing Volumes, Oxygen Dissociation Curve (Bohr Effect)', 'Cardiac Cycle, ECG & Double Circulation', 'Counter-Current Mechanism in Nephron', 'Action Potential, Synapse & Endocrine Hormones'] },
      { chapter: 'Reproduction in Plants & Humans', topics: ['Microsporogenesis, Megasporogenesis & Double Fertilization', 'Gametogenesis, Menstrual Cycle & Embryonic Development'] },
      { chapter: 'Genetics, Molecular Basis & Biotechnology', topics: ['Mendelian Deviations, Linkage & Pedigree Analysis', 'DNA Replication, Transcription, Lac Operon & Genetic Code', 'PCR, Restriction Enzymes, pBR322 & Bt Crops'] },
      { chapter: 'Ecology, Evolution & Human Health', topics: ['Hardy-Weinberg Equilibrium & Natural Selection', 'Population Interactions, Ecological Pyramids & Biodiversity', 'Immunity, Antibodies, AIDS & Cancer'] },
    ],
  },
};

export function getChaptersForSelection(classLevel: ClassLevel, subject: string): ChapterEntry[] {
  const group = parseInt(classLevel, 10) <= 10 ? 'junior' : 'senior';
  return CHAPTER_CATALOG[group][subject] || [];
}

export const DEFAULT_STYLE_CONFIG: DppStyleConfig = {
  brandName: 'SAFAL ACADEMY LIVE',
  brandSubtitle: 'Powered by Ravish Sir',
  brandStyle: {
    color: '#0F172A',
    fontSize: 22,
    bold: true,
    italic: false,
    underline: false,
  },
  subtitleStyle: {
    color: '#1D4ED8',
    fontSize: 12,
    bold: true,
    italic: true,
    underline: false,
  },
  showHeaderMeta: true,
  batchName: 'Target Ranker Batch',
  testCode: 'DPP-01',
  duration: '45 Mins',
  dateText: 'Nov 2026',
  footerNote: 'Safal Academy Live · Quality PYQ Practice Sheet',

  orientation: 'portrait',
  columns: 1,
  pageColor: '#FFFFFF',
  borderStyle: 'double',
  borderColor: '#1E293B',
  borderWidth: 2,
  paperFontFamily: 'Source Serif 4',
  showWatermark: false,
  watermarkOpacity: 8,
  questionSpacing: 14,

  headerMetaStyle: {
    color: '#334155',
    fontSize: 11,
    bold: false,
    italic: false,
    underline: false,
  },
  chapterLineStyle: {
    color: '#0F172A',
    fontSize: 12,
    bold: true,
    italic: false,
    underline: false,
  },
  questionStyle: {
    color: '#0F172A',
    fontSize: 13.5,
    bold: false,
    italic: false,
    underline: false,
  },
  optionStyle: {
    color: '#1E293B',
    fontSize: 12.5,
    bold: false,
    italic: false,
    underline: false,
  },
  subjectiveStyle: {
    color: '#1E3A8A',
    fontSize: 13.5,
    bold: false,
    italic: false,
    underline: false,
  },
  matchLeftStyle: {
    color: '#0F172A',
    fontSize: 12.5,
    bold: true,
    italic: false,
    underline: false,
  },
  matchRightStyle: {
    color: '#047857',
    fontSize: 12.5,
    bold: false,
    italic: false,
    underline: false,
  },
  assertionStyle: {
    color: '#7C2D12',
    fontSize: 13,
    bold: false,
    italic: false,
    underline: false,
  },
  reasonStyle: {
    color: '#1E40AF',
    fontSize: 13,
    bold: false,
    italic: false,
    underline: false,
  },
  metaTagStyle: {
    color: '#64748B',
    fontSize: 10.5,
    bold: true,
    italic: false,
    underline: false,
  },
  solutionStyle: {
    color: '#1E293B',
    fontSize: 12.5,
    bold: false,
    italic: false,
    underline: false,
  },
  footerStyle: {
    color: '#475569',
    fontSize: 10.5,
    bold: false,
    italic: false,
    underline: false,
  },

  figureColor: '#0F172A',
  figureStrokeWidth: 1.8,
  figureScale: 100,

  defaultMarksPerQuestion: 4,
  defaultNegativeMarks: 1,
  showMarksPerQuestion: true,
  showPyqTags: true,
};
