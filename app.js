// Main Application Controller for WEB-LOGO
import { tokenize, unrollTokens, compile } from './interpreter.js';

/* -------------------------------------------------------------
   1. DICTIONARIES: TURTLE SVGS & TRANSLATIONS
------------------------------------------------------------- */
const TURTLE_SVGS = {
  classic: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 15 C55 15, 57 22, 53 25 C68 28, 78 40, 72 65 C68 78, 62 82, 50 82 C38 82, 32 78, 28 65 C22 40, 32 28, 47 25 C43 22, 45 15, 50 15 Z" fill="#10b981" stroke="#047857" stroke-width="4"/>
    <ellipse cx="50" cy="52" rx="20" ry="24" fill="#059669" stroke="#047857" stroke-width="3"/>
    <!-- Leg Top-Left -->
    <path d="M30 40 C20 30, 15 35, 25 45" stroke="#10b981" stroke-width="6" stroke-linecap="round"/>
    <!-- Leg Top-Right -->
    <path d="M70 40 C80 30, 85 35, 75 45" stroke="#10b981" stroke-width="6" stroke-linecap="round"/>
    <!-- Leg Bottom-Left -->
    <path d="M32 68 C22 78, 25 83, 35 75" stroke="#10b981" stroke-width="6" stroke-linecap="round"/>
    <!-- Leg Bottom-Right -->
    <path d="M68 68 C78 78, 75 83, 65 75" stroke="#10b981" stroke-width="6" stroke-linecap="round"/>
    <!-- Tail -->
    <path d="M50 76 L50 88" stroke="#10b981" stroke-width="5" stroke-linecap="round"/>
    <!-- Eyes -->
    <circle cx="47" cy="20" r="2" fill="#000000"/>
    <circle cx="53" cy="20" r="2" fill="#000000"/>
  </svg>`,
  
  rocket: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Thruster Flame -->
    <path d="M50 75 L42 92 L50 85 L58 92 Z" fill="#f97316" stroke="#ea580c" stroke-width="2"/>
    <path d="M50 75 L46 84 L50 81 L54 84 Z" fill="#facc15"/>
    <!-- Rocket Body -->
    <path d="M50 10 C50 10, 66 35, 66 65 C66 75, 60 78, 50 78 C40 78, 34 75, 34 65 C34 35, 50 10, 50 10 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="4"/>
    <!-- Fins -->
    <path d="M34 60 L18 78 L34 72 Z" fill="#38bdf8" stroke="#0284c7" stroke-width="3"/>
    <path d="M66 60 L82 78 L66 72 Z" fill="#38bdf8" stroke="#0284c7" stroke-width="3"/>
    <!-- Cabin Window -->
    <circle cx="50" cy="42" r="8" fill="#0f172a" stroke="#38bdf8" stroke-width="3"/>
    <circle cx="47" cy="39" r="3" fill="#ffffff" opacity="0.6"/>
  </svg>`,
  
  beetle: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Legs -->
    <path d="M25 40 L12 35 M22 50 L10 50 M25 60 L12 65" stroke="#475569" stroke-width="4" stroke-linecap="round"/>
    <path d="M75 40 L88 35 M78 50 L90 50 M75 60 L88 65" stroke="#475569" stroke-width="4" stroke-linecap="round"/>
    <!-- Antennae -->
    <path d="M43 20 C38 10, 32 12, 32 12" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
    <path d="M57 20 C62 10, 68 12, 68 12" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
    <!-- Head -->
    <circle cx="50" cy="24" r="10" fill="#1e293b"/>
    <!-- Body -->
    <circle cx="50" cy="54" r="26" fill="#ef4444" stroke="#b91c1c" stroke-width="4"/>
    <!-- Shell Split -->
    <line x1="50" y1="28" x2="50" y2="80" stroke="#1e293b" stroke-width="4"/>
    <!-- Dots -->
    <circle cx="38" cy="44" r="4" fill="#1e293b"/>
    <circle cx="62" cy="44" r="4" fill="#1e293b"/>
    <circle cx="36" cy="62" r="5" fill="#1e293b"/>
    <circle cx="64" cy="62" r="5" fill="#1e293b"/>
    <circle cx="50" cy="68" r="4" fill="#1e293b"/>
  </svg>`,
  
  arrow: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 8 L92 84 L50 64 L8 84 Z" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" stroke-width="6" stroke-linejoin="round"/>
    <path d="M50 20 L78 72 L50 58 L22 72 Z" fill="#38bdf8" opacity="0.8"/>
    <!-- Engine Core Glow -->
    <circle cx="50" cy="50" r="6" fill="#ffffff" filter="drop-shadow(0 0 8px #38bdf8)"/>
  </svg>`,
  
  wand: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Star Sparkles -->
    <path d="M30 15 L32 24 L40 26 L32 28 L30 37 L28 28 L20 26 L28 24 Z" fill="#facc15" filter="drop-shadow(0 0 6px #facc15)"/>
    <path d="M72 12 L73 17 L78 18 L73 19 L72 24 L71 19 L66 18 L71 17 Z" fill="#c084fc"/>
    <!-- Wand Stick -->
    <path d="M15 85 L70 30" stroke="#78350f" stroke-width="8" stroke-linecap="round"/>
    <!-- Magic Gem Top -->
    <path d="M70 30 L78 18 L90 30 L78 42 Z" fill="#c084fc" stroke="#a855f7" stroke-width="4"/>
    <circle cx="79" cy="30" r="4" fill="#ffffff"/>
  </svg>`
};

const TRANSLATIONS = {
  en: {
    filesHeader: 'SAVED FILES',
    presetsHeader: 'PRESETS',
    lblSettings: 'Settings & Info',
    lblUserRole: 'Local Developer',
    lblCheatsheetTitle: 'AC-LOGO MANUAL',
    lblSpeed: 'Speed: Normal',
    lblSettingsTitle: 'Settings & Info',
    btnRunText: 'RUN',
    fileStatusDraft: 'Draft: unsaved_drawing.logo',
    msgUnknownCmd: 'I do not know how to',
    msgWelcome: 'Welcome to WEB-LOGO. Type a command or run a preset.',
    msgClear: 'Canvas cleared and turtle coordinates reset.',
    msgHistoryClean: 'CLI output history cleaned.',
    msgSuccessRun: 'Script executed successfully.',
    msgRunning: 'Drawing vector layers...',
    msgSaved: 'Saved file successfully to Local Storage.',
    msgDeleteConfirm: 'Are you sure you want to delete this file?',
    msgInvalidSaveName: 'Please specify a valid name ending in .logo',
    lblLang: 'Language Interface',
    lblTurtle: 'Turtle Character avatar',
    lblTheme: 'UI Color Palette Theme',
    lblProfile: 'User Profile Details',
    lblBadge: 'Local Developer',
    manualHtml: `
      <div class="cheatsheet-section">
        <div class="cheatsheet-section-title">Movements</div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">FD / FORWARD &lt;dist&gt;</div>
          <div class="cheatsheet-cmd-desc">Moves the turtle forward by the specified distance pixels.</div>
          <div class="cheatsheet-cmd-example">FD 100</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">BK / BACK &lt;dist&gt;</div>
          <div class="cheatsheet-cmd-desc">Moves the turtle backward.</div>
          <div class="cheatsheet-cmd-example">BK 50</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">RT / RIGHT &lt;deg&gt;</div>
          <div class="cheatsheet-cmd-desc">Rotates the turtle clockwise by degrees.</div>
          <div class="cheatsheet-cmd-example">RT 90</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">LT / LEFT &lt;deg&gt;</div>
          <div class="cheatsheet-cmd-desc">Rotates the turtle counter-clockwise.</div>
          <div class="cheatsheet-cmd-example">LT 45</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">HOME</div>
          <div class="cheatsheet-cmd-desc">Returns turtle to center (0,0) pointing straight UP.</div>
          <div class="cheatsheet-cmd-example">HOME</div>
        </div>
      </div>
      
      <div class="cheatsheet-section">
        <div class="cheatsheet-section-title">Pen & Canvas</div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">PU / PENUP</div>
          <div class="cheatsheet-cmd-desc">Lifts the pen up so movements don't draw lines.</div>
          <div class="cheatsheet-cmd-example">PU</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">PD / PENDOWN</div>
          <div class="cheatsheet-cmd-desc">Lowers the pen to start drawing paths.</div>
          <div class="cheatsheet-cmd-example">PD</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">SETPC &lt;color&gt;</div>
          <div class="cheatsheet-cmd-desc">Sets pen line color (name, hex or rgb).</div>
          <div class="cheatsheet-cmd-example">SETPC #f43f5e</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">SETPS &lt;thickness&gt;</div>
          <div class="cheatsheet-cmd-desc">Sets pen line thickness.</div>
          <div class="cheatsheet-cmd-example">SETPS 5</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">SETBG &lt;color&gt;</div>
          <div class="cheatsheet-cmd-desc">Sets canvas background fill.</div>
          <div class="cheatsheet-cmd-example">SETBG #020617</div>
        </div>
      </div>
      
      <div class="cheatsheet-section">
        <div class="cheatsheet-section-title">Loops & Logic</div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">REPEAT &lt;n&gt; [ &lt;cmds&gt; ]</div>
          <div class="cheatsheet-cmd-desc">Runs nested instruction block multiple times.</div>
          <div class="cheatsheet-cmd-example">REPEAT 4 [ FD 50 RT 90 ]</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">CS / CLEARSCREEN</div>
          <div class="cheatsheet-cmd-desc">Clears drawing and resets coordinates.</div>
          <div class="cheatsheet-cmd-example">CS</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">CT / CLEARTEXT</div>
          <div class="cheatsheet-cmd-desc">Clears the interactive CLI feedback history.</div>
          <div class="cheatsheet-cmd-example">CT</div>
        </div>
      </div>
    `
  },
  fr: {
    filesHeader: 'FICHIERS ENREGISTRÉS',
    presetsHeader: 'PRÉRÉGLAGES',
    lblSettings: 'Paramètres',
    lblUserRole: 'Développeur Local',
    lblCheatsheetTitle: 'MANUEL AC-LOGO',
    lblSpeed: 'Vitesse: Normale',
    lblSettingsTitle: 'Paramètres & Info',
    btnRunText: 'LANCER',
    fileStatusDraft: 'Brouillon: dessin_sans_nom.logo',
    msgUnknownCmd: 'Je ne connais pas la commande',
    msgWelcome: 'Bienvenue sur WEB-LOGO. Saisissez une commande ou lancez un préréglage.',
    msgClear: 'Écran nettoyé et coordonnées de la tortue réinitialisées.',
    msgHistoryClean: 'Historique de la console nettoyé.',
    msgSuccessRun: 'Script exécuté avec succès.',
    msgRunning: 'Dessin des vecteurs...',
    msgSaved: 'Fichier enregistré avec succès dans le stockage local.',
    msgDeleteConfirm: 'Êtes-vous sûr de vouloir supprimer ce fichier ?',
    msgInvalidSaveName: 'Veuillez spécifier un nom se terminant par .logo',
    lblLang: 'Langue de l\'interface',
    lblTurtle: 'Avatar de la Tortue',
    lblTheme: 'Palette de Couleurs',
    lblProfile: 'Profil de l\'utilisateur',
    lblBadge: 'Développeur Local',
    manualHtml: `
      <div class="cheatsheet-section">
        <div class="cheatsheet-section-title">Mouvements</div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">AV / AVANCE &lt;dist&gt;</div>
          <div class="cheatsheet-cmd-desc">Avance la tortue de la distance spécifiée en pixels.</div>
          <div class="cheatsheet-cmd-example">AV 100</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">RE / RECULE &lt;dist&gt;</div>
          <div class="cheatsheet-cmd-desc">Recule la tortue.</div>
          <div class="cheatsheet-cmd-example">RE 50</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">TD / TOURNE_DROITE &lt;deg&gt;</div>
          <div class="cheatsheet-cmd-desc">Tourne la tortue dans le sens horaire.</div>
          <div class="cheatsheet-cmd-example">TD 90</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">TG / TOURNE_GAUCHE &lt;deg&gt;</div>
          <div class="cheatsheet-cmd-desc">Tourne dans le sens anti-horaire.</div>
          <div class="cheatsheet-cmd-example">TG 45</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">HOME / MAISON</div>
          <div class="cheatsheet-cmd-desc">Ramène la tortue au centre, orientée vers le HAUT.</div>
          <div class="cheatsheet-cmd-example">MAISON</div>
        </div>
      </div>
      
      <div class="cheatsheet-section">
        <div class="cheatsheet-section-title">Crayon & Fond</div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">LC / LEVE_CRAYON</div>
          <div class="cheatsheet-cmd-desc">Lève le crayon pour déplacer la tortue sans dessiner.</div>
          <div class="cheatsheet-cmd-example">LC</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">BC / BAISSE_CRAYON</div>
          <div class="cheatsheet-cmd-desc">Baisse le crayon pour recommencer à tracer.</div>
          <div class="cheatsheet-cmd-example">BC</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">SETPC &lt;couleur&gt;</div>
          <div class="cheatsheet-cmd-desc">Change la couleur du tracé (nom ou hexadécimal).</div>
          <div class="cheatsheet-cmd-example">SETPC #f43f5e</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">SETPS &lt;épaisseur&gt;</div>
          <div class="cheatsheet-cmd-desc">Définit l'épaisseur de la ligne en pixels.</div>
          <div class="cheatsheet-cmd-example">SETPS 5</div>
        </div>
      </div>
      
      <div class="cheatsheet-section">
        <div class="cheatsheet-section-title">Boucles</div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">REPETE &lt;n&gt; [ &lt;cmds&gt; ]</div>
          <div class="cheatsheet-cmd-desc">Répète les commandes n fois.</div>
          <div class="cheatsheet-cmd-example">REPETE 4 [ AV 80 TD 90 ]</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">VE / VIDE_ECRAN</div>
          <div class="cheatsheet-cmd-desc">Efface l'écran et réinitialise la tortue.</div>
          <div class="cheatsheet-cmd-example">VE</div>
        </div>
      </div>
    `
  },
  de: {
    filesHeader: 'DATEIEN',
    presetsHeader: 'VORLAGEN',
    lblSettings: 'Einstellungen',
    lblUserRole: 'Lokaler Entwickler',
    lblCheatsheetTitle: 'AC-LOGO ANLEITUNG',
    lblSpeed: 'Geschwindigkeit: Normal',
    lblSettingsTitle: 'Einstellungen & Info',
    btnRunText: 'AUSFÜHREN',
    fileStatusDraft: 'Entwurf: unbenannt.logo',
    msgUnknownCmd: 'Ich kenne den Befehl nicht:',
    msgWelcome: 'Willkommen bei WEB-LOGO. Geben Sie einen Befehl ein oder starten Sie eine Vorlage.',
    msgClear: 'Bildschirm gelöscht und Schildkröte zurückgesetzt.',
    msgHistoryClean: 'Verlauf gelöscht.',
    msgSuccessRun: 'Skript erfolgreich ausgeführt.',
    msgRunning: 'Vektorbau läuft...',
    msgSaved: 'Datei erfolgreich lokal gespeichert.',
    msgDeleteConfirm: 'Möchten Sie diese Datei wirklich löschen?',
    msgInvalidSaveName: 'Bitte geben Sie einen Namen ein, der auf .logo endet.',
    lblLang: 'Sprache',
    lblTurtle: 'Schildkröten-Form',
    lblTheme: 'Farbthema',
    lblProfile: 'Profil',
    lblBadge: 'Entwickler',
    manualHtml: `
      <div class="cheatsheet-section">
        <div class="cheatsheet-section-title">Bewegung</div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">VW / VORWÄRTS &lt;dist&gt;</div>
          <div class="cheatsheet-cmd-desc">Schildkröte um distance Pixel vorwärts bewegen.</div>
          <div class="cheatsheet-cmd-example">VW 100</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">RW / RÜCKWÄRTS &lt;dist&gt;</div>
          <div class="cheatsheet-cmd-desc">Schildkröte rückwärts bewegen.</div>
          <div class="cheatsheet-cmd-example">RW 50</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">RE / RECHTS &lt;grad&gt;</div>
          <div class="cheatsheet-cmd-desc">Im Uhrzeigersinn drehen.</div>
          <div class="cheatsheet-cmd-example">RE 90</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">LI / LINKS &lt;grad&gt;</div>
          <div class="cheatsheet-cmd-desc">Gegen den Uhrzeigersinn drehen.</div>
          <div class="cheatsheet-cmd-example">LI 45</div>
        </div>
      </div>
      
      <div class="cheatsheet-section">
        <div class="cheatsheet-section-title">Stift & Bildschirm</div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">AH / AUFHEBEN</div>
          <div class="cheatsheet-cmd-desc">Hebt den Stift an (kein Zeichnen mehr).</div>
          <div class="cheatsheet-cmd-example">AH</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">AB / ABSETZEN</div>
          <div class="cheatsheet-cmd-desc">Senkt den Stift ab, um zu zeichnen.</div>
          <div class="cheatsheet-cmd-example">AB</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">WIEDERHOLE &lt;n&gt; [ &lt;befehle&gt; ]</div>
          <div class="cheatsheet-cmd-desc">Wiederholt die Befehle n-mal.</div>
          <div class="cheatsheet-cmd-example">WIEDERHOLE 4 [ VW 80 RE 90 ]</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">BS / BILDLÖSCHEN</div>
          <div class="cheatsheet-cmd-desc">Löscht das Bild und setzt Koordinaten zurück.</div>
          <div class="cheatsheet-cmd-example">BS</div>
        </div>
      </div>
    `
  },
  es: {
    filesHeader: 'ARCHIVOS',
    presetsHeader: 'PREAJUSTES',
    lblSettings: 'Ajustes',
    lblUserRole: 'Desarrollador Local',
    lblCheatsheetTitle: 'MANUAL AC-LOGO',
    lblSpeed: 'Velocidad: Normal',
    lblSettingsTitle: 'Configuración & Info',
    btnRunText: 'EJECUTAR',
    fileStatusDraft: 'Borrador: dibujo_sin_nombre.logo',
    msgUnknownCmd: 'No conozco el comando:',
    msgWelcome: 'Bienvenido a WEB-LOGO. Escribe un comando o ejecuta un preajuste.',
    msgClear: 'Lienzo borrado y coordenadas de tortuga restauradas.',
    msgHistoryClean: 'Historial CLI borrado.',
    msgSuccessRun: 'Script ejecutado con éxito.',
    msgRunning: 'Dibujando vectores...',
    msgSaved: 'Archivo guardado en almacenamiento local.',
    msgDeleteConfirm: '¿Está seguro de borrar este archivo?',
    msgInvalidSaveName: 'Especifique un nombre que termine en .logo',
    lblLang: 'Idioma',
    lblTurtle: 'Avatar de Tortuga',
    lblTheme: 'Tema del Color',
    lblProfile: 'Perfil de Usuario',
    lblBadge: 'Programador',
    manualHtml: `
      <div class="cheatsheet-section">
        <div class="cheatsheet-section-title">Movimientos</div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">AD / ADELANTE &lt;dist&gt;</div>
          <div class="cheatsheet-cmd-desc">Mueve la tortuga hacia adelante.</div>
          <div class="cheatsheet-cmd-example">AD 100</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">AT / ATRAS &lt;dist&gt;</div>
          <div class="cheatsheet-cmd-desc">Mueve la tortuga hacia atrás.</div>
          <div class="cheatsheet-cmd-example">AT 50</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">GD / GIRA_DERECHA &lt;deg&gt;</div>
          <div class="cheatsheet-cmd-desc">Gira en sentido horario.</div>
          <div class="cheatsheet-cmd-example">GD 90</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">GI / GIRA_IZQUIERDA &lt;deg&gt;</div>
          <div class="cheatsheet-cmd-desc">Gira en sentido anti-horario.</div>
          <div class="cheatsheet-cmd-example">GI 45</div>
        </div>
      </div>
      
      <div class="cheatsheet-section">
        <div class="cheatsheet-section-title">Pincel & Bucles</div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">SL / SUBE_LAPIZ</div>
          <div class="cheatsheet-cmd-desc">Levanta el lápiz para mover la tortuga sin dibujar.</div>
          <div class="cheatsheet-cmd-example">SL</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">BL / BAJA_LAPIZ</div>
          <div class="cheatsheet-cmd-desc">Baja el lápiz para dibujar líneas.</div>
          <div class="cheatsheet-cmd-example">BL</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">REPETIR &lt;n&gt; [ &lt;cmds&gt; ]</div>
          <div class="cheatsheet-cmd-desc">Repite los comandos n veces.</div>
          <div class="cheatsheet-cmd-example">REPETIR 4 [ AD 80 GD 90 ]</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">BP / BORRA_PANTALLA</div>
          <div class="cheatsheet-cmd-desc">Borra la pantalla y centra la tortuga.</div>
          <div class="cheatsheet-cmd-example">BP</div>
        </div>
      </div>
    `
  },
  it: {
    filesHeader: 'ARCHIVI',
    presetsHeader: 'PRESET',
    lblSettings: 'Impostazioni',
    lblUserRole: 'Sviluppatore Locale',
    lblCheatsheetTitle: 'MANUALE AC-LOGO',
    lblSpeed: 'Velocità: Normale',
    lblSettingsTitle: 'Impostazioni & Info',
    btnRunText: 'ESEGUI',
    fileStatusDraft: 'Bozza: disegno_senza_nome.logo',
    msgUnknownCmd: 'Non conosco il comando:',
    msgWelcome: 'Benvenuto in WEB-LOGO. Digita un comando o esegui un preset.',
    msgClear: 'Schermo pulito e tartaruga riposizionata.',
    msgHistoryClean: 'Cronologia CLI pulita.',
    msgSuccessRun: 'Script eseguito correttamente.',
    msgRunning: 'Creazione vettori...',
    msgSaved: 'Disegno salvato correttamente nel browser.',
    msgDeleteConfirm: 'Sei sicuro di voler eliminare questo file?',
    msgInvalidSaveName: 'Specificare un nome valido che termina in .logo',
    lblLang: 'Lingua',
    lblTurtle: 'Avatar Tartaruga',
    lblTheme: 'Tema Grafico',
    lblProfile: 'Profilo Utente',
    lblBadge: 'Developer',
    manualHtml: `
      <div class="cheatsheet-section">
        <div class="cheatsheet-section-title">Movimenti</div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">AV / AVANTI &lt;dist&gt;</div>
          <div class="cheatsheet-cmd-desc">Muove la tartaruga in avanti.</div>
          <div class="cheatsheet-cmd-example">AV 100</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">IN / INDIETRO &lt;dist&gt;</div>
          <div class="cheatsheet-cmd-desc">Muove la tartaruga indietro.</div>
          <div class="cheatsheet-cmd-example">IN 50</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">DE / DESTRA &lt;deg&gt;</div>
          <div class="cheatsheet-cmd-desc">Ruota in senso orario.</div>
          <div class="cheatsheet-cmd-example">DE 90</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">SI / SINISTRA &lt;deg&gt;</div>
          <div class="cheatsheet-cmd-desc">Ruota in senso antiorario.</div>
          <div class="cheatsheet-cmd-example">SI 45</div>
        </div>
      </div>
      
      <div class="cheatsheet-section">
        <div class="cheatsheet-section-title">Penna & Ripetizioni</div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">SU / SU_PENNA</div>
          <div class="cheatsheet-cmd-desc">Solleva la penna dal foglio virtuale.</div>
          <div class="cheatsheet-cmd-example">SU</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">GIU / GIU_PENNA</div>
          <div class="cheatsheet-cmd-desc">Abbassa la penna per tracciare linee.</div>
          <div class="cheatsheet-cmd-example">GIU</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">RIPETI &lt;n&gt; [ &lt;cmds&gt; ]</div>
          <div class="cheatsheet-cmd-desc">Ripete le istruzioni n volte.</div>
          <div class="cheatsheet-cmd-example">RIPETI 4 [ AV 80 DE 90 ]</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">PS / PULISCI_SCHERMO</div>
          <div class="cheatsheet-cmd-desc">Pulisce lo schermo e riposiziona la tartaruga.</div>
          <div class="cheatsheet-cmd-example">PS</div>
        </div>
      </div>
    `
  },
  pl: {
    filesHeader: 'ZAPISANE PLIKI',
    presetsHeader: 'SZABLONY',
    lblSettings: 'Ustawienia',
    lblUserRole: 'Programista',
    lblCheatsheetTitle: 'PODRĘCZNIK AC-LOGO',
    lblSpeed: 'Prędkość: Normalna',
    lblSettingsTitle: 'Ustawienia & Info',
    btnRunText: 'URUCHOM',
    fileStatusDraft: 'Szkic: bez_nazwy.logo',
    msgUnknownCmd: 'Nie znam polecenia:',
    msgWelcome: 'Witaj w WEB-LOGO. Wpisz polecenie lub uruchom szablon.',
    msgClear: 'Ekran wyczyszczony, współrzędne zresetowane.',
    msgHistoryClean: 'Wyczyszczono historię konsoli.',
    msgSuccessRun: 'Skrypt został wykonany pomyślnie.',
    msgRunning: 'Rysowanie warstw wektorowych...',
    msgSaved: 'Plik zapisany pomyślnie w pamięci przeglądarki.',
    msgDeleteConfirm: 'Czy na pewno chcesz usunąć ten plik?',
    msgInvalidSaveName: 'Wprowadź prawidłową nazwę kończącą się na .logo',
    lblLang: 'Język interfejsu',
    lblTurtle: 'Wygląd Pisaka/Żółwia',
    lblTheme: 'Motyw kolorystyczny',
    lblProfile: 'Profil użytkownika',
    lblBadge: 'Developer',
    manualHtml: `
      <div class="cheatsheet-section">
        <div class="cheatsheet-section-title">Mouvements</div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">NP / NAPRZÓD &lt;dist&gt;</div>
          <div class="cheatsheet-cmd-desc">Przesuwa pisak do przodu o daną liczbę pikseli.</div>
          <div class="cheatsheet-cmd-example">NP 100</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">WS / WSTECZ &lt;dist&gt;</div>
          <div class="cheatsheet-cmd-desc">Przesuwa pisak w tył.</div>
          <div class="cheatsheet-cmd-example">WS 50</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">PW / PRAWO &lt;stopnie&gt;</div>
          <div class="cheatsheet-cmd-desc">Obraca żółwia w prawo (zgodnie z ruchem wskazówek).</div>
          <div class="cheatsheet-cmd-example">PW 90</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">LW / LEWO &lt;stopnie&gt;</div>
          <div class="cheatsheet-cmd-desc">Obraca żółwia w lewo.</div>
          <div class="cheatsheet-cmd-example">LW 45</div>
        </div>
      </div>
      
      <div class="cheatsheet-section">
        <div class="cheatsheet-section-title">Pisak & Ekran</div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">PP / PODNIEŚ_PISAK</div>
          <div class="cheatsheet-cmd-desc">Podnosi pisak. Ruchy nie zostawiają śladu.</div>
          <div class="cheatsheet-cmd-example">PP</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">OP / OPUŚĆ_PISAK</div>
          <div class="cheatsheet-cmd-desc">Opuszcza pisak na ekran virtualny.</div>
          <div class="cheatsheet-cmd-example">OP</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">POWTÓRZ &lt;n&gt; [ &lt;instrukcje&gt; ]</div>
          <div class="cheatsheet-cmd-desc">Powtarza instrukcje w nawiasach n-razy.</div>
          <div class="cheatsheet-cmd-example">POWTÓRZ 4 [ NP 80 PW 90 ]</div>
        </div>
        <div class="cheatsheet-cmd-card">
          <div class="cheatsheet-cmd-name">CZS / CZYŚĆ_EKRAN</div>
          <div class="cheatsheet-cmd-desc">Czyści ekran rysowania i resetuje pozycję.</div>
          <div class="cheatsheet-cmd-example">CZS</div>
        </div>
      </div>
    `
  }
};

const PRESETS = {
  'mandala_squares.logo': `; Colorful Geometric Mandala
CS SETPS 2 SETPC #38bdf8
REPEAT 36 [
  REPEAT 4 [
    FD 100
    RT 90
  ]
  RT 10
]`,
  'vibrant_spiral.logo': `; Growing square spiral
CS SETPS 1 SETPC #38bdf8
REPEAT 50 [
  FD 10 RT 90
  SETPC #c084fc
  FD 20 RT 90
  SETPC #38bdf8
  FD 30 RT 90
  SETPC #10b981
  FD 40 RT 90
  SETPC #facc15
  FD 50 RT 90
  SETPC #f43f5e
  FD 60 RT 90
  SETPC #38bdf8
  FD 70 RT 90
  SETPC #c084fc
  FD 80 RT 90
  SETPC #10b981
  FD 90 RT 90
  SETPC #facc15
  FD 100 RT 90
]`,
  'triangle_star.logo': `; Triquetra Star
CS SETPS 2 SETPC #c084fc
REPEAT 18 [
  REPEAT 3 [
    FD 120
    RT 120
  ]
  RT 20
]`,
  'koch_snowflake.logo': `; Recursive-like Sunburst Star
CS SETPS 1 SETPC #facc15
REPEAT 120 [
  FD 160
  BK 80
  RT 60
  FD 40
  BK 40
  LT 60
  BK 80
  RT 3
]`
};

/* -------------------------------------------------------------
   2. TURTLE STATE & CANVAS REDRAW ENGINE
------------------------------------------------------------- */
class TurtleGraphics {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    // Virtual coordinates: Cartesian (0,0) is center, Y points UP, heading 0 is UP
    this.reset();
  }
  
  reset() {
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.pen = true;
    this.visible = true;
    this.penColor = '#38bdf8';
    this.penSize = 2;
    this.bgColor = '#090d16';
    
    this.drawSegments = []; // holds relative lines {x1, y1, x2, y2, color, size}
  }
  
  // Maps Cartesian coords to physical canvas pixels
  getCanvasCoords(x, y) {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    return {
      x: centerX + x,
      y: centerY - y
    };
  }
  
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  redraw() {
    this.clear();
    // Re-draw background if customizable
    this.canvas.style.backgroundColor = this.bgColor;
    
    // Draw all segments stored in history
    this.drawSegments.forEach(seg => {
      const p1 = this.getCanvasCoords(seg.x1, seg.y1);
      const p2 = this.getCanvasCoords(seg.x2, seg.y2);
      
      this.ctx.beginPath();
      this.ctx.moveTo(p1.x, p1.y);
      this.ctx.lineTo(p2.x, p2.y);
      this.ctx.strokeStyle = seg.color;
      this.ctx.lineWidth = seg.size;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.stroke();
    });
  }
  
  // Draws a line dynamically and registers it in history relative to center
  drawLine(x1, y1, x2, y2, color, size) {
    const segment = { x1, y1, x2, y2, color, size };
    this.drawSegments.push(segment);
    
    const p1 = this.getCanvasCoords(x1, y1);
    const p2 = this.getCanvasCoords(x2, y2);
    
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = size;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.stroke();
  }
}

/* -------------------------------------------------------------
   3. APP SETUP & INTERACTIVE BINDINGS
------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // UI Panels
  const appContainer = document.getElementById('appContainer');
  const leftPanel = document.getElementById('leftPanel');
  const rightPanel = document.getElementById('rightPanel');
  const bottomPanel = document.getElementById('bottomPanel');
  const canvasContainer = document.getElementById('canvasContainer');
  const drawingCanvas = document.getElementById('drawingCanvas');
  const turtleSprite = document.getElementById('turtleSprite');
  const coordsDisplay = document.getElementById('coordsDisplay');
  
  // Toggles
  const toggleLeftPanel = document.getElementById('toggleLeftPanel');
  const toggleRightPanel = document.getElementById('toggleRightPanel');
  const toggleBottomPanel = document.getElementById('toggleBottomPanel');
  const closeRightPanel = document.getElementById('closeRightPanel');
  
  // Editor and Input Elements
  const tabCmd = document.getElementById('tabCmd');
  const tabFile = document.getElementById('tabFile');
  const tabContentCmd = document.getElementById('tabContentCmd');
  const tabContentFile = document.getElementById('tabContentFile');
  
  const cliInputField = document.getElementById('cliInputField');
  const cliLog = document.getElementById('cliLog');
  const fileEditorField = document.getElementById('fileEditorField');
  const editorLineNumbers = document.getElementById('editorLineNumbers');
  const speedSlider = document.getElementById('speedSlider');
  const fileStatusDisplay = document.getElementById('fileStatusDisplay');
  
  // Modals & triggers
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsDialog = document.getElementById('settingsDialog');
  const closeSettingsDialog = document.getElementById('closeSettingsDialog');
  const btnSettingsReset = document.getElementById('btnSettingsReset');
  const btnSettingsApply = document.getElementById('btnSettingsApply');
  const settingLang = document.getElementById('settingLang');
  const settingTurtleIcon = document.getElementById('settingTurtleIcon');
  const settingTheme = document.getElementById('settingTheme');
  const profileNameInput = document.getElementById('profileNameInput');
  const modalProfileAvatar = document.getElementById('modalProfileAvatar');
  const userAvatar = document.getElementById('userAvatar');
  
  const btnHelp = document.getElementById('btnHelp');
  const helpDialog = document.getElementById('helpDialog');
  const closeHelpDialog = document.getElementById('closeHelpDialog');
  const btnHelpClose = document.getElementById('btnHelpClose');
  
  const saveDialog = document.getElementById('saveDialog');
  const closeSaveDialog = document.getElementById('closeSaveDialog');
  const saveFileNameInput = document.getElementById('saveFileNameInput');
  const btnCancelSave = document.getElementById('btnCancelSave');
  const btnConfirmSave = document.getElementById('btnConfirmSave');
  
  // Actions
  const btnResetCanvas = document.getElementById('btnResetCanvas');
  const btnSaveFile = document.getElementById('btnSaveFile');
  const btnRunCode = document.getElementById('btnRunCode');
  
  // Lists
  const fileList = document.getElementById('fileList');
  const presetList = document.getElementById('presetList');
  
  // Dynamic labels for localization
  const idsToLocalize = [
    'filesHeader', 'presetsHeader', 'lblSettings', 'lblUserRole',
    'lblCheatsheetTitle', 'lblSpeed', 'btnRunText'
  ];

  /* -----------------------------------------------------------
     3.1 GLOBAL APP STATE
  ----------------------------------------------------------- */
  let appLanguage = 'en';
  let activeTurtleStyle = 'classic';
  let activeTheme = 'glass-dark';
  let userProfileName = 'Aero Coder';
  
  let currentFileName = null; // null represents temporary draft
  let cliHistory = [];
  let cliHistoryIdx = -1;
  
  let userFiles = {}; // files stored in localStorage: { "filename.logo": "content" }
  
  // Setup Turtle Canvas Engine
  const turtleEngine = new TurtleGraphics(drawingCanvas);
  
  // Timers for animation
  let activeAnimationTimer = null;
  let stepsQueue = [];
  let queuePointer = 0;
  
  /* -----------------------------------------------------------
     3.2 LOCAL STORAGE & FILES MANAGER
  ----------------------------------------------------------- */
  function loadAppPreferences() {
    appLanguage = localStorage.getItem('weblogo_lang') || 'en';
    activeTurtleStyle = localStorage.getItem('weblogo_turtle') || 'classic';
    activeTheme = localStorage.getItem('weblogo_theme') || 'glass-dark';
    userProfileName = localStorage.getItem('weblogo_profile') || 'Aero Coder';
    
    // Parse files
    const storedFiles = localStorage.getItem('weblogo_files');
    if (storedFiles) {
      try {
        userFiles = JSON.parse(storedFiles);
      } catch (e) {
        userFiles = {};
      }
    } else {
      userFiles = {};
    }
    
    // Set UI Control values
    settingLang.value = appLanguage;
    settingTurtleIcon.value = activeTurtleStyle;
    settingTheme.value = activeTheme;
    profileNameInput.value = userProfileName;
    
    applyPreferences(false);
  }
  
  function saveAppPreferences() {
    localStorage.setItem('weblogo_lang', appLanguage);
    localStorage.setItem('weblogo_turtle', activeTurtleStyle);
    localStorage.setItem('weblogo_theme', activeTheme);
    localStorage.setItem('weblogo_profile', userProfileName);
    localStorage.setItem('weblogo_files', JSON.stringify(userFiles));
  }
  
  function applyPreferences(doRedraw = true) {
    // 1. Theme
    document.documentElement.setAttribute('data-theme', activeTheme);
    
    // 2. Language Text Translation
    const dict = TRANSLATIONS[appLanguage];
    idsToLocalize.forEach(id => {
      const el = document.getElementById(id);
      if (el && dict[id]) {
        if (id === 'lblSpeed') {
          updateSpeedLabel();
        } else if (id === 'btnRunText') {
          el.textContent = dict[id];
        } else {
          el.textContent = dict[id];
        }
      }
    });
    
    // Translate Cheatsheet Accordion Manual
    const cheatsheet = document.getElementById('cheatsheetContent');
    if (cheatsheet && dict.manualHtml) {
      cheatsheet.innerHTML = dict.manualHtml;
    }
    
    // Translate Draft status
    if (!currentFileName) {
      fileStatusDisplay.textContent = dict.fileStatusDraft;
    }
    
    // 3. Turtle Icon Style
    turtleSprite.innerHTML = TURTLE_SVGS[activeTurtleStyle] || TURTLE_SVGS['classic'];
    
    // 4. Profiles
    const avatarHtml = `<svg class="avatar-icon" viewBox="0 0 24 24" width="24" height="24">
      <circle cx="12" cy="8" r="4" fill="currentColor"/>
      <path d="M12 14c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z" fill="currentColor"/>
    </svg>`;
    userAvatar.innerHTML = avatarHtml;
    modalProfileAvatar.innerHTML = avatarHtml;
    document.querySelector('.settings-text-group .settings-user').textContent = dict.lblUserRole;
    
    // Re-draw canvas details if colors/themes changed
    if (doRedraw) {
      // Re-apply background color depending on themes or instructions
      if (activeTheme === 'glass-dark') turtleEngine.bgColor = '#090d16';
      else if (activeTheme === 'glass-light') turtleEngine.bgColor = '#f8fafc';
      else if (activeTheme === 'neon-cyber') turtleEngine.bgColor = '#000000';
      else if (activeTheme === 'retro-green') turtleEngine.bgColor = '#020804';
      
      turtleEngine.redraw();
      updateTurtleDisplay();
    }
  }
  
  function populateFileList() {
    fileList.innerHTML = '';
    const keys = Object.keys(userFiles);
    
    if (keys.length === 0) {
      fileList.innerHTML = `<div class="log-line system-line" style="padding: 10px; font-size: 0.8rem; text-align: center;">No saved files yet.</div>`;
    } else {
      keys.sort().forEach(filename => {
        const item = document.createElement('div');
        item.className = `file-item ${currentFileName === filename ? 'active' : ''}`;
        item.setAttribute('role', 'tab');
        item.setAttribute('aria-selected', currentFileName === filename ? 'true' : 'false');
        
        item.innerHTML = `
          <div class="file-name-group">
            <span class="file-icon">📄</span>
            <span class="file-name" title="${filename}">${filename}</span>
          </div>
          <div class="file-actions">
            <button class="file-action-btn edit-btn" title="Rename file">✏️</button>
            <button class="file-action-btn delete-btn" title="Delete file">🗑️</button>
          </div>
        `;
        
        // Clicks
        item.addEventListener('click', (e) => {
          // Check if clicked actions
          if (e.target.classList.contains('delete-btn')) {
            e.stopPropagation();
            deleteFile(filename);
            return;
          }
          if (e.target.classList.contains('edit-btn')) {
            e.stopPropagation();
            renameFileDialog(filename);
            return;
          }
          
          loadFile(filename);
        });
        
        fileList.appendChild(item);
      });
    }
    
    // Preset List
    presetList.innerHTML = '';
    Object.keys(PRESETS).forEach(presetName => {
      const item = document.createElement('div');
      item.className = 'file-item';
      item.setAttribute('role', 'tab');
      item.innerHTML = `
        <div class="file-name-group">
          <span class="file-icon" style="color: var(--accent);">⭐</span>
          <span class="file-name" title="${presetName}">${presetName.replace('.logo', '').replace('_', ' ')}</span>
        </div>
      `;
      
      item.addEventListener('click', () => {
        // Load Preset into Editor, switch to FILE tab
        fileEditorField.value = PRESETS[presetName];
        currentFileName = null;
        fileStatusDisplay.textContent = `Preset: ${presetName}`;
        switchTab('FILE');
        
        // Instantly run preset
        stopAnimation();
        btnRunCode.click();
      });
      presetList.appendChild(item);
    });
  }

  function loadFile(filename) {
    if (userFiles[filename] !== undefined) {
      currentFileName = filename;
      fileEditorField.value = userFiles[filename];
      fileStatusDisplay.textContent = filename;
      populateFileList();
      switchTab('FILE');
      updateLineNumbers();
      
      // Auto run
      stopAnimation();
      btnRunCode.click();
    }
  }
  
  function deleteFile(filename) {
    const dict = TRANSLATIONS[appLanguage];
    if (confirm(`${dict.msgDeleteConfirm} (${filename})`)) {
      delete userFiles[filename];
      saveAppPreferences();
      if (currentFileName === filename) {
        currentFileName = null;
        fileEditorField.value = '';
        fileStatusDisplay.textContent = dict.fileStatusDraft;
      }
      populateFileList();
      logCLI(`Deleted file: ${filename}`, 'system');
    }
  }
  
  function renameFileDialog(filename) {
    const newName = prompt("Rename file to:", filename);
    if (newName && newName !== filename) {
      if (!newName.endsWith('.logo')) {
        alert(TRANSLATIONS[appLanguage].msgInvalidSaveName);
        return;
      }
      // Re-map in object
      userFiles[newName] = userFiles[filename];
      delete userFiles[filename];
      saveAppPreferences();
      if (currentFileName === filename) {
        currentFileName = newName;
        fileStatusDisplay.textContent = newName;
      }
      populateFileList();
      logCLI(`Renamed ${filename} to ${newName}`, 'system');
    }
  }

  /* -----------------------------------------------------------
     3.3 DYNAMIC CANVAS SIZING & REDRAW
  ----------------------------------------------------------- */
  function resizeCanvas() {
    const width = canvasContainer.clientWidth;
    const height = canvasContainer.clientHeight;
    
    // Avoid resetting if size didn't actually change (e.g. mobile bar bounce)
    if (drawingCanvas.width === width && drawingCanvas.height === height) {
      return;
    }
    
    drawingCanvas.width = width;
    drawingCanvas.height = height;
    
    // Reposition turtle sprite based on engine coordinates
    turtleEngine.redraw();
    updateTurtleDisplay();
  }
  
  // Set up resize observer to capture changes on grid transitions
  const resizeObserver = new ResizeObserver(() => {
    resizeCanvas();
  });
  resizeObserver.observe(canvasContainer);
  
  window.addEventListener('resize', resizeCanvas);
  
  // Initial size
  setTimeout(resizeCanvas, 100);

  /* -----------------------------------------------------------
     3.4 LIVE ANIMATED TURTLE RENDER OVERLAY
  ----------------------------------------------------------- */
  function updateTurtleDisplay() {
    const activeCoords = turtleEngine.getCanvasCoords(turtleEngine.x, turtleEngine.y);
    
    // Set absolute positions, adjusting by half sprite height/width (24px)
    turtleSprite.style.left = `${activeCoords.x - 24}px`;
    turtleSprite.style.top = `${activeCoords.y - 24}px`;
    
    // Rotate relative to SVG up-pointing vector (which is 0 degrees Cartesian).
    // CSS rot operates clockwise. Our angle coordinates align perfectly!
    turtleSprite.style.transform = `rotate(${turtleEngine.angle}deg)`;
    
    // Hide turtle sprite if hidden
    turtleSprite.style.display = turtleEngine.visible ? 'flex' : 'none';
    
    // Update watermark text
    coordsDisplay.textContent = `X: ${Math.round(turtleEngine.x)}, Y: ${Math.round(turtleEngine.y)} | H: ${Math.round(turtleEngine.angle)}°`;
  }

  /* -----------------------------------------------------------
     3.5 TIMED EXECUTION THREAD (STEP MODE)
  ----------------------------------------------------------- */
  function stopAnimation() {
    if (activeAnimationTimer) {
      clearInterval(activeAnimationTimer);
      activeAnimationTimer = null;
    }
    stepsQueue = [];
    queuePointer = 0;
  }
  
  function executeInstructionsAnimated(compiledSteps, speedLevel) {
    stopAnimation();
    stepsQueue = compiledSteps;
    queuePointer = 0;
    
    const dict = TRANSLATIONS[appLanguage];
    logCLI(dict.msgRunning, 'system');
    
    if (speedLevel === 0) {
      // 0 means Instant Mode - execute all steps in a single frame!
      while (queuePointer < stepsQueue.length) {
        executeSingleStep(stepsQueue[queuePointer++]);
      }
      turtleEngine.redraw();
      updateTurtleDisplay();
      logCLI(dict.msgSuccessRun, 'success');
      return;
    }
    
    // Setup transition speed
    let transitionMs = 150;
    let tickMs = 150;
    let stepsPerTick = 1;
    
    if (speedLevel === 1) { // Slow
      transitionMs = 300;
      tickMs = 300;
      stepsPerTick = 1;
    } else if (speedLevel === 2) { // Normal
      transitionMs = 150;
      tickMs = 150;
      stepsPerTick = 1;
    } else if (speedLevel === 3) { // Fast
      transitionMs = 40;
      tickMs = 40;
      stepsPerTick = 2; // Run multiple steps per frame to increase speed!
    } else if (speedLevel === 4) { // Hyper
      transitionMs = 10;
      tickMs = 15;
      stepsPerTick = 10; // Large chunk executions
    }
    
    // Set CSS transition timing dynamically
    if (speedLevel >= 4) {
      turtleSprite.style.transition = 'none'; // absolute raw rendering
    } else {
      turtleSprite.style.transition = `left ${transitionMs}ms ease-out, top ${transitionMs}ms ease-out, transform ${transitionMs}ms ease-out`;
    }
    
    activeAnimationTimer = setInterval(() => {
      let actionsPerformed = 0;
      
      while (actionsPerformed < stepsPerTick && queuePointer < stepsQueue.length) {
        const step = stepsQueue[queuePointer++];
        executeSingleStep(step);
        actionsPerformed++;
      }
      
      // Update displays
      updateTurtleDisplay();
      
      if (queuePointer >= stepsQueue.length) {
        stopAnimation();
        logCLI(dict.msgSuccessRun, 'success');
      }
    }, tickMs);
  }
  
  function executeSingleStep(step) {
    switch (step.type) {
      case 'MOVE':
        if (step.pen) {
          turtleEngine.drawLine(step.oldX, step.oldY, step.newX, step.newY, step.color, step.size);
        }
        turtleEngine.x = step.newX;
        turtleEngine.y = step.newY;
        break;
        
      case 'ROTATE':
        turtleEngine.angle = step.newAngle;
        break;
        
      case 'PEN':
        turtleEngine.pen = step.pen;
        break;
        
      case 'VISIBLE':
        turtleEngine.visible = step.visible;
        break;
        
      case 'PENCOLOR':
        turtleEngine.penColor = step.color;
        break;
        
      case 'PENSIZE':
        turtleEngine.penSize = step.size;
        break;
        
      case 'BGCOLOR':
        turtleEngine.bgColor = step.color;
        // Background color change instantly alters canvas style
        drawingCanvas.style.backgroundColor = step.color;
        break;
        
      case 'CLEARSCREEN':
        turtleEngine.reset();
        turtleEngine.clear();
        // Clear background color if customized
        drawingCanvas.style.backgroundColor = turtleEngine.bgColor;
        break;
        
      case 'CLEARTEXT':
        clearCLI();
        break;
    }
  }

  /* -----------------------------------------------------------
     3.6 EDITOR TAB INTERACTION & LINE NUMBERS
  ----------------------------------------------------------- */
  function switchTab(target) {
    if (target === 'CMD') {
      tabCmd.classList.add('active');
      tabCmd.setAttribute('aria-selected', 'true');
      tabFile.classList.remove('active');
      tabFile.setAttribute('aria-selected', 'false');
      tabContentCmd.style.display = 'flex';
      tabContentFile.style.display = 'none';
      cliInputField.focus();
    } else {
      tabCmd.classList.remove('active');
      tabCmd.setAttribute('aria-selected', 'false');
      tabFile.classList.add('active');
      tabFile.setAttribute('aria-selected', 'true');
      tabContentCmd.style.display = 'none';
      tabContentFile.style.display = 'flex';
      fileEditorField.focus();
      updateLineNumbers();
    }
  }
  
  tabCmd.addEventListener('click', () => switchTab('CMD'));
  tabFile.addEventListener('click', () => switchTab('FILE'));
  
  // Custom textarea scroll alignment for line numbers
  fileEditorField.addEventListener('scroll', () => {
    editorLineNumbers.scrollTop = fileEditorField.scrollTop;
  });
  
  function updateLineNumbers() {
    const text = fileEditorField.value;
    const lines = text.split('\n');
    const lineCount = lines.length || 1;
    
    let numbersHtml = '';
    for (let l = 1; l <= lineCount; l++) {
      numbersHtml += `${l}<br>`;
    }
    editorLineNumbers.innerHTML = numbersHtml;
  }
  
  fileEditorField.addEventListener('input', updateLineNumbers);
  
  // Speed Slider Label Updater
  function updateSpeedLabel() {
    const val = parseInt(speedSlider.value, 10);
    const speedLabels = {
      0: 'Speed: Instant (0s)',
      1: 'Speed: Slow',
      2: 'Speed: Normal',
      3: 'Speed: Fast',
      4: 'Speed: Hyper (60fps)'
    };
    document.getElementById('lblSpeed').textContent = speedLabels[val];
    speedSlider.setAttribute('aria-valuenow', val);
    speedSlider.setAttribute('aria-valuetext', speedLabels[val].replace('Speed: ', ''));
  }
  speedSlider.addEventListener('input', updateSpeedLabel);

  /* -----------------------------------------------------------
     3.7 CLI LOGS & HISTORY SYSTEM
  ----------------------------------------------------------- */
  function logCLI(text, type = 'system') {
    const line = document.createElement('div');
    line.className = `log-line ${type}-line`;
    
    if (type === 'cmd') {
      line.textContent = `> ${text}`;
    } else {
      line.textContent = text;
    }
    
    cliLog.appendChild(line);
    cliLog.scrollTop = cliLog.scrollHeight;
  }
  
  function clearCLI() {
    cliLog.innerHTML = '';
    logCLI(TRANSLATIONS[appLanguage].msgWelcome, 'system');
  }

  // CLI execution input keypress listeners (supports arrow histories!)
  cliInputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const code = cliInputField.value.trim();
      if (!code) return;
      
      cliInputField.value = '';
      
      // Save history
      cliHistory.push(code);
      cliHistoryIdx = cliHistory.length;
      
      logCLI(code, 'cmd');
      
      // Execute command
      runLogoCode(code);
    } 
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cliHistory.length > 0 && cliHistoryIdx > 0) {
        cliHistoryIdx--;
        cliInputField.value = cliHistory[cliHistoryIdx];
      }
    } 
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cliHistory.length > 0 && cliHistoryIdx < cliHistory.length - 1) {
        cliHistoryIdx++;
        cliInputField.value = cliHistory[cliHistoryIdx];
      } else {
        cliHistoryIdx = cliHistory.length;
        cliInputField.value = '';
      }
    }
  });

  /* -----------------------------------------------------------
     3.8 LOGO EXECUTION ROUTE
  ----------------------------------------------------------- */
  function runLogoCode(code) {
    try {
      // 1. Lexical Tokenizer
      const tokens = tokenize(code);
      if (tokens.length === 0) return;
      
      // 2. Expand Repeats
      const unrolled = unrollTokens(tokens);
      
      // 3. Compile list relative to virtual starting points
      const compiled = compile(unrolled, turtleEngine, appLanguage);
      
      // 4. Run timed or immediate draw blocks
      const speedVal = parseInt(speedSlider.value, 10);
      executeInstructionsAnimated(compiled, speedVal);
      
    } catch (err) {
      stopAnimation();
      logCLI(err.message, 'error');
    }
  }
  
  // RUN button click orchestrator (pulls active tab code)
  btnRunCode.addEventListener('click', () => {
    const isCmd = tabCmd.classList.contains('active');
    const code = isCmd ? cliInputField.value.trim() : fileEditorField.value.trim();
    
    if (!code) return;
    
    if (isCmd) {
      cliInputField.value = '';
      cliHistory.push(code);
      cliHistoryIdx = cliHistory.length;
      logCLI(code, 'cmd');
      runLogoCode(code);
    } else {
      runLogoCode(code);
    }
  });

  // CLEAR button
  btnResetCanvas.addEventListener('click', () => {
    stopAnimation();
    turtleEngine.reset();
    turtleEngine.clear();
    // Default background color reset
    if (activeTheme === 'glass-dark') turtleEngine.bgColor = '#090d16';
    else if (activeTheme === 'glass-light') turtleEngine.bgColor = '#f8fafc';
    else if (activeTheme === 'neon-cyber') turtleEngine.bgColor = '#000000';
    else if (activeTheme === 'retro-green') turtleEngine.bgColor = '#020804';
    
    drawingCanvas.style.backgroundColor = turtleEngine.bgColor;
    
    updateTurtleDisplay();
    logCLI(TRANSLATIONS[appLanguage].msgClear, 'system');
  });

  /* -----------------------------------------------------------
     3.9 PANEL COLLAPSIBLE CONTROLLER
  ----------------------------------------------------------- */
  toggleLeftPanel.addEventListener('click', () => {
    const isCollapsed = appContainer.classList.toggle('left-collapsed');
    toggleLeftPanel.setAttribute('aria-expanded', !isCollapsed);
    // Grid scaling shifts viewport. Redraw canvas in 150ms after animation shifts.
    setTimeout(resizeCanvas, 310);
  });
  
  toggleRightPanel.addEventListener('click', () => {
    const isCollapsed = appContainer.classList.toggle('right-collapsed');
    toggleRightPanel.setAttribute('aria-expanded', !isCollapsed);
    setTimeout(resizeCanvas, 310);
  });
  
  closeRightPanel.addEventListener('click', () => {
    appContainer.classList.add('right-collapsed');
    toggleRightPanel.setAttribute('aria-expanded', 'false');
    setTimeout(resizeCanvas, 310);
  });
  
  toggleBottomPanel.addEventListener('click', () => {
    const isCollapsed = appContainer.classList.toggle('bottom-collapsed');
    toggleBottomPanel.setAttribute('aria-expanded', !isCollapsed);
    setTimeout(resizeCanvas, 310);
  });

  /* -----------------------------------------------------------
     3.10 DIALOG OVERLAYS & CONTROLS
  ----------------------------------------------------------- */
  // Settings dialogue
  settingsBtn.addEventListener('click', () => {
    settingsDialog.showModal();
  });
  
  closeSettingsDialog.addEventListener('click', () => {
    settingsDialog.close();
  });
  
  btnSettingsReset.addEventListener('click', () => {
    settingLang.value = 'en';
    settingTurtleIcon.value = 'classic';
    settingTheme.value = 'glass-dark';
    profileNameInput.value = 'Aero Coder';
  });
  
  btnSettingsApply.addEventListener('click', () => {
    appLanguage = settingLang.value;
    activeTurtleStyle = settingTurtleIcon.value;
    activeTheme = settingTheme.value;
    userProfileName = profileNameInput.value.trim() || 'Aero Coder';
    
    saveAppPreferences();
    applyPreferences(true);
    populateFileList();
    
    settingsDialog.close();
    logCLI('Applied new workspace customization.', 'success');
  });

  // Help Dialogue
  btnHelp.addEventListener('click', () => {
    helpDialog.showModal();
  });
  
  closeHelpDialog.addEventListener('click', () => {
    helpDialog.close();
  });
  
  btnHelpClose.addEventListener('click', () => {
    helpDialog.close();
  });

  // Save Dialogues
  btnSaveFile.addEventListener('click', () => {
    const code = fileEditorField.value.trim();
    if (!code) return;
    
    if (currentFileName) {
      // Direct save without prompt if already loaded filename
      userFiles[currentFileName] = code;
      saveAppPreferences();
      populateFileList();
      logCLI(TRANSLATIONS[appLanguage].msgSaved, 'success');
    } else {
      saveDialog.showModal();
    }
  });
  
  closeSaveDialog.addEventListener('click', () => {
    saveDialog.close();
  });
  btnCancelSave.addEventListener('click', () => {
    saveDialog.close();
  });
  
  btnConfirmSave.addEventListener('click', () => {
    const name = saveFileNameInput.value.trim();
    if (!name || !name.endsWith('.logo')) {
      alert(TRANSLATIONS[appLanguage].msgInvalidSaveName);
      return;
    }
    
    const code = fileEditorField.value.trim();
    userFiles[name] = code;
    currentFileName = name;
    fileStatusDisplay.textContent = name;
    
    saveAppPreferences();
    populateFileList();
    saveDialog.close();
    logCLI(TRANSLATIONS[appLanguage].msgSaved, 'success');
  });

  /* -----------------------------------------------------------
     3.11 INITIALIZATION PIPELINES
  ----------------------------------------------------------- */
  loadAppPreferences();
  
  // If no files yet, pre-populate with Presets in localstorage
  if (Object.keys(userFiles).length === 0) {
    userFiles = { ...PRESETS };
    saveAppPreferences();
  }
  
  populateFileList();
  
  // Initial manual render
  applyPreferences(true);
  
  // Log greet
  logCLI('Core virtual machines online.', 'success');
});
