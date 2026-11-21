import type { ChapterEntry } from './syllabusCatalog';

export const JUNIOR_CATALOG: Record<string, Record<string, Record<string, ChapterEntry[]>>> = {
  // ---------- CLASS 7 ----------
  '7': {
    CBSE: {
      Physics: [
        {
          chapter: 'Heat & Temperature',
          topics: [
            'Hot vs Cold & Concept of Temperature',
            'Clinical Thermometer: Range, Kink & Precautions',
            'Laboratory Thermometer & Digital Thermometer',
            'Conduction in Solids, Conductors & Insulators',
            'Convection in Liquids & Gases',
            'Sea Breeze & Land Breeze Mechanism',
            'Radiation & Role of Dark vs Light Coloured Clothes',
          ],
        },
        {
          chapter: 'Motion & Time',
          topics: [
            'Slow vs Fast Motion & Concept of Speed',
            'Uniform vs Non-Uniform Motion',
            'Measurement of Time & Simple Pendulum Time Period',
            'Units of Speed (m/s, km/h) & Conversion',
            'Odometer & Speedometer Applications',
            'Plotting & Interpreting Distance-Time Graphs',
          ],
        },
        {
          chapter: 'Electric Current & Its Effects',
          topics: [
            'Symbols of Electric Components & Circuit Diagrams',
            'Battery (Combination of Cells) & Open/Closed Circuits',
            'Heating Effect of Electric Current (Nichrome Element)',
            'Electric Fuse, Miniature Circuit Breaker (MCB) & Short Circuit',
            'Magnetic Effect of Electric Current (Oersted Experiment)',
            'Electromagnet Construction, Factors & Electric Bell',
          ],
        },
        {
          chapter: 'Light',
          topics: [
            'Rectilinear Propagation of Light',
            'Laws of Reflection & Plane Mirror Image Characteristics',
            'Lateral Inversion in Plane Mirrors',
            'Concave vs Convex Mirrors (Real/Virtual Images & Uses)',
            'Convex vs Concave Lenses (Magnifying & Diverging)',
            'Dispersion of Sunlight Through Prism & Newton’s Colour Disc',
          ],
        },
      ],
      Chemistry: [
        {
          chapter: 'Acids, Bases & Salts',
          topics: [
            'Properties & Examples of Organic and Mineral Acids',
            'Properties & Examples of Bases & Alkalis',
            'Natural Indicators: Litmus Paper, Turmeric & China Rose',
            'Phenolphthalein & Methyl Orange Indicator Tests',
            'Neutralization Reaction (Acid + Base → Salt + Water)',
            'Neutralization in Daily Life (Indigestion, Ant Bite, Soil & Factory Waste)',
          ],
        },
        {
          chapter: 'Physical & Chemical Changes',
          topics: [
            'Characteristics & Examples of Physical Changes',
            'Characteristics & Examples of Chemical Changes',
            'Magnesium Ribbon Burning, CuSO4 + Iron & Vinegar + Baking Soda',
            'Rusting of Iron: Conditions & Chemical Equation',
            'Prevention of Rusting (Painting, Greasing, Galvanization, Alloying)',
            'Crystallization of Copper Sulphate',
          ],
        },
        {
          chapter: 'Wastewater Story & Water',
          topics: [
            'Sources & Composition of Sewage Contaminants',
            'Wastewater Treatment Plant (Bar Screens, Grit Tank, Clarifier, Aeration)',
            'Sludge Treatment & Biogas Generation',
            'Sanitation Practices & Vermi-Processing Toilets',
          ],
        },
      ],
      Biology: [
        {
          chapter: 'Nutrition in Plants',
          topics: [
            'Autotrophic vs Heterotrophic Nutrition',
            'Photosynthesis Equation, Chlorophyll, Stomata & Starch Test',
            'Synthesis of Plant Proteins & Nitrogen Fixation (Rhizobium)',
            'Parasitic (Cuscuta), Insectivorous (Pitcher Plant) & Saprotrophic Nutrition',
            'Symbiotic Relationship (Lichens & Mycorrhiza)',
          ],
        },
        {
          chapter: 'Nutrition in Animals',
          topics: [
            'Five Steps of Animal Nutrition (Ingestion to Egestion)',
            'Human Teeth Types, Dental Care & Tongue Functions',
            'Human Digestive Tract: Oesophagus, Stomach, Small & Large Intestine',
            'Digestive Glands (Salivary, Liver Bile, Pancreas) & Villi Absorption',
            'Digestion in Grass-Eating Ruminants (Rumen) & Amoeba Pseudopodia',
          ],
        },
        {
          chapter: 'Respiration in Organisms',
          topics: [
            'Cellular Respiration: Aerobic vs Anaerobic Respiration (Yeast & Muscle Cramps)',
            'Breathing Rate & Inhalation/Exhalation Rib-Diaphragm Mechanism',
            'Percentage of O2 & CO2 in Inhaled vs Exhaled Air',
            'Breathing in Cockroach (Spiracles), Earthworm (Skin), Frog & Fish (Gills)',
            'Respiration in Plant Roots, Stems & Leaves',
          ],
        },
        {
          chapter: 'Transportation in Animals & Plants',
          topics: [
            'Blood Components (Plasma, RBC, WBC, Platelets)',
            'Blood Vessels: Arteries, Veins & Capillaries',
            'Human Heart Chambers, Pulse Rate & Circulation',
            'Human Excretory System (Kidneys, Ureters, Bladder) & Sweat',
            'Transport in Plants: Xylem, Phloem, Root Hair Osmosis & Transpiration',
          ],
        },
        {
          chapter: 'Reproduction in Plants & Forests',
          topics: [
            'Asexual Reproduction: Vegetative Propagation, Budding (Yeast), Fragmentation & Spores',
            'Sexual Reproduction: Flower Parts, Unisexual vs Bisexual Flowers',
            'Self-Pollination vs Cross-Pollination, Fertilisation & Fruit/Seed Formation',
            'Seed Dispersal by Wind, Water, Animals & Explosion',
            'Forest Ecosystem: Canopy, Food Chains, Decomposers & Conservation',
          ],
        },
      ],
      'Science (Combined)': [
        {
          chapter: 'Nutrition in Plants & Animals',
          topics: [
            'Photosynthesis, Stomata & Symbiosis',
            'Human Digestive System, Enzymes & Villi',
            'Digestion in Ruminants & Amoeba',
          ],
        },
        {
          chapter: 'Heat, Acids, Bases & Physical/Chemical Changes',
          topics: [
            'Thermometers & Conduction/Convection/Radiation',
            'Indicators & Neutralization Reactions',
            'Physical vs Chemical Changes, Rusting & Crystallization',
          ],
        },
        {
          chapter: 'Respiration, Transportation & Reproduction in Plants',
          topics: [
            'Aerobic vs Anaerobic Respiration & Breathing Mechanism',
            'Blood, Heart, Excretion, Xylem & Phloem',
            'Vegetative Propagation, Pollination & Seed Dispersal',
          ],
        },
        {
          chapter: 'Motion, Time, Electric Current & Light',
          topics: [
            'Speed, Simple Pendulum & Distance-Time Graphs',
            'Circuit Symbols, Fuse & Electromagnet',
            'Plane/Spherical Mirrors, Lenses & Newton’s Disc',
          ],
        },
      ],
      Mathematics: [
        {
          chapter: 'Integers',
          topics: [
            'Addition, Subtraction & Number Line Representation of Integers',
            'Closure, Commutative, Associative & Distributive Properties',
            'Multiplication & Division of Integers + BODMAS',
          ],
        },
        {
          chapter: 'Fractions & Decimals',
          topics: [
            'Proper, Improper, Mixed & Equivalent Fractions',
            'Multiplication & Division of Fractions (Reciprocal)',
            'Place Value, Multiplication & Division of Decimals',
          ],
        },
        {
          chapter: 'Data Handling',
          topics: [
            'Arithmetic Mean, Range, Mode & Median of Ungrouped Data',
            'Single & Double Bar Graphs Interpretation',
          ],
        },
        {
          chapter: 'Simple Equations',
          topics: [
            'Setting Up Linear Equations from Statements',
            'Solving Equations by Balancing & Transposition Method',
            'Word Problems on Ages, Numbers & Perimeter',
          ],
        },
        {
          chapter: 'Lines, Angles & Triangles',
          topics: [
            'Complementary, Supplementary, Adjacent & Vertically Opposite Angles',
            'Parallel Lines Cut by Transversal (Corresponding, Alternate, Co-Interior)',
            'Medians & Altitudes of a Triangle',
            'Exterior Angle Property & Angle Sum Property of Triangles',
            'Triangle Inequality Property & Pythagoras Theorem',
          ],
        },
        {
          chapter: 'Comparing Quantities',
          topics: [
            'Percentage Conversions (Fraction, Decimal & Ratio)',
            'Percentage Increase/Decrease, Profit & Loss Percentage',
            'Simple Interest Formula (SI = PRT/100) & Amount',
          ],
        },
        {
          chapter: 'Rational Numbers',
          topics: [
            'Positive/Negative Rational Numbers & Standard Form',
            'Rational Numbers on Number Line & Comparison',
            'Addition, Subtraction, Multiplication & Division of Rational Numbers',
          ],
        },
        {
          chapter: 'Perimeter, Area, Exponents & Symmetry',
          topics: [
            'Perimeter & Area of Parallelograms & Triangles',
            'Circumference & Area of Circles (Pathways & Semicircles)',
            'Laws of Exponents & Scientific Standard Form',
            'Lines of Symmetry, Rotational Symmetry & 3D Solid Nets',
          ],
        },
        {
          chapter: 'Algebraic Expressions',
          topics: [
            'Terms, Factors, Coefficients, Monomials, Binomials & Trinomials',
            'Like/Unlike Terms & Addition/Subtraction of Expressions',
            'Finding Value of an Algebraic Expression',
          ],
        },
      ],
    },
    ICSE: {
      Physics: [
        {
          chapter: 'Physical Quantities & Measurement',
          topics: [
            'Area of Regular & Irregular Shapes (Graph Paper)',
            'Volume of Regular Solids & Measuring Cylinder (Liquid/Irregular Solid)',
            'Density Formula, Units (kg/m³ vs g/cm³) & Relative Density',
            'Concept of Speed & Numerics (v = d/t)',
          ],
        },
        {
          chapter: 'Force, Pressure & Motion',
          topics: [
            'Rest vs Motion & Types (Translatory, Rotatory, Oscillatory, Periodic)',
            'Distance vs Displacement & Uniform vs Non-Uniform Motion',
            'Mass vs Weight (Spring Balance vs Beam Balance)',
          ],
        },
        {
          chapter: 'Energy & Light Energy',
          topics: [
            'Forms of Energy (Kinetic, Potential, Mechanical, Chemical) & Transformations',
            'Laws of Reflection & Regular vs Diffused Reflection',
            'Plane Mirror Image Formation, Lateral Inversion & Periscope',
            'Primary Colours, Complementary Colours & Additive Mixing',
          ],
        },
        {
          chapter: 'Heat & Sound',
          topics: [
            'Temperature Scales (°C, °F, K) & Conversions',
            'Effects of Heat: Expansion in Solids/Liquids/Gases & Change of State',
            'Conduction, Convection, Radiation & Thermos Flask Design',
            'Production, Propagation, Speed & Reflection of Sound (Echo & Absorption)',
          ],
        },
        {
          chapter: 'Electricity & Magnetism',
          topics: [
            'Laws of Magnetism, Magnetic Induction & Neutral Points',
            'Electric Cell (Primary vs Secondary), Conductors & Insulators',
            'Series vs Parallel Circuits & Household Safety Precautions',
          ],
        },
      ],
      Chemistry: [
        {
          chapter: 'Matter & Physical/Chemical Changes',
          topics: [
            'Kinetic Theory of Matter (Solids, Liquids, Gases Interconversion)',
            'Sublimation, Melting, Boiling, Condensation & Evaporation',
            'Characteristics & Examples of Physical vs Chemical Changes',
          ],
        },
        {
          chapter: 'Elements, Compounds & Mixtures',
          topics: [
            'Pure Substances (Elements, Metals, Non-Metals, Metalloids) & Compounds',
            'Homogeneous vs Heterogeneous Mixtures',
            'Separation Techniques: Evaporation, Distillation, Fractional Distillation, Chromatography & Separating Funnel',
          ],
        },
        {
          chapter: 'Atomic Structure & Language of Chemistry',
          topics: [
            'Dalton’s Atomic Theory & Subatomic Particles (p, n, e)',
            'Atomic Number, Mass Number, Valency & Variable Valency',
            'Symbols, Radicals (Polyatomic Ions) & Writing Chemical Formulae',
            'Balancing Simple Chemical Equations',
          ],
        },
        {
          chapter: 'Metals, Non-Metals & Air',
          topics: [
            'Physical/Chemical Properties & Uses of Metals and Non-Metals',
            'Rusting of Iron & Prevention Methods',
            'Composition of Air & Roles of Oxygen, Nitrogen, CO2 & Inert Gases',
          ],
        },
      ],
      Biology: [
        {
          chapter: 'Plant & Animal Tissues',
          topics: [
            'Meristematic Tissues (Apical, Lateral, Intercalary)',
            'Simple & Complex Permanent Plant Tissues (Parenchyma, Collenchyma, Sclerenchyma, Xylem, Phloem)',
            'Animal Tissues: Epithelial, Connective, Muscular & Nervous Tissues',
          ],
        },
        {
          chapter: 'Classification of Living Organisms',
          topics: [
            'Five Kingdom Classification (Monera, Protista, Fungi, Plantae, Animalia)',
            'Invertebrates (Porifera to Arthropoda/Mollusca/Echinodermata) & Vertebrates',
          ],
        },
        {
          chapter: 'Photosynthesis & Respiration',
          topics: [
            'Chloroplast Structure, Stomata, Factors & Experiments on Photosynthesis',
            'Aerobic vs Anaerobic Respiration in Plants & Significance',
          ],
        },
        {
          chapter: 'Excretory System, Nervous System & Allergy',
          topics: [
            'Human Excretory Organs (Kidneys, Ureters, Bladder) & Common Disorders',
            'Human Nervous System: Neuron, Brain, Spinal Cord & Reflex Action',
            'Allergens, Entry Routes & Prevention of Allergic Reactions',
          ],
        },
      ],
      Mathematics: [
        {
          chapter: 'Integers, Rational Numbers & Exponents',
          topics: [
            'BODMAS & Properties of Integers',
            'Operations & Comparison of Fractions/Decimals & Rational Numbers',
            'Laws of Exponents & Standard Scientific Form',
          ],
        },
        {
          chapter: 'Sets, Ratio, Proportion & Unitary Method',
          topics: [
            'Set Notation (Roster, Set-Builder), Subsets, Union & Intersection',
            'Ratio, Proportion, Direct/Inverse Variation & Time-Work Problems',
            'Speed, Distance & Time Word Problems',
          ],
        },
        {
          chapter: 'Percentage, Profit-Loss & Simple Interest',
          topics: [
            'Percentage Change, Profit, Loss & Discount Calculations',
            'Simple Interest & Amount Numerics',
          ],
        },
        {
          chapter: 'Algebraic Expressions & Linear Equations',
          topics: [
            'Operations on Polynomials & Product Formulas',
            'Solving Linear Equations & Linear Inequations in One Variable',
          ],
        },
        {
          chapter: 'Lines, Angles, Triangles & Mensuration',
          topics: [
            'Parallel Lines, Angle Properties & Angle Sum of Triangles',
            'Congruence of Triangles (SSS, SAS, ASA, RHS) & Pythagoras Theorem',
            'Symmetry, Reflection & Rotation',
            'Perimeter & Area of Triangles, Parallelograms & Circles + Cube/Cuboid Volume',
          ],
        },
      ],
    },
  },

  // ---------- CLASS 8 ----------
  '8': {
    CBSE: {
      Physics: [
        {
          chapter: 'Force and Pressure',
          topics: [
            'Force as Push/Pull & Effects of Force on Motion and Shape',
            'Contact Forces (Muscular, Friction) & Non-Contact Forces (Magnetic, Electrostatic, Gravitational)',
            'Resultant of Forces Acting in Same & Opposite Directions',
            'Pressure (P = F/A) & Area Applications in Daily Life',
            'Pressure Exerted by Liquids (Depth & Pascal’s Effect) & Manometer',
            'Atmospheric Pressure & Magdeburg Hemispheres',
          ],
        },
        {
          chapter: 'Friction',
          topics: [
            'Cause of Friction (Surface Irregularities) & Spring Balance Measurement',
            'Factors Affecting Friction (Nature of Surfaces & Normal Force)',
            'Static Friction, Sliding Friction & Rolling Friction Comparison',
            'Advantages, Disadvantages & Methods to Increase/Reduce Friction (Lubricants, Ball Bearings)',
            'Fluid Friction (Drag) & Streamlined Shapes',
          ],
        },
        {
          chapter: 'Sound',
          topics: [
            'Sound Production by Vibrations & Human Larynx (Voice Box)',
            'Propagation of Sound Through Solids, Liquids & Gases (Vacuum Bell Jar)',
            'Structure & Working of Human Ear (Eardrum, Cochlea)',
            'Amplitude, Time Period & Frequency (f = 1/T)',
            'Loudness (Amplitude²) vs Pitch (Frequency)',
            'Audible, Infrasonic & Ultrasonic Sounds + Noise vs Music & Pollution Control',
          ],
        },
        {
          chapter: 'Some Natural Phenomena',
          topics: [
            'Charging by Friction, Like/Unlike Charge Repulsion/Attraction',
            'Gold-Leaf Electroscope, Earthing & Electric Discharge',
            'Lightning Formation, Lightning Conductor & Safety Precautions',
            'Earthquakes: Tectonic Plates, Fault Zones, Seismograph & Richter Scale',
          ],
        },
        {
          chapter: 'Light',
          topics: [
            'Laws of Reflection & Regular vs Diffused Reflection',
            'Multiple Reflections (360/θ − 1 Formula) & Kaleidoscope / Periscope',
            'Dispersion of White Light',
            'Human Eye Parts (Cornea, Iris, Pupil, Lens, Retina Rods/Cones, Blind Spot)',
            'Persistence of Vision, Eye Care & Braille System',
          ],
        },
      ],
      Chemistry: [
        {
          chapter: 'Coal and Petroleum',
          topics: [
            'Inexhaustible vs Exhaustible Natural Resources',
            'Coal: Carbonisation, Varieties & Destructive Distillation (Coke, Coal Tar, Coal Gas)',
            'Petroleum Formation & Fractional Distillation Refining Fractions/Uses',
            'Natural Gas (CNG) & PCRA Fuel Conservation Tips',
          ],
        },
        {
          chapter: 'Combustion and Flame',
          topics: [
            'Combustible vs Non-Combustible Substances & Conditions for Combustion',
            'Ignition Temperature & Inflammable Substances',
            'Fire Extinguishers (Water vs CO2 Electrical Fires)',
            'Types of Combustion (Rapid, Spontaneous, Explosion)',
            'Zones of a Candle Flame (Outer Blue, Middle Luminous, Inner Dark)',
            'Fuel Efficiency, Calorific Value (kJ/kg) & Harmful Products (CO, Global Warming, Acid Rain)',
          ],
        },
        {
          chapter: 'Chemical Effects of Electric Current',
          topics: [
            'Good & Poor Conducting Liquids (Acids, Bases, Salts, Distilled Water)',
            'LED & Magnetic Compass Testers for Weak Currents',
            'Chemical Effects of Current & Electrolysis of Water',
            'Electroplating Process (Copper on Iron, Chromium) & Industrial Uses',
          ],
        },
      ],
      Biology: [
        {
          chapter: 'Crop Production & Management',
          topics: [
            'Kharif vs Rabi Crops & Basic Agricultural Practices',
            'Soil Preparation (Ploughing, Levelling), Seed Selection & Sowing Tools',
            'Manure vs Fertilisers & Crop Rotation',
            'Traditional & Modern Irrigation (Sprinkler & Drip Systems)',
            'Weeds/Weedicides, Harvesting, Storage (Silos) & Animal Husbandry',
          ],
        },
        {
          chapter: 'Microorganisms: Friend & Foe',
          topics: [
            'Major Microbial Groups: Bacteria, Fungi, Protozoa, Algae & Viruses',
            'Friendly Microbes: Curd, Fermentation, Antibiotics & Vaccines',
            'Harmful Microbes: Human, Plant & Animal Diseases + Food Spoilage/Preservation',
            'Biological Nitrogen Fixation & Nitrogen Cycle',
          ],
        },
        {
          chapter: 'Conservation of Plants & Animals',
          topics: [
            'Deforestation Causes, Global Warming, Drought & Desertification',
            'Biosphere Reserves, Wildlife Sanctuaries & National Parks',
            'Endemic Species, Red Data Book, Migration & Reforestation',
          ],
        },
        {
          chapter: 'Reproduction in Animals & Adolescence',
          topics: [
            'Sexual Reproduction: Male/Female Organs, Fertilisation (Internal/External) & IVF',
            'Oviparous vs Viviparous Animals & Metamorphosis in Frog/Silkworm',
            'Asexual Reproduction: Budding in Hydra, Binary Fission in Amoeba & Cloning',
            'Adolescence, Puberty Changes, Secondary Sexual Characters & Endocrine Hormones',
            'Sex Determination (XX/XY), Metamorphosis Hormones & Reproductive Health',
          ],
        },
      ],
      'Science (Combined)': [
        {
          chapter: 'Crop Production, Microorganisms & Conservation',
          topics: [
            'Kharif/Rabi, Manure vs Fertilisers & Irrigation',
            'Vaccines, Nitrogen Cycle & Food Preservation',
            'Endemic Species, Red Data Book & Biosphere Reserves',
          ],
        },
        {
          chapter: 'Coal, Petroleum, Combustion & Chemical Effects',
          topics: [
            'Fractional Distillation of Petroleum & Coal Products',
            'Candle Flame Zones, Ignition Temperature & Calorific Value',
            'Conducting Liquids, Electrolysis & Electroplating',
          ],
        },
        {
          chapter: 'Force, Pressure, Friction, Sound & Light',
          topics: [
            'Liquid/Atmospheric Pressure & Non-Contact Forces',
            'Static/Sliding/Rolling Friction & Fluid Drag',
            'Amplitude, Frequency, Ear & Multiple Reflections in Eye',
          ],
        },
        {
          chapter: 'Reproduction in Animals & Adolescence',
          topics: [
            'Internal/External Fertilisation, Binary Fission & Budding',
            'Endocrine Glands, Sex Determination & Puberty',
          ],
        },
      ],
      Mathematics: [
        {
          chapter: 'Rational Numbers',
          topics: [
            'Closure, Commutative, Associative & Distributive Properties of Rational Numbers',
            'Additive & Multiplicative Identities and Inverses',
            'Rational Numbers Between Two Rational Numbers',
          ],
        },
        {
          chapter: 'Linear Equations in One Variable',
          topics: [
            'Solving Equations Having Variable on Both Sides',
            'Equations Reducible to Linear Form (Cross-Multiplication)',
            'Word Problems on Ages, Digits, Fractions & Geometry',
          ],
        },
        {
          chapter: 'Understanding Quadrilaterals',
          topics: [
            'Polygons Classification & Interior/Exterior Angle Sum',
            'Properties of Trapezium & Kite',
            'Properties of Parallelogram, Rhombus, Rectangle & Square',
          ],
        },
        {
          chapter: 'Data Handling',
          topics: [
            'Grouped Frequency Distribution & Histograms',
            'Pie Charts (Circle Graphs) & Central Angle Calculations',
            'Chance & Equally Likely Probability Experiments',
          ],
        },
        {
          chapter: 'Squares, Square Roots, Cubes & Cube Roots',
          topics: [
            'Properties of Square Numbers & Pythagorean Triplets',
            'Square Roots by Prime Factorization & Long Division Method',
            'Smallest Multiplier/Divisor for Perfect Square/Cube',
            'Cube Roots by Prime Factorization & Estimation',
          ],
        },
        {
          chapter: 'Comparing Quantities',
          topics: [
            'Ratios, Percentages, Discount & Tax (GST/VAT)',
            'Compound Interest (Compounded Annually & Half-Yearly)',
            'Appreciation & Depreciation Word Problems',
          ],
        },
        {
          chapter: 'Algebraic Expressions, Identities & Factorisation',
          topics: [
            'Multiplication of Polynomials (Monomial × Binomial/Trinomial)',
            'Standard Algebraic Identities (a±b)², a²−b², (x+a)(x+b)',
            'Factorisation by Grouping, Identities & Splitting Middle Term',
            'Division of Polynomials (Monomial & Polynomial Divisors)',
          ],
        },
        {
          chapter: 'Mensuration',
          topics: [
            'Area of Trapezium, General Quadrilateral, Rhombus & Polygons',
            'Surface Area (LSA/TSA) of Cube, Cuboid & Right Circular Cylinder',
            'Volume of Cube, Cuboid & Cylinder + Capacity Word Problems',
          ],
        },
        {
          chapter: 'Exponents, Powers & Direct/Inverse Proportions',
          topics: [
            'Negative Exponents & Laws of Integral Exponents',
            'Standard Scientific Notation for Small & Large Numbers',
            'Direct Proportion & Inverse Proportion (Time-Work/Speed-Time)',
          ],
        },
        {
          chapter: 'Introduction to Graphs',
          topics: [
            'Line Graphs, Bar Graphs & Linear Coordinate Plotting',
            'Time-Distance & Principal-Interest Graph Applications',
          ],
        },
      ],
    },
    ICSE: {
      Physics: [
        {
          chapter: 'Matter & Physical Quantities (Density)',
          topics: [
            'Kinetic Molecular Model & Change of State (Melting, Boiling, Sublimation, Evaporation)',
            'Density Determination of Irregular Solid & Liquid (Density Bottle)',
            'Relative Density, Flotation & Archimedes Principle Basics',
          ],
        },
        {
          chapter: 'Force, Pressure & Energy',
          topics: [
            'Turning Effect of Force (Moment of Force / Torque)',
            'Pressure in Solids, Liquids & Atmospheric Pressure',
            'Work, Kinetic/Potential Energy, Conservation & Power',
          ],
        },
        {
          chapter: 'Light Energy',
          topics: [
            'Refraction of Light & Refractive Index (Snell’s Rule Intro)',
            'Refraction Through Glass Slab & Triangular Prism (Dispersion)',
            'Concave & Convex Mirrors: Focal Length & Ray Diagrams',
          ],
        },
        {
          chapter: 'Heat Transfer & Sound',
          topics: [
            'Thermal Expansion in Solids (Linear, Superficial, Cubical), Liquids & Gases',
            'Boiling vs Evaporation Differences',
            'Sound Characteristics: Pitch, Loudness, Quality (Timbre) & Decibel',
          ],
        },
        {
          chapter: 'Electricity',
          topics: [
            'Household Electric Circuits, kWh Meter & Power Calculation',
            'Fuse, MCB, Earthing & Colour Coding of Live/Neutral/Earth Wires',
            'Static Electricity, Electroscope & Lightning Conductors',
          ],
        },
      ],
      Chemistry: [
        {
          chapter: 'Matter, Physical/Chemical Changes & Atomic Structure',
          topics: [
            'Law of Conservation of Mass & Kinetic Theory',
            'Dalton, Thomson, Rutherford & Bohr Models of Atom',
            'Atomic Number, Mass Number, Isotopes & Electronic Configuration (First 20 Elements)',
          ],
        },
        {
          chapter: 'Language of Chemistry & Chemical Reactions',
          topics: [
            'Symbols, Valency, Radicals & Chemical Formulae',
            'Balancing Equations & Types of Reactions (Combination, Decomposition, Displacement, Double Displacement)',
            'Metal Reactivity Series & Oxides (Acidic, Basic, Amphoteric, Neutral)',
          ],
        },
        {
          chapter: 'Hydrogen, Water & Carbon Allotropes',
          topics: [
            'Laboratory & Bosch Industrial Preparation of Hydrogen + Uses',
            'Solutions, Suspensions, Colloids & Water of Crystallisation',
            'Hard vs Soft Water (Temporary & Permanent Hardness Removal)',
            'Allotropes of Carbon: Diamond, Graphite, Fullerene & Amorphous Forms + CO/CO2',
          ],
        },
      ],
      Biology: [
        {
          chapter: 'Transport in Plants & Reproduction',
          topics: [
            'Diffusion, Osmosis, Root Pressure, Transpiration & Translocation',
            'Binary Fission, Budding, Vegetative Propagation & Artificial Propagation (Tissue Culture)',
            'Sexual Reproduction in Plants & Humans',
          ],
        },
        {
          chapter: 'Ecosystems & Human Nervous/Endocrine System',
          topics: [
            'Biotic & Abiotic Factors, Food Chains, Pyramids & Symbiosis',
            'Endocrine Glands (Pituitary, Thyroid, Adrenal, Pancreas) & Hormones',
            'Human Nervous System, Reflex Arc & Circulatory System (Heart & Blood Groups)',
          ],
        },
      ],
      Mathematics: [
        {
          chapter: 'Rational Numbers, Exponents, Squares & Cubes',
          topics: [
            'Properties & Word Problems on Rational Numbers',
            'Laws of Exponents with Negative/Fractional Bases',
            'Square Roots (Long Division) & Cube Roots',
          ],
        },
        {
          chapter: 'Sets, Percentage, Profit-Loss & Compound Interest',
          topics: [
            'Set Operations, Venn Diagrams & Cardinality n(A∪B)',
            'Percentage, Profit, Loss, Discount & GST',
            'Compound Interest (Annual, Half-Yearly & Growth/Depreciation)',
          ],
        },
        {
          chapter: 'Algebraic Expressions, Factorisation & Linear Equations',
          topics: [
            'Algebraic Identities & Special Expansions (x ± 1/x)',
            'Factorisation by Grouping, Difference of Squares & Trinomials',
            'Linear Equations & Linear Inequations on Number Line',
          ],
        },
        {
          chapter: 'Quadrilaterals, Circles & Mensuration',
          topics: [
            'Polygons, Parallelograms & Chord/Arc Properties of Circles',
            'Area of Trapezium, Polygons & Surface Area/Volume of Cube, Cuboid, Cylinder',
          ],
        },
      ],
    },
  },

  // ---------- CLASS 9 ----------
  '9': {
    CBSE: {
      Physics: [
        {
          chapter: 'Motion',
          topics: [
            'Distance vs Displacement, Scalar & Vector Quantities',
            'Uniform vs Non-Uniform Motion, Speed & Velocity',
            'Acceleration & Retardation Numerics',
            'Distance-Time (s-t) & Velocity-Time (v-t) Graphs (Slope & Area)',
            'Derivation & Application of Equations of Motion (v=u+at, s=ut+½at², v²−u²=2as)',
            'Uniform Circular Motion (v = 2πr/t) & Centripetal Force Intro',
          ],
        },
        {
          chapter: 'Force and Laws of Motion',
          topics: [
            'Balanced & Unbalanced Forces',
            'Newton’s First Law & Types of Inertia (Rest, Motion, Direction)',
            'Linear Momentum (p = mv) & Newton’s Second Law (F = ma, Impulse)',
            'Newton’s Third Law (Action-Reaction Pairs)',
            'Law of Conservation of Linear Momentum & Gun Recoil / Collision Numerics',
          ],
        },
        {
          chapter: 'Gravitation',
          topics: [
            'Universal Law of Gravitation (Inverse-Square) & Universal Constant G',
            'Free Fall, Acceleration Due to Gravity (g) & Equations Under Gravity',
            'Mass vs Weight (Weight on Moon vs Earth)',
            'Thrust & Pressure in Solids and Fluids',
            'Buoyancy, Upthrust & Archimedes’ Principle',
            'Relative Density & Conditions for Floating/Sinking',
          ],
        },
        {
          chapter: 'Work and Energy',
          topics: [
            'Scientific Concept of Work (W = Fs cosθ), Positive, Negative & Zero Work',
            'Kinetic Energy (½mv²) & Work-Energy Theorem',
            'Gravitational Potential Energy (mgh) & Elastic Potential Energy',
            'Law of Conservation of Mechanical Energy (Free Fall & Simple Pendulum)',
            'Rate of Doing Work (Power), Average Power & Commercial Unit (1 kWh)',
          ],
        },
        {
          chapter: 'Sound',
          topics: [
            'Production, Propagation & Longitudinal vs Transverse Waves',
            'Wave Characteristics: Wavelength, Frequency, Time Period, Amplitude & Speed (v = fλ)',
            'Speed of Sound in Different Media & Sonic Boom',
            'Reflection of Sound, Laws, Echo (Minimum Distance) & Reverberation',
            'Audible Range, Ultrasound Applications & SONAR Depth Numerics',
          ],
        },
      ],
      Chemistry: [
        {
          chapter: 'Matter in Our Surroundings',
          topics: [
            'Physical Nature & Characteristics of Particles of Matter',
            'Comparison of Solid, Liquid, Gaseous States + Plasma/BEC',
            'Effect of Temperature & Pressure on Change of State',
            'Latent Heat of Fusion & Latent Heat of Vaporization',
            'Sublimation & Deposition',
            'Evaporation, Factors Affecting Rate & Cooling Effect of Evaporation',
          ],
        },
        {
          chapter: 'Is Matter Around Us Pure?',
          topics: [
            'Pure Substances vs Mixtures (Homogeneous & Heterogeneous)',
            'True Solutions, Mass/Volume Percentage Concentration & Solubility',
            'Suspensions & Colloidal Solutions (Tyndall Effect, Brownian Motion)',
            'Physical vs Chemical Changes',
            'Elements (Metals, Non-Metals, Metalloids) vs Compounds',
          ],
        },
        {
          chapter: 'Atoms and Molecules',
          topics: [
            'Laws of Chemical Combination (Conservation of Mass & Constant Proportions)',
            'Dalton’s Atomic Theory & Modern Atomic Symbols',
            'Atomic Mass Unit (u), Atomicity & Ions (Cations/Anions/Polyatomic)',
            'Writing Chemical Formulae (Criss-Cross Valency Method)',
            'Molecular Mass, Formula Unit Mass & Mole Concept Basics',
          ],
        },
        {
          chapter: 'Structure of the Atom',
          topics: [
            'Discovery of Electron (Cathode Rays), Proton & Neutron',
            'Thomson’s Plum Pudding Model & Rutherford’s α-Scattering Experiment',
            'Bohr’s Model of Atom & Energy Shells (K, L, M, N)',
            'Electronic Distribution (2n² Rule) & Valency Calculation',
            'Atomic Number, Mass Number, Isotopes (Applications) & Isobars',
          ],
        },
      ],
      Biology: [
        {
          chapter: 'The Fundamental Unit of Life',
          topics: [
            'Discovery of Cell, Cell Theory & Microscope Observations',
            'Prokaryotic vs Eukaryotic Cells & Unicellular vs Multicellular',
            'Plasma Membrane: Diffusion, Osmosis (Hypotonic/Isotonic/Hypertonic) & Plasmolysis',
            'Cell Wall, Nucleus (Chromosomes/DNA) & Cytoplasm',
            'Cell Organelles: ER (RER/SER), Golgi Apparatus, Lysosomes, Mitochondria, Plastids & Vacuoles',
            'Mitosis vs Meiosis Overview',
          ],
        },
        {
          chapter: 'Tissues',
          topics: [
            'Plant Meristematic Tissues (Apical, Lateral, Intercalary)',
            'Simple Permanent Plant Tissues (Parenchyma, Collenchyma, Sclerenchyma, Epidermis/Cork)',
            'Complex Permanent Plant Tissues: Xylem & Phloem Components',
            'Animal Epithelial Tissues (Squamous, Cuboidal, Columnar, Ciliated, Stratified)',
            'Animal Connective Tissues (Blood, Bone, Cartilage, Ligament, Tendon, Areolar, Adipose)',
            'Animal Muscular Tissues (Striated, Smooth, Cardiac) & Nervous Tissue (Neuron)',
          ],
        },
        {
          chapter: 'Improvement in Food Resources',
          topics: [
            'Crop Variety Improvement (Hybridisation, GM Crops, Kharif/Rabi)',
            'Nutrient Management (Macronutrients/Micronutrients, Manure vs Fertilisers)',
            'Irrigation Methods & Cropping Patterns (Mixed, Inter-Cropping, Crop Rotation)',
            'Crop Protection (Weeds, Pests, Diseases & Grain Storage)',
            'Animal Husbandry: Cattle Farming, Poultry, Fish Production (Marine/Inland) & Bee-Keeping',
          ],
        },
      ],
      'Science (Combined)': [
        {
          chapter: 'Matter, Pure Substances, Atoms & Atomic Structure',
          topics: [
            'Evaporation, Sublimation & Latent Heat',
            'True Solutions, Colloids (Tyndall) & Suspensions',
            'Laws of Chemical Combination, Formulae & Molecular Mass',
            'Rutherford, Bohr Models, Valency, Isotopes & Isobars',
          ],
        },
        {
          chapter: 'Cell & Tissues + Food Resources',
          topics: [
            'Osmosis, Plasmolysis & Cell Organelles',
            'Plant & Animal Tissues Classification',
            'Cropping Patterns, Manures, Cattle & Pisciculture',
          ],
        },
        {
          chapter: 'Motion, Force & Gravitation',
          topics: [
            'Graphs (s-t, v-t) & Equations of Motion',
            'Newton’s Laws & Conservation of Momentum',
            'Gravitation, Free Fall, Buoyancy & Archimedes Principle',
          ],
        },
        {
          chapter: 'Work, Energy & Sound',
          topics: [
            'Work Done, KE, PE Conservation & kWh Power',
            'Wave Equation (v = fλ), Echo, Ultrasound & SONAR',
          ],
        },
      ],
      Mathematics: [
        {
          chapter: 'Number Systems',
          topics: [
            'Rational & Irrational Numbers + Decimal Expansions (Terminating/Non-Terminating)',
            'Representing √n on Number Line & Operations on Real Numbers',
            'Rationalization of Denominators (Conjugate Surds)',
            'Laws of Exponents for Real Numbers (Fractional Powers)',
          ],
        },
        {
          chapter: 'Polynomials',
          topics: [
            'Degree, Types & Value/Zeroes of a Polynomial',
            'Remainder Theorem & Factor Theorem',
            'Factorization of Quadratic & Cubic Polynomials',
            'Algebraic Identities: (x+y+z)², (x±y)³, x³±y³, x³+y³+z³−3xyz',
          ],
        },
        {
          chapter: 'Coordinate Geometry & Linear Equations in Two Variables',
          topics: [
            'Cartesian Plane, Quadrants, Abscissa & Ordinate Plotting',
            'Solutions & Graphs of ax + by + c = 0 & Equations Parallel to Axes',
          ],
        },
        {
          chapter: 'Euclid’s Geometry, Lines & Angles',
          topics: [
            'Euclid’s Axioms & Five Postulates',
            'Linear Pair, Vertically Opposite & Parallel Lines with Transversal Theorems',
            'Angle Sum Property & Exterior Angle Theorem of a Triangle',
          ],
        },
        {
          chapter: 'Triangles',
          topics: [
            'Congruence Criteria: SAS, ASA, AAS, SSS & RHS',
            'Properties of Isosceles Triangles',
            'Triangle Inequalities (Angle-Side Relation & Sum of Two Sides)',
          ],
        },
        {
          chapter: 'Quadrilaterals',
          topics: [
            'Angle Sum & Properties of Parallelograms, Rectangles, Rhombus & Square',
            'Mid-Point Theorem & Its Converse Applications',
          ],
        },
        {
          chapter: 'Circles',
          topics: [
            'Equal Chords Subtend Equal Angles & Perpendicular from Centre Bisects Chord',
            'Angle Subtended by an Arc at Centre vs Remaining Part',
            'Angles in Same Segment & Angle in Semicircle',
            'Cyclic Quadrilaterals (Opposite Angles Sum = 180°)',
          ],
        },
        {
          chapter: 'Heron’s Formula, Surface Areas & Volumes & Statistics',
          topics: [
            'Heron’s Formula Area of Triangles & Quadrilaterals',
            'Surface Area & Volume of Right Circular Cone',
            'Surface Area & Volume of Sphere & Hemisphere',
            'Bar Graphs, Histograms (Uniform & Varying Width) & Frequency Polygons',
          ],
        },
      ],
    },
    ICSE: {
      Physics: [
        {
          chapter: 'Measurements and Experimentation',
          topics: [
            'SI Units, Multiples, Submultiples & Derived Units',
            'Vernier Callipers: Least Count, Zero Error & Diameter Numerics',
            'Screw Gauge: Pitch, Least Count & Backlash Error',
            'Simple Pendulum: Time Period, Second’s Pendulum & T² vs l Graph',
          ],
        },
        {
          chapter: 'Motion in One Dimension',
          topics: [
            'Scalar vs Vector, Distance vs Displacement & Uniform/Variable Velocity',
            'Displacement-Time & Velocity-Time Graphs',
            'Derivation & Numerics on Three Equations of Motion',
          ],
        },
        {
          chapter: 'Laws of Motion',
          topics: [
            'Contact/Non-Contact Forces & Inertia (Newton’s 1st Law)',
            'Linear Momentum & Newton’s Second Law (F = ma)',
            'Newton’s Third Law & Gravitation (g vs G, Free Fall)',
          ],
        },
        {
          chapter: 'Fluids (Pressure & Upthrust)',
          topics: [
            'Fluid Pressure (P = hρg), Pascal’s Law & Hydraulic Press/Brakes',
            'Atmospheric Pressure & Simple/Fortin Barometer',
            'Upthrust, Archimedes’ Principle, Relative Density & Floatation Laws',
          ],
        },
        {
          chapter: 'Heat and Energy',
          topics: [
            'Heat vs Temperature, Anomalous Expansion of Water & Hope’s Experiment',
            'Renewable vs Non-Renewable Energy & Greenhouse Effect / Global Warming',
          ],
        },
        {
          chapter: 'Light (Reflection at Plane & Spherical Mirrors)',
          topics: [
            'Laws of Reflection, Plane Mirror Rotation, Periscope & Multiple Images',
            'Concave & Convex Mirrors: Focal Length, Ray Diagrams, Mirror Formula & Uses',
          ],
        },
        {
          chapter: 'Sound, Electricity & Magnetism',
          topics: [
            'Wave Equation v = fλ, Comparison of Speed in Solids/Liquids/Gases & Ultrasonic Applications',
            'Electric Potential, Current (I = Q/t), Resistance & Closed/Open Circuits',
            'Induced Magnetism, Earth’s Magnetic Field, Neutral Points & Electromagnets',
          ],
        },
      ],
      Chemistry: [
        {
          chapter: 'The Language of Chemistry',
          topics: [
            'Symbols, Valency, Acid/Basic Radicals & Chemical Formulae',
            'Balancing Chemical Equations by Hit-and-Trial & Partial Equation Methods',
            'Relative Atomic Mass, Molecular Mass & Percentage Composition Numerics',
          ],
        },
        {
          chapter: 'Chemical Changes & Reactions',
          topics: [
            'Direct Combination, Thermal/Electrolytic Decomposition, Displacement & Double Decomposition',
            'Exothermic vs Endothermic & Photochemical Reactions',
          ],
        },
        {
          chapter: 'Water & Solutions',
          topics: [
            'Solubility Curves, Saturated/Unsaturated/Supersaturated Solutions',
            'Hydrated vs Anhydrous Salts, Efflorescence, Deliquescence & Hygroscopy',
            'Soft vs Hard Water (Temporary & Permanent Hardness Removal) & Drying Agents',
          ],
        },
        {
          chapter: 'Atomic Structure & Chemical Bonding',
          topics: [
            'Bohr Atomic Structure, Valency, Octet Rule & Isotopes',
            'Electrovalent (Ionic) vs Covalent Bonding with Electron Dot Structures',
          ],
        },
        {
          chapter: 'The Periodic Table & Study of Hydrogen',
          topics: [
            'Dobereiner Triads, Newlands Octaves, Mendeleev & Modern Periodic Table',
            'Group Properties (Alkali Metals, Halogens, Noble Gases)',
            'Laboratory Preparation, Bosch Process & Oxidation-Reduction of Hydrogen',
          ],
        },
        {
          chapter: 'Study of Gas Laws & Atmospheric Pollution',
          topics: [
            'Boyle’s Law, Charles’s Law, Absolute Zero (Kelvin Scale) & Gas Equation Numerics',
            'Acid Rain, Greenhouse Effect & Ozone Layer Depletion',
          ],
        },
      ],
      Biology: [
        {
          chapter: 'Cell, Plant & Animal Tissues',
          topics: [
            'Cell Organelles & Plant vs Animal Cell Differences',
            'Meristematic, Simple/Complex Plant & Animal Tissues',
          ],
        },
        {
          chapter: 'Flower, Pollination, Fertilisation & Seeds',
          topics: [
            'Parts of a Complete Flower & Placentation',
            'Self vs Cross Pollination, Agents & Contrivances',
            'Double Fertilisation, Seed Structure & Epigeal vs Hypogeal Germination',
          ],
        },
        {
          chapter: 'Respiration in Plants & Five Kingdom Classification',
          topics: [
            'Aerobic vs Anaerobic Respiration & Comparison with Photosynthesis',
            'Five Kingdoms, Plant Divisions & Animal Phyla (Invertebrates & Vertebrates)',
          ],
        },
        {
          chapter: 'Nutrition, Digestive, Skeleton, Skin & Respiratory Systems',
          topics: [
            'Classes of Food, Balanced Diet & Deficiency Diseases',
            'Human Teeth, Digestive Enzymes & Assimilation',
            'Axial/Appendicular Skeleton & Types of Movable Joints',
            'Structure of Skin, Thermoregulation, Respiratory Mechanism & Hygiene/Diseases',
          ],
        },
      ],
      Mathematics: [
        {
          chapter: 'Rational & Irrational Numbers + Compound Interest',
          topics: [
            'Surds, Rationalization & Proof of Irrationality',
            'Compound Interest Without & With Formula + Growth/Depreciation',
          ],
        },
        {
          chapter: 'Expansions, Factorisation & Simultaneous Equations',
          topics: [
            '(a±b)³, (a+b+c)² & (x ± 1/x) Expansions',
            'Factorisation by Grouping, Splitting Middle Term & a³±b³',
            'Simultaneous Linear Equations (Elimination, Substitution, Cross-Multiplication & Word Problems)',
          ],
        },
        {
          chapter: 'Indices & Logarithms',
          topics: [
            'Laws of Indices & Exponential Equations',
            'Laws of Logarithms & Simplification Numerics',
          ],
        },
        {
          chapter: 'Triangles, Mid-Point Theorem & Pythagoras Theorem',
          topics: [
            'Congruence Criteria & Isosceles Triangle Theorems',
            'Mid-Point Theorem, Equal Intercept Theorem & Pythagoras Numerics',
          ],
        },
        {
          chapter: 'Rectilinear Figures, Circle & Mensuration',
          topics: [
            'Polygons, Parallelograms & Chord Properties of Circle',
            'Frequency Distribution, Mean & Median',
            'Area of Triangles/Quadrilaterals & Cube/Cuboid/Cylinder TSA/Volume',
          ],
        },
        {
          chapter: 'Trigonometry & Coordinate Geometry',
          topics: [
            'Trigonometric Ratios of Acute Angles & Standard Values (0°–90°)',
            'Complementary Angles Identities',
            'Distance Formula & Graphical Solution of Linear Equations',
          ],
        },
      ],
    },
  },

  // ---------- CLASS 10 ----------
  '10': {
    CBSE: {
      Physics: [
        {
          chapter: 'Light — Reflection and Refraction',
          topics: [
            'Laws of Reflection & Spherical Mirror Terminology (Pole, Focus, Centre)',
            'Ray Diagrams for Concave & Convex Mirrors + Uses',
            'New Cartesian Sign Convention, Mirror Formula (1/v + 1/u = 1/f) & Magnification',
            'Laws of Refraction, Snell’s Law, Absolute & Relative Refractive Index',
            'Refraction Through Rectangular Glass Slab & Lateral Displacement',
            'Ray Diagrams for Convex & Concave Lenses',
            'Lens Formula (1/v − 1/u = 1/f), Magnification & Power of Lens (Dioptre)',
          ],
        },
        {
          chapter: 'The Human Eye and the Colourful World',
          topics: [
            'Structure of Human Eye & Power of Accommodation',
            'Myopia (Near-Sightedness): Causes, Ray Diagram & Concave Lens Correction Numerics',
            'Hypermetropia (Far-Sightedness): Causes, Ray Diagram & Convex Lens Correction Numerics',
            'Presbyopia & Cataract',
            'Refraction Through Triangular Glass Prism & Angle of Deviation',
            'Dispersion of White Light & Rainbow Formation',
            'Atmospheric Refraction (Twinkling Stars, Early Sunrise/Delayed Sunset)',
            'Scattering of Light: Tyndall Effect & Blue Sky / Red Sunrise',
          ],
        },
        {
          chapter: 'Electricity',
          topics: [
            'Electric Charge, Current (I = Q/t), Potential & Potential Difference (V = W/Q)',
            'Circuit Diagrams, Ammeter & Voltmeter Connections',
            'Ohm’s Law (V-I Graph) & Factors Affecting Resistance',
            'Resistivity (ρ = RA/l) & Wire Stretching/Doubling Numerics',
            'Series & Parallel Combination of Resistors (Equivalent Resistance & Current Division)',
            'Heating Effect of Electric Current (Joule’s Law H = I²Rt) & Practical Applications',
            'Electric Power (P = VI = I²R = V²/R), Bulb Rating & Commercial Unit (kWh) Bills',
          ],
        },
        {
          chapter: 'Magnetic Effects of Electric Current',
          topics: [
            'Magnetic Field Lines & Properties Around Bar Magnet',
            'Magnetic Field Due to Straight Current-Carrying Wire & Right-Hand Thumb Rule',
            'Magnetic Field Due to Circular Loop & Current-Carrying Solenoid (Electromagnet)',
            'Force on Current-Carrying Conductor in Magnetic Field & Fleming’s Left-Hand Rule',
            'Direct Current (DC) vs Alternating Current (AC) & Frequency in India (50 Hz)',
            'Domestic Electric Circuits: Live, Neutral, Earth Wires, Parallel Wiring, Fuse, Overloading & Short Circuit',
          ],
        },
      ],
      Chemistry: [
        {
          chapter: 'Chemical Reactions and Equations',
          topics: [
            'Observations of Chemical Reactions & Balancing Chemical Equations',
            'Combination & Decomposition Reactions (Thermal, Electrolytic, Photolytic)',
            'Single Displacement & Double Displacement (Precipitation) Reactions',
            'Exothermic vs Endothermic Reactions',
            'Oxidation, Reduction & Redox Reactions (Oxidising & Reducing Agents)',
            'Corrosion of Metals (Rusting, Silver/Copper Tarnishing) & Rancidity Prevention',
          ],
        },
        {
          chapter: 'Acids, Bases and Salts',
          topics: [
            'Olfactory & Synthetic Indicators (Litmus, Methyl Orange, Phenolphthalein)',
            'Reactions of Acids/Bases with Metals, Metal Carbonates, Bicarbonates & Metal Oxides',
            'Conductivity of Acid/Base Solutions & Role of Water in H+/OH− Ionisation',
            'pH Scale, Universal Indicator & Importance of pH in Everyday Life (Digestion, Tooth Decay, Soil)',
            'Family of Salts, pH of Acidic/Basic/Neutral Salts & Rock Salt',
            'Chlor-Alkali Process (NaOH, Cl2, H2) & Bleaching Powder (CaOCl2)',
            'Baking Soda (NaHCO3), Washing Soda (Na2CO3·10H2O) & Plaster of Paris (CaSO4·½H2O)',
          ],
        },
        {
          chapter: 'Metals and Non-Metals',
          topics: [
            'Physical Properties & Exceptions (Mercury, Gallium, Iodine, Graphite, Alkali Metals)',
            'Chemical Reactions of Metals with Oxygen (Amphoteric Al2O3/ZnO), Water & Dilute Acids',
            'Aqua Regia & Reactivity Series Displacement Reactions',
            'Ionic Bonding (Electron Dot Diagrams) & Properties of Ionic Compounds',
            'Occurrence of Ores & Extraction of Low, Medium (Roasting/Calcination, Thermite) & High Reactivity Metals',
            'Electrolytic Refining of Copper, Corrosion & Alloys (Brass, Bronze, Solder, Steel)',
          ],
        },
        {
          chapter: 'Carbon and Its Compounds',
          topics: [
            'Covalent Bonding in Carbon, Electron Dot Structures & Allotropes (Diamond, Graphite, C60)',
            'Versatile Nature of Carbon: Catenation & Tetravalency',
            'Saturated (Alkanes) vs Unsaturated (Alkenes/Alkynes) & Structural Isomers',
            'Functional Groups, Homologous Series & IUPAC Nomenclature',
            'Chemical Properties: Combustion, Oxidation, Addition (Hydrogenation) & Substitution',
            'Ethanol: Properties, Reactions with Na & Conc. H2SO4 Dehydration',
            'Ethanoic Acid: Esterification, Saponification & Reaction with Carbonates/Bases',
            'Soaps vs Detergents, Micelle Structure & Cleansing Action in Hard Water',
          ],
        },
      ],
      Biology: [
        {
          chapter: 'Life Processes',
          topics: [
            'Autotrophic Nutrition: Photosynthesis Steps, Desert Plants & Stomatal Guard Cells',
            'Heterotrophic Nutrition (Holozoic, Saprophytic, Parasitic) & Amoeba Nutrition',
            'Human Digestive System: Buccal Cavity, Stomach, Bile, Pancreatic Enzymes & Villi',
            'Respiration Pathways: Glucose Breakdown (Yeast, Muscle Lactic Acid, Mitochondria)',
            'Human Respiratory System, Alveoli, Haemoglobin & Aquatic vs Terrestrial Breathing',
            'Human Heart, Double Circulation, Blood Vessels, Platelets & Lymph',
            'Transportation in Plants: Xylem (Transpiration Pull) & Phloem (Translocation)',
            'Excretion in Humans (Kidney, Nephron Ultrafiltration & Dialysis) & Plants',
          ],
        },
        {
          chapter: 'Control and Coordination',
          topics: [
            'Structure of Neuron, Neuromuscular Junction & Synapse',
            'Reflex Action & Reflex Arc Pathway',
            'Human Brain (Forebrain Cerebrum, Midbrain, Hindbrain Cerebellum/Pons/Medulla) & Spinal Cord',
            'Plant Movements: Nastic (Touch-me-not) vs Tropic (Phototropism, Geotropism, Chemotropism)',
            'Plant Hormones (Auxin, Gibberellin, Cytokinin, Abscisic Acid)',
            'Human Endocrine Glands (Pituitary, Thyroid, Adrenal, Pancreas, Gonads) & Feedback Mechanism',
          ],
        },
        {
          chapter: 'How Do Organisms Reproduce?',
          topics: [
            'Importance of DNA Copying & Variation',
            'Asexual Modes: Binary/Multiple Fission, Fragmentation, Regeneration, Budding, Spore Formation & Vegetative Propagation',
            'Sexual Reproduction in Flowering Plants: Flower Parts, Pollination, Double Fertilisation & Seed',
            'Puberty Changes, Male & Female Human Reproductive Systems',
            'Fertilisation, Placenta & Menstruation Cycle',
            'Reproductive Health, STDs & Contraceptive Methods (Barrier, Oral, IUCD, Surgical)',
          ],
        },
        {
          chapter: 'Heredity',
          topics: [
            'Accumulation of Variation & Inherited vs Acquired Traits',
            'Mendel’s Monohybrid Cross (Law of Dominance & Segregation)',
            'Mendel’s Dihybrid Cross (9:3:3:1 Ratio & Independent Assortment)',
            'Sex Determination in Humans (XX/XY Chromosomes)',
          ],
        },
        {
          chapter: 'Our Environment',
          topics: [
            'Biotic & Abiotic Ecosystem Components + Producers, Consumers, Decomposers',
            'Food Chains, Trophic Levels, Food Web & 10% Energy Flow Law',
            'Biological Magnification (Biomagnification)',
            'Ozone Layer Depletion (CFCs) & Biodegradable vs Non-Biodegradable Waste Management',
          ],
        },
      ],
      'Science (Combined)': [
        {
          chapter: 'Chemical Reactions, Acids, Bases & Salts',
          topics: [
            'Balancing Equations, Types of Reactions & Redox/Corrosion',
            'pH Scale, Indicators & Chlor-Alkali / Baking / Washing Soda / POP',
          ],
        },
        {
          chapter: 'Metals, Non-Metals & Carbon Compounds',
          topics: [
            'Reactivity Series, Ionic Compounds & Metallurgy (Roasting/Calcination)',
            'IUPAC Naming, Homologous Series, Ethanol, Ethanoic Acid & Soaps/Micelles',
          ],
        },
        {
          chapter: 'Life Processes, Control & Coordination',
          topics: [
            'Photosynthesis, Digestive Enzymes, Respiration, Heart & Nephron',
            'Neuron, Reflex Arc, Brain, Phytohormones & Endocrine Glands',
          ],
        },
        {
          chapter: 'Reproduction, Heredity & Environment',
          topics: [
            'Asexual Modes, Flower Fertilisation, Human Reproduction & Contraception',
            'Mendel’s Monohybrid/Dihybrid Crosses, Sex Determination & 10% Law / Ozone',
          ],
        },
        {
          chapter: 'Light & The Human Eye',
          topics: [
            'Mirror & Lens Formula Numerics + Sign Convention & Power',
            'Myopia, Hypermetropia, Prism Dispersion & Atmospheric Scattering',
          ],
        },
        {
          chapter: 'Electricity & Magnetic Effects',
          topics: [
            'Ohm’s Law, Resistivity, Series/Parallel Resistors, Joule Heating & Power (kWh)',
            'Solenoid, Fleming’s Left-Hand Rule & Domestic Circuits (Fuse/Earthing)',
          ],
        },
      ],
      Mathematics: [
        {
          chapter: 'Real Numbers',
          topics: [
            'Fundamental Theorem of Arithmetic (Prime Factorization)',
            'HCF & LCM Relation (HCF × LCM = Product of Two Numbers) + Word Problems',
            'Proof of Irrationality (√2, √3, √5 & a + b√p)',
          ],
        },
        {
          chapter: 'Polynomials',
          topics: [
            'Geometrical Meaning of Zeroes of a Polynomial',
            'Relationship Between Zeroes & Coefficients of Quadratic Polynomial (α+β, αβ)',
            'Forming Quadratic Polynomial from Sum/Product & Symmetric Roots (α²+β², 1/α+1/β)',
          ],
        },
        {
          chapter: 'Pair of Linear Equations in Two Variables',
          topics: [
            'Graphical Method & Consistency Conditions (Unique, Infinite, No Solution)',
            'Algebraic Solution by Substitution Method',
            'Algebraic Solution by Elimination Method',
            'Word Problems (Digits, Fractions, Ages, Upstream/Downstream, Fixed Charges)',
          ],
        },
        {
          chapter: 'Quadratic Equations',
          topics: [
            'Standard Form & Solution by Factorisation',
            'Quadratic Formula (Sridharacharya) & Discriminant (D = b² − 4ac)',
            'Nature of Roots (Distinct, Equal, Non-Real) & Finding Unknown k',
            'Word Problems (Speed-Time, Consecutive Integers, Pipe Filling, Areas)',
          ],
        },
        {
          chapter: 'Arithmetic Progressions',
          topics: [
            'General Form & nth Term from Beginning / End (an = a + (n−1)d)',
            'Sum of First n Terms (Sn) & Relation an = Sn − Sn−1',
            'Selection of Terms in AP & Real-Life Word Problems',
          ],
        },
        {
          chapter: 'Triangles',
          topics: [
            'Similar Figures & Basic Proportionality Theorem (Thales Theorem) + Converse',
            'Similarity Criteria (AAA/AA, SSS, SAS)',
            'Proportional Sides, Medians & Perimeters in Similar Triangles',
          ],
        },
        {
          chapter: 'Coordinate Geometry',
          topics: [
            'Distance Formula (Collinearity, Triangle/Quadrilateral Identification & Equidistant)',
            'Section Formula (Internal Ratio m1:m2), Mid-Point Formula & Trisection',
          ],
        },
        {
          chapter: 'Introduction to Trigonometry & Heights/Distances',
          topics: [
            'Trigonometric Ratios of Acute Angles (sin, cos, tan, cot, sec, cosec)',
            'Trigonometric Ratios of Specific Angles (0°, 30°, 45°, 60°, 90°)',
            'Fundamental Trigonometric Identities & Proofs',
            'Heights & Distances: Angles of Elevation & Depression Word Problems',
          ],
        },
        {
          chapter: 'Circles',
          topics: [
            'Tangent Perpendicular to Radius at Point of Contact',
            'Equal Length of Two Tangents from an External Point & Concentric Chord Proofs',
          ],
        },
        {
          chapter: 'Areas Related to Circles & Surface Areas/Volumes',
          topics: [
            'Perimeter & Area of Sector and Segment (Minor/Major) of a Circle',
            'Surface Area of Combined Solids (Cylinder, Cone, Hemisphere, Cube, Sphere)',
            'Volume of Combined Solids & Water Flow / Conversion',
          ],
        },
        {
          chapter: 'Statistics & Probability',
          topics: [
            'Mean of Grouped Data (Direct, Assumed Mean & Step-Deviation)',
            'Mode & Median of Grouped Data + Missing Frequencies & Empirical Relation',
            'Classical Probability: Coins, Single/Pair of Dice, Playing Cards & Complements',
          ],
        },
      ],
    },
    ICSE: {
      Physics: [
        {
          chapter: 'Force, Work, Energy & Power',
          topics: [
            'Moment of Force (Torque), Couple & Principle of Moments (Equilibrium)',
            'Centre of Gravity of Regular & Irregular Laminae',
            'Uniform Circular Motion (Centripetal vs Centrifugal Force)',
            'Work, Kinetic/Potential Energy, Power & Conservation of Mechanical Energy',
          ],
        },
        {
          chapter: 'Machines',
          topics: [
            'Mechanical Advantage (MA), Velocity Ratio (VR) & Efficiency (η = MA/VR)',
            'Classes I, II & III Levers + Principle of a Machine',
            'Single Fixed Pulley, Single Movable Pulley & Block-and-Tackle Pulley Systems',
          ],
        },
        {
          chapter: 'Refraction of Light at Plane Surfaces & Lenses',
          topics: [
            'Snell’s Law, Refractive Index, Lateral Displacement & Multiple Images in Thick Mirror',
            'Real & Apparent Depth Numerics',
            'Refraction Through Prism, Minimum Deviation & Factors Affecting Deviation',
            'Total Internal Reflection (TIR), Critical Angle & Right-Angled Isosceles Prisms',
            'Convex & Concave Lenses: Ray Diagrams, Lens Formula, Magnification & Power',
          ],
        },
        {
          chapter: 'Spectrum & Sound',
          topics: [
            'Dispersion, Electromagnetic Spectrum Bands & Ultraviolet/Infrared Properties',
            'Scattering of Light & Sky/Sunset Phenomena',
            'Echoes, SONAR & Reflection of Sound Numerics',
            'Free (Natural), Damped & Forced Vibrations + Resonance & Loudness/Pitch/Quality',
          ],
        },
        {
          chapter: 'Current Electricity & Household Circuits',
          topics: [
            'Ohm’s Law, Ohmic/Non-Ohmic Graphs, Specific Resistance & Superconductors',
            'EMF, Terminal Voltage, Internal Resistance & Combination of Resistors',
            'Electrical Energy, Power (P = V²/R) & Commercial Electricity Bill Numerics',
            'Household Circuits: Ring System, Fuse, MCB, Earthing & Dual Control Switches',
          ],
        },
        {
          chapter: 'Electro-magnetism, Calorimetry & Radioactivity',
          topics: [
            'Oersted Experiment, Solenoid, Electromagnet & Fleming’s Left-Hand Rule',
            'DC Motor, Electromagnetic Induction (Faraday/Lenz) & Fleming’s Right-Hand Rule',
            'AC Generator & Step-Up/Step-Down Transformer',
            'Calorimetry: Specific Heat Capacity, Latent Heat & Principle of Mixtures Numerics',
            'Radioactivity: α, β, γ Radiations, Nuclear Decay Equations, Background Radiation & Fission/Fusion',
          ],
        },
      ],
      Chemistry: [
        {
          chapter: 'Periodic Properties & Variations',
          topics: [
            'Modern Periodic Law & Salient Features of Periods and Groups',
            'Periodic Trends: Atomic Size, Metallic/Non-Metallic Character',
            'Ionization Potential, Electron Affinity & Electronegativity Across Periods/Down Groups',
          ],
        },
        {
          chapter: 'Chemical Bonding',
          topics: [
            'Electrovalent (Ionic) Bonding & Redox Nature (Electron Dot Diagrams)',
            'Covalent Bonding (Polar & Non-Polar Molecules: H2O, NH3, CH4, CCl4)',
            'Coordinate (Dative) Bonding (Hydronium H3O+ & Ammonium NH4+ Ions)',
          ],
        },
        {
          chapter: 'Acids, Bases, Salts & Analytical Chemistry',
          topics: [
            'Classification of Acids/Bases, Basicity/Acidity & pH Scale',
            'Methods of Preparation of Soluble & Insoluble Salts',
            'Action of NaOH & NH4OH on Metallic Salt Solutions (Ca, Fe²⁺, Fe³⁺, Cu, Zn, Pb)',
            'Action of Alkalis on Amphoteric Metals & Oxides (Zn, Al, Pb)',
          ],
        },
        {
          chapter: 'Mole Concept & Stoichiometry',
          topics: [
            'Gay-Lussac’s Law of Combining Volumes & Avogadro’s Law',
            'Vapour Density & Relative Molecular Mass (M = 2 × VD)',
            'Mole Calculations (Mass, Volume at STP, Molecules)',
            'Percentage Composition, Empirical & Molecular Formula + Stoichiometric Numerics',
          ],
        },
        {
          chapter: 'Electrolysis & Metallurgy',
          topics: [
            'Electrolytes vs Non-Electrolytes & Selective Discharge of Ions',
            'Electrolysis of Acidified Water, CuSO4 (Active vs Inert Electrodes) & Molten PbBr2',
            'Electroplating (Ni, Ag) & Electrorefining of Copper',
            'Metallurgy: Ore Dressing, Roasting/Calcination & Extraction of Aluminium (Baeyer & Hall-Héroult)',
            'Alloys (Duralumin, Magnalium, Brass, Bronze, Solder, Steel)',
          ],
        },
        {
          chapter: 'Study of Compounds (HCl, NH3, HNO3, H2SO4)',
          topics: [
            'Hydrogen Chloride: Lab Prep, Fountain Experiment & Aqua Regia',
            'Ammonia: Lab Prep, Haber’s Process, Catalytic Oxidation & Reducing Action',
            'Nitric Acid: Lab Prep, Ostwald Process, Oxidising Action on C, S, Cu & Brown Ring Test',
            'Sulphuric Acid: Contact Process, Acidic, Dehydrating & Oxidising Properties',
          ],
        },
        {
          chapter: 'Organic Chemistry (ICSE)',
          topics: [
            'Unique Nature of Carbon, Homologous Series, Isomerism & IUPAC Nomenclature',
            'Alkanes (Methane, Ethane): Lab Prep & Halogenation',
            'Alkenes (Ethene): Preparation by Dehydration/Dehydrohalogenation & Addition Reactions',
            'Alkynes (Ethyne): Lab Prep from CaC2 & Addition Reactions',
            'Alcohols (Ethanol) & Carboxylic Acids (Acetic Acid): Properties, Esterification & Uses',
          ],
        },
      ],
      Biology: [
        {
          chapter: 'Cell Cycle, Chromosomes & Genetics',
          topics: [
            'Cell Cycle, Stages of Mitosis (Plant vs Animal) & Significance of Meiosis',
            'Structure of Chromosomes, DNA Nucleotide & Watson-Crick Model',
            'Mendel’s Laws, Monohybrid/Dihybrid Crosses & Sex Determination',
            'Sex-Linked Inheritance (Haemophilia & Colour Blindness) & Mutations',
          ],
        },
        {
          chapter: 'Plant Physiology (Absorption, Transpiration, Photosynthesis)',
          topics: [
            'Imbibition, Diffusion, Osmosis, Turgidity, Flaccidity, Plasmolysis & Root Pressure',
            'Transpiration Mechanism, Stomata, Ganong’s Potometer, Guttation & Bleeding',
            'Chloroplast, Light-Dependent & Calvin Cycle Phases of Photosynthesis + Experiments',
            'Chemical Coordination in Plants: Auxins, Gibberellins, Cytokinins, Ethylene, ABA & Tropisms',
          ],
        },
        {
          chapter: 'Human Circulatory, Excretory, Nervous & Endocrine Systems',
          topics: [
            'Blood Composition, Clotting, Blood Groups, Heart Chambers, Valves & Cardiac Cycle',
            'Kidney Structure, Nephron Ultrafiltration, Tubular Reabsorption & Urine Composition',
            'Neuron, Brain (Cerebrum, Cerebellum, Medulla), Spinal Cord & Reflex Action',
            'Sense Organs: Eye Structure, Defects (Myopia, Hypermetropia) & Ear (Balance/Hearing)',
            'Endocrine Glands (Adrenal, Pancreas, Thyroid, Pituitary) & Hormonal Disorders',
          ],
        },
        {
          chapter: 'Reproductive System, Human Evolution & Pollution',
          topics: [
            'Male/Female Reproductive Systems, Menstrual Cycle, Fertilisation & Placenta',
            'Population Explosion, Contraception & Surgical Methods',
            'Human Evolution (Ramapithecus to Homo sapiens), Lamarckism & Darwinism',
            'Air, Water, Soil, Noise, Radioactive Pollution & Swachh Bharat / Euro Norms',
          ],
        },
      ],
      Mathematics: [
        {
          chapter: 'GST, Banking & Shares and Dividends',
          topics: [
            'GST Billing (CGST, SGST, IGST) & Input Tax Credit Basics',
            'Recurring Deposit (RD) Account Interest & Maturity Value',
            'Shares, Market Value vs Nominal Value, Dividend & Rate of Return',
          ],
        },
        {
          chapter: 'Linear Inequations & Quadratic Equations',
          topics: [
            'Solving Linear Inequations over N, W, Z & R + Number Line Graphing',
            'Solving Quadratic Equations & Discriminant Nature of Roots',
            'Quadratic Word Problems (Numbers, Age, Speed, Geometry)',
          ],
        },
        {
          chapter: 'Ratio, Proportion, Remainder & Factor Theorem',
          topics: [
            'Continued Proportion & Properties (Componendo, Dividendo, Invertendo)',
            'Remainder Theorem & Factor Theorem for Cubic Polynomials',
          ],
        },
        {
          chapter: 'Matrices, AP & GP',
          topics: [
            'Matrix Order, Addition, Scalar Multiplication & Matrix Multiplication',
            'Arithmetic Progression (AP): nth Term, Sum & Word Problems',
            'Geometric Progression (GP): nth Term & Sum of n Terms',
          ],
        },
        {
          chapter: 'Coordinate Geometry (Reflection, Section & Line)',
          topics: [
            'Reflection of Points in X-Axis, Y-Axis, Origin & Lines x=a, y=b',
            'Distance, Section & Mid-Point Formula + Centroid',
            'Slope, Parallel/Perpendicular Lines & Equations of a Straight Line',
          ],
        },
        {
          chapter: 'Similarity, Loci & Circles',
          topics: [
            'BPT & Similarity Criteria + Ratio of Areas of Similar Triangles',
            'Loci Theorems & Geometrical Constructions',
            'Circle Angle, Cyclic Quadrilateral & Alternate Segment Tangent-Chord Theorems',
          ],
        },
        {
          chapter: 'Mensuration, Trigonometry, Statistics & Probability',
          topics: [
            'Surface Area & Volume of Cylinder, Cone, Sphere & Combined Solids',
            'Trigonometric Identities & Heights and Distances Problems',
            'Mean (Direct/Short-Cut/Step-Deviation), Median, Quartiles, Ogive & Mode (Histogram)',
            'Classical Probability (Dice, Coins, Cards, Balls)',
          ],
        },
      ],
    },
  },
};

export const JUNIOR_HUMANITIES_AND_CS: Record<string, Record<string, ChapterEntry[]>> = {
  History: {
    CBSE: [
      {
        chapter: 'The Rise of Nationalism in Europe (Class 10)',
        topics: [
          'Frederic Sorrieu’s Vision & French Revolution (1789)',
          'Napoleonic Code (1804) & Congress of Vienna (1815)',
          'Age of Revolutions (1830–1848) & Romanticism',
          'Unification of Germany (Bismarck) & Italy (Cavour, Garibaldi, Mazzini)',
          'Strange Case of Britain, Marianne/Germania Allegory & Balkan Conflict',
        ],
      },
      {
        chapter: 'Nationalism in India (Class 10)',
        topics: [
          'First World War Impact, Rowlatt Act & Jallianwala Bagh Massacre',
          'Khilafat & Non-Cooperation Movement (Towns, Countryside, Plantations)',
          'Simon Commission, Lahore Congress (Purna Swaraj) & Salt March (Civil Disobedience)',
          'Gandhi-Irwin Pact, Poona Pact & Sense of Collective Belonging',
        ],
      },
      {
        chapter: 'The French Revolution & Nazism (Class 9)',
        topics: [
          'French Society of Three Estates, Subsistence Crisis & Storming of Bastille',
          'Declaration of Rights of Man, Reign of Terror (Robespierre) & Abolition of Slavery',
          'Birth of Weimar Republic, Treaty of Versailles & Great Depression',
          'Hitler’s Rise to Power, Nazi Racial Worldview & Youth/Women Policies',
        ],
      },
      {
        chapter: 'Colonialism, Revolt of 1857 & Tribal Movements (Class 8 / JAC)',
        topics: [
          'Permanent Settlement, Ryotwari & Mahalwari Revenue Systems',
          'Indigo Rebellion & Causes/Centres/Impact of the Revolt of 1857',
          'Santhal Hul (Sidhu-Kanhu) & Birsa Munda Ulgulan Movement (Jharkhand JAC)',
          'Social Reformers: Raja Rammohan Roy, Jyotirao Phule & Ishwar Chandra Vidyasagar',
        ],
      },
      {
        chapter: 'Medieval India: Delhi Sultanate & Mughal Empire (Class 7)',
        topics: [
          'Delhi Sultanate Dynasties & Administration under Alauddin Khalji / Tughlaq',
          'Mughal Empire: Babur to Aurangzeb & Mansabdari / Zabt System',
          'Bhakti & Sufi Movements + Temple & Mughal Architecture',
        ],
      },
    ],
    ICSE: [
      {
        chapter: 'The First War of Independence (1857) & Growth of Nationalism',
        topics: [
          'Political, Socio-Religious, Economic & Military Causes of 1857 Revolt',
          'Consequences of 1857 (Queen’s Proclamation & End of Company Rule)',
          'Foundation of Indian National Congress, Partition of Bengal & Swadeshi Movement',
          'Early Nationalists vs Assertive Nationalists (Lal-Bal-Pal) & Lucknow Pact',
        ],
      },
      {
        chapter: 'The Gandhian Era (1919–1947)',
        topics: [
          'Non-Cooperation Movement (Chauri Chaura) & Khilafat',
          'Civil Disobedience Movement (Dandi March, Gandhi-Irwin Pact)',
          'Quit India Movement (1942) & Subhas Chandra Bose (Forward Bloc & INA)',
          'Cabinet Mission, Mountbatten Plan & Indian Independence Act (1947)',
        ],
      },
      {
        chapter: 'The Contemporary World (World Wars & United Nations)',
        topics: [
          'First World War: Causes, Sarajevo Crisis & Treaty of Versailles',
          'Rise of Fascism (Mussolini) & Nazism (Hitler)',
          'Second World War: Causes, Events & Consequences',
          'United Nations Organs (General Assembly, Security Council, ICJ) & Specialized Agencies',
          'Non-Aligned Movement (NAM): Objectives & Role of Nehru',
        ],
      },
    ],
  },
  Civics: {
    CBSE: [
      {
        chapter: 'Power Sharing & Federalism',
        topics: [
          'Ethnic Composition & Accommodation in Belgium vs Majoritarianism in Sri Lanka',
          'Horizontal, Vertical & Community Forms of Power Sharing',
          'Features of Federalism & Union, State, Concurrent Lists',
          'Linguistic States, Language Policy & 1992 Decentralisation (Panchayati Raj)',
        ],
      },
      {
        chapter: 'Political Parties, Gender/Caste & Outcomes of Democracy',
        topics: [
          'Functions & Necessity of Political Parties + One/Two/Multi-Party Systems',
          'National vs State Parties & Challenges + Reforms of Political Parties',
          'Gender Division, Communalism, Secularism & Caste in Politics',
          'Accountable/Legitimate Democracy, Economic Outcomes & Dignity',
        ],
      },
      {
        chapter: 'Constitution, Electoral Politics & Working of Institutions (Class 7–9)',
        topics: [
          'Making of Indian Constitution, Preamble & Fundamental Rights / Duties',
          'System of Elections, Reserved Constituencies & Election Commission Powers',
          'Lok Sabha vs Rajya Sabha, Prime Minister/Cabinet & Independence of Judiciary',
        ],
      },
    ],
    ICSE: [
      {
        chapter: 'The Union Legislature (Parliament)',
        topics: [
          'Federal Setup, Lok Sabha & Rajya Sabha Composition and Qualifications',
          'Parliamentary Procedures: Quorum, Question Hour, Zero Hour & Motions (Adjournment/No-Confidence)',
          'Exclusive Powers of Lok Sabha & Rajya Sabha + Legislative Procedure',
        ],
      },
      {
        chapter: 'The Union Executive (President, PM & Council of Ministers)',
        topics: [
          'President of India: Election, Qualifications, Impeachment & Emergency Powers',
          'Vice-President: Election & Functions',
          'Prime Minister & Council of Ministers: Collective & Individual Responsibility',
        ],
      },
      {
        chapter: 'The Judiciary (Supreme Court & High Courts)',
        topics: [
          'Supreme Court: Judges Appointment, Independence & Original/Appellate/Advisory Jurisdiction',
          'Judicial Review, Court of Record & Fundamental Rights Writs',
          'High Courts & Subordinate Courts (Lok Adalats)',
        ],
      },
    ],
  },
  Geography: {
    CBSE: [
      {
        chapter: 'Resources, Land, Soils, Forests & Water',
        topics: [
          'Resource Planning, Sustainable Development & Rio Earth Summit',
          'Land Use Pattern, Land Degradation & Conservation Measures',
          'Alluvial, Black, Red/Yellow, Laterite, Arid & Forest Soils + Soil Erosion',
          'Forest & Wildlife Conservation (Project Tiger, Joint Forest Management)',
          'Multipurpose River Projects & Traditional Rainwater Harvesting',
        ],
      },
      {
        chapter: 'Agriculture, Minerals & Manufacturing Industries',
        topics: [
          'Farming Types (Subsistence, Plantation) & Rabi, Kharif, Zaid Cropping Seasons',
          'Major Crops (Rice, Wheat, Millets, Cotton, Jute, Tea, Coffee) & Green Revolution',
          'Ferrous, Non-Ferrous, Coal, Petroleum & Jharkhand (Chotanagpur) Mineral Belt',
          'Agro-Based & Mineral-Based Industries (TISCO Jamshedpur, Bokaro Steel, IT) & Pollution',
        ],
      },
      {
        chapter: 'India: Size, Location, Physical Features, Drainage & Climate (Class 7–9)',
        topics: [
          'India’s Latitudinal/Longitudinal Extent, IST (82°30′E) & Neighbours',
          'Himalayas, Northern Plains, Peninsular Plateau, Desert & Coastal Plains',
          'Himalayan vs Peninsular Rivers (Ganga, Brahmaputra, Godavari, Narmada)',
          'Factors Controlling India’s Climate, Monsoon Mechanism, El Nino & Seasons',
        ],
      },
    ],
    ICSE: [
      {
        chapter: 'Interpretation of Topographical Maps & Map of India',
        topics: [
          'Four-Figure & Six-Figure Grid Reference on Survey Sheets',
          'Contour Patterns (Conical Hill, Ridge, Escarpment, Waterfall) & Drainage Patterns',
          'Scale Conversion (Statement, RF, Linear), Direction & Settlement Patterns',
        ],
      },
      {
        chapter: 'Climate, Soils, Natural Vegetation & Water Resources of India',
        topics: [
          'SW Monsoon, Western Disturbances, Mango Showers & Retreating Monsoon',
          'Alluvial, Black, Red & Laterite Soils + Erosion & Conservation',
          'Tropical Evergreen, Deciduous, Thorn, Montane & Littoral (Mangrove) Forests',
          'Irrigation Methods (Wells, Tubewells, Canals, Tanks, Drip) & Rainwater Harvesting',
        ],
      },
      {
        chapter: 'Minerals, Agriculture, Manufacturing Industries & Transport',
        topics: [
          'Iron Ore, Manganese, Copper, Bauxite, Coal, Petroleum & Non-Conventional Energy',
          'Cultivation of Rice, Wheat, Pulses, Sugarcane, Cotton, Jute, Tea & Coffee',
          'Sugar, Cotton Textile, Silk, Iron & Steel (TISCO, Bhilai, Rourkela), Petrochemical & Electronics',
          'Roadways, Railways, Airways, Waterways & Waste Management',
        ],
      },
    ],
  },
  'Social Science (Combined)': {
    CBSE: [
      {
        chapter: 'History: Nationalism in Europe, India & Tribal Uprisings',
        topics: [
          'French Revolution, Napoleonic Code & German/Italian Unification',
          'Non-Cooperation, Civil Disobedience & Quit India Movements',
          'Revolt of 1857, Birsa Munda & Santhal Hul (JAC)',
        ],
      },
      {
        chapter: 'Geography: Resources, Agriculture, Minerals & Industries',
        topics: [
          'Soil Types, Cropping Seasons (Rabi/Kharif/Zaid) & Water Harvesting',
          'Chotanagpur Mineral Belt, Coal/Iron & Steel Plants (TISCO/Bokaro)',
        ],
      },
      {
        chapter: 'Civics & Economics: Federalism, Development, Money & Globalisation',
        topics: [
          'Power Sharing, Federal Lists & Local Government (Panchayati Raj)',
          'Primary, Secondary & Tertiary Sectors of Indian Economy',
          'Formal vs Informal Credit (SHGs), RBI & Globalisation (MNCs, WTO)',
        ],
      },
    ],
  },
  Hindi: {
    CBSE: [
      {
        chapter: 'हिन्दी व्याकरण (संधि, समास, वाक्य एवं वाच्य)',
        topics: [
          'स्वर संधि (दीर्घ, गुण, वृद्धि, यण्, अयादि)',
          'व्यंजन एवं विसर्ग संधि के नियम व उदाहरण',
          'समास एवं उसके भेद (अव्ययीभाव, तत्पुरुष, कर्मधारय, द्विगु, द्वन्द्व, बहुव्रीहि)',
          'उपसर्ग एवं प्रत्यय (कृत व तद्धित)',
          'रचना के आधार पर वाक्य भेद (सरल, संयुक्त, मिश्र) एवं रूपांतरण',
          'वाच्य (कर्तृवाच्य, कर्मवाच्य, भाववाच्य) एवं वाच्य परिवर्तन',
          'पद परिचय (संज्ञा, सर्वनाम, विशेषण, क्रिया, अव्यय)',
        ],
      },
      {
        chapter: 'अलंकार, रस, छंद एवं मुहावरे',
        topics: [
          'शब्दालंकार (अनुप्रास, यमक, श्लेष) एवं अर्थालंकार (उपमा, रूपक, उत्प्रेक्षा, अतिशयोक्ति, मानवीकरण)',
          'रस के अंग (स्थायी भाव, विभाव, अनुभाव, संचारी भाव) एवं प्रमुख रस',
          'मुहावरे, लोकोक्तियाँ एवं पर्यायवाची/विलोम/अनेकार्थी शब्द',
        ],
      },
      {
        chapter: 'गद्य एवं पद्य खंड (क्षितिज / कृतिका / स्पर्श / वसंत)',
        topics: [
          'कबीर की साखियाँ, सबद व पद',
          'सूरदास के पद एवं तुलसीदास (राम-लक्ष्मण-परशुराम संवाद)',
          'प्रेमचंद की कहानियाँ (दो बैलों की कथा / ईदगाह) एवं पठित गद्यांश',
          'अपठित गद्यांश-काव्यांश, अनुच्छेद, विज्ञापन एवं औपचारिक/अनौपचारिक पत्र लेखन',
        ],
      },
    ],
  },
  English: {
    CBSE: [
      {
        chapter: 'Applied English Grammar',
        topics: [
          'Tenses & Sequence of Tenses',
          'Modals (Can, Could, May, Might, Must, Should, Ought to)',
          'Subject-Verb Concord (Agreement Rules)',
          'Determiners & Quantifiers',
          'Active & Passive Voice Transformations',
          'Direct & Indirect (Reported) Speech',
          'Clauses (Noun, Adjective/Relative, Adverb Clauses) & Prepositions',
          'Integrated Editing, Omission & Gap Filling',
        ],
      },
      {
        chapter: 'Reading & Writing Skills',
        topics: [
          'Discursive & Case-Based Factual Comprehension Passages',
          'Formal Letters (Editor, Enquiry, Order, Complaint)',
          'Analytical Paragraph & Notice / E-Mail Writing',
        ],
      },
      {
        chapter: 'Literature: Prose & Poetry Analysis',
        topics: [
          'Poetic Devices (Metaphor, Simile, Alliteration, Oxymoron, Personification, Enjambment)',
          'Extract-Based Comprehension & Character / Theme Analysis',
        ],
      },
    ],
    ICSE: [
      {
        chapter: 'ICSE Functional Grammar & Transformation',
        topics: [
          'Prepositions & Phrasal Verbs Usage',
          'Tense Forms & Joining Sentences Without And/But/So',
          'Transformation of Sentences (No sooner...than, Hardly...when, Too...to, Active/Passive, Reported Speech, Degrees of Comparison)',
        ],
      },
      {
        chapter: 'Composition, Precis & Letter Writing',
        topics: [
          'Narrative, Descriptive & Argumentative Essays',
          'Formal & Informal Letters, Notice & E-Mail',
          'Unseen Comprehension & Precis (Summary Grid) Writing',
        ],
      },
    ],
  },
  Sanskrit: {
    CBSE: [
      {
        chapter: 'संस्कृत व्याकरणम्',
        topics: [
          'स्वरसन्धिः (दीर्घ, गुण, वृद्धि, यण्, अयादि, पूर्वरूप)',
          'व्यञ्जन एवं विसर्गसन्धिः',
          'समासः (अव्ययीभावः, तत्पुरुषः, कर्मधारयः, द्विगुः, द्वन्द्वः, बहुव्रीहिः)',
          'प्रत्ययाः (क्त्वा, तुमुन्, ल्यप्, शतृ, शानच्, क्त, क्तवतु, तव्यत्, अनीयर्)',
          'शब्दरूपाणि, धातुरूपाणि (पञ्च लकाराः) एवं उपपद-विभक्तिप्रयोगः',
          'वाच्यपरिवर्तनम् एवं अशुद्धिसंशोधनम्',
        ],
      },
      {
        chapter: 'शेमुषी / रुचिरा (गद्य-पद्य-नाट्यांश)',
        topics: [
          'पठित-गद्यांशः एवं नाट्यांशः',
          'श्लोक-अन्वयः एवं भावार्थलेखनम्',
          'प्रश्ननिर्माणम् एवं कथा-घटनाक्रमसंयोजनम्',
        ],
      },
    ],
  },
  'Computer Science': {
    CBSE: [
      {
        chapter: 'Python Programming & Problem Solving',
        topics: [
          'Variables, Data Types, Operators & Input/Output',
          'Conditional Statements (if-elif-else) & Loops (for, while, nested)',
          'Strings Slicing & Built-In String Methods',
          'Lists, Tuples, Dictionaries & User-Defined Functions',
        ],
      },
      {
        chapter: 'Databases (SQL), Cyber Safety & Web Basics',
        topics: [
          'DBMS Concepts, Primary/Foreign Keys & DDL/DML Commands',
          'SQL Queries (SELECT, WHERE, ORDER BY, GROUP BY, Aggregate Functions)',
          'HTML5 Tags, CSS Selectors & Box Model',
          'Computer Networks (LAN/WAN, Topologies, Protocols) & Cyber Security',
        ],
      },
    ],
    ICSE: [
      {
        chapter: 'Object-Oriented Programming in Java (BlueJ)',
        topics: [
          'OOP Principles: Abstraction, Encapsulation, Inheritance & Polymorphism',
          'Tokens, Primitive Data Types, Type Casting & Ternary/Bitwise Operators',
          'Conditional Constructs (if-else, switch-case) & Iterative Loops (for, while, do-while)',
          'Methods, Method Overloading, Pure/Impure Functions & Constructors',
        ],
      },
      {
        chapter: 'Arrays, Strings & Library Classes (ICSE Class 10)',
        topics: [
          '1D Arrays: Linear Search, Binary Search, Bubble Sort & Selection Sort',
          '2D Arrays: Matrix Operations & Diagonal Sums',
          'String Handling Methods (charAt, substring, indexOf, compareTo, trim)',
          'Wrapper Classes, Autoboxing/Unboxing & Encapsulation Access Specifiers',
        ],
      },
    ],
  },
};
