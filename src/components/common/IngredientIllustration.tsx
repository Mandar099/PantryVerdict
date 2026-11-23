import React from 'react';

interface IngredientIllustrationProps {
  ingredientId?: string;
  category?: string;
  name?: string;
  className?: string;
}

/**
 * Editorial Botanical & Pantry SVG Specimen System
 * Replaces fragile stock photo URLs with bespoke, handcrafted vector specimens.
 * 100% offline, zero network latency, zero broken images, and 100% exact match.
 */
export const IngredientIllustration: React.FC<IngredientIllustrationProps> = ({
  ingredientId = '',
  category = 'Cooking Oils',
  name = '',
  className = 'w-full h-full',
}) => {
  const normId = ingredientId.toLowerCase();
  const normCat = category.toLowerCase();
  const normName = name.toLowerCase();

  // Helper to choose the exact SVG scene
  const renderSpecimenArtwork = () => {
    // -------------------------------------------------------------
    // SWEETENERS
    // -------------------------------------------------------------
    if (normId.includes('jaggery') || normName.includes('jaggery') || normName.includes('gur')) {
      // Jaggery: Solid stepped dark caramel pyramid/block with sugarcane stalks and juice droplets
      return (
        <g id="specimen-jaggery">
          <rect x="0" y="0" width="300" height="200" fill="#FAF6F0" />
          {/* Background subtle botanical sugarcane stalks */}
          <path d="M50 190 Q65 110 55 30" stroke="#D1C7B7" strokeWidth="2.5" fill="none" strokeDasharray="6 3" />
          <path d="M60 190 Q75 120 70 45" stroke="#E2DDD5" strokeWidth="2" fill="none" />
          <path d="M53 100 Q80 85 100 95" stroke="#C2B6A3" strokeWidth="1.5" fill="none" />
          <path d="M57 140 Q85 125 105 138" stroke="#C2B6A3" strokeWidth="1.5" fill="none" />

          {/* Pedestal / Wooden block */}
          <ellipse cx="160" cy="165" rx="90" ry="22" fill="#E8E0D5" stroke="#18181B" strokeWidth="1.5" />
          <path d="M70 165 C70 177 250 177 250 165 L250 172 C250 184 70 184 70 172 Z" fill="#D8CFBF" stroke="#18181B" strokeWidth="1.5" />

          {/* Jaggery Pyramid Block - Dark unrefined molasses caramel */}
          <path d="M120 155 L140 85 L180 85 L200 155 Z" fill="#78350F" stroke="#18181B" strokeWidth="1.5" />
          <path d="M140 85 L155 60 L195 60 L180 85 Z" fill="#92400E" stroke="#18181B" strokeWidth="1.5" />
          <path d="M195 60 L180 85 L200 155 L215 130 Z" fill="#5A2508" stroke="#18181B" strokeWidth="1.5" />

          {/* Texture marks & broken jaggery chunk */}
          <path d="M135 125 Q145 120 155 125" stroke="#9A3412" strokeWidth="1.5" fill="none" />
          <path d="M165 110 Q175 105 185 110" stroke="#9A3412" strokeWidth="1.5" fill="none" />
          {/* Small broken chunks on dish */}
          <polygon points="105,160 115,152 122,162 110,166" fill="#854D0E" stroke="#18181B" strokeWidth="1.5" />
          <polygon points="198,162 208,155 214,163 205,167" fill="#78350F" stroke="#18181B" strokeWidth="1.5" />

          {/* Tag text in linework */}
          <text x="160" y="32" fontFamily="Fraunces, Georgia, serif" fontSize="12" fontWeight="600" fill="#78350F" textAnchor="middle" letterSpacing="1">
            SACCHARUM OFFICINARUM
          </text>
          <text x="160" y="47" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#A16207" textAnchor="middle" letterSpacing="2">
            RAW UNREFINED GUR
          </text>
        </g>
      );
    }

    if (normId.includes('honey') || normName.includes('honey')) {
      // Raw Wild Honey: Hexagonal honeycomb cells + terracotta honey jar + dripping wooden dipper
      return (
        <g id="specimen-honey">
          <rect x="0" y="0" width="300" height="200" fill="#FCF9F2" />
          {/* Honeycomb lattice background */}
          <path d="M40 50 L55 42 L70 50 L70 68 L55 76 L40 68 Z" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1.5" />
          <path d="M70 50 L85 42 L100 50 L100 68 L85 76 L70 68 Z" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5" />
          <path d="M55 76 L70 68 L85 76 L85 94 L70 102 L55 94 Z" fill="#FCD34D" stroke="#D97706" strokeWidth="1.5" />
          <path d="M85 76 L100 68 L115 76 L115 94 L100 102 L85 94 Z" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1.5" />

          {/* Honey Clay Jar */}
          <path d="M120 165 C115 130 120 105 130 95 L180 95 C190 105 195 130 190 165 Z" fill="#D97706" stroke="#18181B" strokeWidth="1.5" />
          <ellipse cx="155" cy="95" rx="25" ry="6" fill="#F59E0B" stroke="#18181B" strokeWidth="1.5" />
          <path d="M125 120 C140 125 170 125 185 120" stroke="#B45309" strokeWidth="1.5" fill="none" />
          <rect x="135" y="125" width="40" height="25" rx="3" fill="#FFFBEB" stroke="#18181B" strokeWidth="1" />
          <text x="155" y="141" fontFamily="Fraunces, serif" fontSize="8" fill="#78350F" textAnchor="middle" fontWeight="bold">HONEY</text>

          {/* Wooden Honey Dipper with drips */}
          <path d="M175 55 L215 115" stroke="#92400E" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="175" cy="55" rx="8" ry="12" transform="rotate(-35 175 55)" fill="#B45309" stroke="#18181B" strokeWidth="1.5" />
          <path d="M182 62 Q195 85 185 105" stroke="#F59E0B" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Honey droplets */}
          <circle cx="185" cy="115" r="3.5" fill="#F59E0B" stroke="#18181B" strokeWidth="1" />
          <circle cx="180" cy="130" r="2.5" fill="#F59E0B" stroke="#18181B" strokeWidth="1" />

          <text x="155" y="28" fontFamily="Fraunces, Georgia, serif" fontSize="12" fontWeight="600" fill="#92400E" textAnchor="middle" letterSpacing="1">
            APIS MELLIFERA
          </text>
          <text x="155" y="42" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#B45309" textAnchor="middle" letterSpacing="2">
            RAW WILD FOREST HONEY
          </text>
        </g>
      );
    }

    if (normId.includes('khand') || normName.includes('khand')) {
      // Desi Khand: Ceramic bowl with raw unbleached golden-cream sugar crystals
      return (
        <g id="specimen-khand">
          <rect x="0" y="0" width="300" height="200" fill="#FAF7F2" />
          {/* Ceramic Dish */}
          <ellipse cx="150" cy="145" rx="80" ry="24" fill="#E5DFD5" stroke="#18181B" strokeWidth="1.5" />
          <path d="M70 145 C70 175 230 175 230 145 Z" fill="#F3EFEA" stroke="#18181B" strokeWidth="1.5" />
          {/* Mounded raw crystals */}
          <path d="M85 142 Q150 95 215 142 Z" fill="#FEF08A" stroke="#18181B" strokeWidth="1.5" />
          {/* Crystal textures */}
          <polygon points="120,120 126,114 133,122 127,128" fill="#FDE047" stroke="#18181B" strokeWidth="1" />
          <polygon points="145,110 152,104 158,111 151,117" fill="#FACC15" stroke="#18181B" strokeWidth="1" />
          <polygon points="168,122 174,116 182,123 175,130" fill="#FEF08A" stroke="#18181B" strokeWidth="1" />
          <polygon points="135,135 141,130 147,136 142,141" fill="#FDE047" stroke="#18181B" strokeWidth="1" />
          <polygon points="158,132 165,127 172,134 164,139" fill="#FACC15" stroke="#18181B" strokeWidth="1" />

          {/* Wooden scoop handle */}
          <path d="M210 135 L255 110" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
          <ellipse cx="205" cy="137" rx="16" ry="9" fill="#92400E" stroke="#18181B" strokeWidth="1.5" />

          <text x="150" y="32" fontFamily="Fraunces, serif" fontSize="12" fontWeight="600" fill="#713F12" textAnchor="middle" letterSpacing="1">
            MUSCOVADO CRYSTALS
          </text>
          <text x="150" y="47" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#854D0E" textAnchor="middle" letterSpacing="2">
            COLD-PROCESSED DESI KHAND
          </text>
        </g>
      );
    }

    if (normId.includes('white-table-sugar') || normName.includes('table sugar') || normName.includes('white sugar')) {
      // White Refined Sugar: Geometric white sugar cubes + crystal grains
      return (
        <g id="specimen-white-sugar">
          <rect x="0" y="0" width="300" height="200" fill="#F8FAFC" />
          {/* Minimalist slate pedestal */}
          <ellipse cx="150" cy="155" rx="75" ry="18" fill="#E2E8F0" stroke="#18181B" strokeWidth="1.5" />

          {/* Isometric Sugar Cubes */}
          {/* Cube 1 (Left) */}
          <g transform="translate(100, 110)">
            <polygon points="25,0 50,12 25,24 0,12" fill="#FFFFFF" stroke="#18181B" strokeWidth="1.5" />
            <polygon points="0,12 25,24 25,50 0,38" fill="#E2E8F0" stroke="#18181B" strokeWidth="1.5" />
            <polygon points="25,24 50,12 50,38 25,50" fill="#CBD5E1" stroke="#18181B" strokeWidth="1.5" />
          </g>
          {/* Cube 2 (Right) */}
          <g transform="translate(145, 118)">
            <polygon points="25,0 50,12 25,24 0,12" fill="#FFFFFF" stroke="#18181B" strokeWidth="1.5" />
            <polygon points="0,12 25,24 25,50 0,38" fill="#E2E8F0" stroke="#18181B" strokeWidth="1.5" />
            <polygon points="25,24 50,12 50,38 25,50" fill="#CBD5E1" stroke="#18181B" strokeWidth="1.5" />
          </g>
          {/* Cube 3 (Stacked Top) */}
          <g transform="translate(122, 75)">
            <polygon points="25,0 50,12 25,24 0,12" fill="#FFFFFF" stroke="#18181B" strokeWidth="1.5" />
            <polygon points="0,12 25,24 25,50 0,38" fill="#F1F5F9" stroke="#18181B" strokeWidth="1.5" />
            <polygon points="25,24 50,12 50,38 25,50" fill="#E2E8F0" stroke="#18181B" strokeWidth="1.5" />
          </g>

          <text x="150" y="32" fontFamily="Fraunces, serif" fontSize="12" fontWeight="600" fill="#334155" textAnchor="middle" letterSpacing="1">
            CRYSTALLINE SUCROSE
          </text>
          <text x="150" y="47" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#64748B" textAnchor="middle" letterSpacing="2">
            REFINED WHITE TABLE SUGAR
          </text>
        </g>
      );
    }

    // -------------------------------------------------------------
    // COOKING OILS
    // -------------------------------------------------------------
    if (normCat.includes('oil') || normId.includes('oil')) {
      let oilLiquidColor = '#F59E0B'; // default golden
      let oilDropletColor = '#D97706';
      let botanicalPath = null;
      let titleLatin = 'OLEUM CULINARIA';
      let subtitle = 'COLD-PRESSED EXTRACTION';

      if (normId.includes('evoo') || normName.includes('olive')) {
        oilLiquidColor = '#10B981';
        oilDropletColor = '#059669';
        titleLatin = 'OLEA EUROPAEA';
        subtitle = 'EXTRA VIRGIN • FIRST COLD PRESS';
        botanicalPath = (
          <g id="olive-branch">
            <path d="M75 160 Q85 100 110 50" stroke="#18181B" strokeWidth="2" fill="none" />
            {/* Olive leaves */}
            <path d="M90 120 C75 110 70 95 85 90 C100 85 105 100 90 120 Z" fill="#2D5A27" stroke="#18181B" strokeWidth="1.5" />
            <path d="M100 85 C90 70 92 55 107 55 C120 55 118 75 100 85 Z" fill="#3D7835" stroke="#18181B" strokeWidth="1.5" />
            {/* Whole Olives */}
            <ellipse cx="80" cy="130" rx="9" ry="13" transform="rotate(-15 80 130)" fill="#1E3A1A" stroke="#18181B" strokeWidth="1.5" />
            <ellipse cx="108" cy="100" rx="8" ry="12" transform="rotate(25 108 100)" fill="#365314" stroke="#18181B" strokeWidth="1.5" />
          </g>
        );
      } else if (normId.includes('mustard') || normName.includes('mustard')) {
        oilLiquidColor = '#D97706';
        oilDropletColor = '#92400E';
        titleLatin = 'BRASSICA NIGRA';
        subtitle = 'KACHI GHANI • HIGH SMOKE POINT';
        botanicalPath = (
          <g id="mustard-seeds">
            <path d="M80 160 Q90 90 100 50" stroke="#18181B" strokeWidth="2" fill="none" />
            <circle cx="70" cy="135" r="4" fill="#451A03" stroke="#18181B" strokeWidth="1" />
            <circle cx="78" cy="125" r="4" fill="#78350F" stroke="#18181B" strokeWidth="1" />
            <circle cx="88" cy="140" r="3.5" fill="#451A03" stroke="#18181B" strokeWidth="1" />
            <circle cx="65" cy="150" r="3.5" fill="#78350F" stroke="#18181B" strokeWidth="1" />
            <circle cx="95" cy="100" r="4" fill="#451A03" stroke="#18181B" strokeWidth="1" />
            <path d="M85 90 C95 85 105 88 110 95" stroke="#D97706" strokeWidth="2" fill="none" />
          </g>
        );
      } else if (normId.includes('groundnut') || normName.includes('groundnut') || normName.includes('peanut')) {
        oilLiquidColor = '#F59E0B';
        oilDropletColor = '#B45309';
        titleLatin = 'ARACHIS HYPOGAEA';
        subtitle = 'WOOD-PRESSED CHEKKU GROUNDNUT';
        botanicalPath = (
          <g id="peanut-pods">
            <path d="M70 145 C65 130 80 120 75 105 C70 95 90 90 95 105 C100 120 85 130 90 145 Z" fill="#D97706" stroke="#18181B" strokeWidth="1.5" />
            <ellipse cx="102" cy="138" rx="7" ry="11" fill="#78350F" stroke="#18181B" strokeWidth="1.5" />
            <ellipse cx="68" cy="155" rx="6" ry="9" fill="#92400E" stroke="#18181B" strokeWidth="1.5" />
          </g>
        );
      } else if (normId.includes('coconut') || normName.includes('coconut')) {
        oilLiquidColor = '#F8FAFC';
        oilDropletColor = '#E2E8F0';
        titleLatin = 'COCOS NUCIFERA';
        subtitle = 'VIRGIN COLD-PRESSED COCONUT';
        botanicalPath = (
          <g id="coconut-half">
            <ellipse cx="80" cy="135" rx="22" ry="24" fill="#451A03" stroke="#18181B" strokeWidth="1.5" />
            <ellipse cx="80" cy="135" rx="16" ry="18" fill="#FAF8F5" stroke="#18181B" strokeWidth="1.5" />
            <ellipse cx="80" cy="135" rx="10" ry="12" fill="#E2E8F0" />
          </g>
        );
      } else if (normId.includes('sunflower') || normName.includes('sunflower')) {
        oilLiquidColor = '#FCD34D';
        oilDropletColor = '#F59E0B';
        titleLatin = 'HELIANTHUS ANNUUS';
        subtitle = 'REFINED DEEP FRYING MEDIUM';
        botanicalPath = (
          <g id="sunflower-bloom">
            <circle cx="85" cy="115" r="14" fill="#78350F" stroke="#18181B" strokeWidth="1.5" />
            <path d="M85 95 L88 103 L85 95 Z" stroke="#F59E0B" strokeWidth="4" />
            <path d="M85 135 L88 127 L85 135 Z" stroke="#F59E0B" strokeWidth="4" />
            <path d="M65 115 L73 115 L65 115 Z" stroke="#F59E0B" strokeWidth="4" />
            <path d="M105 115 L97 115 L105 115 Z" stroke="#F59E0B" strokeWidth="4" />
          </g>
        );
      } else if (normId.includes('rice-bran') || normName.includes('rice bran')) {
        oilLiquidColor = '#F59E0B';
        oilDropletColor = '#D97706';
        titleLatin = 'ORYZA SATIVA';
        subtitle = 'GAMMA ORYZANOL • HIGH STABILITY';
        botanicalPath = (
          <g id="rice-ear">
            <path d="M75 160 Q85 100 70 50" stroke="#18181B" strokeWidth="2" fill="none" />
            <ellipse cx="72" cy="70" rx="4" ry="7" transform="rotate(30 72 70)" fill="#D97706" stroke="#18181B" strokeWidth="1" />
            <ellipse cx="65" cy="90" rx="4" ry="7" transform="rotate(-20 65 90)" fill="#D97706" stroke="#18181B" strokeWidth="1" />
            <ellipse cx="75" cy="110" rx="4" ry="7" transform="rotate(25 75 110)" fill="#B45309" stroke="#18181B" strokeWidth="1" />
          </g>
        );
      } else if (normId.includes('avocado') || normName.includes('avocado')) {
        oilLiquidColor = '#10B981';
        oilDropletColor = '#047857';
        titleLatin = 'PERSEA AMERICANA';
        subtitle = 'EXTRA VIRGIN • 271°C SMOKE POINT';
        botanicalPath = (
          <g id="avocado-fruit">
            <path d="M85 145 C65 145 60 120 70 100 C78 85 92 85 100 100 C110 120 105 145 85 145 Z" fill="#84CC16" stroke="#18181B" strokeWidth="1.5" />
            <circle cx="85" cy="122" r="11" fill="#78350F" stroke="#18181B" strokeWidth="1.5" />
          </g>
        );
      }

      return (
        <g id="specimen-oil">
          <rect x="0" y="0" width="300" height="200" fill="#FAF8F5" />
          {botanicalPath}

          {/* Apothecary Glass Oil Bottle */}
          <path d="M165 50 L185 50 L185 65 L205 90 L205 165 C205 170 195 175 175 175 C155 175 145 170 145 165 L145 90 L165 65 Z" fill="#FFFFFF" stroke="#18181B" strokeWidth="1.5" opacity="0.95" />
          {/* Liquid fill */}
          <path d="M147 110 L203 110 L203 163 C203 168 193 173 175 173 C157 173 147 168 147 163 Z" fill={oilLiquidColor} opacity="0.85" />
          {/* Glass stopper */}
          <rect x="170" y="40" width="10" height="10" rx="2" fill="#D1D5DB" stroke="#18181B" strokeWidth="1.5" />
          {/* Etched Glass Droplet Emblem */}
          <path d="M175 125 C175 125 183 137 183 143 C183 148 179 151 175 151 C171 151 167 148 167 143 C167 137 175 125 175 125 Z" fill={oilDropletColor} stroke="#18181B" strokeWidth="1.2" />

          {/* Clean Editorial Title */}
          <text x="175" y="28" fontFamily="Fraunces, Georgia, serif" fontSize="12" fontWeight="600" fill="#18181B" textAnchor="middle" letterSpacing="1">
            {titleLatin}
          </text>
          <text x="175" y="42" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#2D5A27" textAnchor="middle" letterSpacing="2">
            {subtitle}
          </text>
        </g>
      );
    }

    // -------------------------------------------------------------
    // GHEE & BUTTER
    // -------------------------------------------------------------
    if (normCat.includes('ghee') || normCat.includes('butter') || normId.includes('ghee') || normId.includes('butter')) {
      const isButter = normId.includes('butter') || normName.includes('butter') || normName.includes('makhan');

      return (
        <g id="specimen-ghee-butter">
          <rect x="0" y="0" width="300" height="200" fill="#FCFAF7" />
          
          {isButter ? (
            /* Desi White Makhan / Butter Block */
            <g transform="translate(10, 0)">
              {/* Earthen plate */}
              <ellipse cx="140" cy="155" rx="80" ry="22" fill="#E7DFD5" stroke="#18181B" strokeWidth="1.5" />
              {/* Churned sphere of Makhan */}
              <ellipse cx="140" cy="130" rx="45" ry="35" fill="#FAF8F5" stroke="#18181B" strokeWidth="1.5" />
              <path d="M115 120 Q140 105 165 120" stroke="#E2DDD5" strokeWidth="2" fill="none" />
              {/* Fresh mint garnish */}
              <path d="M140 95 Q130 80 140 70 Q150 80 140 95 Z" fill="#2D5A27" stroke="#18181B" strokeWidth="1.2" />
              <path d="M140 95 Q155 85 160 78 Q152 70 140 95 Z" fill="#4D7C0F" stroke="#18181B" strokeWidth="1.2" />
            </g>
          ) : (
            /* Traditional Bilona Brass / Clay Ghee Matka */
            <g transform="translate(0, 5)">
              <ellipse cx="150" cy="165" rx="70" ry="18" fill="#E5DFD5" stroke="#18181B" strokeWidth="1.5" />
              {/* Matka Pot */}
              <path d="M100 145 C95 105 120 90 130 80 L170 80 C180 90 205 105 200 145 C195 165 105 165 100 145 Z" fill="#B45309" stroke="#18181B" strokeWidth="1.5" />
              <ellipse cx="150" cy="80" rx="22" ry="7" fill="#FBBF24" stroke="#18181B" strokeWidth="1.5" />
              {/* Golden Ghee Swirl */}
              <ellipse cx="150" cy="80" rx="16" ry="5" fill="#FDE047" />
              {/* Wooden Bilona Churn Stick */}
              <line x1="150" y1="35" x2="150" y2="80" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />
            </g>
          )}

          <text x="150" y="28" fontFamily="Fraunces, Georgia, serif" fontSize="12" fontWeight="600" fill="#92400E" textAnchor="middle" letterSpacing="1">
            BUTYRUM PURIFICATUM
          </text>
          <text x="150" y="42" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#B45309" textAnchor="middle" letterSpacing="2">
            {isButter ? 'CULTURED FRESH MAKHAN' : 'TRADITIONAL BILONA GHEE'}
          </text>
        </g>
      );
    }

    // -------------------------------------------------------------
    // FLOURS & ATTA
    // -------------------------------------------------------------
    if (normCat.includes('flour') || normCat.includes('atta') || normId.includes('flour') || normId.includes('atta') || normId.includes('maida') || normId.includes('besan')) {
      let sackColor = '#E7DFD5';
      let powderColor = '#FDFBF7';
      let subtitle = 'CHAKKI STONE-GROUND ATTA';

      if (normId.includes('besan') || normName.includes('besan')) {
        powderColor = '#FDE047';
        subtitle = 'PURE BENGAL GRAM BESAN';
      } else if (normId.includes('ragi') || normName.includes('ragi')) {
        powderColor = '#881337';
        subtitle = 'SPROUTED FINGER MILLET';
      } else if (normId.includes('almond') || normName.includes('almond')) {
        powderColor = '#FEF08A';
        subtitle = 'BLANCHED ALMOND FLOUR';
      } else if (normId.includes('maida') || normName.includes('maida')) {
        powderColor = '#FFFFFF';
        subtitle = 'REFINED BLEACHED FLOUR';
      }

      return (
        <g id="specimen-flour">
          <rect x="0" y="0" width="300" height="200" fill="#FAF8F5" />
          {/* Wheat stalk botanical background */}
          <path d="M60 160 Q75 90 65 40" stroke="#D1C7B7" strokeWidth="2" fill="none" strokeDasharray="4 2" />
          <ellipse cx="62" cy="65" rx="5" ry="9" transform="rotate(25 62 65)" fill="#D4AF37" stroke="#18181B" strokeWidth="1" />
          <ellipse cx="68" cy="85" rx="5" ry="9" transform="rotate(-20 68 85)" fill="#D4AF37" stroke="#18181B" strokeWidth="1" />

          {/* Kraft / Burlap Flour Sack */}
          <path d="M110 165 L115 105 C115 95 130 90 150 90 C170 90 185 95 185 105 L190 165 Z" fill={sackColor} stroke="#18181B" strokeWidth="1.5" />
          {/* Sack Rim tied with cord */}
          <ellipse cx="150" cy="90" rx="36" ry="12" fill="#D6CEBE" stroke="#18181B" strokeWidth="1.5" />
          {/* Mounded flour crest */}
          <ellipse cx="150" cy="90" rx="30" ry="9" fill={powderColor} stroke="#18181B" strokeWidth="1.2" />
          {/* Twine knot */}
          <path d="M185 90 Q195 85 200 95" stroke="#78350F" strokeWidth="2" fill="none" />

          {/* Flour Seal Stamp */}
          <circle cx="150" cy="130" r="16" fill="none" stroke="#2D5A27" strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="150" y="134" fontFamily="Fraunces, serif" fontSize="8" fill="#2D5A27" textAnchor="middle" fontWeight="bold">MILL</text>

          <text x="150" y="28" fontFamily="Fraunces, Georgia, serif" fontSize="12" fontWeight="600" fill="#18181B" textAnchor="middle" letterSpacing="1">
            TRITICUM AESTIVUM
          </text>
          <text x="150" y="42" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#2D5A27" textAnchor="middle" letterSpacing="2">
            {subtitle}
          </text>
        </g>
      );
    }

    // -------------------------------------------------------------
    // RICE & GRAINS
    // -------------------------------------------------------------
    if (normCat.includes('rice') || normCat.includes('grain') || normId.includes('rice') || normId.includes('basmati') || normId.includes('quinoa') || normId.includes('oat')) {
      const isBasmati = normId.includes('basmati') || normName.includes('basmati');

      return (
        <g id="specimen-grains">
          <rect x="0" y="0" width="300" height="200" fill="#FCFAF7" />
          {/* Ceramic Grain Bowl */}
          <ellipse cx="150" cy="155" rx="75" ry="20" fill="#E5DFD5" stroke="#18181B" strokeWidth="1.5" />
          <path d="M75 140 C75 175 225 175 225 140 Z" fill="#F4EFEA" stroke="#18181B" strokeWidth="1.5" />

          {/* Mounded grains */}
          <path d="M90 138 Q150 90 210 138 Z" fill={isBasmati ? '#FFFFFF' : '#FEF3C7'} stroke="#18181B" strokeWidth="1.5" />

          {/* Slender grains linework */}
          <ellipse cx="130" cy="115" rx="3" ry="8" transform="rotate(35 130 115)" fill="#FAF8F5" stroke="#18181B" strokeWidth="1" />
          <ellipse cx="150" cy="110" rx="3" ry="9" transform="rotate(-15 150 110)" fill="#FAF8F5" stroke="#18181B" strokeWidth="1" />
          <ellipse cx="168" cy="120" rx="3" ry="8" transform="rotate(45 168 120)" fill="#FAF8F5" stroke="#18181B" strokeWidth="1" />
          <ellipse cx="145" cy="125" rx="3" ry="8" transform="rotate(-40 145 125)" fill="#FAF8F5" stroke="#18181B" strokeWidth="1" />

          <text x="150" y="28" fontFamily="Fraunces, Georgia, serif" fontSize="12" fontWeight="600" fill="#18181B" textAnchor="middle" letterSpacing="1">
            ORYZA SATIVA INDICA
          </text>
          <text x="150" y="42" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#2D5A27" textAnchor="middle" letterSpacing="2">
            TRADITIONAL AGED BASMATI
          </text>
        </g>
      );
    }

    // -------------------------------------------------------------
    // SALTS & MINERALS
    // -------------------------------------------------------------
    if (normCat.includes('salt') || normId.includes('salt')) {
      const isPink = normId.includes('pink') || normName.includes('pink');
      const isBlack = normId.includes('black') || normId.includes('kala');
      const crystalColor = isPink ? '#FDA4AF' : isBlack ? '#7E22CE' : '#F8FAFC';

      return (
        <g id="specimen-salt">
          <rect x="0" y="0" width="300" height="200" fill="#FAF8F5" />
          {/* Wooden Cellar Dish */}
          <ellipse cx="150" cy="155" rx="75" ry="20" fill="#D8CFBF" stroke="#18181B" strokeWidth="1.5" />
          <path d="M75 140 C75 175 225 175 225 140 Z" fill="#C2B6A3" stroke="#18181B" strokeWidth="1.5" />

          {/* Angular Salt Crystals */}
          <polygon points="120,135 130,115 145,125 135,145" fill={crystalColor} stroke="#18181B" strokeWidth="1.5" />
          <polygon points="140,120 155,100 170,115 155,135" fill={crystalColor} stroke="#18181B" strokeWidth="1.5" />
          <polygon points="165,130 178,118 190,132 175,145" fill={crystalColor} stroke="#18181B" strokeWidth="1.5" />
          <polygon points="105,142 115,132 125,140 115,148" fill={crystalColor} stroke="#18181B" strokeWidth="1.5" />

          <text x="150" y="28" fontFamily="Fraunces, Georgia, serif" fontSize="12" fontWeight="600" fill="#18181B" textAnchor="middle" letterSpacing="1">
            SAL SODIUM CHLORIDE
          </text>
          <text x="150" y="42" fontFamily="JetBrains Mono, monospace" fontSize="9" fill={isPink ? '#BE185D' : '#18181B'} textAnchor="middle" letterSpacing="2">
            {isPink ? 'HIMALAYAN PINK MINERAL' : isBlack ? 'VOLCANIC KALA NAMAK' : 'IODIZED TABLE SALT'}
          </text>
        </g>
      );
    }

    // -------------------------------------------------------------
    // PULSES & SPICES (Fallback / Default)
    // -------------------------------------------------------------
    const isChili = normId.includes('mirch') || normName.includes('mirch') || normName.includes('chili');
    const isTurmeric = normId.includes('haldi') || normName.includes('turmeric');

    return (
      <g id="specimen-spice-pulse">
        <rect x="0" y="0" width="300" height="200" fill="#FCFAF7" />
        
        {isChili ? (
          /* Whole dried red chili */
          <g transform="translate(0, 10)">
            <path d="M90 140 Q150 160 210 110 Q160 90 120 115 Z" fill="#DC2626" stroke="#18181B" strokeWidth="1.5" />
            <path d="M90 140 Q80 145 75 140" stroke="#2D5A27" strokeWidth="3" fill="none" />
          </g>
        ) : isTurmeric ? (
          /* Fresh Turmeric Rhizome */
          <g transform="translate(0, 10)">
            <ellipse cx="140" cy="130" rx="35" ry="16" transform="rotate(-15 140 130)" fill="#D97706" stroke="#18181B" strokeWidth="1.5" />
            <ellipse cx="170" cy="120" rx="20" ry="12" transform="rotate(30 170 120)" fill="#F59E0B" stroke="#18181B" strokeWidth="1.5" />
          </g>
        ) : (
          /* Divided Spice / Pulse Bowl */
          <g transform="translate(0, 10)">
            <ellipse cx="150" cy="140" rx="70" ry="20" fill="#E5DFD5" stroke="#18181B" strokeWidth="1.5" />
            <circle cx="130" cy="135" r="7" fill="#FACC15" stroke="#18181B" strokeWidth="1" />
            <circle cx="150" cy="130" r="8" fill="#F59E0B" stroke="#18181B" strokeWidth="1" />
            <circle cx="170" cy="135" r="7" fill="#B45309" stroke="#18181B" strokeWidth="1" />
          </g>
        )}

        <text x="150" y="28" fontFamily="Fraunces, Georgia, serif" fontSize="12" fontWeight="600" fill="#18181B" textAnchor="middle" letterSpacing="1">
          SPECIMEN BOTANICUM
        </text>
        <text x="150" y="42" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#2D5A27" textAnchor="middle" letterSpacing="2">
          {name.toUpperCase() || 'WHOLE KITCHEN ESSENTIAL'}
        </text>
      </g>
    );
  };

  return (
    <svg
      viewBox="0 0 300 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Subtle Paper Grain Filter */}
        <filter id="paper-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.05 0" />
          <feComposite in2="SourceGraphic" in="gl" operator="over" />
        </filter>
      </defs>

      {renderSpecimenArtwork()}

      {/* Editorial Hairline Border Frame inside SVG */}
      <rect x="1" y="1" width="298" height="198" fill="none" stroke="#E2DDD5" strokeWidth="1" />
      <rect x="5" y="5" width="290" height="190" fill="none" stroke="#E2DDD5" strokeWidth="0.5" strokeDasharray="3 3" />
    </svg>
  );
};

export default IngredientIllustration;
