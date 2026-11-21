import os

assets_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "assets")
os.makedirs(assets_dir, exist_ok=True)

meds = [
    ('paracetamol.svg', 'Paracetamol 650mg', '#0284c7', 'Tablet / Antipyretic', 'PARACETAMOL'),
    ('amoxicillin.svg', 'Amoxicillin 500mg', '#0d9488', 'Capsule / Antibiotic', 'AMOXICILLIN'),
    ('atorvastatin.svg', 'Atorvastatin 20mg', '#e11d48', 'Tablet / Cardiology', 'ATORVASTATIN'),
    ('metformin.svg', 'Metformin 500mg', '#7c3aed', 'Tablet / Diabetes', 'METFORMIN'),
    ('vitaminc.svg', 'Vitamin C 500mg', '#ea580c', 'Chewable / Immunity', 'VITAMIN C'),
    ('cetirizine.svg', 'Cetirizine 10mg', '#0891b2', 'Tablet / Antihistamine', 'CETIRIZINE'),
    ('omeprazole.svg', 'Omeprazole 20mg', '#16a34a', 'Capsule / Antacid', 'OMEPRAZOLE'),
    ('azithromycin.svg', 'Azithromycin 500mg', '#2563eb', 'Tablet / Antibiotic', 'AZITHROMYCIN'),
    ('ibuprofen.svg', 'Ibuprofen 400mg', '#dc2626', 'Softgel / Pain Relief', 'IBUPROFEN'),
    ('losartan.svg', 'Losartan Pot. 50mg', '#c026d3', 'Tablet / Hypertension', 'LOSARTAN'),
    ('glimepiride.svg', 'Glimepiride 2mg', '#4f46e5', 'Tablet / Blood Sugar', 'GLIMEPIRIDE'),
    ('multivitamin.svg', 'Multivitamin Daily', '#d97706', 'Formula / Vitality', 'MULTIVITAMIN'),
    ('coughsyrup.svg', 'Cough Syrup 100ml', '#059669', 'Herbal / Respiratory', 'COUGH SYRUP'),
    ('antiseptic.svg', 'Antiseptic Cream', '#0284c7', 'Ointment / First Aid', 'ANTISEPTIC'),
    ('pantoprazole.svg', 'Pantoprazole 40mg', '#0f766e', 'Tablet / Gastro', 'PANTOPRAZOLE'),
    ('zincovit.svg', 'Zincovit Tablets', '#b45309', 'Formula / Minerals', 'ZINCOVIT'),
    ('medicine-default.svg', 'MediCare Clinical', '#0369a1', 'Medical Supplies', 'MEDICINE')
]

for filename, title, color, subtitle, code in meds:
    svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <linearGradient id="grad_{code}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#e2e8f0" />
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#grad_{code})" rx="16" />
  <rect x="30" y="25" width="340" height="250" rx="12" fill="white" stroke="#cbd5e1" stroke-width="1.5" />
  
  <!-- Medical Header Bar -->
  <path d="M 30 37 Q 30 25 42 25 L 358 25 Q 370 25 370 37 L 370 75 L 30 75 Z" fill="{color}" />
  <text x="50" y="55" font-family="Segoe UI, -apple-system, sans-serif" font-size="14" font-weight="bold" fill="white" letter-spacing="1">MEDICARE PHARMACEUTICALS</text>
  <circle cx="345" cy="50" r="14" fill="white" fill-opacity="0.25" />
  <text x="340" y="55" font-family="Segoe UI, sans-serif" font-size="16" font-weight="bold" fill="white">+</text>
  
  <!-- Capsule Graphic -->
  <g transform="translate(200, 150)">
    <rect x="-70" y="-35" width="140" height="70" rx="35" fill="#f8fafc" stroke="{color}" stroke-width="4" />
    <path d="M -70 0 C -70 -19.33 -54.33 -35 -35 -35 L 0 -35 L 0 35 L -35 35 C -54.33 35 -70 19.33 -70 0 Z" fill="{color}" />
    <circle cx="-25" cy="0" r="6" fill="white" fill-opacity="0.8" />
    <text x="18" y="7" font-family="Segoe UI, sans-serif" font-size="16" font-weight="bold" fill="{color}">Rx</text>
  </g>
  
  <!-- Medicine Label Info -->
  <text x="200" y="235" text-anchor="middle" font-family="Segoe UI, -apple-system, sans-serif" font-size="16" font-weight="bold" fill="#0f172a">{title}</text>
  <text x="200" y="258" text-anchor="middle" font-family="Segoe UI, -apple-system, sans-serif" font-size="13" font-weight="500" fill="#64748b">{subtitle}</text>
</svg>"""
    with open(os.path.join(assets_dir, filename), 'w', encoding='utf-8') as f:
        f.write(svg_content)

print(f"Generated {len(meds)} SVG illustrations successfully.")
