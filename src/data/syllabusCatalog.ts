import { ClassLevel } from '../types/dpp';

export interface ChapterEntry {
  chapter: string;
  topics: string[];
}

// ---------- SENIOR (CLASS 11 & 12) EXAM-ALIGNED SYLLABUS ----------

const CLASS_11_PHYSICS_BASE: ChapterEntry[] = [
  {
    chapter: 'Units, Measurements & Error Analysis',
    topics: [
      'Dimensional Analysis & Homogeneity Principle',
      'Significant Figures & Error Propagation',
      'Vernier Callipers & Screw Gauge Least Count',
    ],
  },
  {
    chapter: 'Motion in a Straight Line',
    topics: [
      'Position-Time, Velocity-Time & Acceleration-Time Graphs',
      'Equations of Uniformly Accelerated Motion',
      'Calculus-Based Kinematics (v = dx/dt, a = v dv/dx)',
      'Relative Velocity in 1D & Stopping Distance',
    ],
  },
  {
    chapter: 'Motion in a Plane & Vectors',
    topics: [
      'Vector Addition, Dot & Cross Product',
      'Projectile Motion on Horizontal Plane',
      'Projectile on Inclined Plane (JEE)',
      'River-Boat & Rain-Man Relative Motion',
      'Uniform Circular Motion & Centripetal Acceleration',
    ],
  },
  {
    chapter: 'Laws of Motion & Friction',
    topics: [
      'Newton’s Laws, Free Body Diagrams & Equilibrium',
      'Constraint Relations & Wedge-Pulley Systems',
      'Static & Kinetic Friction on Inclined Planes',
      'Pseudo Force & Non-Inertial Frames',
      'Dynamics of Circular Motion & Banking of Roads',
    ],
  },
  {
    chapter: 'Work, Energy & Power',
    topics: [
      'Work Done by Constant & Variable Forces',
      'Work-Energy Theorem & Conservative Forces',
      'Potential Energy Curves & Equilibrium Stability',
      'Vertical Circular Motion',
      'Power, Efficiency & Spring-Block Energy Problems',
    ],
  },
  {
    chapter: 'System of Particles & Rotational Motion',
    topics: [
      'Center of Mass & Motion of COM',
      'Elastic & Inelastic Collisions (1D & 2D)',
      'Moment of Inertia, Parallel & Perpendicular Axes Theorems',
      'Torque, Angular Momentum & Conservation',
      'Pure Rolling Motion on Horizontal & Inclined Planes',
    ],
  },
  {
    chapter: 'Gravitation',
    topics: [
      'Newton’s Law of Gravitation & Superposition',
      'Variation of g with Altitude, Depth & Rotation',
      'Gravitational Potential & Field (Shell / Solid Sphere)',
      'Escape Velocity, Orbital Velocity & Satellites',
      'Kepler’s Laws of Planetary Motion',
    ],
  },
  {
    chapter: 'Mechanical Properties of Solids & Fluids',
    topics: [
      'Young’s, Bulk & Shear Modulus, Elastic Potential Energy',
      'Pascal’s Law, Hydrostatic Pressure & Buoyancy',
      'Equation of Continuity & Bernoulli’s Theorem',
      'Viscosity, Stokes’ Law & Terminal Velocity',
      'Surface Tension, Excess Pressure & Capillary Rise',
    ],
  },
  {
    chapter: 'Thermal Properties of Matter',
    topics: [
      'Thermal Expansion (Linear, Area, Volume) & Bimetallic Strips',
      'Calorimetry, Specific Heat & Latent Heat',
      'Conduction in Composite Slabs & Searle’s Method',
      'Stefan-Boltzmann Law, Wien’s Law & Newton’s Law of Cooling',
    ],
  },
  {
    chapter: 'Thermodynamics & Kinetic Theory of Gases',
    topics: [
      'Ideal Gas Equation & RMS/Most Probable/Average Speeds',
      'Degrees of Freedom, Equipartition & Cp/Cv',
      'First Law of Thermodynamics & PV Indicator Diagrams',
      'Isothermal, Adiabatic, Isobaric & Polytropic Processes',
      'Carnot Engine, Refrigerator & Second Law (Board/Adv)',
    ],
  },
  {
    chapter: 'Oscillations (SHM)',
    topics: [
      'Equations, Phase, Velocity & Acceleration in SHM',
      'Spring-Block Combinations (Series & Parallel)',
      'Simple, Physical & Torsional Pendulum',
      'Energy & Superposition of Two SHMs',
    ],
  },
  {
    chapter: 'Waves & Acoustics',
    topics: [
      'Progressive Wave Equation & Speed on Stretched String',
      'Superposition, Interference & Beats',
      'Standing Waves in Strings & Organ Pipes (Open/Closed)',
      'Doppler Effect in Sound (JEE Adv/Board/NEET)',
    ],
  },
];

const CLASS_12_PHYSICS_BASE: ChapterEntry[] = [
  {
    chapter: 'Electric Charges & Fields',
    topics: [
      'Coulomb’s Law & Superposition of Forces',
      'Electric Field due to Continuous Charge Distributions',
      'Electric Dipole in Uniform & Non-Uniform Electric Field',
      'Electric Flux & Gauss’s Law Applications',
    ],
  },
  {
    chapter: 'Electrostatic Potential & Capacitance',
    topics: [
      'Electrostatic Potential, Equipotential Surfaces & Relation E = -∇V',
      'Potential Energy of Charge System & Dipole',
      'Parallel Plate, Spherical & Cylindrical Capacitors',
      'Capacitor Networks with Dielectrics & Battery Connections',
    ],
  },
  {
    chapter: 'Current Electricity',
    topics: [
      'Drift Velocity, Mobility & Ohm’s Law',
      'Combination of Resistors & Symmetry Circuits',
      'Kirchhoff’s Laws (KCL/KVL), Cells & Grouping',
      'Wheatstone Bridge, Meter Bridge & Potentiometer',
      'RC Circuits (Charging & Discharging Transients — JEE)',
    ],
  },
  {
    chapter: 'Moving Charges & Magnetism',
    topics: [
      'Biot-Savart Law (Straight Wire, Circular Loop, Solenoid)',
      'Ampere’s Circuital Law Applications',
      'Lorentz Force & Helical Motion in Magnetic Field',
      'Force & Torque on Current-Carrying Loop, Moving Coil Galvanometer',
    ],
  },
  {
    chapter: 'Magnetism & Matter',
    topics: [
      'Bar Magnet, Magnetic Dipole & Gauss’s Law in Magnetism',
      'Dia-, Para- and Ferromagnetic Materials & Hysteresis',
    ],
  },
  {
    chapter: 'Electromagnetic Induction (EMI)',
    topics: [
      'Faraday’s Laws & Lenz’s Law',
      'Motional EMF in Translating & Rotating Rods',
      'Induced Electric Field (Non-Conservative)',
      'Self-Inductance, Mutual Inductance & LR Growth/Decay',
    ],
  },
  {
    chapter: 'Alternating Current (AC)',
    topics: [
      'Peak, Average & RMS Values of AC',
      'Phasor Analysis of R, L, C & Series LCR Circuits',
      'Resonance, Quality Factor & Power Factor (cos φ)',
      'LC Oscillations & Transformers',
    ],
  },
  {
    chapter: 'Electromagnetic Waves',
    topics: [
      'Displacement Current & Maxwell’s Equations',
      'Transverse Nature, Poynting Vector & EM Spectrum',
    ],
  },
  {
    chapter: 'Ray Optics & Optical Instruments',
    topics: [
      'Reflection at Spherical Mirrors & Mirror Formula',
      'Refraction at Plane Surfaces, Apparent Depth & TIR',
      'Refraction at Spherical Surfaces & Lens Maker’s Formula',
      'Combination of Lenses, Mirrors & Silvered Lens',
      'Prism Deviation, Minimum Deviation & Dispersion',
      'Simple/Compound Microscope & Astronomical Telescope',
    ],
  },
  {
    chapter: 'Wave Optics',
    topics: [
      'Huygens Principle & Coherent Interference',
      'Young’s Double Slit Experiment (YDSE) & Thin Film Shift',
      'Single-Slit Fraunhofer Diffraction',
      'Polarisation, Malus’s Law & Brewster’s Angle',
    ],
  },
  {
    chapter: 'Dual Nature of Radiation & Matter',
    topics: [
      'Einstein’s Photoelectric Equation & Stopping Potential Graphs',
      'Radiation Pressure & Photon Flux',
      'de Broglie Wavelength & Davisson-Germer Concept',
    ],
  },
  {
    chapter: 'Atoms & Nuclei',
    topics: [
      'Rutherford Scattering & Bohr’s Model of Hydrogen Atom',
      'Hydrogen Spectral Series & X-Ray Emission (Moseley’s Law)',
      'Binding Energy Curve, Nuclear Fission & Fusion',
      'Law of Radioactive Decay (α, β, γ & Half-Life — JEE Adv)',
    ],
  },
  {
    chapter: 'Semiconductor Electronics & Logic Gates',
    topics: [
      'Intrinsic & Extrinsic (p-type, n-type) Semiconductors',
      'PN Junction Diode, I-V Characteristics & Rectifiers',
      'Zener Diode as Voltage Regulator & LED/Photodiode',
      'Boolean Algebra & Logic Gates (AND, OR, NOT, NAND, NOR)',
    ],
  },
];

// ---------- CHEMISTRY CLASS 11 & 12 ----------

const CLASS_11_CHEMISTRY_BASE: ChapterEntry[] = [
  {
    chapter: 'Some Basic Concepts of Chemistry (Mole Concept)',
    topics: [
      'Mole Concept, Molarity, Molality & Concentration Terms',
      'Stoichiometry, Limiting Reagent & Percentage Yield',
      'Empirical/Molecular Formula & Eudiometry (JEE)',
      'Equivalent Weight & Titration (Redox / Acid-Base)',
    ],
  },
  {
    chapter: 'Structure of Atom',
    topics: [
      'Bohr’s Atomic Model, Radius, Velocity & Energy',
      'Hydrogen Spectrum & Rydberg Formula',
      'de Broglie Wavelength & Heisenberg Uncertainty Principle',
      'Quantum Numbers, Radial/Angular Nodes & Electronic Configuration',
    ],
  },
  {
    chapter: 'Classification of Elements & Periodicity',
    topics: [
      'Modern Periodic Table & IUPAC Nomenclature (>100)',
      'Periodic Trends: Atomic/Ionic Radii, Ionization Enthalpy',
      'Electron Gain Enthalpy, Electronegativity & Diagonal Relationship',
    ],
  },
  {
    chapter: 'Chemical Bonding & Molecular Structure',
    topics: [
      'Ionic Bonding, Lattice Energy & Fajan’s Rules',
      'VSEPR Theory, Hybridization & Molecular Geometry',
      'Dipole Moment & Back Bonding (JEE)',
      'Molecular Orbital Theory (MOT), Bond Order & Magnetic Behaviour',
      'Hydrogen Bonding & Intermolecular Forces',
    ],
  },
  {
    chapter: 'Chemical Thermodynamics',
    topics: [
      'First Law: Internal Energy, Work & Enthalpy (ΔH, ΔU)',
      'Hess’s Law, Bond Enthalpy & Enthalpy of Combustion/Formation',
      'Entropy (ΔS) & Second/Third Law of Thermodynamics',
      'Gibbs Free Energy (ΔG) & Spontaneity Criteria',
    ],
  },
  {
    chapter: 'Equilibrium (Chemical & Ionic)',
    topics: [
      'Law of Mass Action, Kp, Kc & Degree of Dissociation',
      'Le Chatelier’s Principle Applications',
      'pH of Strong/Weak Acids, Bases & Polyprotic Acids',
      'Buffer Solutions, Henderson Equation & Salt Hydrolysis',
      'Solubility Product (Ksp) & Common Ion Effect',
    ],
  },
  {
    chapter: 'Redox Reactions',
    topics: [
      'Oxidation Number & Disproportionation Reactions',
      'Balancing Redox Equations (Ion-Electron & Oxidation Number)',
      'n-Factor & Volumetric Redox Titrations',
    ],
  },
  {
    chapter: 'General Organic Chemistry (GOC) & Isomerism',
    topics: [
      'IUPAC Nomenclature of Polyfunctional & Aromatic Compounds',
      'Electronic Effects: Inductive, Resonance, Hyperconjugation',
      'Aromaticity (Hückel Rule) & Stability of Intermediates',
      'Acidic & Basic Strength of Organic Compounds',
      'Structural, Geometrical (E/Z) & Optical Isomerism (R/S, Chirality)',
    ],
  },
  {
    chapter: 'Hydrocarbons (Alkanes, Alkenes, Alkynes, Benzene)',
    topics: [
      'Alkanes: Conformations (Ethane/Butane) & Free Radical Halogenation',
      'Alkenes: Markovnikov/Anti-Markovnikov, Hydroboration, Ozonolysis',
      'Alkynes: Acidity, Hydration & Birch/Lindlar Reduction',
      'Aromatic Benzene: Nitration, Friedel-Crafts & Directing Effects',
    ],
  },
];

const CLASS_11_CHEMISTRY_JEE_ADV_EXTRAS: ChapterEntry[] = [
  {
    chapter: 'Gaseous & Liquid States (JEE Advanced)',
    topics: [
      'Gas Laws, Dalton’s Law & Graham’s Law of Effusion',
      'Kinetic Theory, Maxwell Distribution & Real Gas (van der Waals)',
      'Compressibility Factor (Z) & Critical Constants',
    ],
  },
  {
    chapter: 's-Block, Hydrogen & Environmental Chemistry (JEE Adv)',
    topics: [
      'Alkali & Alkaline Earth Metals Compounds & Solubility',
      'Hydrogen Peroxide (H2O2) Volume Strength & Hydrides',
    ],
  },
];

const CLASS_12_CHEMISTRY_BASE: ChapterEntry[] = [
  {
    chapter: 'Solutions',
    topics: [
      'Henry’s Law & Raoult’s Law (Ideal & Non-Ideal Solutions)',
      'Azeotropes & Vapour Pressure Diagrams',
      'Colligative Properties (RLVP, ΔTb, ΔTf, Osmotic Pressure)',
      'van’t Hoff Factor (i) & Abnormal Molar Mass',
    ],
  },
  {
    chapter: 'Electrochemistry',
    topics: [
      'Galvanic Cells, Standard Electrode Potential & Nernst Equation',
      'Gibbs Energy & Equilibrium Constant from Cell EMF',
      'Molar Conductivity & Kohlrausch’s Law',
      'Electrolysis, Faraday’s Laws, Batteries & Corrosion',
    ],
  },
  {
    chapter: 'Chemical Kinetics',
    topics: [
      'Rate Law, Order, Molecularity & Zero/First Order Kinetics',
      'Half-Life, Pseudo-First Order & Parallel/Sequential Reactions (JEE)',
      'Arrhenius Equation, Activation Energy & Collision Theory',
    ],
  },
  {
    chapter: 'd & f-Block Elements',
    topics: [
      'Transition Metals: Oxidation States, Colour & Magnetic Moment',
      'KMnO4 & K2Cr2O7 Preparation & Oxidising Reactions',
      'Lanthanoid Contraction & Actinoid Chemistry',
    ],
  },
  {
    chapter: 'Coordination Compounds',
    topics: [
      'Werner’s Theory & IUPAC Nomenclature of Complexes',
      'Structural & Stereoisomerism in Coordination Complexes',
      'Valence Bond Theory (VBT) & Hybridization',
      'Crystal Field Theory (CFT), CFSE, Colour & Stability',
    ],
  },
  {
    chapter: 'Haloalkanes & Haloarenes',
    topics: [
      'SN1 vs SN2 Mechanisms, Stereochemistry & Rearrangements',
      'E1, E2, E1cb Elimination & Saytzeff/Hofmann Rules',
      'Nucleophilic Aromatic Substitution & Polyhalogen Compounds',
    ],
  },
  {
    chapter: 'Alcohols, Phenols & Ethers',
    topics: [
      'Preparation via Grignard Reagent & Hydroboration-Oxidation',
      'Lucas Test, Victor Meyer & Acidic Strength of Phenols',
      'Reimer-Tiemann, Kolbe’s Reaction & Electrophilic Substitution',
      'Williamson Ether Synthesis & HI Cleavage of Ethers',
    ],
  },
  {
    chapter: 'Aldehydes, Ketones & Carboxylic Acids',
    topics: [
      'Nucleophilic Addition, Cyanohydrin, Acetal & Imine Formation',
      'Aldol Condensation, Cross-Aldol & Cannizzaro Reaction',
      'Haloform Test, Clemmensen, Wolff-Kishner & Tollens/Fehling',
      'Acidity of Carboxylic Acids, HVZ & Decarboxylation',
    ],
  },
  {
    chapter: 'Amines & Diazonium Salts',
    topics: [
      'Basicity Order of Aliphatic & Aromatic Amines',
      'Gabriel Phthalimide & Hoffmann Bromamide Degradation',
      'Hinsberg Test, Carbylamine & Electrophilic Substitution of Aniline',
      'Diazonium Salts: Sandmeyer, Gattermann & Azo Coupling',
    ],
  },
  {
    chapter: 'Biomolecules',
    topics: [
      'Carbohydrates: Glucose, Fructose, Mutarotation & Disaccharides',
      'Amino Acids, Zwitterion, Isoelectric Point & Peptide Bond',
      'Proteins, Enzymes, Vitamins & Nucleic Acids (DNA/RNA)',
    ],
  },
];

const CLASS_12_CHEMISTRY_EXTRA: ChapterEntry[] = [
  {
    chapter: 'p-Block Elements (Groups 15–18)',
    topics: [
      'Nitrogen & Phosphorus Oxyacids, Oxides & Ammonia',
      'Oxygen, Sulphur Oxoacids (H2SO4) & Interhalogen Compounds',
      'Noble Gas Fluorides & VSEPR Geometries (XeF2, XeF4, XeOF4)',
    ],
  },
  {
    chapter: 'Qualitative Salt Analysis & Practical Organic Chemistry',
    topics: [
      'Cation Groups (0 to VI) & Anion Tests (CO3²⁻, SO4²⁻, NO3⁻, X⁻)',
      'Chromyl Chloride, Brown Ring & Borax Bead Tests',
      'Lassaigne’s Extract & Functional Group Detection',
    ],
  },
];

const CLASS_12_CHEMISTRY_JEE_ADV_EXTRAS: ChapterEntry[] = [
  {
    chapter: 'Solid State, Surface Chemistry & Metallurgy (JEE Adv)',
    topics: [
      'Unit Cell Packing Efficiency, Voids & Crystal Defects',
      'Freundlich Adsorption, Colloids & Hardy-Schulze Rule',
      'Ellingham Diagram, Froth Floatation & Refining of Metals',
    ],
  },
];

// ---------- MATHEMATICS CLASS 11 & 12 ----------

const CLASS_11_MATHS_BASE: ChapterEntry[] = [
  {
    chapter: 'Sets, Relations & Functions',
    topics: [
      'Set Operations, Venn Diagrams & Cardinality Identities',
      'Domain, Range, Types of Relations & Functions',
      'Modulus, Greatest Integer & Fractional Part Equations',
    ],
  },
  {
    chapter: 'Trigonometric Functions & Equations',
    topics: [
      'Compound, Multiple & Sub-Multiple Angle Identities',
      'Conditional Identities & Range of Trigonometric Expressions',
      'General Solutions of Trigonometric Equations',
      'Properties of Triangles & Solutions (Sine/Cosine Rules — JEE)',
    ],
  },
  {
    chapter: 'Complex Numbers & Quadratic Equations',
    topics: [
      'Algebra of Complex Numbers, Modulus, Conjugate & Argument',
      'Argand Plane, Rotation Theorem & Triangle Inequality',
      'Cube Roots of Unity (1, ω, ω²) & De Moivre’s Theorem',
      'Nature of Roots, Common Roots & Location of Roots',
    ],
  },
  {
    chapter: 'Linear Inequalities',
    topics: [
      'Wavy Curve Method & Rational Inequalities',
      'Modulus & Logarithmic Inequalities',
    ],
  },
  {
    chapter: 'Permutations & Combinations',
    topics: [
      'Fundamental Counting Principle, Gap & Bundle Methods',
      'Circular Permutations & Permutations with Repetition',
      'Multinomial Theorem (Beggar’s Method) & Dearrangements',
      'Exponent of Prime in n! & Geometrical Counting',
    ],
  },
  {
    chapter: 'Binomial Theorem',
    topics: [
      'General Term, Middle Term & Greatest Term',
      'Properties of Binomial Coefficients & Summation Series',
      'Remainder & Divisibility via Binomial Theorem',
      'Multinomial Expansion & Any-Index Series (JEE)',
    ],
  },
  {
    chapter: 'Sequences & Series',
    topics: [
      'Arithmetic & Geometric Progressions (AP & GP)',
      'Arithmetic-Geometric Progression (AGP) & Means',
      'Method of Differences (Vn / Telescoping Series)',
      'AM-GM-HM Inequalities & Optimization',
    ],
  },
  {
    chapter: 'Straight Lines',
    topics: [
      'Slope, Various Forms of Line & Angle Between Lines',
      'Distance of Point, Foot of Perpendicular & Image',
      'Family of Lines, Angle Bisectors & Concurrency',
      'Pair of Straight Lines & Homogenization (JEE)',
    ],
  },
  {
    chapter: 'Conic Sections (Circle, Parabola, Ellipse, Hyperbola)',
    topics: [
      'Circles: Tangents, Normals, Chord of Contact & Radical Axis',
      'Family of Circles & Orthogonal Circles',
      'Parabola: Focus, Directrix, Focal Chord & Tangents/Normals',
      'Ellipse & Hyperbola: Eccentricity, Director Circle & Asymptotes',
    ],
  },
  {
    chapter: 'Introduction to Three-Dimensional Geometry',
    topics: [
      'Distance, Section Formula & Centroid in 3D Space',
      'Direction Cosines & Direction Ratios',
    ],
  },
  {
    chapter: 'Limits & Derivatives',
    topics: [
      'Algebraic, Trigonometric & Exponential/Logarithmic Limits',
      '1^∞ Indeterminate Form, L’Hôpital & Sandwich Theorem',
      'First Principle of Derivatives & Standard Rules',
    ],
  },
  {
    chapter: 'Statistics & Probability (Class 11)',
    topics: [
      'Mean Deviation, Variance & Standard Deviation',
      'Sample Space, Axiomatic Probability & Addition Theorem',
    ],
  },
];

const CLASS_12_MATHS_BASE: ChapterEntry[] = [
  {
    chapter: 'Relations & Functions (Class 12)',
    topics: [
      'Reflexive, Symmetric, Transitive & Equivalence Relations',
      'One-One (Injective), Onto (Surjective) & Bijective Functions',
      'Composition (fog/gof), Inverse & Functional Equations',
    ],
  },
  {
    chapter: 'Inverse Trigonometric Functions',
    topics: [
      'Principal Value Branches & Domain/Range of ITF',
      'Properties, Simplification & Summation of ITF Series',
    ],
  },
  {
    chapter: 'Matrices',
    topics: [
      'Algebra of Matrices, Symmetric & Skew-Symmetric Matrices',
      'Adjoint, Inverse & Orthogonal/Idempotent/Nilpotent Matrices',
    ],
  },
  {
    chapter: 'Determinants',
    topics: [
      'Properties of Determinants & Row/Column Operations',
      'System of Linear Equations (Cramer’s Rule & Consistency)',
      'Differentiation & Product of Determinants (JEE)',
    ],
  },
  {
    chapter: 'Continuity & Differentiability',
    topics: [
      'Continuity at a Point/Interval & Types of Discontinuity',
      'Differentiability at Corner/Piecewise & Functional Points',
      'Chain Rule, Implicit, Parametric & Logarithmic Differentiation',
    ],
  },
  {
    chapter: 'Application of Derivatives (AOD)',
    topics: [
      'Rate of Change, Tangents, Normals & Angle of Intersection',
      'Monotonicity (Increasing/Decreasing Functions)',
      'Maxima, Minima & Global Extrema Word Problems',
      'Rolle’s Theorem & Lagrange’s Mean Value Theorem (LMVT)',
    ],
  },
  {
    chapter: 'Indefinite Integrals',
    topics: [
      'Integration by Substitution & Standard Algebraic Forms',
      'Integration by Parts & e^x[f(x) + f’(x)] Forms',
      'Partial Fractions & Trigonometric Reductions',
    ],
  },
  {
    chapter: 'Definite Integrals',
    topics: [
      'Properties of Definite Integrals & King’s Property',
      'Even/Odd, Periodic Functions & Walli’s Formula',
      'Newton-Leibniz Rule (Differentiation Under Integral Sign)',
      'Limit as a Sum & Integral Inequalities (JEE)',
    ],
  },
  {
    chapter: 'Application of Integrals (Area Under Curves)',
    topics: [
      'Area Bounded by Parabolas, Circles, Ellipses & Lines',
      'Symmetry & Area Between Two Curves',
    ],
  },
  {
    chapter: 'Differential Equations',
    topics: [
      'Order, Degree & Formation of Differential Equations',
      'Variable Separable & Reducible Homogeneous Equations',
      'Linear Differential Equations (Integrating Factor) & Bernoulli',
      'Orthogonal Trajectories & Exact Differential Forms (JEE)',
    ],
  },
  {
    chapter: 'Vector Algebra',
    topics: [
      'Dot & Cross Product, Projection & Vector Equations',
      'Scalar Triple Product (Box Product) & Coplanarity',
      'Vector Triple Product & Lagrange’s Identity (JEE)',
    ],
  },
  {
    chapter: 'Three-Dimensional Geometry',
    topics: [
      'Equation of Line in 3D, Angle & Foot of Perpendicular',
      'Shortest Distance Between Two Skew Lines',
      'Equation of Plane, Line-Plane & Two-Plane Intersection (JEE)',
    ],
  },
  {
    chapter: 'Linear Programming',
    topics: [
      'Feasible Region & Graphical Optimization (Board Exams)',
    ],
  },
  {
    chapter: 'Probability (Class 12)',
    topics: [
      'Conditional Probability & Multiplication Theorem',
      'Independent Events, Total Probability & Bayes’ Theorem',
      'Random Variable, Mean, Variance & Binomial Distribution',
    ],
  },
];

// ---------- BIOLOGY CLASS 11 & 12 ----------

const CLASS_11_BIOLOGY_BASE: ChapterEntry[] = [
  {
    chapter: 'The Living World & Biological Classification',
    topics: [
      'Taxonomic Hierarchy, Binomial Nomenclature & Taxonomic Aids',
      'Five Kingdom Classification (Whittaker): Monera, Protista, Fungi',
      'Viruses, Viroids, Prions & Lichens',
    ],
  },
  {
    chapter: 'Plant Kingdom & Animal Kingdom',
    topics: [
      'Algae, Bryophytes, Pteridophytes, Gymnosperms & Life Cycles',
      'Basis of Animal Classification (Coelom, Symmetry, Notochord)',
      'Non-Chordata Phyla (Porifera to Echinodermata) & Chordata Classes',
    ],
  },
  {
    chapter: 'Morphology & Anatomy of Flowering Plants',
    topics: [
      'Root, Stem, Leaf Modifications, Inflorescence & Placentation',
      'Floral Formulas & Families (Solanaceae, Fabaceae, Liliaceae/Malvaceae)',
      'Plant Tissues, Stomata, Vascular Bundles & Dicot/Monocot Anatomy',
    ],
  },
  {
    chapter: 'Structural Organisation in Animals',
    topics: [
      'Animal Tissues (Epithelial, Connective, Muscular, Neural)',
      'Morphology & Anatomy of Frog (Rana tigrina) & Cockroach (NEET)',
    ],
  },
  {
    chapter: 'Cell: The Unit of Life & Cell Cycle',
    topics: [
      'Prokaryotic vs Eukaryotic Cell & Fluid Mosaic Membrane Model',
      'Endomembrane System, Mitochondria, Plastids & Nucleus',
      'Mitosis, Meiosis I/II Stages, Crossing Over & Significance',
    ],
  },
  {
    chapter: 'Biomolecules',
    topics: [
      'Carbohydrates, Amino Acids, Lipids & Nucleic Acids',
      'Enzyme Action, Activation Energy, Km & Inhibition',
    ],
  },
  {
    chapter: 'Photosynthesis & Respiration in Plants',
    topics: [
      'Light Reaction, Z-Scheme, Photophosphorylation & Chemiosmosis',
      'Calvin Cycle (C3), Hatch-Slack Pathway (C4) & Photorespiration',
      'Glycolysis, Krebs Cycle, ETS & ATP Yield Balance Sheet',
    ],
  },
  {
    chapter: 'Plant Growth & Development',
    topics: [
      'Arithmetic vs Geometric Growth & Differentiation',
      'Plant Growth Regulators (Auxin, Gibberellin, Cytokinin, ABA, Ethylene)',
    ],
  },
  {
    chapter: 'Human Physiology: Breathing & Circulation',
    topics: [
      'Respiratory Volumes, Capacities & Oxygen Dissociation Curve (Bohr Effect)',
      'Blood Groups, Coagulation, Cardiac Cycle & ECG Waveforms',
      'Double Circulation & Regulation of Cardiac Activity',
    ],
  },
  {
    chapter: 'Human Physiology: Excretion & Locomotion',
    topics: [
      'Nephron Structure, Ultrafiltration & Counter-Current Mechanism',
      'Sarcomere Structure, Sliding Filament Theory & Joints',
    ],
  },
  {
    chapter: 'Human Physiology: Neural & Endocrine Control',
    topics: [
      'Generation & Conduction of Nerve Impulse, Synapse & Brain Parts',
      'Pituitary, Thyroid, Adrenal, Pancreas & Mechanism of Hormone Action',
    ],
  },
];

const CLASS_12_BIOLOGY_BASE: ChapterEntry[] = [
  {
    chapter: 'Sexual Reproduction in Flowering Plants',
    topics: [
      'Microsporogenesis, Pollen Grain & Megasporogenesis',
      'Pollination Types, Outbreeding Devices & Double Fertilization',
      'Endosperm, Embryo Development, Apomixis & Polyembryony',
    ],
  },
  {
    chapter: 'Human Reproduction & Reproductive Health',
    topics: [
      'Male & Female Reproductive Systems & Gametogenesis',
      'Menstrual Cycle Hormones, Fertilization & Embryonic Cleavage',
      'Contraception, MTP, STIs & Assisted Reproductive Technologies (IVF/ZIFT)',
    ],
  },
  {
    chapter: 'Principles of Inheritance & Variation',
    topics: [
      'Mendelian Monohybrid/Dihybrid Crosses & Incomplete Dominance',
      'Linkage, Recombination (Morgan) & Sex Determination',
      'Pedigree Analysis, Chromosomal & Mendelian Disorders',
    ],
  },
  {
    chapter: 'Molecular Basis of Inheritance',
    topics: [
      'DNA Structure, Packaging, Griffith/Hershey-Chase Experiments',
      'DNA Replication, Transcription, Genetic Code & Translation',
      'Lac Operon Regulation, Human Genome Project & DNA Fingerprinting',
    ],
  },
  {
    chapter: 'Evolution',
    topics: [
      'Origin of Life, Miller’s Experiment & Evidences of Evolution',
      'Hardy-Weinberg Equilibrium & Factors Affecting Allele Frequency',
      'Adaptive Radiation & Human Evolution Timeline',
    ],
  },
  {
    chapter: 'Human Health, Disease & Microbes',
    topics: [
      'Malaria (Plasmodium Life Cycle), Typhoid, Pneumonia & Immunity',
      'Structure of Antibody, Vaccination, AIDS (HIV) & Cancer',
      'Microbes in Sewage Treatment, Biogas & Biofertilizers',
    ],
  },
  {
    chapter: 'Biotechnology: Principles & Applications',
    topics: [
      'Restriction Enzymes, Gel Electrophoresis & pBR322 Cloning Vector',
      'PCR Amplification & Bioreactors',
      'Bt Cotton, RNA Interference (RNAi), Gene Therapy (ADA) & ELISA',
    ],
  },
  {
    chapter: 'Organisms, Populations, Ecosystem & Biodiversity',
    topics: [
      'Population Growth Models (Exponential/Logistic) & Interactions',
      'Productivity, Decomposition, Energy Flow & Ecological Pyramids',
      'Species-Area Relationship, Biodiversity Loss & Conservation',
    ],
  },
];

// ---------- JUNIOR (CLASSES 7–10) BOARD-SPECIFIC & CLASS-SPECIFIC SYLLABUS ----------

const JUNIOR_CATALOG: Record<string, Record<string, Record<string, ChapterEntry[]>>> = {
  // CLASS 7
  '7': {
    CBSE: {
      Physics: [
        { chapter: 'Heat & Temperature', topics: ['Clinical vs Laboratory Thermometer', 'Conduction, Convection & Radiation', 'Sea Breeze & Land Breeze'] },
        { chapter: 'Motion & Time', topics: ['Uniform & Non-Uniform Motion', 'Speed Formula & Distance-Time Graphs', 'Simple Pendulum Time Period'] },
        { chapter: 'Electric Current & Its Effects', topics: ['Circuit Symbols & Components', 'Heating Effect & Electric Fuse', 'Electromagnet & Electric Bell'] },
        { chapter: 'Light', topics: ['Rectilinear Propagation & Reflection', 'Plane, Concave & Convex Mirrors', 'Lenses & Newton’s Colour Disc'] },
      ],
      Chemistry: [
        { chapter: 'Acids, Bases & Salts', topics: ['Natural Indicators (Litmus, Turmeric, China Rose)', 'Neutralization Reactions in Daily Life'] },
        { chapter: 'Physical & Chemical Changes', topics: ['Reversible vs Irreversible Changes', 'Rusting of Iron, Galvanization & Crystallization'] },
        { chapter: 'Wastewater Story & Water', topics: ['Sewage Treatment & Sanitation', 'Water Purification Processes'] },
      ],
      Biology: [
        { chapter: 'Nutrition in Plants & Animals', topics: ['Photosynthesis & Symbiotic Plants', 'Human Digestive System & Ruminants'] },
        { chapter: 'Respiration in Organisms', topics: ['Aerobic vs Anaerobic Respiration', 'Breathing Mechanism in Humans, Fish & Earthworm'] },
        { chapter: 'Transportation in Animals & Plants', topics: ['Human Heart, Blood Vessels & Excretion', 'Xylem, Phloem & Transpiration'] },
        { chapter: 'Reproduction in Plants & Forests', topics: ['Vegetative Propagation, Pollination & Seed Dispersal', 'Food Webs & Forest Conservation'] },
      ],
      'Science (Combined)': [
        { chapter: 'Nutrition in Plants & Animals', topics: ['Photosynthesis & Stomata', 'Human Alimentary Canal'] },
        { chapter: 'Heat, Acids, Bases & Physical/Chemical Changes', topics: ['Heat Transfer Modes', 'Indicators & Neutralization', 'Rusting & Crystallization'] },
        { chapter: 'Motion, Time, Electric Current & Light', topics: ['Speed & Distance-Time Graph', 'Electromagnet & Fuse', 'Mirrors & Lenses'] },
        { chapter: 'Respiration, Transportation & Reproduction', topics: ['Cellular Respiration', 'Heart & Blood Circulation', 'Pollination & Seed Dispersal'] },
      ],
      Mathematics: [
        { chapter: 'Integers, Fractions & Decimals', topics: ['Properties of Integers', 'Multiplication & Division of Fractions/Decimals'] },
        { chapter: 'Simple Equations & Data Handling', topics: ['Solving Linear Equations & Word Problems', 'Mean, Median, Mode & Bar Graphs'] },
        { chapter: 'Lines, Angles & Triangles', topics: ['Complementary, Supplementary & Parallel Lines', 'Angle Sum & Exterior Angle Property', 'Pythagoras Property'] },
        { chapter: 'Comparing Quantities & Rational Numbers', topics: ['Percentage, Profit-Loss & Simple Interest', 'Operations on Rational Numbers'] },
        { chapter: 'Perimeter, Area, Exponents & Symmetry', topics: ['Area of Parallelogram, Triangle & Circle', 'Laws of Exponents & Standard Form'] },
      ],
    },
    ICSE: {
      Physics: [
        { chapter: 'Physical Quantities & Measurement', topics: ['Area of Regular/Irregular Shapes & Volume', 'Density & Speed Numerics'] },
        { chapter: 'Force, Pressure & Motion', topics: ['Rest, Motion, Speed & Velocity', 'Mass vs Weight'] },
        { chapter: 'Energy & Light Energy', topics: ['Kinetic, Potential & Energy Transformations', 'Laws of Reflection & Plane Mirror Images'] },
        { chapter: 'Heat & Sound', topics: ['Thermometers, Heat Transfer & Thermos Flask', 'Sources, Pitch, Loudness & Reflection of Sound'] },
        { chapter: 'Electricity & Magnetism', topics: ['Laws of Magnetism, Series/Parallel Circuits & Dry Cell'] },
      ],
      Chemistry: [
        { chapter: 'Matter & Physical/Chemical Changes', topics: ['States of Matter & Kinetic Theory', 'Physical vs Chemical Changes'] },
        { chapter: 'Elements, Compounds & Mixtures', topics: ['Separation Techniques (Distillation, Chromatography)', 'Symbols & Chemical Formulae'] },
        { chapter: 'Atomic Structure & Language of Chemistry', topics: ['Subatomic Particles & Valency', 'Writing & Balancing Word/Chemical Equations'] },
        { chapter: 'Metals, Non-Metals & Air', topics: ['Properties of Metals/Non-Metals & Corrosion', 'Composition of Air & Oxygen/Nitrogen'] },
      ],
      Biology: [
        { chapter: 'Plant & Animal Tissues', topics: ['Meristematic & Permanent Plant Tissues', 'Epithelial, Connective, Muscular & Nervous Tissues'] },
        { chapter: 'Classification of Living Organisms', topics: ['Five Kingdoms: Monera, Protista, Fungi, Plantae, Animalia'] },
        { chapter: 'Photosynthesis & Respiration', topics: ['Chloroplast, Factors & Experiments on Photosynthesis', 'Aerobic vs Anaerobic Respiration in Plants'] },
        { chapter: 'Excretory & Nervous System + Allergy', topics: ['Human Kidneys & Urine Formation', 'Brain, Spinal Cord, Reflex Action & Allergens'] },
      ],
      Mathematics: [
        { chapter: 'Integers, Rational Numbers & Exponents', topics: ['Laws of Exponents &BODMAS', 'Operations on Rational Numbers'] },
        { chapter: 'Sets, Ratio, Proportion & Unitary Method', topics: ['Roster/Set-Builder Notation & Venn Basics', 'Direct/Inverse Variation & Time-Work'] },
        { chapter: 'Percentage, Profit-Loss & Simple Interest', topics: ['Discount, Tax & Simple Interest Word Problems'] },
        { chapter: 'Algebraic Expressions & Linear Equations', topics: ['Addition/Subtraction of Polynomials', 'Solving Linear Inequations & Equations'] },
        { chapter: 'Lines, Angles, Triangles & Mensuration', topics: ['Congruence (SSS, SAS, ASA, RHS)', 'Perimeter & Area of Triangles, Circles & Paths'] },
      ],
    },
  },

  // CLASS 8
  '8': {
    CBSE: {
      Physics: [
        { chapter: 'Force and Pressure', topics: ['Contact & Non-Contact Forces', 'Liquid & Atmospheric Pressure'] },
        { chapter: 'Friction', topics: ['Static, Sliding & Rolling Friction', 'Methods of Increasing & Reducing Friction'] },
        { chapter: 'Sound', topics: ['Amplitude, Frequency & Time Period', 'Audible Range, Pitch, Loudness & Noise Pollution'] },
        { chapter: 'Light & Some Natural Phenomena', topics: ['Laws of Reflection, Multiple Images & Human Eye', 'Electroscope, Lightning & Earthquakes'] },
      ],
      Chemistry: [
        { chapter: 'Coal and Petroleum', topics: ['Refining of Petroleum & Destructive Distillation of Coal', 'Fossil Fuels & Conservation'] },
        { chapter: 'Combustion and Flame', topics: ['Ignition Temperature, Fire Extinguishers & Calorific Value', 'Zones of a Candle Flame'] },
        { chapter: 'Chemical Effects of Electric Current', topics: ['Conducting Liquids, Electrolysis & Electroplating'] },
      ],
      Biology: [
        { chapter: 'Crop Production & Microorganisms', topics: ['Kharif vs Rabi Crops & Irrigation', 'Useful/Harmful Microbes & Nitrogen Cycle'] },
        { chapter: 'Conservation of Plants & Animals', topics: ['Endemic Species, Biosphere Reserves & Red Data Book'] },
        { chapter: 'Reproduction & Adolescence', topics: ['Binary Fission, Budding, Fertilization & Metamorphosis', 'Endocrine Hormones & Secondary Sexual Characters'] },
      ],
      'Science (Combined)': [
        { chapter: 'Crop Production, Microorganisms & Conservation', topics: ['Nitrogen Fixation & Vaccines', 'Biodiversity & National Parks'] },
        { chapter: 'Combustion, Coal, Petroleum & Chemical Effects', topics: ['Zones of Flame & Calorific Value', 'Electroplating & Electrolysis'] },
        { chapter: 'Force, Pressure, Friction, Sound & Light', topics: ['Pressure Numerics & Friction', 'Frequency/Pitch & Reflection Laws'] },
        { chapter: 'Reproduction in Animals & Adolescence', topics: ['IVF, Viviparous/Oviparous & Hormones'] },
      ],
      Mathematics: [
        { chapter: 'Rational Numbers & Linear Equations', topics: ['Properties of Rational Numbers', 'Solving Linear Equations with Variable on Both Sides'] },
        { chapter: 'Understanding Quadrilaterals & Mensuration', topics: ['Angle Sum of Polygons & Parallelograms/Rhombus', 'Area of Trapezium, Cylinder, Cube & Cuboid'] },
        { chapter: 'Squares, Cubes, Exponents & Algebraic Identities', topics: ['Square/Cube Roots by Prime Factorization', 'Algebraic Identities & Factorization'] },
        { chapter: 'Comparing Quantities & Direct/Inverse Proportions', topics: ['Compound Interest, Discount & GST', 'Direct & Inverse Variation Problems'] },
        { chapter: 'Data Handling & Introduction to Graphs', topics: ['Pie Charts, Probability & Line Graphs'] },
      ],
    },
    ICSE: {
      Physics: [
        { chapter: 'Matter & Physical Quantities (Density)', topics: ['Kinetic Molecular Theory & Change of State', 'Relative Density & Eureka Can'] },
        { chapter: 'Force, Pressure & Energy', topics: ['Moment of Force (Torque) & Pressure in Fluids', 'Work, Kinetic/Potential Energy & Power'] },
        { chapter: 'Light Energy', topics: ['Refraction, Prism Dispersion & Spherical Mirrors'] },
        { chapter: 'Heat Transfer & Sound', topics: ['Linear/Cubical Thermal Expansion', 'Pitch, Quality, Loudness & Monotone'] },
        { chapter: 'Electricity', topics: ['Household Wiring, Fuse, MCB, Earthing & Static Charge'] },
      ],
      Chemistry: [
        { chapter: 'Matter, Physical/Chemical Changes & Atomic Structure', topics: ['Law of Conservation of Mass', 'Bohr Model, Isotopes & Electronic Configuration'] },
        { chapter: 'Language of Chemistry & Chemical Reactions', topics: ['Radicals, Formulae & Balancing Equations', 'Types of Reactions & Activity Series'] },
        { chapter: 'Hydrogen, Water & Carbon Allotropes', topics: ['Laboratory Preparation of Hydrogen', 'Hard vs Soft Water & Diamond/Graphite/Fullerene'] },
      ],
      Biology: [
        { chapter: 'Transport in Plants & Reproduction', topics: ['Osmosis, Active Transport & Transpiration', 'Asexual, Sexual Reproduction & Artificial Pollination'] },
        { chapter: 'Ecosystems & Human Nervous/Endocrine System', topics: ['Food Pyramids, Biotic/Abiotic Factors', 'Reflex Arc, Hormones & Circulatory System'] },
      ],
      Mathematics: [
        { chapter: 'Rational Numbers, Exponents, Squares & Cubes', topics: ['Operations & Negative Exponents', 'Square Roots & Cube Roots'] },
        { chapter: 'Sets, Percentage, Profit-Loss & Compound Interest', topics: ['Set Operations, Venn Diagrams', 'Compound Interest (Annual/Half-Yearly)'] },
        { chapter: 'Algebraic Expressions, Factorization & Linear Equations', topics: ['Algebraic Identities & Splitting Middle Term', 'Linear Inequations on Number Line'] },
        { chapter: 'Quadrilaterals, Circles & Mensuration', topics: ['Polygons, Trapezium, Cylinder & Cone Volume/TSA'] },
      ],
    },
  },

  // CLASS 9
  '9': {
    CBSE: {
      Physics: [
        { chapter: 'Motion', topics: ['Distance vs Displacement, Speed & Velocity', 'Equations of Uniformly Accelerated Motion', 'Distance-Time & Velocity-Time Graphs', 'Uniform Circular Motion'] },
        { chapter: 'Force and Laws of Motion', topics: ['Balanced/Unbalanced Forces & Inertia', 'Newton’s Second Law & Momentum (F = ma)', 'Conservation of Momentum & Recoil'] },
        { chapter: 'Gravitation', topics: ['Universal Law of Gravitation & Free Fall', 'Mass vs Weight', 'Thrust, Pressure, Buoyancy & Archimedes’ Principle'] },
        { chapter: 'Work and Energy', topics: ['Work Done & Conditions for Zero Work', 'Kinetic Energy, Potential Energy & Conservation', 'Commercial Unit of Energy (kWh) & Power'] },
        { chapter: 'Sound', topics: ['Longitudinal Waves, Wavelength, Frequency & Speed', 'Reflection of Sound, Echo & Reverberation', 'Ultrasound Applications & SONAR'] },
      ],
      Chemistry: [
        { chapter: 'Matter in Our Surroundings', topics: ['Characteristics of Particles & States of Matter', 'Latent Heat of Fusion/Vaporization & Sublimation', 'Evaporation & Factors Affecting Cooling'] },
        { chapter: 'Is Matter Around Us Pure?', topics: ['True Solutions, Colloids (Tyndall Effect) & Suspensions', 'Concentration (% w/w, % w/v) & Alloys', 'Physical vs Chemical Changes'] },
        { chapter: 'Atoms and Molecules', topics: ['Laws of Conservation of Mass & Constant Proportions', 'Dalton’s Atomic Theory & Atomicity', 'Writing Chemical Formulae & Molecular Mass'] },
        { chapter: 'Structure of the Atom', topics: ['Thomson, Rutherford & Bohr Atomic Models', 'Valency, Isotopes & Isobars'] },
      ],
      Biology: [
        { chapter: 'The Fundamental Unit of Life', topics: ['Prokaryotic vs Eukaryotic Cell', 'Plasma Membrane, Osmosis & Plasmolysis', 'Organelles: ER, Golgi, Lysosomes, Mitochondria, Plastids'] },
        { chapter: 'Tissues', topics: ['Plant Tissues: Meristematic, Parenchyma, Collenchyma, Sclerenchyma, Xylem, Phloem', 'Animal Tissues: Epithelial, Connective, Muscular & Nervous'] },
        { chapter: 'Improvement in Food Resources', topics: ['Crop Variety, Manure vs Fertilizers & Cropping Patterns', 'Animal Husbandry, Poultry & Pisciculture'] },
      ],
      'Science (Combined)': [
        { chapter: 'Matter, Atoms & Atomic Structure', topics: ['Evaporation & Colloids', 'Laws of Chemical Combination & Formulae', 'Bohr Model, Isotopes & Isobars'] },
        { chapter: 'Cell & Tissues', topics: ['Osmosis & Cell Organelles', 'Plant & Animal Tissues'] },
        { chapter: 'Motion, Force & Gravitation', topics: ['v-t Graphs & Equations of Motion', 'Momentum Conservation & Archimedes Principle'] },
        { chapter: 'Work, Energy & Sound', topics: ['Mechanical Energy Conservation & kWh', 'Echo, SONAR & Wave Equation'] },
      ],
      Mathematics: [
        { chapter: 'Number Systems', topics: ['Rational & Irrational Numbers on Number Line', 'Rationalization & Laws of Exponents for Real Numbers'] },
        { chapter: 'Polynomials', topics: ['Zeroes, Remainder Theorem & Factor Theorem', 'Algebraic Identities (a³+b³+c³−3abc) & Factorization'] },
        { chapter: 'Coordinate Geometry & Linear Equations in Two Variables', topics: ['Cartesian Plane & Plotting Points', 'Solutions & Graphs of ax + by + c = 0'] },
        { chapter: 'Lines, Angles & Triangles', topics: ['Parallel Lines, Transversal & Angle Sum Property', 'Congruence Criteria (SAS, ASA, SSS, RHS) & Inequalities'] },
        { chapter: 'Quadrilaterals & Circles', topics: ['Parallelogram Properties & Mid-Point Theorem', 'Chords, Angle Subtended at Centre & Cyclic Quadrilaterals'] },
        { chapter: 'Heron’s Formula, Surface Areas & Volumes & Statistics', topics: ['Heron’s Formula Applications', 'Surface Area & Volume of Cone, Sphere & Hemisphere', 'Histograms & Frequency Polygons'] },
      ],
    },
    ICSE: {
      Physics: [
        { chapter: 'Measurements and Experimentation', topics: ['SI Units, Vernier Callipers & Screw Gauge', 'Simple Pendulum & Time-Period Graph'] },
        { chapter: 'Motion in One Dimension', topics: ['Scalar/Vector, Graphs (x-t, v-t) & Equations of Motion'] },
        { chapter: 'Laws of Motion', topics: ['Newton’s 3 Laws, Linear Momentum & Gravitation (g vs G)'] },
        { chapter: 'Fluids (Pressure & Upthrust)', topics: ['Pascal’s Law, Hydraulic Press & Atmospheric Pressure', 'Upthrust, Archimedes’ Principle & Floatation'] },
        { chapter: 'Heat and Energy', topics: ['Anomalous Expansion of Water & Hope’s Experiment', 'Greenhouse Effect & Energy Sources'] },
        { chapter: 'Light (Reflection at Plane & Spherical Mirrors)', topics: ['Laws of Reflection & Periscope/Kaleidoscope', 'Concave/Convex Mirror Formula & Ray Diagrams'] },
        { chapter: 'Sound, Electricity & Magnetism', topics: ['Wave Velocity v = fλ, Ultrasonic Applications', 'Electric Current, Potential & Neutral Points in Magnetism'] },
      ],
      Chemistry: [
        { chapter: 'The Language of Chemistry', topics: ['Symbols, Radicals, Formulae & Balancing Equations', 'Relative Atomic/Molecular Mass & % Composition'] },
        { chapter: 'Chemical Changes & Reactions', topics: ['Direct Combination, Decomposition, Displacement & Double Decomposition'] },
        { chapter: 'Water & Solutions', topics: ['Solubility Curves, Efflorescence, Deliquescence & Soft/Hard Water'] },
        { chapter: 'Atomic Structure & Chemical Bonding', topics: ['Bohr Model, Octet Rule, Electrovalent & Covalent Bonding'] },
        { chapter: 'The Periodic Table & Study of Hydrogen', topics: ['Dobereiner, Newlands, Mendeleev & Modern Periodic Table', 'Bosch Process & Laboratory Preparation of Hydrogen'] },
        { chapter: 'Study of Gas Laws & Atmospheric Pollution', topics: ['Boyle’s Law, Charles’s Law & Kelvin Scale Numerics', 'Acid Rain, Global Warming & Ozone Depletion'] },
      ],
      Biology: [
        { chapter: 'Cell, Plant & Animal Tissues', topics: ['Cell Organelles & Differences Plant vs Animal Cell', 'Meristematic, Complex Plant & Animal Tissues'] },
        { chapter: 'Flower, Pollination, Fertilisation & Seeds', topics: ['Parts of Flower, Self vs Cross Pollination', 'Double Fertilisation & Epigeal/Hypogeal Germination'] },
        { chapter: 'Respiration in Plants & Five Kingdom Classification', topics: ['Glycolysis/Krebs Overview & Experiments', 'Animal Phyla & Plant Divisions'] },
        { chapter: 'Nutrition, Digestive, Skeleton, Skin & Respiratory Systems', topics: ['Human Teeth, Enzymes & Peristalsis', 'Joints, Skin Heat Regulation & Alveolar Gas Exchange'] },
      ],
      Mathematics: [
        { chapter: 'Rational & Irrational Numbers + Compound Interest', topics: ['Surds, Rationalization & Compound Interest Growth'] },
        { chapter: 'Expansions, Factorisation & Simultaneous Equations', topics: ['(x ± 1/x) Expansions & Splitting Middle Term', 'Cross-Multiplication & Word Problems'] },
        { chapter: 'Indices & Logarithms', topics: ['Laws of Indices & Laws of Logarithms Numerics'] },
        { chapter: 'Triangles, Mid-Point Theorem & Pythagoras Theorem', topics: ['Congruence, Isosceles Triangle & Mid-Point Theorem', 'Pythagoras Theorem Applications'] },
        { chapter: 'Rectilinear Figures, Circle & Mensuration', topics: ['Polygons, Chord Properties of Circle', 'Cube, Cuboid & Cylinder TSA/Volume'] },
        { chapter: 'Trigonometry & Coordinate Geometry', topics: ['Trigonometric Ratios of Standard Angles (0°–90°)', 'Distance Formula & Graphical Solution of Linear Equations'] },
      ],
    },
  },

  // CLASS 10
  '10': {
    CBSE: {
      Physics: [
        { chapter: 'Light — Reflection and Refraction', topics: ['Spherical Mirrors, Ray Diagrams & Mirror Formula', 'Laws of Refraction, Refractive Index & Snell’s Law', 'Spherical Lenses, Lens Formula & Power of Lens'] },
        { chapter: 'The Human Eye and the Colourful World', topics: ['Defects of Vision (Myopia, Hypermetropia, Presbyopia)', 'Refraction through Prism, Dispersion & Atmospheric Refraction', 'Tyndall Effect & Scattering of Light'] },
        { chapter: 'Electricity', topics: ['Electric Current, Potential Difference & Ohm’s Law', 'Resistivity, Series & Parallel Combination of Resistors', 'Heating Effect (Joule’s Law) & Electrical Power'] },
        { chapter: 'Magnetic Effects of Electric Current', topics: ['Magnetic Field Lines & Right-Hand Thumb Rule', 'Solenoid & Force on Current-Carrying Conductor (Fleming’s Left-Hand Rule)', 'Domestic Electric Circuits, Fuse & Earthing'] },
      ],
      Chemistry: [
        { chapter: 'Chemical Reactions and Equations', topics: ['Balancing Chemical Equations & State Symbols', 'Combination, Decomposition, Displacement & Double Displacement', 'Oxidation, Reduction, Corrosion & Rancidity'] },
        { chapter: 'Acids, Bases and Salts', topics: ['Chemical Properties of Acids & Bases + Indicators', 'pH Scale, Universal Indicator & Importance in Daily Life', 'Chlor-Alkali Process, Bleaching Powder, Baking Soda, Washing Soda & POP'] },
        { chapter: 'Metals and Non-Metals', topics: ['Reactivity Series & Reaction with Water/Acids', 'Ionic Bonding & Properties of Ionic Compounds', 'Metallurgy (Roasting, Calcination, Thermite) & Corrosion Prevention'] },
        { chapter: 'Carbon and Its Compounds', topics: ['Covalent Bonding, Allotropes & Versatile Nature of Carbon', 'Homologous Series, Functional Groups & IUPAC Nomenclature', 'Combustion, Oxidation, Addition, Substitution, Ethanol & Ethanoic Acid'] },
      ],
      Biology: [
        { chapter: 'Life Processes', topics: ['Autotrophic Photosynthesis & Stomatal Regulation', 'Human Digestive System & Enzymes', 'Aerobic/Anaerobic Respiration & Human Lungs', 'Human Heart, Double Circulation & Xylem/Phloem Transport', 'Nephron Structure & Urine Formation'] },
        { chapter: 'Control and Coordination', topics: ['Neuron, Reflex Arc & Human Brain Parts', 'Plant Tropic Movements & Phytohormones (Auxin, GA, ABA)', 'Human Endocrine Glands & Feedback Mechanism'] },
        { chapter: 'How Do Organisms Reproduce?', topics: ['Asexual Modes (Fission, Budding, Regeneration, Tissue Culture)', 'Sexual Reproduction in Flowering Plants', 'Human Reproductive Systems & Contraceptive Methods'] },
        { chapter: 'Heredity & Our Environment', topics: ['Mendel’s Monohybrid & Dihybrid Crosses + Sex Determination', 'Food Chains, 10% Energy Law, Biological Magnification & Ozone'] },
      ],
      'Science (Combined)': [
        { chapter: 'Chemical Reactions, Acids, Metals & Carbon', topics: ['Balancing Equations & Redox', 'pH & Industrial Salts', 'Metallurgy & IUPAC/Reactions of Carbon Compounds'] },
        { chapter: 'Life Processes, Control, Reproduction & Heredity', topics: ['Photosynthesis, Heart & Nephron', 'Reflex Arc & Hormones', 'Mendel’s Crosses & 10% Energy Law'] },
        { chapter: 'Light, Human Eye, Electricity & Magnetism', topics: ['Mirror & Lens Formula Numerics', 'Myopia/Hypermetropia & Prism', 'Ohm’s Law, Equivalent Resistance & Domestic Circuits'] },
      ],
      Mathematics: [
        { chapter: 'Real Numbers', topics: ['Fundamental Theorem of Arithmetic (HCF × LCM)', 'Proof of Irrationality (√2, √3, √5)'] },
        { chapter: 'Polynomials & Pair of Linear Equations', topics: ['Zeroes & Coefficient Relations of Quadratic Polynomials', 'Consistency Conditions, Substitution & Elimination Methods'] },
        { chapter: 'Quadratic Equations', topics: ['Factorization & Quadratic Formula', 'Discriminant & Nature of Roots + Word Problems'] },
        { chapter: 'Arithmetic Progressions', topics: ['nth Term (an) & Sum of First n Terms (Sn)', 'AP Word Problems & Series Logic'] },
        { chapter: 'Triangles & Coordinate Geometry', topics: ['Basic Proportionality Theorem (Thales) & Similarity Criteria', 'Distance Formula, Section Formula & Mid-Point'] },
        { chapter: 'Introduction to Trigonometry & Heights/Distances', topics: ['Trigonometric Ratios, Standard Angles & Identities', 'Angles of Elevation & Depression Word Problems'] },
        { chapter: 'Circles & Mensuration', topics: ['Tangent Perpendicular to Radius & Equal Tangents Theorem', 'Sector/Segment Area, Combined Solids (Cylinder/Cone/Sphere)'] },
        { chapter: 'Statistics & Probability', topics: ['Mean (Direct/Assumed/Step), Median & Mode of Grouped Data', 'Classical Probability (Dice, Coins, Playing Cards)'] },
      ],
    },
    ICSE: {
      Physics: [
        { chapter: 'Force, Work, Energy & Power', topics: ['Torque (Moment of Force), Equilibrium & Centre of Gravity', 'Uniform Circular Motion & Conservation of Mechanical Energy'] },
        { chapter: 'Machines', topics: ['MA, VR & Efficiency of Levers and Pulley Systems'] },
        { chapter: 'Refraction of Light at Plane Surfaces & Lenses', topics: ['Snell’s Law, Apparent Depth, Prism & Total Internal Reflection', 'Convex/Concave Lens Ray Diagrams, Lens Formula & Power'] },
        { chapter: 'Spectrum & Sound', topics: ['Electromagnetic Spectrum, Scattering & Dispersion', 'Echoes, Free/Damped/Forced Vibrations & Resonance'] },
        { chapter: 'Current Electricity & Household Circuits', topics: ['Ohm’s Law, Internal Resistance, EMF & Combination of Resistors', 'Electrical Power, kWh, Ring System, Fuse & Earthing'] },
        { chapter: 'Electro-magnetism, Calorimetry & Radioactivity', topics: ['Solenoid, DC Motor, AC Generator & Transformer', 'Specific Heat, Latent Heat & Mixtures Numerics', 'Alpha, Beta, Gamma Emission & Nuclear Fission/Fusion'] },
      ],
      Chemistry: [
        { chapter: 'Periodic Properties & Chemical Bonding', topics: ['Periodic Trends (IE, EA, EN, Atomic Size)', 'Ionic, Covalent & Coordinate Bonding (Electron Dot Diagrams)'] },
        { chapter: 'Acids, Bases, Salts & Analytical Chemistry', topics: ['Preparation of Salts & pH Scale', 'Action of NaOH & NH4OH on Metallic Salt Solutions'] },
        { chapter: 'Mole Concept & Stoichiometry', topics: ['Gay-Lussac’s Law, Avogadro’s Law & Vapour Density', 'Empirical/Molecular Formula & Limiting Stoichiometry'] },
        { chapter: 'Electrolysis & Metallurgy', topics: ['Selective Discharge, Electroplating & Electrorefining', 'Extraction of Aluminium (Baeyer’s & Hall-Héroult) & Alloys'] },
        { chapter: 'Study of Compounds (HCl, NH3, HNO3, H2SO4)', topics: ['Fountain Experiment & Properties of HCl / Ammonia', 'Ostwald Process (HNO3) & Contact Process (H2SO4)'] },
        { chapter: 'Organic Chemistry (ICSE)', topics: ['IUPAC Naming, Isomerism & Homologous Series', 'Preparation & Reactions of Alkanes, Alkenes, Alkynes, Alcohols & Carboxylic Acids'] },
      ],
      Biology: [
        { chapter: 'Cell Cycle, Chromosomes & Genetics', topics: ['Mitosis vs Meiosis, DNA Structure & Mendel’s Laws', 'Sex-Linked Inheritance (Haemophilia, Colour Blindness)'] },
        { chapter: 'Plant Physiology (Absorption, Transpiration, Photosynthesis)', topics: ['Osmosis, Turgidity, Plasmolysis & Root Pressure', 'Potometer, Stomata & Light/Dark Reactions of Photosynthesis', 'Phytohormones & Tropic Movements'] },
        { chapter: 'Human Circulatory, Excretory, Nervous & Endocrine Systems', topics: ['Heart Valves, Blood Vessels & Cardiac Cycle', 'Nephron Ultrafiltration, Brain, Eye/Ear Defects & Hormones'] },
        { chapter: 'Reproductive System, Evolution & Pollution', topics: ['Menstrual Cycle, Placenta, Contraception & Population Control', 'Lamarckism vs Darwinism & Environmental Pollution'] },
      ],
      Mathematics: [
        { chapter: 'GST, Banking & Shares and Dividends', topics: ['CGST/SGST Billing, Recurring Deposit Accounts & Share Yield'] },
        { chapter: 'Linear Inequations & Quadratic Equations', topics: ['Solving Inequations on R/Z/N & Nature of Roots Word Problems'] },
        { chapter: 'Ratio, Proportion, Remainder & Factor Theorem', topics: ['Componendo-Dividendo & Factorizing Cubic Polynomials'] },
        { chapter: 'Matrices, AP & GP', topics: ['Matrix Multiplication & 2×2 Equations', 'nth Term & Sum of AP and Geometric Progression (GP)'] },
        { chapter: 'Coordinate Geometry (Reflection, Section & Line)', topics: ['Reflection in Axes/Origin, Section Formula & Equation of Line'] },
        { chapter: 'Similarity, Loci & Circles', topics: ['BPT, Area Ratio of Similar Triangles & Tangent-Secant Theorems'] },
        { chapter: 'Mensuration, Trigonometry, Statistics & Probability', topics: ['Cylinder, Cone & Sphere Combinations', 'Trigonometric Identities & Heights/Distances', 'Mean, Median, Ogive & Probability'] },
      ],
    },
  },
};

// Shared Social Science, Languages & CS for Classes 7–10
const JUNIOR_HUMANITIES_AND_CS: Record<string, Record<string, ChapterEntry[]>> = {
  History: {
    CBSE: [
      { chapter: 'Rise of Nationalism in Europe (Class 10) / French Revolution (Class 9)', topics: ['French Revolution & Napoleonic Code', 'Unification of Germany & Italy', 'Visualising the Nation & Balkan Crisis'] },
      { chapter: 'Nationalism in India & Freedom Struggle', topics: ['Non-Cooperation & Khilafat Movement', 'Civil Disobedience, Dandi March & Poona Pact', 'Quit India Movement & Subhas Chandra Bose (INA)'] },
      { chapter: 'Colonialism, Revolt of 1857 & Tribal Movements (Jharkhand)', topics: ['Permanent Settlement, Ryotwari & Mahalwari Systems', 'Revolt of 1857 & Birsa Munda Ulgulan / Santhal Hul (JAC)'] },
      { chapter: 'Medieval India: Delhi Sultanate & Mughal Empire', topics: ['Administration under Alauddin Khalji & Akbar', 'Bhakti, Sufi Movements & Mughal Architecture'] },
    ],
    ICSE: [
      { chapter: 'The First War of Independence (1857) & Growth of Nationalism', topics: ['Political, Socio-Religious & Military Causes of 1857', 'Foundation of INC, Early Nationalists & Assertive Nationalists'] },
      { chapter: 'The Gandhian Era (1919–1947)', topics: ['Non-Cooperation, Civil Disobedience & Quit India Movement', 'Cabinet Mission, Mountbatten Plan & Independence'] },
      { chapter: 'The Contemporary World (World Wars & UN)', topics: ['Causes & Consequences of First and Second World Wars', 'Rise of Fascism/Nazism, United Nations & NAM'] },
    ],
  },
  Civics: {
    CBSE: [
      { chapter: 'Indian Constitution, Fundamental Rights & Electoral Politics', topics: ['Preamble, Fundamental Rights & Duties', 'Election Commission & Democratic Elections'] },
      { chapter: 'Power Sharing & Federalism', topics: ['Belgium/Sri Lanka Models & Forms of Power Sharing', 'Union, State, Concurrent Lists & Panchayati Raj'] },
      { chapter: 'Parliament, Executive, Judiciary & Political Parties', topics: ['Lok Sabha vs Rajya Sabha & Law-Making', 'Supreme Court & Judicial Review', 'National/State Political Parties & Challenges'] },
    ],
    ICSE: [
      { chapter: 'The Union Legislature (Lok Sabha & Rajya Sabha)', topics: ['Composition, Qualifications, Powers & Parliamentary Procedures'] },
      { chapter: 'The Union Executive (President, PM & Council of Ministers)', topics: ['Election & Emergency Powers of President', 'Collective Responsibility of Cabinet'] },
      { chapter: 'The Judiciary (Supreme Court & High Courts)', topics: ['Original, Appellate & Advisory Jurisdiction + Writs'] },
    ],
  },
  Geography: {
    CBSE: [
      { chapter: 'India: Size, Physical Features, Drainage & Climate', topics: ['Himalayas, Northern Plains & Peninsular Plateau', 'Himalayan vs Peninsular Rivers & Monsoon Mechanism'] },
      { chapter: 'Resources, Agriculture & Soils of India', topics: ['Alluvial, Black, Laterite & Soil Conservation', 'Rabi, Kharif, Zaid Crops & Green Revolution'] },
      { chapter: 'Minerals, Energy & Manufacturing Industries (Jharkhand Focus)', topics: ['Coal, Iron Ore & Mica Belts of Chotanagpur (Jharkhand)', 'TISCO Jamshedpur, Bokaro Steel & Non-Conventional Energy'] },
    ],
    ICSE: [
      { chapter: 'Interpretation of Topographical Maps & Climate of India', topics: ['Four/Six-Figure Grid Reference, Contours & Drainage', 'SW Monsoon, Western Disturbances & Retreating Monsoon'] },
      { chapter: 'Soils, Natural Vegetation & Water Resources', topics: ['Soil Erosion Control, Tropical Forests & Rainwater Harvesting'] },
      { chapter: 'Minerals, Agriculture, Industries & Transport in India', topics: ['Iron, Manganese, Coal, Petroleum & Agro/Mineral Industries'] },
    ],
  },
  'Social Science (Combined)': {
    CBSE: [
      { chapter: 'Nationalism in India & Europe', topics: ['Gandhian Mass Movements', 'French Revolution & German/Italian Unification', 'Jharkhand Tribal Movements (JAC)'] },
      { chapter: 'Resources, Agriculture, Minerals & Industries', topics: ['Cropping Seasons & Soil Types', 'Chotanagpur Mineral Belt & Steel Plants'] },
      { chapter: 'Power Sharing, Federalism & Indian Economy', topics: ['Decentralisation & Local Government', 'Sectors of Economy, Money, Credit & Globalisation'] },
    ],
  },
  Hindi: {
    CBSE: [
      { chapter: 'हिन्दी व्याकरण (संधि, समास, वाक्य एवं अलंकार)', topics: ['स्वर, व्यंजन एवं विसर्ग संधि', 'समास भेद (तत्पुरुष, कर्मधारय, द्विगु, द्वन्द्व, बहुव्रीहि)', 'रचना के आधार पर वाक्य भेद एवं वाच्य', 'रस, छंद, अलंकार एवं पद परिचय'] },
      { chapter: 'गद्य एवं पद्य खंड (क्षितिज / कृतिका / स्पर्श)', topics: ['कबीर की साखियाँ एवं पद', 'सूरदास के पद एवं तुलसीदास संवाद', 'प्रेमचंद: दो बैलों की कथा / ईदगाह', 'अपठित गद्यांश, अनुच्छेद एवं पत्र लेखन'] },
    ],
  },
  English: {
    CBSE: [
      { chapter: 'Applied Grammar & Sentence Transformation', topics: ['Tenses, Modals & Subject-Verb Concord', 'Active-Passive Voice & Direct-Indirect Speech', 'Determiners, Clauses & Editing/Omission'] },
      { chapter: 'Reading Comprehension & Writing Skills', topics: ['Discursive & Case-Based Factual Passages', 'Formal Letter, Analytical Paragraph & Notice Writing'] },
      { chapter: 'Prose & Poetry Analysis', topics: ['Extract-Based Questions & Poetic Devices', 'Themes, Character Sketches & Extrapolative Answers'] },
    ],
    ICSE: [
      { chapter: 'ICSE Functional Grammar & Synthesis', topics: ['Prepositions, Phrasal Verbs & Tenses', 'Transformation of Sentences (No sooner, Too..to, Active/Passive, Reported Speech)'] },
      { chapter: 'Composition, Letter & Comprehension', topics: ['Essay, Formal/Informal Letter, Notice, Email & Precis Writing'] },
    ],
  },
  Sanskrit: {
    CBSE: [
      { chapter: 'संस्कृत व्याकरणम्', topics: ['सन्धिः (स्वर, व्यञ्जन, विसर्ग)', 'समासः (तत्पुरुष, द्वन्द्व, बहुव्रीहि, अव्ययीभाव)', 'लकार, शब्दरूप एवं धातुरूप', 'प्रत्ययाः (क्त्वा, तुमुन्, ल्यप्, शतृ) एवं वाच्यपरिवर्तनम्'] },
      { chapter: 'शेमुषी / रुचिरा (गद्य-पद्य)', topics: ['श्लोक अन्वयः एवं भावार्थः', 'प्रश्ननिर्माणम् एवं घटनाक्रमः'] },
    ],
  },
  'Computer Science': {
    CBSE: [
      { chapter: 'Python Programming & Problem Solving', topics: ['Variables, Loops, Conditionals & Functions', 'Lists, Strings, Tuples & Dictionaries'] },
      { chapter: 'Databases (SQL), Cyber Safety & Networking', topics: ['SQL Queries (SELECT, WHERE, ORDER BY, GROUP BY)', 'Network Topologies, Protocols & HTML/CSS'] },
    ],
    ICSE: [
      { chapter: 'Object-Oriented Programming in Java (BlueJ)', topics: ['Classes, Objects, Encapsulation & Constructors', 'Decision Making, Nested Loops & Function Overloading'] },
      { chapter: 'Arrays, Strings & Library Classes (ICSE Class 10)', topics: ['Linear/Binary Search & Bubble/Selection Sort', 'String Handling Methods & Wrapper Classes'] },
    ],
  },
};

export function getSyllabusChapters(
  classLevel: ClassLevel,
  subject: string,
  boardOrExam?: string,
): ChapterEntry[] {
  const clsNum = parseInt(classLevel, 10);

  // Classes 7–10
  if (clsNum <= 10) {
    const boardKey = boardOrExam === 'ICSE' ? 'ICSE' : 'CBSE';
    const classData = JUNIOR_CATALOG[classLevel]?.[boardKey]?.[subject] || JUNIOR_CATALOG[classLevel]?.CBSE?.[subject];
    if (classData && classData.length > 0) {
      return classData;
    }
    const humanities = JUNIOR_HUMANITIES_AND_CS[subject]?.[boardKey] || JUNIOR_HUMANITIES_AND_CS[subject]?.CBSE;
    if (humanities && humanities.length > 0) {
      return humanities;
    }
    return [];
  }

  // Classes 11–12
  const exam = boardOrExam || 'JEE Mains';
  if (subject === 'Physics') {
    const base = classLevel === '11' ? CLASS_11_PHYSICS_BASE : CLASS_12_PHYSICS_BASE;
    if (exam === 'Board Exams') {
      return base.map((c) => ({
        ...c,
        topics: c.topics.filter((t) => !t.includes('(JEE')),
      }));
    }
    return base;
  }

  if (subject === 'Chemistry') {
    if (classLevel === '11') {
      if (exam === 'JEE Advanced') {
        return [...CLASS_11_CHEMISTRY_BASE, ...CLASS_11_CHEMISTRY_JEE_ADV_EXTRAS];
      }
      if (exam === 'Board Exams') {
        return CLASS_11_CHEMISTRY_BASE.map((c) => ({
          ...c,
          topics: c.topics.filter((t) => !t.includes('(JEE')),
        }));
      }
      return CLASS_11_CHEMISTRY_BASE;
    }
    // Class 12 Chemistry
    if (exam === 'JEE Advanced') {
      return [...CLASS_12_CHEMISTRY_BASE, ...CLASS_12_CHEMISTRY_EXTRA, ...CLASS_12_CHEMISTRY_JEE_ADV_EXTRAS];
    }
    if (exam === 'JEE Mains' || exam === 'NEET') {
      return [...CLASS_12_CHEMISTRY_BASE, ...CLASS_12_CHEMISTRY_EXTRA];
    }
    return CLASS_12_CHEMISTRY_BASE.map((c) => ({
      ...c,
      topics: c.topics.filter((t) => !t.includes('(JEE')),
    }));
  }

  if (subject === 'Mathematics') {
    const base = classLevel === '11' ? CLASS_11_MATHS_BASE : CLASS_12_MATHS_BASE;
    if (exam === 'Board Exams') {
      return base.map((c) => ({
        ...c,
        topics: c.topics.filter((t) => !t.includes('(JEE')),
      }));
    }
    if (exam === 'JEE Advanced') {
      return base.filter((c) => c.chapter !== 'Linear Programming');
    }
    return base;
  }

  if (subject === 'Biology') {
    return classLevel === '11' ? CLASS_11_BIOLOGY_BASE : CLASS_12_BIOLOGY_BASE;
  }

  return [];
}
