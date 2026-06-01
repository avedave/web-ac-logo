// Logo Interpreter Engine for WEB-LOGO
// Supports multi-language commands and unrolls nested REPEAT loops.

const COMMAND_ALIASES = {
  // Forward
  'FD': 'FORWARD', 'FORWARD': 'FORWARD',
  'AV': 'FORWARD', 'AVANCE': 'FORWARD',
  'VW': 'FORWARD', 'VORWÄRTS': 'FORWARD', 'VORWAERTS': 'FORWARD',
  'AD': 'FORWARD', 'ADELANTE': 'FORWARD',
  'NP': 'FORWARD', 'NAPRZÓD': 'FORWARD', 'NAPRZOD': 'FORWARD',
  
  // Back
  'BK': 'BACK', 'BACK': 'BACK',
  'RECULE': 'BACK', // RE handled conditionally
  'RW': 'BACK', 'RÜCKWÄRTS': 'BACK', 'RUECKWAERTS': 'BACK',
  'AT': 'BACK', 'ATRAS': 'BACK',
  'IN': 'BACK', 'INDIETRO': 'BACK',
  'WS': 'BACK', 'WSTECZ': 'BACK', 'WST': 'BACK',
  
  // Right
  'RT': 'RIGHT', 'RIGHT': 'RIGHT',
  'TD': 'RIGHT', 'TOURNE_DROITE': 'RIGHT', 'TOURNEDROITE': 'RIGHT',
  'RECHTS': 'RIGHT', // RE handled conditionally
  'GD': 'RIGHT', 'GIRA_DERECHA': 'RIGHT', 'GIRADERECHA': 'RIGHT',
  'DE': 'RIGHT', 'DESTRA': 'RIGHT',
  'PW': 'RIGHT', 'PRAWO': 'RIGHT',
  
  // Left
  'LT': 'LEFT', 'LEFT': 'LEFT',
  'TG': 'LEFT', 'TOURNE_GAUCHE': 'LEFT', 'TOURNEGAUCHE': 'LEFT',
  'LI': 'LEFT', 'LINKS': 'LEFT',
  'GI': 'LEFT', 'GIRA_IZQUIERDA': 'LEFT', 'GIRAIZQUIERDA': 'LEFT',
  'SI': 'LEFT', 'SINISTRA': 'LEFT',
  'LW': 'LEFT', 'LEWO': 'LEFT',
  
  // Pen Up
  'PU': 'PENUP', 'PENUP': 'PENUP',
  'LC': 'PENUP', 'LEVE_CRAYON': 'PENUP', 'LEVECRAYON': 'PENUP',
  'AH': 'PENUP', 'AUFHEBEN': 'PENUP', 'STIFTUP': 'PENUP',
  'SL': 'PENUP', 'SUBE_LAPIZ': 'PENUP', 'SUBELAPIZ': 'PENUP',
  'SU': 'PENUP', 'SU_PENNA': 'PENUP', 'SUPENNA': 'PENUP',
  'PP': 'PENUP', 'PODNIEŚ_PISAK': 'PENUP', 'PODNIESPISAK': 'PENUP',
  
  // Pen Down
  'PD': 'PENDOWN', 'PENDOWN': 'PENDOWN',
  'BC': 'PENDOWN', 'BAISSE_CRAYON': 'PENDOWN', 'BAISSECRAYON': 'PENDOWN',
  'AB': 'PENDOWN', 'ABSETZEN': 'PENDOWN', 'STIFTDOWN': 'PENDOWN',
  'BL': 'PENDOWN', 'BAJA_LAPIZ': 'PENDOWN', 'BAJALAPIZ': 'PENDOWN',
  'GIU': 'PENDOWN', 'GIU_PENNA': 'PENDOWN', 'GIUPENNA': 'PENDOWN',
  'OP': 'PENDOWN', 'OPUŚĆ_PISAK': 'PENDOWN', 'OPUSCPISAK': 'PENDOWN',
  
  // Clear Screen
  'CS': 'CLEARSCREEN', 'CLEARSCREEN': 'CLEARSCREEN', 'CLEAN': 'CLEARSCREEN',
  'VE': 'CLEARSCREEN', 'VIDE_ECRAN': 'CLEARSCREEN', 'VIDEECRAN': 'CLEARSCREEN',
  'BS': 'CLEARSCREEN', 'BILDLÖSCHEN': 'CLEARSCREEN', 'BILDLOESCHEN': 'CLEARSCREEN',
  'BP': 'CLEARSCREEN', 'BORRA_PANTALLA': 'CLEARSCREEN', 'BORRAPANTALLA': 'CLEARSCREEN',
  'PS': 'CLEARSCREEN', 'PULISCI_SCHERMO': 'CLEARSCREEN', 'PULISCISCHERMO': 'CLEARSCREEN',
  'CZS': 'CLEARSCREEN', 'CZYŚĆ_EKRAN': 'CLEARSCREEN', 'CZYSC': 'CLEARSCREEN',
  
  // Clear Text
  'CT': 'CLEARTEXT', 'CLEARTEXT': 'CLEARTEXT',
  
  // Hide Turtle
  'HT': 'HIDETURTLE', 'HIDETURTLE': 'HIDETURTLE',
  'CE': 'HIDETURTLE', 'CACHE_TORTUE': 'HIDETURTLE', 'CACHETORTUE': 'HIDETURTLE',
  'UT': 'HIDETURTLE', 'UNSICHTBAR': 'HIDETURTLE',
  'OC': 'HIDETURTLE', 'OCULTATORTUGA': 'HIDETURTLE', 'OCULTA_TORTUGA': 'HIDETURTLE',
  'NT': 'HIDETURTLE', 'NASCONDI_TORTUGA': 'HIDETURTLE', 'NASCONDITORTUGA': 'HIDETURTLE',
  'SZY': 'HIDETURTLE', 'SCHOWAJ_TORTUGĘ': 'HIDETURTLE', 'SCHOWAJ': 'HIDETURTLE',
  
  // Show Turtle
  'ST': 'SHOWTURTLE', 'SHOWTURTLE': 'SHOWTURTLE',
  'MT': 'SHOWTURTLE', 'MONTRE_TORTUE': 'SHOWTURTLE', 'MONTRETORTUE': 'SHOWTURTLE',
  'ZT': 'SHOWTURTLE', 'ZEIGETORTUE': 'SHOWTURTLE', 'ZEIGE_TORTUE': 'SHOWTURTLE',
  'MUESTRATORTUGA': 'SHOWTURTLE', 'MUESTRA_TORTUGA': 'SHOWTURTLE',
  'MOSTRA_TORTUGA': 'SHOWTURTLE', 'MOSTRATORTUGA': 'SHOWTURTLE',
  'POK': 'SHOWTURTLE', 'POKAŻ_TORTUGĘ': 'SHOWTURTLE', 'POKAZ': 'SHOWTURTLE',
  
  // Pen Color
  'SETPC': 'SETPENCOLOR', 'SETPENCOLOR': 'SETPENCOLOR',
  'COULEUR_CRAYON': 'SETPENCOLOR', 'COULEURCRAYON': 'SETPENCOLOR',
  'STIFTFARBE': 'SETPENCOLOR',
  'COLOR_LAPIZ': 'SETPENCOLOR', 'COLORLAPIZ': 'SETPENCOLOR',
  'COLORE_PENNA': 'SETPENCOLOR', 'COLOREPENNA': 'SETPENCOLOR',
  'USTAW_KOLOR': 'SETPENCOLOR', 'KOLORPISAKA': 'SETPENCOLOR',
  
  // Pen Size
  'SETPS': 'SETPENSIZE', 'SETPENSIZE': 'SETPENSIZE',
  'TAILLE_CRAYON': 'SETPENSIZE', 'TAILLECRAYON': 'SETPENSIZE',
  'STIFTDICKE': 'SETPENSIZE',
  'TAMANO_LAPIZ': 'SETPENSIZE', 'TAÑOLAPIZ': 'SETPENSIZE',
  'SPESSORE_PENNA': 'SETPENSIZE', 'SPESSOREPENNA': 'SETPENSIZE',
  'USTAW_GRUBOŚĆ': 'SETPENSIZE', 'GRUBOSCPISAKA': 'SETPENSIZE',
  
  // Background Color
  'SETBG': 'SETBACKGROUND', 'SETBACKGROUND': 'SETBACKGROUND',
  'COULEUR_FOND': 'SETBACKGROUND', 'COULEURFOND': 'SETBACKGROUND',
  'HINTERGRUNDFARBE': 'SETBACKGROUND',
  'COLOR_FONDO': 'SETBACKGROUND', 'COLORFONDO': 'SETBACKGROUND',
  'COLORE_SFONDO': 'SETBACKGROUND', 'COLORESFONDO': 'SETBACKGROUND',
  'USTAW_TŁO': 'SETBACKGROUND', 'KOLORTLA': 'SETBACKGROUND',
  
  // Home
  'HOME': 'HOME',
  'MAISON': 'HOME',
  'HEIM': 'HOME',
  'INICIO': 'HOME',
  'CASA': 'HOME',
  'DOM': 'HOME'
};

function resolveCommand(token, lang = 'en') {
  const t = token.toUpperCase();
  
  // Resolve collision for 'RE'
  if (t === 'RE') {
    if (lang === 'fr') return 'BACK';       // Recule
    if (lang === 'de') return 'RIGHT';      // Rechts
    return 'BACK'; // Default fallback
  }
  
  return COMMAND_ALIASES[t] || null;
}

// Tokenize standard Logo code, handling comments and splitting brackets
export function tokenize(code) {
  // Remove comments (starting with semicolon ; to end of line)
  const cleanCode = code.replace(/;.*$/gm, '');
  
  // Insert spacing around square brackets so they split perfectly
  const spacedCode = cleanCode
    .replace(/\[/g, ' [ ')
    .replace(/\]/g, ' ] ');
    
  // Split by any whitespace
  return spacedCode.trim().split(/\s+/).filter(t => t.length > 0);
}

// Recursively unrolls REPEAT loops
export function unrollTokens(tokens) {
  const result = [];
  let i = 0;
  
  while (i < tokens.length) {
    const token = tokens[i].toUpperCase();
    
    // Check if token is a repeat keyword
    const isRepeat = ['REPEAT', 'REPETE', 'WIEDERHOLE', 'REPETIR', 'RIPETI', 'POWTÓRZ', 'POWTORZ'].includes(token);
    
    if (isRepeat) {
      if (i + 1 >= tokens.length) {
        throw new Error('REPEAT statement is missing a repetition count!');
      }
      
      const countToken = tokens[i + 1];
      const count = parseInt(countToken, 10);
      if (isNaN(count) || count < 0) {
        throw new Error(`Invalid REPEAT count: "${countToken}"`);
      }
      
      if (i + 2 >= tokens.length || tokens[i + 2] !== '[') {
        throw new Error(`Expected opening bracket "[" after REPEAT count, found "${tokens[i + 2] || 'EOF'}"`);
      }
      
      // Find matching bracket
      let bracketCount = 1;
      let j = i + 3;
      const bodyTokens = [];
      
      while (j < tokens.length && bracketCount > 0) {
        if (tokens[j] === '[') bracketCount++;
        else if (tokens[j] === ']') bracketCount--;
        
        if (bracketCount > 0) {
          bodyTokens.push(tokens[j]);
        }
        j++;
      }
      
      if (bracketCount > 0) {
        throw new Error('Unterminated bracket: missing matching "]" for REPEAT loop!');
      }
      
      // Recursively unroll the body of this loop
      const unrolledBody = unrollTokens(bodyTokens);
      
      // Duplicate body in place
      for (let c = 0; c < count; c++) {
        result.push(...unrolledBody);
      }
      
      // Move index past the closing bracket
      i = j;
    } else {
      result.push(tokens[i]);
      i++;
    }
  }
  return result;
}

// Compiles a list of flat tokens into atomic drawing steps.
// Keeps track of virtual turtle state as it compiles.
export function compile(tokens, startState, lang = 'en') {
  const steps = [];
  let i = 0;
  
  // Clone starting state to track virtual position during compilation
  let currentX = startState.x;
  let currentY = startState.y;
  let currentAngle = startState.angle;
  let currentPen = startState.pen;
  let currentVisible = startState.visible;
  let currentPenColor = startState.penColor;
  let currentPenSize = startState.penSize;
  let currentBgColor = startState.bgColor;

  while (i < tokens.length) {
    const rawToken = tokens[i];
    const cmd = resolveCommand(rawToken, lang);
    
    if (!cmd) {
      throw new Error(`Unknown command or keyword: "${rawToken}"`);
    }
    
    i++; // Move to next token (potential arguments)
    
    switch (cmd) {
      case 'FORWARD':
      case 'BACK': {
        if (i >= tokens.length) throw new Error(`Command "${rawToken}" expects a distance argument.`);
        const valStr = tokens[i++];
        const distance = parseFloat(valStr);
        if (isNaN(distance)) throw new Error(`Invalid distance: "${valStr}" for command "${rawToken}"`);
        
        const sign = cmd === 'FORWARD' ? 1 : -1;
        const rad = ((90 - currentAngle) * Math.PI) / 180;
        const dx = distance * Math.cos(rad) * sign;
        const dy = distance * Math.sin(rad) * sign;
        
        const oldX = currentX;
        const oldY = currentY;
        currentX += dx;
        currentY += dy;
        
        steps.push({
          type: 'MOVE',
          oldX,
          oldY,
          newX: currentX,
          newY: currentY,
          pen: currentPen,
          color: currentPenColor,
          size: currentPenSize,
          visible: currentVisible
        });
        break;
      }
      
      case 'RIGHT':
      case 'LEFT': {
        if (i >= tokens.length) throw new Error(`Command "${rawToken}" expects an angle argument.`);
        const valStr = tokens[i++];
        const deltaAngle = parseFloat(valStr);
        if (isNaN(deltaAngle)) throw new Error(`Invalid angle: "${valStr}" for command "${rawToken}"`);
        
        const sign = cmd === 'RIGHT' ? 1 : -1;
        const oldAngle = currentAngle;
        currentAngle = (currentAngle + deltaAngle * sign) % 360;
        if (currentAngle < 0) currentAngle += 360;
        
        steps.push({
          type: 'ROTATE',
          oldAngle,
          newAngle: currentAngle,
          x: currentX,
          y: currentY
        });
        break;
      }
      
      case 'PENUP':
        currentPen = false;
        steps.push({ type: 'PEN', pen: false });
        break;
        
      case 'PENDOWN':
        currentPen = true;
        steps.push({ type: 'PEN', pen: true });
        break;
        
      case 'CLEARSCREEN':
        currentX = 0;
        currentY = 0;
        currentAngle = 0;
        currentPen = true;
        steps.push({ type: 'CLEARSCREEN' });
        break;
        
      case 'CLEARTEXT':
        steps.push({ type: 'CLEARTEXT' });
        break;
        
      case 'HIDETURTLE':
        currentVisible = false;
        steps.push({ type: 'VISIBLE', visible: false, x: currentX, y: currentY, angle: currentAngle });
        break;
        
      case 'SHOWTURTLE':
        currentVisible = true;
        steps.push({ type: 'VISIBLE', visible: true, x: currentX, y: currentY, angle: currentAngle });
        break;
        
      case 'SETPENCOLOR': {
        if (i >= tokens.length) throw new Error(`Command "${rawToken}" expects a color argument.`);
        const color = tokens[i++];
        currentPenColor = color;
        steps.push({ type: 'PENCOLOR', color });
        break;
      }
      
      case 'SETPENSIZE': {
        if (i >= tokens.length) throw new Error(`Command "${rawToken}" expects a thickness argument.`);
        const sizeStr = tokens[i++];
        const size = parseFloat(sizeStr);
        if (isNaN(size) || size <= 0) throw new Error(`Invalid line width: "${sizeStr}" for command "${rawToken}"`);
        currentPenSize = size;
        steps.push({ type: 'PENSIZE', size });
        break;
      }
      
      case 'SETBACKGROUND': {
        if (i >= tokens.length) throw new Error(`Command "${rawToken}" expects a color argument.`);
        const color = tokens[i++];
        currentBgColor = color;
        steps.push({ type: 'BGCOLOR', color });
        break;
      }
      
      case 'HOME': {
        const oldX = currentX;
        const oldY = currentY;
        const oldAngle = currentAngle;
        currentX = 0;
        currentY = 0;
        currentAngle = 0;
        
        if (oldX !== 0 || oldY !== 0) {
          steps.push({
            type: 'MOVE',
            oldX,
            oldY,
            newX: 0,
            newY: 0,
            pen: currentPen,
            color: currentPenColor,
            size: currentPenSize,
            visible: currentVisible
          });
        }
        if (oldAngle !== 0) {
          steps.push({
            type: 'ROTATE',
            oldAngle,
            newAngle: 0,
            x: 0,
            y: 0
          });
        }
        break;
      }
      
      default:
        throw new Error(`Unhandleable compiled command: "${cmd}"`);
    }
  }
  
  return steps;
}
