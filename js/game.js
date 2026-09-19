const LOGICAL_WIDTH = 1200;
const LOGICAL_HEIGHT = 675;

const canvas = document.querySelector("#game-canvas");
const context = canvas.getContext("2d");
const stage = document.querySelector(".game-stage");
const tankSprite = document.querySelector("#tank-sprite");
const debugPresentationToggle = document.querySelector("#debug-presentation-toggle");
const debugPresentationPanel = document.querySelector("#debug-presentation-panel");
const debugLevelSelect = document.querySelector("#debug-level-select");
const debugStageSelect = document.querySelector("#debug-stage-select");
const debugLoadStageButton = document.querySelector("#debug-load-stage-button");
const debugRestartLevelButton = document.querySelector("#debug-restart-level-button");
const pauseOverlay = document.querySelector("#pause-overlay");
const continueButton = document.querySelector("#continue-button");
const pauseRestartButton = document.querySelector("#pause-restart-button");
const pauseMenuButton = document.querySelector("#pause-menu-button");
const gameOverOverlay = document.querySelector("#game-over-overlay");
const gameOverScore = document.querySelector("#game-over-score");
const gameOverLevel = document.querySelector("#game-over-level");
const checkpointButton = document.querySelector("#checkpoint-button");
const retryButton = document.querySelector("#retry-button");
const mainMenuButton = document.querySelector("#main-menu-button");
const levelCompleteOverlay = document.querySelector("#level-complete-overlay");
const levelCompleteTitle = document.querySelector("#level-complete-title");
const levelCompleteScore = document.querySelector("#level-complete-score");
const levelCompleteHp = document.querySelector("#level-complete-hp");
const nextLevelButton = document.querySelector("#next-level-button");
const levelCompleteMenuButton = document.querySelector("#level-complete-menu-button");
const nextLevelPreviewOverlay = document.querySelector("#next-level-preview-overlay");
const nextLevelPreviewTitle = document.querySelector("#next-level-preview-title");
const nextLevelPreviewScore = document.querySelector("#next-level-preview-score");
const nextLevelPreviewHp = document.querySelector("#next-level-preview-hp");
const nextLevelPreviewWeapon = document.querySelector("#next-level-preview-weapon");
const nextLevelMenuButton = document.querySelector("#next-level-menu-button");
const mainMenuOverlay = document.querySelector("#main-menu-overlay");
const startGameButton = document.querySelector("#start-game-button");

const ENEMY_SPEED = 180;
const TANK_SPEED = 260;
const TANK_MOVE_SPEED_NOT_FIRING_MULTIPLIER = 1.40;
const PROJECTILE_SPEED = 520;
const TANK_WIDTH = 165;
const TANK_HEIGHT = 82;
const TANK_START_X = (LOGICAL_WIDTH - TANK_WIDTH) / 2;
const TANK_START_Y = 550;
const TANK_MAX_HP = 100;
const STARTING_WEAPON_LEVEL = 1;
const PROJECTILE_FIRE_INTERVAL = 0.09;
const PROJECTILE_FIRE_INTERVAL_UPGRADED = 0.07;
const ROCKET_COOLDOWN = 3;
const ROCKET_SPEED = 390;
const ROCKET_TURN_RATE = 3.2;
const ROCKET_WIDTH = 58;
const ROCKET_HEIGHT = 24;
const ROCKET_HIT_RADIUS = 18;
const ROCKET_SMOKE_DURATION = 0.42;
const ROCKET_SMOKE_EMIT_INTERVAL = 0.035;
const ROCKET_SMOKE_MAX_PARTICLES = 48;
const ROCKET_HUD_SIZE = 62;
const ROCKET_MULTI_LAUNCH_INTERVAL = 0.5;
const ROCKET_EXPLOSION_DURATION = 0.38;
const ROCKET_EXPLOSION_RADIUS = 42;
const ROCKET_EXPLOSION_PARTICLES = 18;
const MUZZLE_FLASH_DURATION = 0.055;
const MUZZLE_SMOKE_DURATION = 0.34;
const MUZZLE_SMOKE_MAX_PARTICLES = 28;
const TANK_DUST_EMIT_INTERVAL = 0.045;
const TANK_IDLE_DUST_EMIT_INTERVAL = 0.09;
const TANK_DUST_DURATION = 0.42;
const TANK_IDLE_DUST_DURATION = 0.38;
const TANK_DUST_MAX_PARTICLES = 42;
const ENEMY_LASER_LENGTH = 34;
const ENEMY_LASER_LINE_WIDTH = 3;
const LASER_TANK_IMPACT_DURATION = 0.16;
const LASER_TANK_IMPACT_RADIUS = 14;
const PROJECTILE_IMPACT_DURATION = 0.18;
const BOSS_PROJECTILE_IMPACT_RADIUS = 18;
const EXPLOSION_ASSET = "assets/gif/exploci\u00f3n3.gif";
const EXPLOSION_DURATION = 0.75;
const EXPLOSION_WIDTH = 80;
const EXPLOSION_HEIGHT = 119;
const GROUND_EXPLOSION_ASSET = "assets/gif/exploci\u00f3n2.gif";
const GROUND_EXPLOSION_DURATION = 1.46;
const GROUND_EXPLOSION_WIDTH = 67;
const GROUND_EXPLOSION_HEIGHT = 171;
const GROUND_LASER_IMPACT_FLASH_DURATION = 0.5;
const GROUND_LASER_IMPACT_FLASH_RADIUS = 34;
const TANK_DEATH_EXPLOSION_ASSET = "assets/gif/explosion.gif";
const TANK_DEATH_EXPLOSION_DURATION = 1.7;
const TANK_DEATH_EXPLOSION_WIDTH = 187;
const TANK_DEATH_EXPLOSION_HEIGHT = 232;
const TANK_DEATH_EXPLOSION_VISUAL_BOTTOM = 216;
const ENEMY_DEATH_VISUAL_DELAY = 0.5;

const rocketAssets = {
  icon: createImageAsset("assets/gif/RocketLauncher.webp"),
  missileFrames: [
    createImageAsset("assets/png/Misil1.png"),
  ],
  flameFrames: [
    createImageAsset("assets/png/Fuego1.png"),
    createImageAsset("assets/png/Fuego2.png"),
    createImageAsset("assets/png/Fuego3.png"),
    createImageAsset("assets/png/Fuego4.png"),
  ],
};

function createImageAsset(src) {
  const image = new Image();
  image.src = src;
  return image;
}

const STAGES = {
  INICIO: "INICIO",
  NUDO: "NUDO",
  BOSS: "BOSS",
};

const MUSIC_CONFIG = {
  [STAGES.INICIO]: {
    src: "assets/audio/music/inicio.ogg",
  },
  [STAGES.NUDO]: {
    src: "assets/audio/music/nudo.ogg",
  },
  [STAGES.BOSS]: {
    src: "assets/audio/music/boss.ogg",
  },
};

const GAME_STATES = {
  MENU: "MENU",
  PLAYING: "PLAYING",
  PAUSED: "PAUSED",
  PLAYER_DYING: "PLAYER_DYING",
  BOSS_DEFEATED: "BOSS_DEFEATED",
  LEVEL_COMPLETE: "LEVEL_COMPLETE",
  LEVEL_PREVIEW: "LEVEL_PREVIEW",
  GAME_OVER: "GAME_OVER",
};

const LEVEL_CONFIG = {
  1: {
    enabled: true,
    start: {
      stage: STAGES.INICIO,
      tankX: TANK_START_X,
      tankY: TANK_START_Y,
      tankHp: TANK_MAX_HP,
      weaponLevel: STARTING_WEAPON_LEVEL,
    },
    normalEnemy: {
      hp: 30,
      lanes: [100, 190, 280],
      trajectory: {
        amplitude: 40,
        period: 1200,
      },
      laser: {
        speed: 320,
        fireInterval: 2.6,
        damage: 5,
      },
    },
    boss: {
      asset: "assets/gif/jefe1.gif",
      label: "Boss 1",
      width: 301,
      height: 123,
      visualOffsetX: 0,
      visualOffsetY: 0,
      maxHp: 700,
      speed: 145,
      initialDirection: -1,
      trajectory: {
        type: "sin",
        midline: 180,
        amplitude: 70,
        period: 1000,
      },
      laser: {
        speed: 420,
        fireInterval: 0.85,
        damage: 15,
        length: 58,
        lineWidth: 7,
        type: "boss",
      },
      attackPattern: {
        sequence: [1, 1, 2],
        doubleSpreadDegrees: 10,
      },
      projectileHitbox: {
        insetX: 24,
        topOffset: -46,
        bottomOffset: 18,
      },
      deathExplosion: {
        asset: TANK_DEATH_EXPLOSION_ASSET,
        duration: TANK_DEATH_EXPLOSION_DURATION,
        width: 380,
        height: 470,
      },
    },
    powerUps: {
      heavyMachineGun: {
        asset: "assets/gif/Heavy Machine Gun.webp",
        normalKillTrigger: 17,
        weaponLevel: 2,
        width: 42,
        height: 42,
        spawnX: 600,
        spawnY: 80,
        fallSpeed: 140,
        groundAvailableTime: 8,
      },
    },
    drops: {
      health: {
        dropChance: 0.3,
        healAmount: 25,
        width: 42,
        height: 42,
        fallSpeed: 125,
        groundAvailableTime: 7,
        pulseScale: 0.14,
        pulseSpeed: 5.5,
      },
    },
    stages: {
      [STAGES.INICIO]: {
        maxNormalEnemies: 3,
        spawnInterval: 2.4,
        normalKillTarget: 10,
        spawnsNormalEnemies: true,
      },
      [STAGES.NUDO]: {
        maxNormalEnemies: 4,
        spawnInterval: 1.9,
        normalKillTarget: 25,
        spawnsNormalEnemies: true,
      },
      [STAGES.BOSS]: {
        maxNormalEnemies: 0,
        spawnInterval: null,
        normalKillTarget: null,
        spawnsNormalEnemies: false,
      },
    },
  },
  2: {
    enabled: true,
    start: {
      stage: STAGES.INICIO,
      tankX: TANK_START_X,
      tankY: TANK_START_Y,
      tankHp: TANK_MAX_HP,
      weaponLevel: 2,
    },
    normalEnemy: {
      hp: 40,
      lanes: [90, 175, 260],
      trajectory: {
        amplitude: 35,
        period: 900,
      },
      laser: {
        speed: 340,
        fireInterval: 2.3,
        damage: 5,
      },
    },
    boss: {
      asset: "assets/gif/Jefe2.gif",
      label: "Boss 2",
      width: 207,
      height: 156,
      visualOffsetX: 0,
      visualOffsetY: 0,
      maxHp: 800,
      speed: 155,
      initialDirection: -1,
      trajectory: {
        type: "cos",
        midline: 180,
        amplitude: 65,
        period: 800,
      },
      laser: {
        speed: 440,
        fireInterval: 0.8,
        damage: 15,
        length: 58,
        lineWidth: 7,
        type: "boss",
        colors: {
          fade: "rgba(255, 190, 28, 0)",
          core: "rgba(255, 205, 46, 0.88)",
          tip: "rgba(255, 250, 190, 1)",
          glowOuter: "rgba(255, 184, 28, 0.28)",
          glowInner: "rgba(255, 220, 74, 0.62)",
        },
      },
      attackPattern: {
        sequence: [1, 1, 2],
        doubleSpreadDegrees: 10,
      },
      projectileHitbox: {
        insetX: 18,
        topOffset: -49,
        bottomOffset: 26,
      },
      deathExplosion: {
        asset: TANK_DEATH_EXPLOSION_ASSET,
        duration: TANK_DEATH_EXPLOSION_DURATION,
        width: 300,
        height: 372,
      },
    },
    powerUps: {
      heavyMachineGun: {
        asset: "assets/gif/Heavy Machine Gun.webp",
        normalKillTrigger: 20,
        weaponLevel: 3,
        width: 42,
        height: 42,
        spawnX: 600,
        spawnY: 80,
        fallSpeed: 140,
        groundAvailableTime: 8,
      },
    },
    drops: {
      health: {
        dropChance: 0.2,
        healAmount: 25,
        width: 42,
        height: 42,
        fallSpeed: 125,
        groundAvailableTime: 7,
        pulseScale: 0.14,
        pulseSpeed: 5.5,
      },
    },
    stages: {
      [STAGES.INICIO]: {
        maxNormalEnemies: 4,
        spawnInterval: 2.2,
        normalKillTarget: 12,
        spawnsNormalEnemies: true,
      },
      [STAGES.NUDO]: {
        maxNormalEnemies: 5,
        spawnInterval: 1.7,
        normalKillTarget: 30,
        spawnsNormalEnemies: true,
      },
      [STAGES.BOSS]: {
        maxNormalEnemies: 0,
        spawnInterval: null,
        normalKillTarget: null,
        spawnsNormalEnemies: false,
      },
    },
  },
  3: {
    enabled: true,
    start: {
      stage: STAGES.INICIO,
      tankX: TANK_START_X,
      tankY: TANK_START_Y,
      tankHp: TANK_MAX_HP,
      weaponLevel: 3,
    },
    normalEnemy: {
      hp: 48,
      lanes: [85, 170, 255],
      trajectory: {
        amplitude: 35,
        period: 600,
      },
      laser: {
        speed: 360,
        fireInterval: 2.05,
        damage: 6,
      },
    },
    boss: {
      asset: "assets/gif/jefe4.gif",
      label: "Boss 3",
      width: 260,
      height: 195,
      visualOffsetX: 0,
      visualOffsetY: 0,
      maxHp: 950,
      speed: 165,
      initialDirection: -1,
      trajectory: {
        type: "sin",
        midline: 175,
        amplitude: 55,
        period: 600,
      },
      laser: {
        speed: 460,
        fireInterval: 0.95,
        damage: 16,
        length: 58,
        lineWidth: 7,
        type: "boss",
        colors: {
          fade: "rgba(32, 220, 255, 0)",
          core: "rgba(35, 210, 255, 0.88)",
          tip: "rgba(220, 252, 255, 1)",
          glowOuter: "rgba(20, 180, 255, 0.28)",
          glowInner: "rgba(88, 226, 255, 0.62)",
        },
      },
      attackPattern: {
        sequence: [1, 1, 2, 2],
        doubleSpreadDegrees: 10,
      },
      specialAttack: {
        type: "fan",
        interval: 6,
        telegraphDuration: 0.5,
        projectileCount: 7,
        startAngle: 0,
        endAngle: Math.PI,
      },
      healthDropOnHpRatio: 0.5,
      playerHealthDropOnHpRatio: 0.3,
      healthDropHealAmount: 40,
      projectileHitbox: {
        insetX: 26,
        topOffset: -62,
        bottomOffset: 34,
      },
      deathExplosion: {
        asset: TANK_DEATH_EXPLOSION_ASSET,
        duration: TANK_DEATH_EXPLOSION_DURATION,
        width: 380,
        height: 470,
      },
    },
    powerUps: {
      heavyMachineGun: {
        asset: "assets/gif/Heavy Machine Gun.webp",
        normalKillTrigger: 22,
        weaponLevel: 4,
        width: 42,
        height: 42,
        spawnX: 600,
        spawnY: 80,
        fallSpeed: 140,
        groundAvailableTime: 8,
      },
      rocketLauncher: {
        asset: "assets/gif/RocketLauncher.webp",
        normalKillTrigger: 28,
        rockets: 1,
        rocketDamage: 12,
        width: 76,
        height: 76,
        spawnX: 600,
        spawnY: 80,
        fallSpeed: 145,
        groundAvailableTime: 8,
        cooldown: ROCKET_COOLDOWN,
        enabled: true,
      },
    },
    drops: {
      health: {
        dropChance: 0.2,
        healAmount: 25,
        width: 42,
        height: 42,
        fallSpeed: 125,
        groundAvailableTime: 7,
        pulseScale: 0.14,
        pulseSpeed: 5.5,
      },
    },
    stages: {
      [STAGES.INICIO]: {
        maxNormalEnemies: 4,
        spawnInterval: 2.0,
        normalKillTarget: 14,
        spawnsNormalEnemies: true,
      },
      [STAGES.NUDO]: {
        maxNormalEnemies: 5,
        spawnInterval: 1.55,
        normalKillTarget: 34,
        spawnsNormalEnemies: true,
        normalTrajectoryVariants: [
          { amplitude: 35, period: 600 },
          { amplitude: 35, period: 400 },
          { amplitude: 35, period: 400 },
        ],
      },
      [STAGES.BOSS]: {
        maxNormalEnemies: 0,
        spawnInterval: null,
        normalKillTarget: null,
        spawnsNormalEnemies: false,
      },
    },
  },
  4: {
    enabled: true,
    start: {
      stage: STAGES.INICIO,
      tankX: TANK_START_X,
      tankY: TANK_START_Y,
      tankHp: TANK_MAX_HP,
      weaponLevel: 4,
      projectileFireInterval: PROJECTILE_FIRE_INTERVAL,
      rocketLauncher: {
        enabled: true,
        rockets: 1,
        rocketDamage: 12,
        cooldown: ROCKET_COOLDOWN,
      },
    },
    normalEnemy: {
      hp: 58,
      lanes: [85, 170, 255],
      trajectory: {
        amplitude: 42,
        period: 560,
      },
      laser: {
        speed: 390,
        fireInterval: 1.9,
        damage: 9,
      },
    },
    boss: {
      asset: "assets/gif/jefe3.gif",
      label: "Boss 4",
      width: 260,
      height: 193,
      visualOffsetX: 0,
      visualOffsetY: 0,
      maxHp: 1250,
      speed: 155,
      initialDirection: -1,
      trajectory: {
        type: "sinCos",
        midline: 180,
        sinAmplitude: 45,
        sinPeriod: 600,
        cosAmplitude: 25,
        cosPeriod: 300,
      },
      laser: {
        speed: 470,
        fireInterval: 0.9,
        damage: 17,
        length: 58,
        lineWidth: 7,
        type: "boss",
        colors: {
          fade: "rgba(110, 76, 255, 0)",
          core: "rgba(128, 92, 255, 0.86)",
          tip: "rgba(218, 235, 255, 1)",
          glowOuter: "rgba(68, 120, 255, 0.28)",
          glowInner: "rgba(162, 98, 255, 0.62)",
        },
      },
      attackPattern: {
        sequence: [1, 2, 1, 2],
        doubleSpreadDegrees: 10,
      },
      specialAttack: {
        type: "spectralLine",
        interval: 4.5,
        telegraphDuration: 1.5,
        projectileCount: 6,
        shotInterval: 0.8,
        lineWidth: 360,
        lineOffsetY: -125,
        speed: 360,
      },
      playerHealthDrops: [
        { hpRatio: 0.4, healAmount: 40 },
        { hpRatio: 0.2, healAmount: 40 },
      ],
      projectileHitbox: {
        insetX: 26,
        topOffset: -62,
        bottomOffset: 36,
      },
      deathExplosion: {
        asset: TANK_DEATH_EXPLOSION_ASSET,
        duration: TANK_DEATH_EXPLOSION_DURATION,
        width: 330,
        height: 410,
      },
    },
    powerUps: {
      cadenceCore: {
        normalKillTrigger: 26,
        fireInterval: PROJECTILE_FIRE_INTERVAL_UPGRADED,
        width: 52,
        height: 52,
        spawnX: 600,
        spawnY: 80,
        fallSpeed: 138,
        groundAvailableTime: 8,
        enabled: true,
      },
      rocketUpgrade: {
        asset: "assets/gif/RocketLauncher.webp",
        normalKillTrigger: 34,
        rockets: 2,
        rocketDamage: 12,
        width: 76,
        height: 76,
        spawnX: 600,
        spawnY: 80,
        fallSpeed: 145,
        groundAvailableTime: 8,
        cooldown: ROCKET_COOLDOWN,
        launchInterval: ROCKET_MULTI_LAUNCH_INTERVAL,
        enabled: true,
      },
    },
    checkpoint: {
      normalKillTrigger: 25,
    },
    drops: {
      health: {
        dropChance: 0.18,
        healAmount: 25,
        width: 42,
        height: 42,
        fallSpeed: 125,
        groundAvailableTime: 7,
        pulseScale: 0.14,
        pulseSpeed: 5.5,
      },
    },
    stages: {
      [STAGES.INICIO]: {
        maxNormalEnemies: 5,
        spawnInterval: 1.65,
        normalKillTarget: 18,
        spawnsNormalEnemies: true,
        normalTrajectoryVariants: [
          { type: "sin", amplitude: 42, period: 560, phase: 0 },
          { type: "sin", amplitude: 42, period: 560, phase: Math.PI / 2 },
          { type: "sin", amplitude: 42, period: 560, phase: Math.PI },
          { type: "sin", amplitude: 42, period: 560, phase: 3 * Math.PI / 2 },
        ],
      },
      [STAGES.NUDO]: {
        maxNormalEnemies: 6,
        spawnInterval: 1.25,
        normalKillTarget: 42,
        spawnsNormalEnemies: true,
        normalTrajectoryVariants: [
          { type: "sin", amplitude: 42, period: 560, phase: 0 },
          { type: "sin", amplitude: 42, period: 560, phase: Math.PI / 2 },
          { type: "sin", amplitude: 42, period: 560, phase: Math.PI },
          { type: "sin", amplitude: 42, period: 560, phase: 3 * Math.PI / 2 },
        ],
      },
      [STAGES.BOSS]: {
        maxNormalEnemies: 0,
        spawnInterval: null,
        normalKillTarget: null,
        spawnsNormalEnemies: false,
      },
    },
  },
  5: { normalEnemy: { hp: 70 } },
};

const SCORE_CONFIG = {
  normalEnemyDestroyed: 10,
};

const DEBUG_PRESENTATION_CONFIG = {
  1: {
    weaponLevelByStage: {
      [STAGES.INICIO]: 1,
      [STAGES.NUDO]: 1,
      [STAGES.BOSS]: 2,
    },
  },
  2: {
    weaponLevelByStage: {
      [STAGES.INICIO]: 2,
      [STAGES.NUDO]: 2,
      [STAGES.BOSS]: 3,
    },
  },
  3: {
    weaponLevelByStage: {
      [STAGES.INICIO]: 3,
      [STAGES.NUDO]: 3,
      [STAGES.BOSS]: 4,
    },
    normalEnemiesDestroyedByStage: {
      [STAGES.NUDO]: 21,
    },
  },
  4: {
    weaponLevelByStage: {
      [STAGES.INICIO]: 4,
      [STAGES.NUDO]: 4,
      [STAGES.BOSS]: 4,
    },
    normalEnemiesDestroyedByStage: {
      [STAGES.NUDO]: 25,
    },
  },
};

let currentLevel = 1;

const gameState = {
  status: GAME_STATES.MENU,
  score: 0,
  stage: STAGES.INICIO,
  normalEnemiesDestroyed: 0,
};

const checkpointState = {
  active: false,
  level: null,
  normalEnemiesDestroyed: 0,
  score: 0,
  stage: STAGES.INICIO,
  weaponLevel: STARTING_WEAPON_LEVEL,
  weaponFireInterval: PROJECTILE_FIRE_INTERVAL,
};

const debug = {
  enabled: false,
  gridStep: 100,
  groundY: TANK_START_Y + TANK_HEIGHT,
  presentationPanelOpen: false,
  presentationModeActive: false,
};

const tank = {
  x: TANK_START_X,
  y: TANK_START_Y,
  width: TANK_WIDTH,
  height: TANK_HEIGHT,
  maxHp: TANK_MAX_HP,
  hp: TANK_MAX_HP,
  alive: true,
  visible: true,
};

const musicManager = {
  audio: new Audio(),
  currentStage: null,

  setup() {
    this.audio.loop = true;
    this.audio.preload = "auto";
  },

  playStage(stageName, options = {}) {
    const musicConfig = MUSIC_CONFIG[stageName];
    if (!musicConfig) {
      this.stop();
      return;
    }

    const shouldSwitchTrack = this.currentStage !== stageName;

    if (shouldSwitchTrack) {
      this.audio.pause();
      this.audio.src = musicConfig.src;
      this.audio.loop = true;
      this.audio.preload = "auto";
      this.currentStage = stageName;
      this.seekStart();
    } else if (options.restart && this.audio.paused) {
      this.seekStart();
    }

    this.tryPlay();
  },

  pause() {
    this.audio.pause();
  },

  resume() {
    if (!this.currentStage) {
      this.playStage(gameState.stage);
      return;
    }

    this.tryPlay();
  },

  stop() {
    this.audio.pause();
    this.seekStart();
    this.currentStage = null;
  },

  seekStart() {
    try {
      this.audio.currentTime = 0;
    } catch (error) {
      // Algunas pistas aun pueden no estar listas para seekear justo al cambiar src.
    }
  },

  tryPlay() {
    const playPromise = this.audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  },
};

musicManager.setup();

const weapon = {
  level: STARTING_WEAPON_LEVEL,
  projectileDamage: 2,
  fireInterval: PROJECTILE_FIRE_INTERVAL,
  muzzlePoints: [
    { id: 1, offsetX: -8, offsetY: -50 },
    { id: 2, offsetX: 15, offsetY: -50 },
    { id: 3, offsetX: -48, offsetY: -28 },
    { id: 4, offsetX: 65, offsetY: -28 },
  ],
};

const input = {
  left: false,
  right: false,
  fire: false,
};

const muzzleFlashes = [];

const muzzleSmokeParticles = [];

const tankDustManager = {
  particles: [],
  emitCooldown: 0,
  idleEmitCooldown: 0,

  update(deltaSeconds, movementDirection) {
    this.emitCooldown -= deltaSeconds;
    this.idleEmitCooldown -= deltaSeconds;

    if (movementDirection !== 0 && this.emitCooldown <= 0) {
      this.emit(movementDirection);
      this.emitCooldown = TANK_DUST_EMIT_INTERVAL;
    } else if (movementDirection === 0 && this.idleEmitCooldown <= 0) {
      this.emitIdle();
      this.idleEmitCooldown = TANK_IDLE_DUST_EMIT_INTERVAL;
    }

    for (let index = this.particles.length - 1; index >= 0; index -= 1) {
      const particle = this.particles[index];
      particle.age += deltaSeconds;
      particle.x += particle.vx * deltaSeconds;
      particle.y += particle.vy * deltaSeconds;
      particle.vy -= 8 * deltaSeconds;
      particle.radius += particle.growth * deltaSeconds;

      if (particle.age >= particle.duration) this.particles.splice(index, 1);
    }
  },

  emit(movementDirection) {
    const rearX = movementDirection > 0 ? tank.x + 12 : tank.x + tank.width - 12;
    const rearY = getTankGroundY() - 8;
    const driftDirection = -movementDirection;

    for (let count = 0; count < 3; count += 1) {
      this.particles.push({
        x: rearX + (Math.random() - 0.5) * 12,
        y: rearY + (Math.random() - 0.5) * 8,
        vx: driftDirection * (42 + Math.random() * 34),
        vy: -18 - Math.random() * 18,
        radius: 5 + Math.random() * 5,
        growth: 18 + Math.random() * 14,
        age: 0,
        duration: TANK_DUST_DURATION,
      });
    }

    if (this.particles.length > TANK_DUST_MAX_PARTICLES) {
      this.particles.splice(0, this.particles.length - TANK_DUST_MAX_PARTICLES);
    }
  },

  emitIdle() {
    const rearY = getTankGroundY() - 7;
    const sides = [
      { x: tank.x + 14, drift: -1 },
      { x: tank.x + tank.width + 8, drift: 1 },
    ];

    sides.forEach((side) => {
      this.particles.push({
        x: side.x + (Math.random() - 0.5) * 8,
        y: rearY + (Math.random() - 0.5) * 5,
        vx: side.drift * (26 + Math.random() * 26),
        vy: -10 - Math.random() * 12,
        radius: 4 + Math.random() * 4,
        growth: 14 + Math.random() * 10,
        age: 0,
        duration: TANK_IDLE_DUST_DURATION,
      });
    });

    if (this.particles.length > TANK_DUST_MAX_PARTICLES) {
      this.particles.splice(0, this.particles.length - TANK_DUST_MAX_PARTICLES);
    }
  },

  clear() {
    this.particles = [];
    this.emitCooldown = 0;
    this.idleEmitCooldown = 0;
  },
};

const projectileManager = {
  projectiles: [],
  nextId: 1,
  fireCooldown: 0,

  update(deltaSeconds) {
    this.fireCooldown = Math.max(0, this.fireCooldown - deltaSeconds);
    if (input.fire && this.fireCooldown <= 0) {
      this.fire();
      this.fireCooldown = weapon.fireInterval;
    }

    this.projectiles.forEach((projectile) => {
      projectile.y -= projectile.speed * deltaSeconds;
    });
    this.removeExitedProjectiles();
  },

  fire() {
    getActiveMuzzlePoints().forEach((muzzle) => {
      this.projectiles.push({
        id: this.nextId,
        x: muzzle.x,
        y: muzzle.y,
        width: 4,
        height: 18,
        speed: PROJECTILE_SPEED,
      });
      this.nextId += 1;
      muzzleFlashes.push({
        muzzleId: muzzle.id,
        activeTime: MUZZLE_FLASH_DURATION,
      });
      createMuzzleSmoke(muzzle.x, muzzle.y + 4);
    });
  },

  removeExitedProjectiles() {
    this.projectiles = this.projectiles.filter((projectile) => projectile.y + projectile.height > 0);
  },

  clear() {
    this.projectiles = [];
    this.nextId = 1;
    this.fireCooldown = 0;
  },
};

const rocketManager = {
  unlocked: false,
  missileCount: 0,
  missileDamage: 0,
  cooldownDuration: ROCKET_COOLDOWN,
  cooldown: 0,
  launchInterval: 0,
  pendingLaunches: [],
  missiles: [],
  smokeParticles: [],
  nextId: 1,

  unlock(config) {
    if (!config?.enabled) return;

    this.unlocked = true;
    this.missileCount = config.rockets;
    this.missileDamage = config.rocketDamage;
    this.cooldownDuration = config.cooldown ?? ROCKET_COOLDOWN;
    this.launchInterval = config.launchInterval ?? 0;
    this.cooldown = 0;
  },

  tryFire() {
    if (!isGameplayActive() || !this.unlocked || this.cooldown > 0) return false;

    for (let index = 0; index < this.missileCount; index += 1) {
      this.pendingLaunches.push({
        delay: this.launchInterval * index,
        angle: -Math.PI / 2,
      });
    }

    this.cooldown = this.cooldownDuration;
    return true;
  },

  createMissile(x, y, angle) {
    this.missiles.push({
      id: this.nextId,
      x,
      y,
      angle,
      speed: ROCKET_SPEED,
      turnRate: ROCKET_TURN_RATE,
      damage: this.missileDamage,
      target: null,
      age: 0,
      smokeCooldown: 0,
    });
    this.nextId += 1;
  },

  update(deltaSeconds) {
    this.cooldown = Math.max(0, this.cooldown - deltaSeconds);
    if (input.fire && this.cooldown <= 0) this.tryFire();
    this.updatePendingLaunches(deltaSeconds);

    for (let index = this.missiles.length - 1; index >= 0; index -= 1) {
      const missile = this.missiles[index];
      missile.age += deltaSeconds;
      missile.smokeCooldown -= deltaSeconds;

      if (!this.isTargetAlive(missile.target)) {
        missile.target = this.acquireTarget(missile);
      }

      if (missile.target) {
        const targetCenter = this.getTargetCenter(missile.target);
        const desiredAngle = Math.atan2(targetCenter.y - missile.y, targetCenter.x - missile.x);
        missile.angle = rotateAngleToward(missile.angle, desiredAngle, missile.turnRate * deltaSeconds);
      }

      missile.x += Math.cos(missile.angle) * missile.speed * deltaSeconds;
      missile.y += Math.sin(missile.angle) * missile.speed * deltaSeconds;
      this.emitSmoke(missile);

      const hitTarget = this.getHitTarget(missile);
      if (hitTarget) {
        this.damageTarget(hitTarget, missile);
        this.missiles.splice(index, 1);
        continue;
      }

      if (this.hasMissileLeftScreen(missile)) {
        if (this.hasLiveTargets()) {
          missile.target = this.isTargetAlive(missile.target) ? missile.target : this.acquireTarget(missile);
          continue;
        }

        const explosionPoint = this.getClampedScreenPoint(missile);
        rocketExplosionManager.createExplosion(explosionPoint.x, explosionPoint.y);
        this.missiles.splice(index, 1);
      }
    }

    this.updateSmoke(deltaSeconds);
  },

  updatePendingLaunches(deltaSeconds) {
    for (let index = this.pendingLaunches.length - 1; index >= 0; index -= 1) {
      const launch = this.pendingLaunches[index];
      launch.delay -= deltaSeconds;
      if (launch.delay > 0) continue;

      const tankCenter = getTankCenter();
      this.createMissile(tankCenter.x, tankCenter.y, launch.angle);
      this.pendingLaunches.splice(index, 1);
    }
  },

  acquireTarget(missile) {
    const targets = [...enemyManager.enemies];
    if (bossManager.boss && !bossManager.defeated) targets.push(bossManager.boss);
    if (targets.length === 0) return null;

    return targets.reduce((closest, target) => {
      const targetCenter = this.getTargetCenter(target);
      const targetDistance = getSquaredDistance(missile, targetCenter);
      if (!closest) return { target, distance: targetDistance };
      return targetDistance < closest.distance ? { target, distance: targetDistance } : closest;
    }, null).target;
  },

  isTargetAlive(target) {
    if (!target) return false;
    if (target === bossManager.boss) return !bossManager.defeated && target.hp > 0 && !target.deathProcessed;
    return enemyManager.enemies.includes(target) && target.hp > 0;
  },

  hasLiveTargets() {
    return enemyManager.enemies.some((enemy) => enemy.hp > 0) || this.isTargetAlive(bossManager.boss);
  },

  getTargetCenter(target) {
    if (target.projectileHitbox) {
      const bounds = getProjectileTargetBounds(target);
      return {
        x: (bounds.left + bounds.right) / 2,
        y: (bounds.top + bounds.bottom) / 2,
      };
    }

    return { x: target.x, y: target.y };
  },

  getHitTarget(missile) {
    const enemy = enemyManager.enemies.find((activeEnemy) => isCircleOverlappingTarget(missile.x, missile.y, ROCKET_HIT_RADIUS, activeEnemy));
    if (enemy) return enemy;

    const boss = bossManager.boss;
    if (boss && isCircleOverlappingTarget(missile.x, missile.y, ROCKET_HIT_RADIUS, boss)) return boss;
    return null;
  },

  damageTarget(target, missile) {
    rocketExplosionManager.createExplosion(missile.x, missile.y);

    if (target === bossManager.boss) {
      bossManager.damageBoss(missile.damage);
      return;
    }

    target.hp -= missile.damage;
    if (target.hp > 0) return;

    explosionManager.createExplosion(target.x, target.y);
    enemyDeathVisualManager.keepSpriteTemporarily(target);
    healthDropManager.tryCreateFromEnemyDeath(target);
    enemyManager.removeEnemy(target, { keepSprite: true });
    registerNormalEnemyDestroyed(target);
  },

  emitSmoke(missile) {
    if (missile.smokeCooldown > 0) return;

    missile.smokeCooldown = ROCKET_SMOKE_EMIT_INTERVAL;
    const rearX = missile.x - Math.cos(missile.angle) * ROCKET_WIDTH * 0.45;
    const rearY = missile.y - Math.sin(missile.angle) * ROCKET_WIDTH * 0.45;
    this.smokeParticles.push({
      x: rearX + (Math.random() - 0.5) * 5,
      y: rearY + (Math.random() - 0.5) * 5,
      vx: -Math.cos(missile.angle) * 28 + (Math.random() - 0.5) * 20,
      vy: -Math.sin(missile.angle) * 28 + (Math.random() - 0.5) * 20,
      radius: 5 + Math.random() * 4,
      growth: 12 + Math.random() * 10,
      age: 0,
      duration: ROCKET_SMOKE_DURATION,
    });

    if (this.smokeParticles.length > ROCKET_SMOKE_MAX_PARTICLES) {
      this.smokeParticles.splice(0, this.smokeParticles.length - ROCKET_SMOKE_MAX_PARTICLES);
    }
  },

  updateSmoke(deltaSeconds) {
    for (let index = this.smokeParticles.length - 1; index >= 0; index -= 1) {
      const smoke = this.smokeParticles[index];
      smoke.age += deltaSeconds;
      smoke.x += smoke.vx * deltaSeconds;
      smoke.y += smoke.vy * deltaSeconds;
      smoke.radius += smoke.growth * deltaSeconds;
      smoke.vx *= 0.98;
      smoke.vy *= 0.98;

      if (smoke.age >= smoke.duration) this.smokeParticles.splice(index, 1);
    }
  },

  hasMissileLeftScreen(missile) {
    return (
      missile.x < 0 ||
      missile.x > LOGICAL_WIDTH ||
      missile.y < 0 ||
      missile.y > LOGICAL_HEIGHT
    );
  },

  getClampedScreenPoint(point) {
    return {
      x: Math.max(ROCKET_EXPLOSION_RADIUS * 0.35, Math.min(LOGICAL_WIDTH - ROCKET_EXPLOSION_RADIUS * 0.35, point.x)),
      y: Math.max(ROCKET_EXPLOSION_RADIUS * 0.35, Math.min(LOGICAL_HEIGHT - ROCKET_EXPLOSION_RADIUS * 0.35, point.y)),
    };
  },

  clear() {
    this.unlocked = false;
    this.missileCount = 0;
    this.missileDamage = 0;
    this.cooldownDuration = ROCKET_COOLDOWN;
    this.cooldown = 0;
    this.launchInterval = 0;
    this.pendingLaunches = [];
    this.missiles = [];
    this.smokeParticles = [];
    this.nextId = 1;
  },
};

const enemyLaserManager = {
  lasers: [],
  nextId: 1,
  lastShot: null,

  update(deltaSeconds) {
    enemyManager.enemies.forEach((enemy) => this.updateEnemyFire(enemy, deltaSeconds));
    this.lasers.forEach((laser) => {
      laser.x += laser.vx * deltaSeconds;
      laser.y += laser.vy * deltaSeconds;
    });
    this.resolveLasers();
  },

  updateEnemyFire(enemy, deltaSeconds) {
    const laserConfig = getCurrentEnemyLaserConfig();
    enemy.laserCooldown -= deltaSeconds;

    if (enemy.laserCooldown > 0) return;

    this.createLaser(enemy, laserConfig);
    enemy.laserCooldown += laserConfig.fireInterval;
  },

  createLaser(source, laserConfig, options = {}) {
    const originX = options.originX ?? source.x;
    const originY = options.originY ?? source.y;
    let theta = options.theta;

    if (theta === undefined) {
      const tankCenter = getTankCenter();
      const dx = tankCenter.x - originX;
      const dy = tankCenter.y - originY;
      theta = Math.atan2(dy, dx);
    }

    const vx = laserConfig.speed * Math.cos(theta);
    const vy = laserConfig.speed * Math.sin(theta);
    const laser = {
      id: this.nextId,
      x: originX,
      y: originY,
      theta,
      vx,
      vy,
      damage: laserConfig.damage,
      length: laserConfig.length ?? ENEMY_LASER_LENGTH,
      lineWidth: laserConfig.lineWidth ?? ENEMY_LASER_LINE_WIDTH,
      type: laserConfig.type ?? "normal",
      colors: laserConfig.colors,
    };

    this.lasers.push(laser);
    this.lastShot = { theta, vx, vy, type: laser.type };
    if (options.onShot) options.onShot({ theta, vx, vy, originX, originY });
    this.nextId += 1;
    return laser;
  },

  resolveLasers() {
    for (let index = this.lasers.length - 1; index >= 0; index -= 1) {
      const laser = this.lasers[index];
      const tankImpact = getLaserTankImpactPoint(laser);

      if (tankImpact) {
        damageTank(laser.damage);
        if (isGameplayActive()) {
          laserTankImpactManager.createImpact(tankImpact.x, tankImpact.y);
        }
        this.lasers.splice(index, 1);
        if (!isGameplayActive()) return;
        continue;
      }

      const groundImpact = getLaserGroundImpactPoint(laser);
      if (groundImpact) {
        groundLaserImpactFlashManager.createImpact(groundImpact.x, debug.groundY, laser.type);
        explosionManager.createExplosion(groundImpact.x, debug.groundY, getGroundExplosionConfig());
        this.lasers.splice(index, 1);
        continue;
      }

      if (hasLaserExited(laser)) {
        this.lasers.splice(index, 1);
      }
    }
  },

  clear() {
    this.lasers = [];
    this.nextId = 1;
    this.lastShot = null;
  },
};

const explosionManager = {
  explosions: [],
  nextId: 1,

  createExplosion(x, y, config = getEnemyExplosionConfig()) {
    const sprite = document.createElement("img");
    const explosionId = this.nextId;
    const explosion = {
      id: explosionId,
      sprite,
      x,
      y,
      width: config.width,
      height: config.height,
      offsetX: config.offsetX,
      offsetY: config.offsetY,
      remainingTime: config.duration,
      onComplete: config.onComplete,
    };

    sprite.className = "game-sprite";
    sprite.src = config.restartOnCreate ? `${config.asset}?restart=${explosionId}-${performance.now()}` : config.asset;
    sprite.alt = "Explosion";
    stage.appendChild(sprite);

    this.explosions.push(explosion);
    this.nextId += 1;
  },

  update(deltaSeconds) {
    for (let index = this.explosions.length - 1; index >= 0; index -= 1) {
      const explosion = this.explosions[index];
      explosion.remainingTime -= deltaSeconds;
      if (explosion.remainingTime > 0) continue;

      const onComplete = explosion.onComplete;
      explosion.sprite.remove();
      this.explosions.splice(index, 1);
      if (onComplete) onComplete();
    }
  },

  clear() {
    this.explosions.forEach((explosion) => {
      explosion.sprite.remove();
    });
    this.explosions = [];
    this.nextId = 1;
  },
};

function getEnemyExplosionConfig() {
  return {
    asset: EXPLOSION_ASSET,
    duration: EXPLOSION_DURATION,
    width: EXPLOSION_WIDTH,
    height: EXPLOSION_HEIGHT,
    offsetX: -EXPLOSION_WIDTH / 2,
    offsetY: -EXPLOSION_HEIGHT / 2,
  };
}

function getGroundExplosionConfig() {
  return {
    asset: GROUND_EXPLOSION_ASSET,
    duration: GROUND_EXPLOSION_DURATION,
    width: GROUND_EXPLOSION_WIDTH,
    height: GROUND_EXPLOSION_HEIGHT,
    offsetX: -GROUND_EXPLOSION_WIDTH / 2,
    offsetY: -170,
    restartOnCreate: true,
  };
}

function getTankDeathExplosionConfig(onComplete) {
  return {
    asset: TANK_DEATH_EXPLOSION_ASSET,
    duration: TANK_DEATH_EXPLOSION_DURATION,
    width: TANK_DEATH_EXPLOSION_WIDTH,
    height: TANK_DEATH_EXPLOSION_HEIGHT,
    offsetX: -TANK_DEATH_EXPLOSION_WIDTH / 2,
    offsetY: tank.height / 2 - TANK_DEATH_EXPLOSION_VISUAL_BOTTOM,
    onComplete,
  };
}

function getBossDeathExplosionConfig(onComplete) {
  const config = getCurrentBossConfig().deathExplosion;
  return {
    asset: config.asset,
    duration: config.duration,
    width: config.width,
    height: config.height,
    offsetX: -config.width / 2,
    offsetY: -config.height / 2,
    onComplete,
  };
}

const laserTankImpactManager = {
  impacts: [],
  nextId: 1,

  createImpact(x, y) {
    this.impacts.push({
      id: this.nextId,
      x,
      y,
      duration: LASER_TANK_IMPACT_DURATION,
      remainingTime: LASER_TANK_IMPACT_DURATION,
    });
    this.nextId += 1;
  },

  update(deltaSeconds) {
    for (let index = this.impacts.length - 1; index >= 0; index -= 1) {
      const impact = this.impacts[index];
      impact.remainingTime -= deltaSeconds;
      if (impact.remainingTime > 0) continue;

      this.impacts.splice(index, 1);
    }
  },

  clear() {
    this.impacts = [];
    this.nextId = 1;
  },
};

const projectileImpactManager = {
  impacts: [],
  nextId: 1,

  createImpact(x, y, radius = BOSS_PROJECTILE_IMPACT_RADIUS) {
    this.impacts.push({
      id: this.nextId,
      x,
      y,
      radius,
      duration: PROJECTILE_IMPACT_DURATION,
      remainingTime: PROJECTILE_IMPACT_DURATION,
    });
    this.nextId += 1;
  },

  update(deltaSeconds) {
    for (let index = this.impacts.length - 1; index >= 0; index -= 1) {
      const impact = this.impacts[index];
      impact.remainingTime -= deltaSeconds;
      if (impact.remainingTime > 0) continue;

      this.impacts.splice(index, 1);
    }
  },

  clear() {
    this.impacts = [];
    this.nextId = 1;
  },
};

const rocketExplosionManager = {
  explosions: [],
  nextId: 1,

  createExplosion(x, y) {
    const particles = [];
    for (let index = 0; index < ROCKET_EXPLOSION_PARTICLES; index += 1) {
      const angle = Math.random() * 2 * Math.PI;
      const speed = 85 + Math.random() * 155;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2.5 + Math.random() * 4.5,
        colorMix: Math.random(),
      });
    }

    this.explosions.push({
      id: this.nextId,
      x,
      y,
      duration: ROCKET_EXPLOSION_DURATION,
      remainingTime: ROCKET_EXPLOSION_DURATION,
      radius: ROCKET_EXPLOSION_RADIUS,
      particles,
    });
    this.nextId += 1;
  },

  update(deltaSeconds) {
    for (let index = this.explosions.length - 1; index >= 0; index -= 1) {
      const explosion = this.explosions[index];
      explosion.remainingTime -= deltaSeconds;

      explosion.particles.forEach((particle) => {
        particle.x += particle.vx * deltaSeconds;
        particle.y += particle.vy * deltaSeconds;
        particle.vx *= 0.91;
        particle.vy *= 0.91;
      });

      if (explosion.remainingTime > 0) continue;
      this.explosions.splice(index, 1);
    }
  },

  clear() {
    this.explosions = [];
    this.nextId = 1;
  },
};

const groundLaserImpactFlashManager = {
  impacts: [],
  nextId: 1,

  createImpact(x, y, laserType) {
    this.impacts.push({
      id: this.nextId,
      x,
      y,
      laserType,
      duration: GROUND_LASER_IMPACT_FLASH_DURATION,
      remainingTime: GROUND_LASER_IMPACT_FLASH_DURATION,
    });
    this.nextId += 1;
  },

  update(deltaSeconds) {
    for (let index = this.impacts.length - 1; index >= 0; index -= 1) {
      const impact = this.impacts[index];
      impact.remainingTime -= deltaSeconds;
      if (impact.remainingTime > 0) continue;

      this.impacts.splice(index, 1);
    }
  },

  clear() {
    this.impacts = [];
    this.nextId = 1;
  },
};

const enemyDeathVisualManager = {
  visuals: [],

  keepSpriteTemporarily(enemy) {
    this.visuals.push({
      sprite: enemy.sprite,
      x: enemy.x,
      y: enemy.y,
      width: enemy.width,
      height: enemy.height,
      remainingTime: ENEMY_DEATH_VISUAL_DELAY,
    });
  },

  update(deltaSeconds) {
    for (let index = this.visuals.length - 1; index >= 0; index -= 1) {
      const visual = this.visuals[index];
      visual.remainingTime -= deltaSeconds;
      if (visual.remainingTime > 0) continue;

      visual.sprite.remove();
      this.visuals.splice(index, 1);
    }
  },

  clear() {
    this.visuals.forEach((visual) => {
      visual.sprite.remove();
    });
    this.visuals = [];
  },
};

const powerUpManager = {
  heavyMachineGun: {
    generated: false,
    collected: false,
    active: null,
  },
  rocketLauncher: {
    generated: false,
    collected: false,
    active: null,
  },
  cadenceCore: {
    generated: false,
    collected: false,
    active: null,
  },
  rocketUpgrade: {
    generated: false,
    collected: false,
    active: null,
  },

  update(deltaSeconds) {
    this.trySpawnHeavyMachineGun();
    this.trySpawnRocketLauncher();
    this.trySpawnCadenceCore();
    this.trySpawnRocketUpgrade();
    this.updateHeavyMachineGun(deltaSeconds);
    this.updateRocketLauncher(deltaSeconds);
    this.updateCadenceCore(deltaSeconds);
    this.updateRocketUpgrade(deltaSeconds);
  },

  trySpawnHeavyMachineGun() {
    const state = this.heavyMachineGun;
    const config = getCurrentHeavyMachineGunConfig();

    if (state.generated || !config) return;
    if (gameState.normalEnemiesDestroyed < config.normalKillTrigger) return;

    this.createHeavyMachineGun(config);
  },

  createHeavyMachineGun(config) {
    const sprite = document.createElement("img");
    const powerUp = {
      sprite,
      x: config.spawnX,
      y: config.spawnY,
      width: config.width,
      height: config.height,
      fallSpeed: config.fallSpeed,
      groundAvailableTime: config.groundAvailableTime,
      grounded: false,
    };

    sprite.className = "game-sprite";
    sprite.src = config.asset;
    sprite.alt = "Heavy Machine Gun";
    stage.appendChild(sprite);

    this.heavyMachineGun.generated = true;
    this.heavyMachineGun.active = powerUp;
  },

  updateHeavyMachineGun(deltaSeconds) {
    const powerUp = this.heavyMachineGun.active;
    if (!powerUp) return;

    if (!powerUp.grounded) {
      powerUp.y += powerUp.fallSpeed * deltaSeconds;
      const groundY = getTankGroundY() - powerUp.height / 2;
      if (powerUp.y >= groundY) {
        powerUp.y = groundY;
        powerUp.grounded = true;
      }
    } else {
      powerUp.groundAvailableTime -= deltaSeconds;
      if (powerUp.groundAvailableTime <= 0) {
        this.removeHeavyMachineGun();
        return;
      }
    }

    if (isPowerUpCollidingWithTank(powerUp)) {
      this.collectHeavyMachineGun();
    }
  },

  collectHeavyMachineGun() {
    const config = getCurrentHeavyMachineGunConfig();
    weapon.level = Math.max(weapon.level, config.weaponLevel);
    this.heavyMachineGun.collected = true;
    this.removeHeavyMachineGun();
  },

  removeHeavyMachineGun() {
    const powerUp = this.heavyMachineGun.active;
    if (!powerUp) return;

    powerUp.sprite.remove();
    this.heavyMachineGun.active = null;
  },

  trySpawnRocketLauncher() {
    const state = this.rocketLauncher;
    const config = getCurrentRocketLauncherConfig();

    if (state.generated || !config?.enabled) return;
    if (gameState.normalEnemiesDestroyed < config.normalKillTrigger) return;

    this.createRocketLauncher(config);
  },

  createRocketLauncher(config) {
    const sprite = document.createElement("img");
    const powerUp = {
      sprite,
      x: config.spawnX,
      y: config.spawnY,
      width: config.width,
      height: config.height,
      fallSpeed: config.fallSpeed,
      groundAvailableTime: config.groundAvailableTime,
      grounded: false,
    };

    sprite.className = "game-sprite";
    sprite.src = config.asset;
    sprite.alt = "Rocket Launcher";
    stage.appendChild(sprite);

    this.rocketLauncher.generated = true;
    this.rocketLauncher.active = powerUp;
  },

  updateRocketLauncher(deltaSeconds) {
    const powerUp = this.rocketLauncher.active;
    if (!powerUp) return;

    if (!powerUp.grounded) {
      powerUp.y += powerUp.fallSpeed * deltaSeconds;
      const groundY = getTankGroundY() - powerUp.height / 2;
      if (powerUp.y >= groundY) {
        powerUp.y = groundY;
        powerUp.grounded = true;
      }
    } else {
      powerUp.groundAvailableTime -= deltaSeconds;
      if (powerUp.groundAvailableTime <= 0) {
        this.removeRocketLauncher();
        return;
      }
    }

    if (isPowerUpCollidingWithTank(powerUp)) {
      this.collectRocketLauncher();
    }
  },

  collectRocketLauncher() {
    const config = getCurrentRocketLauncherConfig();
    this.rocketLauncher.collected = true;
    rocketManager.unlock(config);
    this.removeRocketLauncher();
  },

  removeRocketLauncher() {
    const powerUp = this.rocketLauncher.active;
    if (!powerUp) return;

    powerUp.sprite.remove();
    this.rocketLauncher.active = null;
  },

  trySpawnCadenceCore() {
    const state = this.cadenceCore;
    const config = getCurrentCadenceCoreConfig();

    if (state.generated || !config?.enabled) return;
    if (gameState.normalEnemiesDestroyed < config.normalKillTrigger) return;

    this.cadenceCore.generated = true;
    this.cadenceCore.active = this.createCanvasPowerUp(config, "cadenceCore");
  },

  updateCadenceCore(deltaSeconds) {
    const powerUp = this.cadenceCore.active;
    if (!powerUp) return;

    this.updateCanvasPowerUp(powerUp, deltaSeconds, () => this.removeCadenceCore());
    if (isPowerUpCollidingWithTank(powerUp)) this.collectCadenceCore();
  },

  collectCadenceCore() {
    const config = getCurrentCadenceCoreConfig();
    if (config?.fireInterval) weapon.fireInterval = config.fireInterval;
    this.cadenceCore.collected = true;
    this.removeCadenceCore();
  },

  removeCadenceCore() {
    this.cadenceCore.active = null;
  },

  trySpawnRocketUpgrade() {
    const state = this.rocketUpgrade;
    const config = getCurrentRocketUpgradeConfig();

    if (state.generated || !config?.enabled) return;
    if (gameState.normalEnemiesDestroyed < config.normalKillTrigger) return;

    this.rocketUpgrade.generated = true;
    this.rocketUpgrade.active = this.createImagePowerUp(config, "Rocket Launcher x2");
  },

  updateRocketUpgrade(deltaSeconds) {
    const powerUp = this.rocketUpgrade.active;
    if (!powerUp) return;

    this.updateCanvasPowerUp(powerUp, deltaSeconds, () => this.removeRocketUpgrade());
    if (isPowerUpCollidingWithTank(powerUp)) this.collectRocketUpgrade();
  },

  collectRocketUpgrade() {
    const config = getCurrentRocketUpgradeConfig();
    this.rocketUpgrade.collected = true;
    rocketManager.unlock(config);
    this.removeRocketUpgrade();
  },

  removeRocketUpgrade() {
    if (this.rocketUpgrade.active?.sprite) this.rocketUpgrade.active.sprite.remove();
    this.rocketUpgrade.active = null;
  },

  createImagePowerUp(config, alt) {
    const sprite = document.createElement("img");
    const powerUp = {
      sprite,
      x: config.spawnX,
      y: config.spawnY,
      width: config.width,
      height: config.height,
      fallSpeed: config.fallSpeed,
      groundAvailableTime: config.groundAvailableTime,
      grounded: false,
    };

    sprite.className = "game-sprite";
    sprite.src = config.asset;
    sprite.alt = alt;
    stage.appendChild(sprite);

    return powerUp;
  },

  createCanvasPowerUp(config, type) {
    return {
      type,
      x: config.spawnX,
      y: config.spawnY,
      width: config.width,
      height: config.height,
      fallSpeed: config.fallSpeed,
      groundAvailableTime: config.groundAvailableTime,
      grounded: false,
      pulseTime: 0,
    };
  },

  updateCanvasPowerUp(powerUp, deltaSeconds, onExpired) {
    powerUp.pulseTime += deltaSeconds;

    if (!powerUp.grounded) {
      powerUp.y += powerUp.fallSpeed * deltaSeconds;
      const groundY = getTankGroundY() - powerUp.height / 2;
      if (powerUp.y >= groundY) {
        powerUp.y = groundY;
        powerUp.grounded = true;
      }
      return;
    }

    powerUp.groundAvailableTime -= deltaSeconds;
    if (powerUp.groundAvailableTime <= 0) onExpired();
  },

  clear() {
    this.removeHeavyMachineGun();
    this.heavyMachineGun.generated = false;
    this.heavyMachineGun.collected = false;
    this.removeRocketLauncher();
    this.rocketLauncher.generated = false;
    this.rocketLauncher.collected = false;
    this.removeCadenceCore();
    this.cadenceCore.generated = false;
    this.cadenceCore.collected = false;
    this.removeRocketUpgrade();
    this.rocketUpgrade.generated = false;
    this.rocketUpgrade.collected = false;
  },
};

const healthDropManager = {
  drops: [],
  nextId: 1,

  tryCreateFromEnemyDeath(enemy) {
    const config = getCurrentHealthDropConfig();
    if (!config) return;
    if (Math.random() >= config.dropChance) return;

    this.createDrop(enemy.x, enemy.y, config);
  },

  createDrop(x, y, config) {
    this.drops.push({
      id: this.nextId,
      x,
      y,
      width: config.width,
      height: config.height,
      healAmount: config.healAmount,
      fallSpeed: config.fallSpeed,
      groundAvailableTime: config.groundAvailableTime,
      pulseScale: config.pulseScale,
      pulseSpeed: config.pulseSpeed,
      pulseTime: 0,
      grounded: false,
    });
    this.nextId += 1;
  },

  update(deltaSeconds) {
    for (let index = this.drops.length - 1; index >= 0; index -= 1) {
      const drop = this.drops[index];
      drop.pulseTime += deltaSeconds;

      if (!drop.grounded) {
        drop.y += drop.fallSpeed * deltaSeconds;
        const groundY = debug.groundY - drop.height / 2;
        if (drop.y >= groundY) {
          drop.y = groundY;
          drop.grounded = true;
        }
      } else {
        drop.groundAvailableTime -= deltaSeconds;
        if (drop.groundAvailableTime <= 0) {
          this.removeDropAt(index);
          continue;
        }
      }

      if (isHealthDropCollidingWithTank(drop)) {
        healTank(drop.healAmount ?? getCurrentHealthDropConfig().healAmount);
        this.removeDropAt(index);
      }
    }
  },

  removeDropAt(index) {
    this.drops.splice(index, 1);
  },

  clear() {
    this.drops = [];
    this.nextId = 1;
  },
};

const enemySprites = {
  large: {
    label: "Nave grande",
    asset: "assets/gif/nave2.gif",
    width: 95,
    height: 95,
  },
  small: {
    label: "Nave pequena",
    asset: "assets/gif/nave2.2.gif",
    width: 55,
    height: 33,
  },
};

const enemyFunctionTypes = {
  sin: {
    label: "seno",
    color: "#ff7a7a",
    trajectoryType: "sin",
    direction: 1,
  },
  cos: {
    label: "coseno",
    color: "#80d7ff",
    trajectoryType: "cos",
    direction: -1,
  },
};

const enemyVariants = [
  { spriteKey: "large", functionKey: "sin" },
  { spriteKey: "small", functionKey: "cos" },
  { spriteKey: "large", functionKey: "cos" },
  { spriteKey: "small", functionKey: "sin" },
];

function buildEnemyConfig(spriteKey, functionKey) {
  const spriteConfig = enemySprites[spriteKey];
  const functionConfig = enemyFunctionTypes[functionKey];

  return {
    typeKey: `${spriteKey}-${functionKey}`,
    label: `${spriteConfig.label} ${functionConfig.label}`,
    asset: spriteConfig.asset,
    width: spriteConfig.width,
    height: spriteConfig.height,
    speed: ENEMY_SPEED,
    direction: functionConfig.direction,
    color: functionConfig.color,
    trajectory: {
      type: functionConfig.trajectoryType,
    },
  };
}

const enemyManager = {
  enemies: [],
  nextId: 1,
  nextLaneIndex: 0,
  nextVariantIndex: 0,
  nextTrajectoryVariantIndex: 0,
  spawnTimer: 0,

  update(deltaSeconds) {
    const stageConfig = getCurrentStageConfig();

    if (stageConfig.spawnsNormalEnemies) {
      this.spawnTimer -= deltaSeconds;
      while (this.enemies.length < stageConfig.maxNormalEnemies && this.spawnTimer <= 0) {
        this.createEnemy();
        this.spawnTimer += stageConfig.spawnInterval;
      }
    }

    this.enemies.forEach((enemy) => updateEnemy(enemy, deltaSeconds));
  },

  createEnemy() {
    const variant = this.getNextVariant();
    const typeConfig = buildEnemyConfig(variant.spriteKey, variant.functionKey);
    const midline = this.getNextLane();
    const maxHp = getCurrentEnemyHp();
    const trajectoryConfig = this.getNextTrajectoryConfig();
    const laserCooldown = getInitialEnemyLaserCooldown(this.nextId);
    const sprite = document.createElement("img");
    const enemy = {
      id: this.nextId,
      typeKey: typeConfig.typeKey,
      label: `${typeConfig.label} ${this.nextId}`,
      asset: typeConfig.asset,
      sprite,
      x: getEnemySpawnX(typeConfig),
      y: 0,
      width: typeConfig.width,
      height: typeConfig.height,
      speed: typeConfig.speed,
      direction: typeConfig.direction,
      color: typeConfig.color,
      maxHp,
      hp: maxHp,
      scoreAwarded: false,
      hasEnteredCombat: false,
      laserCooldown,
      midline,
      trajectory: {
        ...typeConfig.trajectory,
        type: trajectoryConfig.type ?? typeConfig.trajectory.type,
        amplitude: trajectoryConfig.amplitude,
        period: trajectoryConfig.period,
        phase: trajectoryConfig.phase ?? 0,
        midline,
      },
    };

    enemy.y = calculateTrajectoryY(enemy, enemy.x);
    sprite.className = "game-sprite";
    sprite.src = enemy.asset;
    sprite.alt = enemy.label;
    stage.appendChild(sprite);

    this.enemies.push(enemy);
    this.nextId += 1;
  },

  getNextVariant() {
    const variant = enemyVariants[this.nextVariantIndex];
    this.nextVariantIndex = (this.nextVariantIndex + 1) % enemyVariants.length;
    return variant;
  },

  getNextLane() {
    const lanes = getCurrentNormalEnemyLanes();
    const midline = lanes[this.nextLaneIndex];
    this.nextLaneIndex = (this.nextLaneIndex + 1) % lanes.length;
    return midline;
  },

  getNextTrajectoryConfig() {
    const variants = getCurrentStageNormalTrajectoryVariants();
    if (!variants.length) return getCurrentNormalEnemyTrajectoryConfig();

    const trajectoryConfig = variants[this.nextTrajectoryVariantIndex];
    this.nextTrajectoryVariantIndex = (this.nextTrajectoryVariantIndex + 1) % variants.length;
    return trajectoryConfig;
  },

  removeEnemy(enemyToRemove, { keepSprite = false } = {}) {
    this.enemies = this.enemies.filter((enemy) => {
      if (enemy !== enemyToRemove) return true;
      if (!keepSprite) enemy.sprite.remove();
      return false;
    });
  },

  clearNormalEnemies() {
    this.enemies.forEach((enemy) => {
      enemy.sprite.remove();
    });
    this.enemies = [];
  },

  reset() {
    this.clearNormalEnemies();
    this.nextId = 1;
    this.nextLaneIndex = 0;
    this.nextVariantIndex = 0;
    this.nextTrajectoryVariantIndex = 0;
    this.spawnTimer = 0;
  },
};

const bossManager = {
  boss: null,
  created: false,
  defeated: false,
  lastShot: null,
  attackCounter: 0,

  tryCreateBoss() {
    if (this.created || this.defeated) return;
    if (gameState.stage !== STAGES.BOSS) return;
    if (enemyManager.enemies.length > 0) return;

    const config = getCurrentBossConfig();
    const sprite = document.createElement("img");
    const boss = {
      id: 1,
      label: config.label,
      sprite,
      x: getBossSpawnX(config),
      y: 0,
      width: config.width,
      height: config.height,
      offsetX: -config.width / 2 + config.visualOffsetX,
      offsetY: -config.height / 2 + config.visualOffsetY,
      speed: config.speed,
      direction: config.initialDirection,
      maxHp: config.maxHp,
      hp: config.maxHp,
      hasEnteredCombat: false,
      deathProcessed: false,
      laserCooldown: config.laser.fireInterval * 0.55,
      specialAttackCooldown: config.specialAttack?.interval ?? null,
      specialTelegraphRemaining: 0,
      specialTelegraphDuration: config.specialAttack?.telegraphDuration ?? 0,
      spectralAttack: null,
      healthDropReleased: false,
      playerLowHealthDropReleased: false,
      playerHealthDropsReleased: (config.playerHealthDrops ?? []).map(() => false),
      trajectory: { ...config.trajectory },
      projectileHitbox: { ...config.projectileHitbox },
    };

    boss.y = calculateTrajectoryY(boss, boss.x);
    sprite.className = "game-sprite";
    sprite.src = config.asset;
    sprite.alt = config.label;
    stage.appendChild(sprite);

    this.boss = boss;
    this.created = true;
    this.defeated = false;
    this.lastShot = null;
    this.attackCounter = 0;
    musicManager.playStage(STAGES.BOSS);
  },

  update(deltaSeconds) {
    this.tryCreateBoss();
    const boss = this.boss;
    if (!boss || this.defeated) return;

    updateBoss(boss, deltaSeconds);
    this.updateBossSpecialAttack(boss, deltaSeconds);
    this.updateBossFire(boss, deltaSeconds);
  },

  updateBossSpecialAttack(boss, deltaSeconds) {
    if (!boss.hasEnteredCombat) return;

    const config = getCurrentBossConfig();
    const specialConfig = config.specialAttack;
    if (!specialConfig) return;
    if (specialConfig.type === "spectralLine") {
      this.updateBossSpectralAttack(boss, config, specialConfig, deltaSeconds);
      return;
    }

    if (boss.specialTelegraphRemaining > 0) {
      boss.specialTelegraphRemaining = Math.max(0, boss.specialTelegraphRemaining - deltaSeconds);
      if (boss.specialTelegraphRemaining <= 0) {
        this.fireBossFanAttack(boss, config, specialConfig);
        boss.specialAttackCooldown = specialConfig.interval;
      }
      return;
    }

    boss.specialAttackCooldown -= deltaSeconds;
    if (boss.specialAttackCooldown > 0) return;

    boss.specialTelegraphDuration = specialConfig.telegraphDuration;
    boss.specialTelegraphRemaining = specialConfig.telegraphDuration;
  },

  updateBossSpectralAttack(boss, config, specialConfig, deltaSeconds) {
    this.updateSpectralBalls(boss, deltaSeconds);

    if (boss.spectralAttack) {
      this.updateSpectralLinePositions(boss, specialConfig, deltaSeconds);
      return;
    }

    boss.specialAttackCooldown -= deltaSeconds;
    if (boss.specialAttackCooldown > 0) return;

    this.startBossSpectralAttack(boss, config, specialConfig);
  },

  startBossSpectralAttack(boss, config, specialConfig) {
    boss.specialTelegraphDuration = specialConfig.telegraphDuration;
    boss.specialTelegraphRemaining = specialConfig.telegraphDuration;
    boss.spectralAttack = {
      state: "forming",
      formTime: 0,
      shotCooldown: 0,
      nextShotIndex: 0,
      balls: Array.from({ length: specialConfig.projectileCount }, (_, index) => ({
        id: index + 1,
        state: "forming",
        x: boss.x,
        y: boss.y,
        vx: 0,
        vy: 0,
        radius: 20,
        damage: specialConfig.damage ?? config.laser.damage,
        targetX: null,
        trail: [],
      })),
    };
  },

  updateSpectralLinePositions(boss, specialConfig, deltaSeconds) {
    const attack = boss.spectralAttack;
    if (!attack) return;

    if (attack.state === "forming") {
      attack.formTime = Math.min(specialConfig.telegraphDuration, attack.formTime + deltaSeconds);
      boss.specialTelegraphRemaining = Math.max(0, specialConfig.telegraphDuration - attack.formTime);
      const progress = specialConfig.telegraphDuration > 0 ? attack.formTime / specialConfig.telegraphDuration : 1;
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      this.positionPendingSpectralBalls(boss, specialConfig, easedProgress);

      if (progress >= 1) {
        attack.state = "firing";
        attack.shotCooldown = 0;
        boss.specialTelegraphRemaining = 0;
      }
      return;
    }

    this.positionPendingSpectralBalls(boss, specialConfig, 1);
    attack.shotCooldown -= deltaSeconds;
    if (attack.nextShotIndex < attack.balls.length && attack.shotCooldown <= 0) {
      this.fireNextSpectralBall(boss, specialConfig);
      attack.shotCooldown = specialConfig.shotInterval;
    }

    const hasPendingBalls = attack.balls.some((ball) => ball.state !== "expired");
    if (!hasPendingBalls) {
      boss.spectralAttack = null;
      boss.specialAttackCooldown = specialConfig.interval;
    }
  },

  positionPendingSpectralBalls(boss, specialConfig, progress) {
    const attack = boss.spectralAttack;
    if (!attack) return;

    const count = specialConfig.projectileCount;
    const startX = boss.x - specialConfig.lineWidth / 2;
    const spacing = count <= 1 ? 0 : specialConfig.lineWidth / (count - 1);
    const lineY = boss.y + specialConfig.lineOffsetY;

    attack.balls.forEach((ball, index) => {
      if (ball.state === "fired" || ball.state === "expired") return;

      const targetX = startX + spacing * index;
      ball.x = boss.x + (targetX - boss.x) * progress;
      ball.y = boss.y + (lineY - boss.y) * progress;
      ball.state = progress >= 1 ? "ready" : "forming";
    });
  },

  fireNextSpectralBall(boss, specialConfig) {
    const attack = boss.spectralAttack;
    if (!attack) return;

    const ball = attack.balls[attack.nextShotIndex];
    if (!ball) return;

    const targetX = tank.x + tank.width / 2;
    const targetY = tank.y + tank.height / 2;
    const theta = Math.atan2(targetY - ball.y, targetX - ball.x);
    ball.vx = Math.cos(theta) * specialConfig.speed;
    ball.vy = Math.sin(theta) * specialConfig.speed;
    ball.targetX = targetX;
    ball.state = "fired";
    attack.nextShotIndex += 1;

    this.lastShot = {
      attackNumber: this.attackCounter,
      attackType: "ESPECTRAL",
      shots: [{ theta, vx: ball.vx, vy: ball.vy }],
      theta,
      vx: ball.vx,
      vy: ball.vy,
    };
  },

  updateSpectralBalls(boss, deltaSeconds) {
    const attack = boss.spectralAttack;
    if (!attack) return;

    attack.balls.forEach((ball) => {
      if (ball.state !== "fired") return;

      ball.trail.push({ x: ball.x, y: ball.y });
      if (ball.trail.length > 16) ball.trail.shift();

      ball.x += ball.vx * deltaSeconds;
      ball.y += ball.vy * deltaSeconds;

      if (isSpectralBallCollidingWithTank(ball)) {
        ball.state = "expired";
        damageTank(ball.damage);
        return;
      }

      if (hasSpectralBallExited(ball)) {
        ball.state = "expired";
      }
    });
  },

  updateBossFire(boss, deltaSeconds) {
    if (!boss.hasEnteredCombat) return;

    const config = getCurrentBossConfig();
    boss.laserCooldown -= deltaSeconds;
    if (boss.laserCooldown > 0) return;

    this.fireBossAttack(boss, config);
    boss.laserCooldown += config.laser.fireInterval;
  },

  fireBossAttack(boss, config) {
    const attackNumber = this.attackCounter + 1;
    const laserCount = getBossAttackLaserCount(config, this.attackCounter);
    const attackType = laserCount === 2 ? "DOBLE" : "SIMPLE";
    const shots = laserCount === 2 ? this.fireDoubleBossAttack(boss, config) : [this.fireSimpleBossAttack(boss, config)];

    this.attackCounter += 1;
    this.lastShot = {
      attackNumber,
      attackType,
      shots,
      theta: shots[0].theta,
      vx: shots[0].vx,
      vy: shots[0].vy,
    };
  },

  fireSimpleBossAttack(boss, config) {
    return enemyLaserManager.createLaser(boss, config.laser, {
      originX: boss.x,
      originY: boss.y,
    });
  },

  fireDoubleBossAttack(boss, config) {
    const tankCenter = getTankCenter();
    const dx = tankCenter.x - boss.x;
    const dy = tankCenter.y - boss.y;
    const theta = Math.atan2(dy, dx);
    const spreadRadians = getBossDoubleSpreadRadians(config);
    const origins = getBossDoubleLaserOrigins(boss);

    return [
      enemyLaserManager.createLaser(boss, config.laser, {
        originX: origins[0].x,
        originY: origins[0].y,
        theta: theta - spreadRadians,
      }),
      enemyLaserManager.createLaser(boss, config.laser, {
        originX: origins[1].x,
        originY: origins[1].y,
        theta: theta + spreadRadians,
      }),
    ];
  },

  fireBossFanAttack(boss, config, specialConfig) {
    const shots = [];
    const projectileCount = specialConfig.projectileCount;
    const angleRange = specialConfig.endAngle - specialConfig.startAngle;

    for (let index = 0; index < projectileCount; index += 1) {
      const ratio = projectileCount === 1 ? 0.5 : index / (projectileCount - 1);
      const theta = specialConfig.startAngle + angleRange * ratio;
      shots.push(enemyLaserManager.createLaser(boss, config.laser, {
        originX: boss.x,
        originY: boss.y,
        theta,
      }));
    }

    this.lastShot = {
      attackNumber: this.attackCounter,
      attackType: "ABANICO",
      shots,
      theta: shots[0].theta,
      vx: shots[0].vx,
      vy: shots[0].vy,
    };
  },

  damageBoss(damage) {
    const boss = this.boss;
    if (!boss || this.defeated || boss.deathProcessed) return;

    boss.hp = Math.max(0, boss.hp - damage);
    this.tryReleaseBossHealthDrop(boss);
    if (boss.hp <= 0) this.defeatBoss();
  },

  tryReleaseBossHealthDrop(boss) {
    const config = getCurrentBossConfig();
    const hpRatioTrigger = config.healthDropOnHpRatio;
    const healthConfig = getCurrentHealthDropConfig();
    if (!hpRatioTrigger || !healthConfig || boss.healthDropReleased) return;
    if (boss.hp > boss.maxHp * hpRatioTrigger) return;

    boss.healthDropReleased = true;
    healthDropManager.createDrop(boss.x, boss.y, {
      ...healthConfig,
      healAmount: config.healthDropHealAmount ?? healthConfig.healAmount,
    });
  },

  tryReleasePlayerLowHealthDrop() {
    const boss = this.boss;
    if (!boss || this.defeated || boss.deathProcessed) return;

    const config = getCurrentBossConfig();
    const healthConfig = getCurrentHealthDropConfig();
    if (!healthConfig) return;

    if (config.playerHealthDrops?.length) {
      config.playerHealthDrops.forEach((dropConfig, index) => {
        if (boss.playerHealthDropsReleased[index]) return;
        if (tank.hp > tank.maxHp * dropConfig.hpRatio) return;

        boss.playerHealthDropsReleased[index] = true;
        healthDropManager.createDrop(tank.x + tank.width / 2, 80, {
          ...healthConfig,
          healAmount: dropConfig.healAmount ?? healthConfig.healAmount,
        });
      });
      return;
    }

    const hpRatioTrigger = config.playerHealthDropOnHpRatio;
    if (!hpRatioTrigger || !healthConfig || boss.playerLowHealthDropReleased) return;
    if (tank.hp > tank.maxHp * hpRatioTrigger) return;

    boss.playerLowHealthDropReleased = true;
    healthDropManager.createDrop(tank.x + tank.width / 2, 80, {
      ...healthConfig,
      healAmount: config.healthDropHealAmount ?? healthConfig.healAmount,
    });
  },

  defeatBoss() {
    const boss = this.boss;
    if (!boss || boss.deathProcessed) return;
    const onDeathComplete = isDebugRunActive() ? showDebugTerminalControls : showLevelComplete;

    boss.deathProcessed = true;
    this.defeated = true;
    this.created = true;
    this.lastShot = null;
    this.attackCounter = 0;
    gameState.status = GAME_STATES.BOSS_DEFEATED;
    clearInputState();
    enemyLaserManager.clear();
    explosionManager.createExplosion(boss.x, boss.y, getBossDeathExplosionConfig(onDeathComplete));
    boss.sprite.remove();
    this.boss = null;
  },

  clear() {
    if (this.boss) this.boss.sprite.remove();
    this.boss = null;
    this.created = false;
    this.defeated = false;
    this.lastShot = null;
    this.attackCounter = 0;
  },
};

function getEnemySpawnX(typeConfig) {
  if (typeConfig.direction > 0) return -typeConfig.width / 2;
  return LOGICAL_WIDTH + typeConfig.width / 2;
}

function getBossSpawnX(config) {
  if (config.initialDirection > 0) return -config.width / 2;
  return LOGICAL_WIDTH + config.width / 2;
}

function getCurrentEnemyHp() {
  return getCurrentLevelConfig().normalEnemy.hp;
}

function getCurrentLevelConfig() {
  return LEVEL_CONFIG[currentLevel];
}

function isPlayableLevelConfigured(level) {
  const config = LEVEL_CONFIG[level];
  return Boolean(config?.enabled && config?.start && config?.normalEnemy && config?.boss && config?.stages);
}

function getCurrentLevelStartConfig() {
  return getCurrentLevelConfig().start;
}

function getCurrentStageConfig() {
  return getCurrentLevelConfig().stages[gameState.stage];
}

function getCurrentNormalEnemyTrajectoryConfig() {
  return getCurrentLevelConfig().normalEnemy.trajectory;
}

function getCurrentStageNormalTrajectoryVariants() {
  return getCurrentStageConfig().normalTrajectoryVariants ?? [];
}

function getCurrentNormalEnemyLanes() {
  return getCurrentLevelConfig().normalEnemy.lanes;
}

function getCurrentEnemyLaserConfig() {
  return getCurrentLevelConfig().normalEnemy.laser;
}

function getCurrentBossConfig() {
  return getCurrentLevelConfig().boss;
}

function getBossAttackPattern(config = getCurrentBossConfig()) {
  return config.attackPattern;
}

function getBossAttackLaserCount(config = getCurrentBossConfig(), attackIndex = bossManager.attackCounter) {
  const pattern = getBossAttackPattern(config).sequence;
  return pattern[attackIndex % pattern.length];
}

function getBossNextAttackType() {
  return getBossAttackLaserCount() === 2 ? "DOBLE" : "SIMPLE";
}

function getBossDoubleSpreadRadians(config = getCurrentBossConfig()) {
  return getBossAttackPattern(config).doubleSpreadDegrees * Math.PI / 180;
}

function getBossDoubleLaserOrigins(boss) {
  return [
    { x: boss.x - boss.width / 6, y: boss.y },
    { x: boss.x + boss.width / 6, y: boss.y },
  ];
}

function getInitialEnemyLaserCooldown(enemyId) {
  const laserConfig = getCurrentEnemyLaserConfig();
  const spreadSlots = enemyVariants.length;
  return ((enemyId - 1) % spreadSlots) * (laserConfig.fireInterval / spreadSlots);
}

function getCurrentHeavyMachineGunConfig() {
  return getCurrentLevelConfig().powerUps?.heavyMachineGun ?? null;
}

function getCurrentRocketLauncherConfig() {
  return getCurrentLevelConfig().powerUps?.rocketLauncher ?? null;
}

function getCurrentCadenceCoreConfig() {
  return getCurrentLevelConfig().powerUps?.cadenceCore ?? null;
}

function getCurrentRocketUpgradeConfig() {
  return getCurrentLevelConfig().powerUps?.rocketUpgrade ?? null;
}

function getCurrentHealthDropConfig() {
  return getCurrentLevelConfig().drops?.health ?? null;
}

function positionSpriteFromTopLeft(sprite, entity) {
  const scale = stage.clientWidth / LOGICAL_WIDTH;
  sprite.style.left = `${entity.x * scale}px`;
  sprite.style.top = `${entity.y * scale}px`;
  sprite.style.width = `${entity.width * scale}px`;
  sprite.style.height = `${entity.height * scale}px`;
}

function positionSpriteFromCenter(sprite, entity) {
  const scale = stage.clientWidth / LOGICAL_WIDTH;
  sprite.style.left = `${(entity.x - entity.width / 2) * scale}px`;
  sprite.style.top = `${(entity.y - entity.height / 2) * scale}px`;
  sprite.style.width = `${entity.width * scale}px`;
  sprite.style.height = `${entity.height * scale}px`;
}

function positionSpriteFromAnchor(sprite, entity) {
  const scale = stage.clientWidth / LOGICAL_WIDTH;
  sprite.style.left = `${(entity.x + entity.offsetX) * scale}px`;
  sprite.style.top = `${(entity.y + entity.offsetY) * scale}px`;
  sprite.style.width = `${entity.width * scale}px`;
  sprite.style.height = `${entity.height * scale}px`;
}

function isGameplayActive() {
  return gameState.status === GAME_STATES.PLAYING && tank.alive;
}

function isDebugRunActive() {
  return debug.enabled || debug.presentationModeActive;
}

function clearInputState() {
  input.left = false;
  input.right = false;
  input.fire = false;
}

function beginTankDeath() {
  if (gameState.status !== GAME_STATES.PLAYING || !tank.alive) return;

  const tankCenter = getTankCenter();
  tank.alive = false;
  tank.visible = false;
  gameState.status = GAME_STATES.PLAYER_DYING;
  clearInputState();
  muzzleFlashes.length = 0;
  muzzleSmokeParticles.length = 0;
  tankDustManager.clear();
  const onDeathComplete = isDebugRunActive() ? showDebugTerminalControls : showGameOver;

  explosionManager.createExplosion(
    tankCenter.x,
    tankCenter.y,
    getTankDeathExplosionConfig(onDeathComplete),
  );
}

function showGameOver() {
  if (gameState.status !== GAME_STATES.PLAYER_DYING) return;
  if (isDebugRunActive()) {
    showDebugTerminalControls();
    return;
  }

  gameState.status = GAME_STATES.GAME_OVER;
  gameOverScore.textContent = `PUNTOS: ${gameState.score}`;
  gameOverLevel.textContent = `NIVEL ${currentLevel}`;
  checkpointButton.hidden = !canRestoreLevelCheckpoint();
  gameOverOverlay.hidden = false;
  musicManager.stop();
}

function hideGameOver() {
  gameOverOverlay.hidden = true;
  checkpointButton.hidden = true;
}

function showLevelComplete() {
  if (gameState.status !== GAME_STATES.BOSS_DEFEATED) return;
  if (isDebugRunActive()) {
    showDebugTerminalControls();
    return;
  }

  gameState.status = GAME_STATES.LEVEL_COMPLETE;
  levelCompleteTitle.textContent = `NIVEL ${currentLevel} SUPERADO`;
  levelCompleteScore.textContent = `PUNTOS: ${gameState.score}`;
  levelCompleteHp.textContent = `VIDA RESTANTE: ${tank.hp}/${tank.maxHp}`;
  levelCompleteOverlay.hidden = false;
  musicManager.stop();
}

function hideLevelComplete() {
  levelCompleteOverlay.hidden = true;
}

function showNextLevelPreview() {
  nextLevelPreviewTitle.textContent = `NIVEL ${currentLevel} - PR\u00d3XIMAMENTE`;
  nextLevelPreviewScore.textContent = `PUNTOS: ${gameState.score}`;
  nextLevelPreviewHp.textContent = `VIDA RESTANTE: ${tank.hp}/${tank.maxHp}`;
  nextLevelPreviewWeapon.textContent = `ARMA NIVEL ${weapon.level}`;
  nextLevelPreviewOverlay.hidden = false;
}

function hideNextLevelPreview() {
  nextLevelPreviewOverlay.hidden = true;
}

function showPauseMenu() {
  pauseOverlay.hidden = false;
}

function hidePauseMenu() {
  pauseOverlay.hidden = true;
}

function showMainMenu() {
  mainMenuOverlay.hidden = false;
}

function hideMainMenu() {
  mainMenuOverlay.hidden = true;
}

function hideAllOverlays() {
  hidePauseMenu();
  hideGameOver();
  hideLevelComplete();
  hideNextLevelPreview();
  hideMainMenu();
}

function resetCheckpointState() {
  checkpointState.active = false;
  checkpointState.level = null;
  checkpointState.normalEnemiesDestroyed = 0;
  checkpointState.score = 0;
  checkpointState.stage = STAGES.INICIO;
  checkpointState.weaponLevel = STARTING_WEAPON_LEVEL;
  checkpointState.weaponFireInterval = PROJECTILE_FIRE_INTERVAL;
}

function getLevelHeavyCheckpointKill(level = currentLevel) {
  const configuredCheckpoint = LEVEL_CONFIG[level]?.checkpoint?.normalKillTrigger;
  if (Number.isFinite(configuredCheckpoint)) return configuredCheckpoint;

  const heavyConfig = LEVEL_CONFIG[level]?.powerUps?.heavyMachineGun;
  if (!heavyConfig || !Number.isFinite(heavyConfig.normalKillTrigger)) return null;
  return Math.max(0, heavyConfig.normalKillTrigger - 1);
}

function getStageForNormalKillCount(level, normalEnemiesDestroyed) {
  const levelConfig = LEVEL_CONFIG[level];
  if (!levelConfig?.stages) return STAGES.INICIO;

  const nudoTarget = levelConfig.stages[STAGES.NUDO]?.normalKillTarget;
  const inicioTarget = levelConfig.stages[STAGES.INICIO]?.normalKillTarget;

  if (Number.isFinite(nudoTarget) && normalEnemiesDestroyed >= nudoTarget) return STAGES.BOSS;
  if (Number.isFinite(inicioTarget) && normalEnemiesDestroyed >= inicioTarget) return STAGES.NUDO;
  return levelConfig.start?.stage ?? STAGES.INICIO;
}

function trySaveLevelCheckpoint() {
  if (isDebugRunActive()) return;

  const checkpointKill = getLevelHeavyCheckpointKill();
  if (checkpointKill === null) return;
  if (gameState.normalEnemiesDestroyed !== checkpointKill) return;

  checkpointState.active = true;
  checkpointState.level = currentLevel;
  checkpointState.normalEnemiesDestroyed = checkpointKill;
  checkpointState.score = gameState.score;
  checkpointState.stage = getStageForNormalKillCount(currentLevel, checkpointKill);
  checkpointState.weaponLevel = weapon.level;
  checkpointState.weaponFireInterval = weapon.fireInterval;
}

function canRestoreLevelCheckpoint() {
  return (
    !isDebugRunActive() &&
    checkpointState.active &&
    checkpointState.level === currentLevel
  );
}

function restoreLevelCheckpoint() {
  if (!canRestoreLevelCheckpoint()) return false;

  const checkpoint = { ...checkpointState };
  cleanupCurrentAttempt();
  currentLevel = checkpoint.level;
  gameState.score = checkpoint.score;
  gameState.normalEnemiesDestroyed = checkpoint.normalEnemiesDestroyed;
  gameState.stage = checkpoint.stage;
  gameState.status = GAME_STATES.PLAYING;

  const startConfig = getCurrentLevelStartConfig();
  tank.x = startConfig.tankX;
  tank.y = startConfig.tankY;
  tank.hp = TANK_MAX_HP;
  tank.maxHp = TANK_MAX_HP;
  tank.alive = true;
  tank.visible = true;

  weapon.level = checkpoint.weaponLevel;
  weapon.fireInterval = checkpoint.weaponFireInterval;
  applyStartingRocketLauncherState();
  enemyManager.spawnTimer = 0;
  hideAllOverlays();
  musicManager.playStage(gameState.stage, { restart: true });
  return true;
}

function cleanupCurrentAttempt() {
  projectileManager.clear();
  rocketManager.clear();
  enemyLaserManager.clear();
  enemyManager.reset();
  bossManager.clear();
  explosionManager.clear();
  enemyDeathVisualManager.clear();
  laserTankImpactManager.clear();
  projectileImpactManager.clear();
  rocketExplosionManager.clear();
  groundLaserImpactFlashManager.clear();
  healthDropManager.clear();
  powerUpManager.clear();
  muzzleFlashes.length = 0;
  muzzleSmokeParticles.length = 0;
  tankDustManager.clear();
  clearInputState();
}

function cleanupCompletedLevel() {
  projectileManager.clear();
  rocketManager.clear();
  enemyLaserManager.clear();
  enemyManager.reset();
  bossManager.clear();
  explosionManager.clear();
  enemyDeathVisualManager.clear();
  laserTankImpactManager.clear();
  projectileImpactManager.clear();
  rocketExplosionManager.clear();
  groundLaserImpactFlashManager.clear();
  healthDropManager.clear();
  powerUpManager.clear();
  muzzleFlashes.length = 0;
  muzzleSmokeParticles.length = 0;
  tankDustManager.clear();
  clearInputState();
}

function cleanupForDebugPresentation() {
  cleanupCurrentAttempt();
  hideAllOverlays();
}

function pauseGame() {
  if (!isGameplayActive()) return;

  clearInputState();
  gameState.status = GAME_STATES.PAUSED;
  musicManager.pause();
  showPauseMenu();
}

function resumeGame() {
  if (gameState.status !== GAME_STATES.PAUSED) return;

  hidePauseMenu();
  gameState.status = GAME_STATES.PLAYING;
  musicManager.resume();
}

function togglePause() {
  if (gameState.status === GAME_STATES.PAUSED) {
    resumeGame();
    return;
  }

  pauseGame();
}

function resetCurrentLevelState({ resetScore = true } = {}) {
  const startConfig = getCurrentLevelStartConfig();

  if (resetScore) gameState.score = 0;
  gameState.normalEnemiesDestroyed = 0;
  gameState.stage = startConfig.stage;
  gameState.status = GAME_STATES.PLAYING;

  tank.x = startConfig.tankX;
  tank.y = startConfig.tankY;
  tank.hp = startConfig.tankHp;
  tank.maxHp = TANK_MAX_HP;
  tank.alive = true;
  tank.visible = true;

  weapon.level = startConfig.weaponLevel;
  weapon.fireInterval = startConfig.projectileFireInterval ?? PROJECTILE_FIRE_INTERVAL;
  applyStartingRocketLauncherState();
  enemyManager.spawnTimer = 0;
}

function applyStartingRocketLauncherState() {
  const startRocketConfig = getCurrentLevelStartConfig().rocketLauncher;
  if (!startRocketConfig?.enabled) return;

  rocketManager.unlock({
    enabled: true,
    rockets: startRocketConfig.rockets,
    rocketDamage: startRocketConfig.rocketDamage,
    cooldown: startRocketConfig.cooldown,
  });
}

function restartCurrentLevel() {
  cleanupCurrentAttempt();
  resetCheckpointState();
  debug.presentationModeActive = false;
  resetCurrentLevelState();
  trySaveLevelCheckpoint();
  hideAllOverlays();
  musicManager.playStage(gameState.stage, { restart: true });
}

function returnToMainMenu() {
  cleanupCurrentAttempt();
  resetCheckpointState();
  debug.presentationModeActive = false;
  currentLevel = 1;
  resetCurrentLevelState();
  gameState.status = GAME_STATES.MENU;
  hideAllOverlays();
  showMainMenu();
  musicManager.stop();
}

function goToNextLevelPreview() {
  if (gameState.status !== GAME_STATES.LEVEL_COMPLETE) return;

  cleanupCompletedLevel();
  resetCheckpointState();
  currentLevel += 1;
  gameState.stage = STAGES.INICIO;
  gameState.normalEnemiesDestroyed = 0;
  gameState.status = GAME_STATES.LEVEL_PREVIEW;
  tank.alive = true;
  tank.visible = true;
  hideLevelComplete();
  hideGameOver();
  hideMainMenu();
  showNextLevelPreview();
}

function startNextLevel() {
  if (gameState.status !== GAME_STATES.LEVEL_COMPLETE) return;

  const nextLevel = currentLevel + 1;
  if (!isPlayableLevelConfigured(nextLevel)) {
    goToNextLevelPreview();
    return;
  }

  cleanupCompletedLevel();
  resetCheckpointState();
  currentLevel = nextLevel;
  debug.presentationModeActive = false;
  resetCurrentLevelState({ resetScore: false });
  trySaveLevelCheckpoint();
  hideAllOverlays();
  musicManager.playStage(gameState.stage, { restart: true });
}

function getDebugPresentationStageConfig(stageName, level = currentLevel) {
  const configuredLevel = isPlayableLevelConfigured(level) ? level : 1;
  level = configuredLevel;
  const levelConfig = LEVEL_CONFIG[level];
  const debugConfig = DEBUG_PRESENTATION_CONFIG[level] ?? {};
  const inicioTarget = levelConfig.stages[STAGES.INICIO].normalKillTarget;
  const nudoTarget = levelConfig.stages[STAGES.NUDO].normalKillTarget;
  const killsByStage = {
    [STAGES.INICIO]: 0,
    [STAGES.NUDO]: inicioTarget,
    [STAGES.BOSS]: nudoTarget,
  };
  const normalEnemiesDestroyed = debugConfig.normalEnemiesDestroyedByStage?.[stageName] ?? killsByStage[stageName] ?? 0;

  return {
    level,
    stage: stageName,
    normalEnemiesDestroyed,
    score: normalEnemiesDestroyed * SCORE_CONFIG.normalEnemyDestroyed,
    weaponLevel: debugConfig.weaponLevelByStage?.[stageName] ?? levelConfig.start.weaponLevel,
    tankHp: levelConfig.start.tankHp,
  };
}

function applyDebugPresentationStage(stageName) {
  const level = Number(debugLevelSelect.value) || currentLevel;
  const config = getDebugPresentationStageConfig(stageName, level);

  cleanupForDebugPresentation();
  debug.presentationModeActive = true;
  currentLevel = config.level;
  gameState.stage = config.stage;
  gameState.normalEnemiesDestroyed = config.normalEnemiesDestroyed;
  gameState.score = config.score;
  gameState.status = GAME_STATES.PLAYING;

  tank.x = LEVEL_CONFIG[currentLevel].start.tankX;
  tank.y = LEVEL_CONFIG[currentLevel].start.tankY;
  tank.hp = config.tankHp;
  tank.maxHp = TANK_MAX_HP;
  tank.alive = true;
  tank.visible = true;

  weapon.level = config.weaponLevel;
  weapon.fireInterval = LEVEL_CONFIG[currentLevel].start.projectileFireInterval ?? PROJECTILE_FIRE_INTERVAL;
  applyStartingRocketLauncherState();
  enemyManager.spawnTimer = 0;
  configureDebugPresentationHeavyState(config);
  configureDebugPresentationRocketState(config);
  configureDebugPresentationCadenceState(config);
  configureDebugPresentationRocketUpgradeState(config);

  if (config.stage === STAGES.BOSS) {
    bossManager.tryCreateBoss();
  }

  musicManager.playStage(gameState.stage, { restart: true });
  updateDebugPresentationPanelVisibility();
}

function configureDebugPresentationHeavyState(config) {
  const heavyConfig = LEVEL_CONFIG[config.level].powerUps?.heavyMachineGun;
  const heavyWasAvailable = Boolean(heavyConfig && config.normalEnemiesDestroyed >= heavyConfig.normalKillTrigger);

  powerUpManager.heavyMachineGun.generated = heavyWasAvailable;
  powerUpManager.heavyMachineGun.collected = heavyWasAvailable;
  powerUpManager.heavyMachineGun.active = null;
}

function configureDebugPresentationRocketState(config) {
  const rocketConfig = LEVEL_CONFIG[config.level].powerUps?.rocketLauncher;
  const rocketWasAvailable = Boolean(rocketConfig?.enabled && config.normalEnemiesDestroyed >= rocketConfig.normalKillTrigger);

  powerUpManager.rocketLauncher.generated = rocketWasAvailable;
  powerUpManager.rocketLauncher.collected = rocketWasAvailable;
  powerUpManager.rocketLauncher.active = null;

  if (rocketWasAvailable) rocketManager.unlock(rocketConfig);
}

function configureDebugPresentationCadenceState(config) {
  const cadenceConfig = LEVEL_CONFIG[config.level].powerUps?.cadenceCore;
  const cadenceWasAvailable = Boolean(cadenceConfig?.enabled && config.normalEnemiesDestroyed >= cadenceConfig.normalKillTrigger);

  powerUpManager.cadenceCore.generated = cadenceWasAvailable;
  powerUpManager.cadenceCore.collected = cadenceWasAvailable;
  powerUpManager.cadenceCore.active = null;

  if (cadenceWasAvailable) weapon.fireInterval = cadenceConfig.fireInterval;
}

function configureDebugPresentationRocketUpgradeState(config) {
  const rocketUpgradeConfig = LEVEL_CONFIG[config.level].powerUps?.rocketUpgrade;
  const rocketUpgradeWasAvailable = Boolean(rocketUpgradeConfig?.enabled && config.normalEnemiesDestroyed >= rocketUpgradeConfig.normalKillTrigger);

  powerUpManager.rocketUpgrade.generated = rocketUpgradeWasAvailable;
  powerUpManager.rocketUpgrade.collected = rocketUpgradeWasAvailable;
  powerUpManager.rocketUpgrade.active = null;

  if (rocketUpgradeWasAvailable) rocketManager.unlock(rocketUpgradeConfig);
}

function restartCurrentLevelFromDebug() {
  restartCurrentLevel();
  updateDebugPresentationPanelVisibility();
}

function setDebugPresentationPanelOpen(isOpen) {
  debug.presentationPanelOpen = isOpen;
  if (isOpen) {
    debugLevelSelect.value = String(isPlayableLevelConfigured(currentLevel) ? currentLevel : 1);
    debugStageSelect.value = Object.values(STAGES).includes(gameState.stage) ? gameState.stage : STAGES.INICIO;
  }
  updateDebugPresentationPanelVisibility();
}

function showDebugTerminalControls() {
  musicManager.pause();
  debug.enabled = true;
  hideAllOverlays();
  setDebugPresentationPanelOpen(true);
}

function updateDebugPresentationPanelVisibility() {
  const canUsePresentationPanel =
    isDebugRunActive() &&
    gameState.status !== GAME_STATES.LEVEL_PREVIEW;

  if (!canUsePresentationPanel) {
    debug.presentationPanelOpen = false;
  }

  debugPresentationToggle.hidden = !canUsePresentationPanel;
  debugPresentationToggle.setAttribute("aria-pressed", String(debug.presentationPanelOpen && canUsePresentationPanel));
  debugPresentationPanel.hidden = !(canUsePresentationPanel && debug.presentationPanelOpen);
}

function updateTank(deltaSeconds) {
  const direction = Number(input.right) - Number(input.left);
  const previousX = tank.x;
  const speedMultiplier = input.fire ? 1 : TANK_MOVE_SPEED_NOT_FIRING_MULTIPLIER;
  tank.x += direction * TANK_SPEED * speedMultiplier * deltaSeconds;
  tank.x = Math.max(0, Math.min(LOGICAL_WIDTH - tank.width, tank.x));
  const movementDirection = Math.sign(tank.x - previousX);
  tankDustManager.update(deltaSeconds, movementDirection);
}

function updateMuzzleFlash(deltaSeconds) {
  for (let index = muzzleFlashes.length - 1; index >= 0; index -= 1) {
    muzzleFlashes[index].activeTime -= deltaSeconds;
    if (muzzleFlashes[index].activeTime <= 0) muzzleFlashes.splice(index, 1);
  }
}

function createMuzzleSmoke(x, y) {
  for (let count = 0; count < 2; count += 1) {
    muzzleSmokeParticles.push({
      x: x + (Math.random() - 0.5) * 5,
      y: y + (Math.random() - 0.5) * 3,
      vx: (Math.random() - 0.5) * 12,
      vy: -18 - Math.random() * 12,
      radius: 4 + Math.random() * 3,
      growth: 8 + Math.random() * 6,
      age: 0,
      duration: MUZZLE_SMOKE_DURATION,
    });
  }

  if (muzzleSmokeParticles.length > MUZZLE_SMOKE_MAX_PARTICLES) {
    muzzleSmokeParticles.splice(0, muzzleSmokeParticles.length - MUZZLE_SMOKE_MAX_PARTICLES);
  }
}

function updateMuzzleSmoke(deltaSeconds) {
  for (let index = muzzleSmokeParticles.length - 1; index >= 0; index -= 1) {
    const smoke = muzzleSmokeParticles[index];
    smoke.age += deltaSeconds;
    smoke.x += smoke.vx * deltaSeconds;
    smoke.y += smoke.vy * deltaSeconds;
    smoke.vy *= 0.96;
    smoke.radius += smoke.growth * deltaSeconds;

    if (smoke.age >= smoke.duration) muzzleSmokeParticles.splice(index, 1);
  }
}

function getTankCenter() {
  return {
    x: tank.x + tank.width / 2,
    y: tank.y + tank.height / 2,
  };
}

function getTankGroundY() {
  return tank.y + tank.height;
}

function getMuzzlePoint(muzzleConfig) {
  const center = getTankCenter();
  return {
    id: muzzleConfig.id,
    x: center.x + muzzleConfig.offsetX,
    y: center.y + muzzleConfig.offsetY,
  };
}

function getAllMuzzlePoints() {
  return weapon.muzzlePoints.map(getMuzzlePoint);
}

function getActiveMuzzlePoints() {
  return weapon.muzzlePoints.slice(0, weapon.level).map(getMuzzlePoint);
}

function calculateTrajectoryY(entity, x) {
  if (entity.trajectory.type === "sinCos") {
    const sinAngle = (2 * Math.PI / entity.trajectory.sinPeriod) * x + (entity.trajectory.sinPhase ?? 0);
    const cosAngle = (2 * Math.PI / entity.trajectory.cosPeriod) * x + (entity.trajectory.cosPhase ?? 0);
    return (
      entity.trajectory.midline +
      entity.trajectory.sinAmplitude * Math.sin(sinAngle) +
      entity.trajectory.cosAmplitude * Math.cos(cosAngle)
    );
  }

  const angle = (2 * Math.PI / entity.trajectory.period) * x;
  const phase = entity.trajectory.phase ?? 0;
  const wave = entity.trajectory.type === "cos" ? Math.cos(angle + phase) : Math.sin(angle + phase);
  return entity.trajectory.midline + entity.trajectory.amplitude * wave;
}

function updateEnemy(enemy, deltaSeconds) {
  const minX = enemy.width / 2;
  const maxX = LOGICAL_WIDTH - enemy.width / 2;

  enemy.x += enemy.speed * enemy.direction * deltaSeconds;
  if (!enemy.hasEnteredCombat && enemy.x >= minX && enemy.x <= maxX) {
    enemy.hasEnteredCombat = true;
  }

  if (enemy.hasEnteredCombat && enemy.x >= maxX) {
    enemy.x = maxX;
    enemy.direction *= -1;
  } else if (enemy.hasEnteredCombat && enemy.x <= minX) {
    enemy.x = minX;
    enemy.direction *= -1;
  }

  enemy.y = calculateTrajectoryY(enemy, enemy.x);
}

function updateBoss(boss, deltaSeconds) {
  const minX = boss.width / 2;
  const maxX = LOGICAL_WIDTH - boss.width / 2;

  boss.x += boss.speed * boss.direction * deltaSeconds;
  if (!boss.hasEnteredCombat && boss.x >= minX && boss.x <= maxX) {
    boss.hasEnteredCombat = true;
  }

  if (boss.hasEnteredCombat && boss.x >= maxX) {
    boss.x = maxX;
    boss.direction *= -1;
  } else if (boss.hasEnteredCombat && boss.x <= minX) {
    boss.x = minX;
    boss.direction *= -1;
  }

  boss.y = calculateTrajectoryY(boss, boss.x);
}

function handleProjectileEnemyCollisions() {
  for (let projectileIndex = projectileManager.projectiles.length - 1; projectileIndex >= 0; projectileIndex -= 1) {
    const projectile = projectileManager.projectiles[projectileIndex];
    const enemy = enemyManager.enemies.find((activeEnemy) => isProjectileCollidingWithEnemy(projectile, activeEnemy));

    if (!enemy) {
      const boss = bossManager.boss;
      const bossImpactPoint = boss ? getProjectileEnemyImpactPoint(projectile, boss) : null;
      if (bossImpactPoint) {
        projectileManager.projectiles.splice(projectileIndex, 1);
        projectileImpactManager.createImpact(bossImpactPoint.x, bossImpactPoint.y, BOSS_PROJECTILE_IMPACT_RADIUS);
        bossManager.damageBoss(weapon.projectileDamage);
      }
      continue;
    }

    const enemyImpactPoint = getProjectileEnemyImpactPoint(projectile, enemy);
    projectileManager.projectiles.splice(projectileIndex, 1);
    if (enemyImpactPoint) {
      projectileImpactManager.createImpact(
        enemyImpactPoint.x,
        enemyImpactPoint.y,
        getNormalEnemyProjectileImpactRadius(enemy),
      );
    }
    enemy.hp -= weapon.projectileDamage;

    if (enemy.hp <= 0) {
      explosionManager.createExplosion(enemy.x, enemy.y);
      enemyDeathVisualManager.keepSpriteTemporarily(enemy);
      healthDropManager.tryCreateFromEnemyDeath(enemy);
      enemyManager.removeEnemy(enemy, { keepSprite: true });
      registerNormalEnemyDestroyed(enemy);
    }
  }
}

function registerNormalEnemyDestroyed(enemy) {
  if (enemy.scoreAwarded) return;

  gameState.score += SCORE_CONFIG.normalEnemyDestroyed;
  gameState.normalEnemiesDestroyed += 1;
  enemy.scoreAwarded = true;
  trySaveLevelCheckpoint();
  powerUpManager.trySpawnHeavyMachineGun();
  powerUpManager.trySpawnRocketLauncher();
  powerUpManager.trySpawnCadenceCore();
  powerUpManager.trySpawnRocketUpgrade();
  evaluateStageProgression();
}

function evaluateStageProgression() {
  if (gameState.stage === STAGES.INICIO && gameState.normalEnemiesDestroyed >= getStageConfig(STAGES.INICIO).normalKillTarget) {
    enterStage(STAGES.NUDO);
  }

  if (gameState.stage === STAGES.NUDO && gameState.normalEnemiesDestroyed >= getStageConfig(STAGES.NUDO).normalKillTarget) {
    enterStage(STAGES.BOSS);
  }
}

function getStageConfig(stageName) {
  return getCurrentLevelConfig().stages[stageName];
}

function enterStage(stageName) {
  if (gameState.stage === stageName) return;

  gameState.stage = stageName;
  enemyManager.spawnTimer = getCurrentStageConfig().spawnInterval ?? 0;
  if (currentLevel === 4 && stageName === STAGES.NUDO) enemyManager.nextTrajectoryVariantIndex = 0;

  if (stageName === STAGES.BOSS) {
    bossManager.tryCreateBoss();
    return;
  }

  musicManager.playStage(gameState.stage, { restart: true });
}

function isProjectileCollidingWithEnemy(projectile, enemy) {
  return Boolean(getProjectileEnemyOverlap(projectile, enemy));
}

function getProjectileTargetBounds(target) {
  if (target.projectileHitbox) {
    return {
      left: target.x - target.width / 2 + target.projectileHitbox.insetX,
      right: target.x + target.width / 2 - target.projectileHitbox.insetX,
      top: target.y + target.projectileHitbox.topOffset,
      bottom: target.y + target.projectileHitbox.bottomOffset,
    };
  }

  return {
    left: target.x - target.width / 2,
    right: target.x + target.width / 2,
    top: target.y - target.height / 2,
    bottom: target.y + target.height / 2,
  };
}

function getProjectileEnemyOverlap(projectile, enemy) {
  const projectileLeft = projectile.x - projectile.width / 2;
  const projectileRight = projectile.x + projectile.width / 2;
  const projectileTop = projectile.y;
  const projectileBottom = projectile.y + projectile.height;
  const targetBounds = getProjectileTargetBounds(enemy);

  const left = Math.max(projectileLeft, targetBounds.left);
  const right = Math.min(projectileRight, targetBounds.right);
  const top = Math.max(projectileTop, targetBounds.top);
  const bottom = Math.min(projectileBottom, targetBounds.bottom);

  if (right < left || bottom < top) return null;

  return {
    left,
    right,
    top,
    bottom,
    targetBottom: targetBounds.bottom,
  };
}

function getProjectileEnemyImpactPoint(projectile, enemy) {
  const overlap = getProjectileEnemyOverlap(projectile, enemy);
  if (!overlap) return null;

  return {
    x: (overlap.left + overlap.right) / 2,
    y: overlap.targetBottom,
  };
}

function getNormalEnemyProjectileImpactRadius(enemy) {
  return Math.max(6.5, Math.min(11.5, enemy.width * 0.12));
}

function normalizeAngle(angle) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

function rotateAngleToward(currentAngle, desiredAngle, maxStep) {
  const delta = normalizeAngle(desiredAngle - currentAngle);
  if (Math.abs(delta) <= maxStep) return desiredAngle;
  return currentAngle + Math.sign(delta) * maxStep;
}

function isCircleOverlappingTarget(x, y, radius, target) {
  const bounds = getProjectileTargetBounds(target);
  const closestX = Math.max(bounds.left, Math.min(x, bounds.right));
  const closestY = Math.max(bounds.top, Math.min(y, bounds.bottom));
  const dx = x - closestX;
  const dy = y - closestY;
  return dx * dx + dy * dy <= radius * radius;
}

function isSpectralBallCollidingWithTank(ball) {
  const tankRect = {
    left: tank.x,
    right: tank.x + tank.width,
    top: tank.y,
    bottom: tank.y + tank.height,
  };
  const closestX = Math.max(tankRect.left, Math.min(ball.x, tankRect.right));
  const closestY = Math.max(tankRect.top, Math.min(ball.y, tankRect.bottom));
  const dx = ball.x - closestX;
  const dy = ball.y - closestY;
  return dx * dx + dy * dy <= ball.radius * ball.radius;
}

function hasSpectralBallExited(ball) {
  const margin = ball.radius * 4;
  return (
    ball.x < -margin ||
    ball.x > LOGICAL_WIDTH + margin ||
    ball.y < -margin ||
    ball.y > LOGICAL_HEIGHT + margin
  );
}

function isPowerUpCollidingWithTank(powerUp) {
  const powerUpLeft = powerUp.x - powerUp.width / 2;
  const powerUpRight = powerUp.x + powerUp.width / 2;
  const powerUpTop = powerUp.y - powerUp.height / 2;
  const powerUpBottom = powerUp.y + powerUp.height / 2;
  const tankLeft = tank.x;
  const tankRight = tank.x + tank.width;
  const tankTop = tank.y;
  const tankBottom = tank.y + tank.height;

  return (
    powerUpRight >= tankLeft &&
    powerUpLeft <= tankRight &&
    powerUpBottom >= tankTop &&
    powerUpTop <= tankBottom
  );
}

function isHealthDropCollidingWithTank(drop) {
  const dropLeft = drop.x - drop.width / 2;
  const dropRight = drop.x + drop.width / 2;
  const dropTop = drop.y - drop.height / 2;
  const dropBottom = drop.y + drop.height / 2;
  const tankLeft = tank.x;
  const tankRight = tank.x + tank.width;
  const tankTop = tank.y;
  const tankBottom = tank.y + tank.height;

  return (
    dropRight >= tankLeft &&
    dropLeft <= tankRight &&
    dropBottom >= tankTop &&
    dropTop <= tankBottom
  );
}

function damageTank(damage) {
  if (!isGameplayActive()) return;

  const currentHp = Number.isFinite(tank.hp) ? tank.hp : 0;
  const safeDamage = Number.isFinite(damage) ? damage : 0;
  tank.hp = Math.max(0, currentHp - safeDamage);
  bossManager.tryReleasePlayerLowHealthDrop();
  if (tank.hp <= 0) beginTankDeath();
}

function healTank(healAmount) {
  const currentHp = Number.isFinite(tank.hp) ? tank.hp : 0;
  const safeHealAmount = Number.isFinite(healAmount) ? healAmount : 0;
  tank.hp = Math.min(tank.maxHp, currentHp + safeHealAmount);
}

function isLaserCollidingWithTank(laser) {
  return Boolean(getLaserTankImpactPoint(laser));
}

function getLaserTankImpactPoint(laser) {
  const segment = getLaserSegment(laser);
  const tankRect = {
    left: tank.x,
    right: tank.x + tank.width,
    top: tank.y,
    bottom: tank.y + tank.height,
  };

  if (isPointInsideRect(segment.x2, segment.y2, tankRect)) {
    return { x: segment.x2, y: segment.y2 };
  }

  if (isPointInsideRect(segment.x1, segment.y1, tankRect)) {
    return { x: segment.x1, y: segment.y1 };
  }

  const intersections = getSegmentRectIntersectionPoints(segment, tankRect);
  if (intersections.length === 0) return null;

  return intersections.reduce((closest, point) => {
    const closestDistance = getSquaredDistance(closest, { x: segment.x2, y: segment.y2 });
    const pointDistance = getSquaredDistance(point, { x: segment.x2, y: segment.y2 });
    return pointDistance < closestDistance ? point : closest;
  });
}

function getLaserSegment(laser) {
  return {
    x1: laser.x - Math.cos(laser.theta) * laser.length,
    y1: laser.y - Math.sin(laser.theta) * laser.length,
    x2: laser.x,
    y2: laser.y,
  };
}

function isSegmentIntersectingRect(segment, rect) {
  if (isPointInsideRect(segment.x1, segment.y1, rect) || isPointInsideRect(segment.x2, segment.y2, rect)) {
    return true;
  }

  return (
    areSegmentsIntersecting(segment.x1, segment.y1, segment.x2, segment.y2, rect.left, rect.top, rect.right, rect.top) ||
    areSegmentsIntersecting(segment.x1, segment.y1, segment.x2, segment.y2, rect.right, rect.top, rect.right, rect.bottom) ||
    areSegmentsIntersecting(segment.x1, segment.y1, segment.x2, segment.y2, rect.right, rect.bottom, rect.left, rect.bottom) ||
    areSegmentsIntersecting(segment.x1, segment.y1, segment.x2, segment.y2, rect.left, rect.bottom, rect.left, rect.top)
  );
}

function isPointInsideRect(x, y, rect) {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function getSegmentRectIntersectionPoints(segment, rect) {
  return [
    getSegmentIntersectionPoint(segment.x1, segment.y1, segment.x2, segment.y2, rect.left, rect.top, rect.right, rect.top),
    getSegmentIntersectionPoint(segment.x1, segment.y1, segment.x2, segment.y2, rect.right, rect.top, rect.right, rect.bottom),
    getSegmentIntersectionPoint(segment.x1, segment.y1, segment.x2, segment.y2, rect.right, rect.bottom, rect.left, rect.bottom),
    getSegmentIntersectionPoint(segment.x1, segment.y1, segment.x2, segment.y2, rect.left, rect.bottom, rect.left, rect.top),
  ].filter(Boolean);
}

function areSegmentsIntersecting(ax, ay, bx, by, cx, cy, dx, dy) {
  return Boolean(getSegmentIntersectionPoint(ax, ay, bx, by, cx, cy, dx, dy));
}

function getSegmentIntersectionPoint(ax, ay, bx, by, cx, cy, dx, dy) {
  const denominator = (ax - bx) * (cy - dy) - (ay - by) * (cx - dx);
  if (denominator === 0) return null;

  const t = ((ax - cx) * (cy - dy) - (ay - cy) * (cx - dx)) / denominator;
  const u = -((ax - bx) * (ay - cy) - (ay - by) * (ax - cx)) / denominator;
  if (t < 0 || t > 1 || u < 0 || u > 1) return null;

  return {
    x: ax + t * (bx - ax),
    y: ay + t * (by - ay),
  };
}

function getSquaredDistance(pointA, pointB) {
  const dx = pointA.x - pointB.x;
  const dy = pointA.y - pointB.y;
  return dx * dx + dy * dy;
}

function getLaserGroundImpactPoint(laser) {
  const segment = getLaserSegment(laser);
  const deltaY = segment.y2 - segment.y1;
  if (deltaY === 0) return null;

  const t = (debug.groundY - segment.y1) / deltaY;
  if (t < 0 || t > 1) return null;

  const x = segment.x1 + (segment.x2 - segment.x1) * t;
  if (x < 0 || x > LOGICAL_WIDTH) return null;

  return { x };
}

function hasLaserExited(laser) {
  const margin = laser.length;
  return (
    laser.x < -margin ||
    laser.x > LOGICAL_WIDTH + margin ||
    laser.y < -margin ||
    laser.y > LOGICAL_HEIGHT + margin
  );
}

function getTrajectoryEquation(trajectory) {
  if (trajectory.type === "sinCos") {
    return `y = ${trajectory.midline} + ${trajectory.sinAmplitude} * Math.sin((2 * Math.PI / ${trajectory.sinPeriod}) * x) + ${trajectory.cosAmplitude} * Math.cos((2 * Math.PI / ${trajectory.cosPeriod}) * x)`;
  }

  const waveFunction = trajectory.type === "cos" ? "Math.cos" : "Math.sin";
  const phase = trajectory.phase ? ` + ${formatPhaseValue(trajectory.phase)}` : "";
  return `y = ${trajectory.midline} + ${trajectory.amplitude} * ${waveFunction}((2 * Math.PI / ${trajectory.period}) * x${phase})`;
}

function formatPhaseValue(phase) {
  if (!phase) return "0";
  if (phase === Math.PI / 2) return "Math.PI / 2";
  if (phase === Math.PI) return "Math.PI";
  if (phase === 3 * Math.PI / 2) return "3 * Math.PI / 2";
  return phase.toFixed(2);
}

function getTrajectoryDebugParams(trajectory) {
  if (trajectory.type === "sinCos") {
    return `D=${trajectory.midline} | As=${trajectory.sinAmplitude} Ts=${trajectory.sinPeriod} | Ac=${trajectory.cosAmplitude} Tc=${trajectory.cosPeriod}`;
  }

  return `A=${trajectory.amplitude} | D=${trajectory.midline} | Periodo=${trajectory.period} | Fase=${formatPhaseValue(trajectory.phase ?? 0)}`;
}

function getActiveTrajectoryConfigs() {
  const configs = new Map();

  enemyManager.enemies.forEach((enemy) => {
    const phase = enemy.trajectory.phase ?? 0;
    const key = `${enemy.typeKey}-${enemy.midline}-${phase}`;
    if (configs.has(key)) return;
    configs.set(key, {
      color: enemy.color,
      label: `${enemy.trajectory.type} carril ${enemy.midline} fase ${formatPhaseValue(phase)}`,
      trajectory: enemy.trajectory,
    });
  });

  if (gameState.stage === STAGES.BOSS && (bossManager.boss || bossManager.created)) {
    const bossConfig = getCurrentBossConfig();
    const bossTrajectory = bossManager.boss?.trajectory ?? bossConfig.trajectory;
    configs.set("boss-1", {
      color: "#55ff7a",
      label: `${bossConfig.label} ${bossTrajectory.type}`,
      trajectory: bossTrajectory,
    });
  }

  return Array.from(configs.values());
}

function drawDebug() {
  context.save();
  context.font = "16px Consolas, monospace";
  context.lineWidth = 1;

  context.strokeStyle = "rgba(111, 221, 255, 0.25)";
  context.fillStyle = "rgba(220, 248, 255, 0.8)";
  for (let x = 0; x <= LOGICAL_WIDTH; x += debug.gridStep) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, LOGICAL_HEIGHT);
    context.stroke();
    if (x < LOGICAL_WIDTH) drawDebugNumber(String(x), x + 4, 18);
  }
  for (let y = 0; y <= LOGICAL_HEIGHT; y += debug.gridStep) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(LOGICAL_WIDTH, y);
    context.stroke();
    if (y < LOGICAL_HEIGHT) drawDebugNumber(String(y), 4, y - 5);
  }

  context.strokeStyle = "rgba(255, 226, 86, 0.95)";
  context.lineWidth = 2;
  context.setLineDash([12, 8]);
  context.beginPath();
  context.moveTo(0, debug.groundY);
  context.lineTo(LOGICAL_WIDTH, debug.groundY);
  context.stroke();
  context.setLineDash([]);
  context.fillStyle = "#fff0a6";
  drawDebugText(`suelo aproximado Y=${debug.groundY}`, 14, debug.groundY - 10);

  getActiveTrajectoryConfigs().forEach(drawTrajectory);

  drawTankCoordinates(tank, "Tanque", "#9effa8");
  drawMuzzleDebugPoints();
  drawRocketDebugMarkers();
  enemyManager.enemies.forEach(drawEnemyCoordinates);
  drawBossDebugBounds();

  const panelX = 14;
  let panelY = 42;
  const stageConfig = getCurrentStageConfig();
  context.fillStyle = "#ffffff";
  drawDebugText("DEBUG: activo | Q para ocultar/mostrar", panelX, LOGICAL_HEIGHT - 16);
  drawDebugText(`Enemigos activos: ${enemyManager.enemies.length}/${stageConfig.maxNormalEnemies}`, panelX, panelY);
  drawDebugText(`Proyectiles activos: ${projectileManager.projectiles.length}`, panelX + 250, panelY);
  panelY += 24;
  drawDebugText(`Stage: ${gameState.stage}`, panelX, panelY);
  drawDebugText(`Kills normales: ${gameState.normalEnemiesDestroyed}`, panelX + 250, panelY);
  panelY += 20;
  drawDebugText(`Estado juego: ${gameState.status}`, panelX, panelY);
  drawDebugText(`tank.alive: ${tank.alive}`, panelX + 250, panelY);
  panelY += 20;
  drawDebugText(`Max simultaneo: ${stageConfig.maxNormalEnemies}`, panelX, panelY);
  drawDebugText(`Intervalo spawn: ${stageConfig.spawnInterval ?? "sin spawn"}s`, panelX + 250, panelY);
  panelY += 24;
  drawDebugText(`Laseres enemigos: ${enemyLaserManager.lasers.length}`, panelX, panelY);
  drawDebugText(`theta ultimo: ${formatLastLaserTheta()}`, panelX + 250, panelY);
  panelY += 20;
  drawDebugText(`vx ultimo: ${formatLastLaserComponent("vx")}`, panelX, panelY);
  drawDebugText(`vy ultimo: ${formatLastLaserComponent("vy")}`, panelX + 250, panelY);
  panelY += 24;
  drawDebugText(`HP tanque: ${tank.hp}/${tank.maxHp}`, panelX, panelY);
  drawDebugText(`Dano laser: ${getCurrentEnemyLaserConfig().damage}`, panelX + 250, panelY);
  panelY += 24;
  drawDebugText(`Drops salud activos: ${healthDropManager.drops.length}`, panelX, panelY);
  drawDebugText(`dropChance salud: ${getCurrentHealthDropConfig().dropChance}`, panelX + 250, panelY);
  panelY += 20;
  drawDebugText(`healAmount salud: ${getCurrentHealthDropConfig().healAmount}`, panelX, panelY);
  panelY += 24;
  drawDebugText(`Heavy generado: ${powerUpManager.heavyMachineGun.generated}`, panelX, panelY);
  drawDebugText(`Heavy activo: ${Boolean(powerUpManager.heavyMachineGun.active)}`, panelX + 250, panelY);
  panelY += 20;
  drawDebugText(`weapon.level: ${weapon.level}`, panelX, panelY);
  drawDebugText(`Rocket listo: ${rocketManager.unlocked && rocketManager.cooldown <= 0}`, panelX + 250, panelY);
  panelY += 20;
  drawDebugText(`Rocket desbloqueado: ${rocketManager.unlocked}`, panelX, panelY);
  drawDebugText(`Misiles activos: ${rocketManager.missiles.length}`, panelX + 250, panelY);
  panelY += 20;
  drawDebugText(`Rocket cooldown: ${rocketManager.cooldown.toFixed(2)}s`, panelX, panelY);
  panelY += 24;

  if (gameState.stage === STAGES.BOSS || bossManager.defeated) {
    const boss = bossManager.boss;
    const bossConfig = getCurrentBossConfig();
    const bossTrajectory = boss?.trajectory ?? bossConfig.trajectory;
    context.fillStyle = "#ff8080";
    drawDebugText(`Boss estado: ${getBossDebugState()}`, panelX, panelY);
    drawDebugText(`HP Boss: ${boss ? `${boss.hp}/${boss.maxHp}` : "n/a"}`, panelX + 250, panelY);
    panelY += 20;
    drawDebugText(`Boss drop vida: ${boss ? boss.healthDropReleased : "n/a"}`, panelX, panelY);
    drawDebugText(`Drops tanque bajo: ${formatBossPlayerHealthDropsDebug(boss)}`, panelX + 250, panelY);
    panelY += 20;
    drawDebugText(`Boss funcion: ${bossTrajectory.type}`, panelX, panelY);
    drawDebugText(getTrajectoryDebugParams(bossTrajectory), panelX + 250, panelY);
    panelY += 20;
    drawDebugText(`Boss ecuacion: ${getTrajectoryEquation(bossTrajectory)}`, panelX, panelY);
    panelY += 20;
    drawDebugText(`Boss X=${boss ? boss.x.toFixed(1) : "n/a"} | Y=${boss ? boss.y.toFixed(1) : "n/a"} | dir=${boss ? boss.direction : "n/a"}`, panelX, panelY);
    panelY += 20;
    drawDebugText(`Boss ataques: ${bossManager.attackCounter}`, panelX, panelY);
    drawDebugText(`Proximo ataque: ${getBossNextAttackType()}`, panelX + 250, panelY);
    panelY += 20;
    drawDebugText(`Especial Boss: ${getBossSpecialDebugState()}`, panelX, panelY);
    drawDebugText(`Especial datos: ${formatBossSpecialFanAngles()}`, panelX + 250, panelY);
    panelY += 20;
    drawDebugText(`Spread doble: ${bossConfig.attackPattern.doubleSpreadDegrees} grados`, panelX, panelY);
    panelY += 20;
    drawDebugText(`Boss theta: ${formatBossShotTheta()}`, panelX, panelY);
    panelY += 20;
    drawDebugText(`Boss vx=${formatBossShotComponent("vx")} | vy=${formatBossShotComponent("vy")}`, panelX, panelY);
    panelY += 24;
  }

  getActiveTrajectoryConfigs().forEach((trajectoryConfig) => {
    context.fillStyle = trajectoryConfig.color;
    drawDebugText(`${trajectoryConfig.label}: ${getTrajectoryEquation(trajectoryConfig.trajectory)}`, panelX, panelY);
    drawDebugText(getTrajectoryDebugParams(trajectoryConfig.trajectory), panelX, panelY + 20);
    panelY += 44;
  });

  enemyManager.enemies.forEach((enemy) => {
    context.fillStyle = enemy.color;
    drawDebugText(
      `${enemy.label}: tipo=${enemy.trajectory.type}, X=${enemy.x.toFixed(1)}, Y=${enemy.y.toFixed(1)}, HP=${enemy.hp}/${enemy.maxHp}, midline=${enemy.midline}, dir=${enemy.direction}`,
      panelX,
      panelY,
    );
    panelY += 20;
  });
  context.restore();
}

function drawDebugText(text, x, y) {
  const previousFillStyle = context.fillStyle;
  const previousStrokeStyle = context.strokeStyle;
  const previousLineWidth = context.lineWidth;

  context.lineWidth = 3;
  context.strokeStyle = "rgba(0, 0, 0, 0.9)";
  context.strokeText(text, x, y);
  context.fillStyle = previousFillStyle;
  context.fillText(text, x, y);
  context.strokeStyle = previousStrokeStyle;
  context.lineWidth = previousLineWidth;
}

function drawDebugNumber(text, x, y) {
  const previousStrokeStyle = context.strokeStyle;
  const previousLineWidth = context.lineWidth;

  context.lineWidth = 3;
  context.strokeStyle = "rgba(0, 0, 0, 0.8)";
  context.strokeText(text, x, y);
  context.fillText(text, x, y);
  context.strokeStyle = previousStrokeStyle;
  context.lineWidth = previousLineWidth;
}

function getHudCheckpointText() {
  if (isDebugRunActive()) return "CHECKPOINT: DEBUG";

  const checkpointKill = getLevelHeavyCheckpointKill();
  if (checkpointKill === null) return "CHECKPOINT: N/A";
  if (checkpointState.active && checkpointState.level === currentLevel) return "CHECKPOINT: ACTIVO";
  return `CHECKPOINT: ${gameState.normalEnemiesDestroyed}/${checkpointKill}`;
}

function drawScoreHud() {
  const scoreText = `PUNTOS: ${gameState.score}`;
  const hpText = `VIDA: ${tank.hp}/${tank.maxHp}`;
  const levelText = `NIVEL ${currentLevel}`;
  const stageText = gameState.stage;
  const checkpointText = getHudCheckpointText();
  const bossDefeatedText = "BOSS DERROTADO";

  context.save();
  context.font = "24px Consolas, monospace";
  context.fillStyle = "#fff6a6";
  context.lineWidth = 4;
  context.strokeStyle = "rgba(0, 0, 0, 0.9)";

  const scoreWidth = context.measureText(scoreText).width;
  const hpWidth = context.measureText(hpText).width;
  const levelWidth = context.measureText(levelText).width;
  const stageWidth = context.measureText(stageText).width;
  const checkpointWidth = context.measureText(checkpointText).width;
  const barWidth = 170;
  const barHeight = 10;
  const x = LOGICAL_WIDTH - Math.max(scoreWidth, hpWidth, levelWidth, stageWidth, checkpointWidth, barWidth) - 24;

  context.strokeText(scoreText, x, 34);
  context.fillText(scoreText, x, 34);
  context.strokeText(hpText, x, 62);
  context.fillText(hpText, x, 62);

  const hpRatio = tank.hp / tank.maxHp;
  context.fillStyle = "rgba(0, 0, 0, 0.55)";
  context.fillRect(x, 72, barWidth, barHeight);
  context.fillStyle = "#55ff7a";
  context.fillRect(x, 72, barWidth * hpRatio, barHeight);

  context.fillStyle = "#fff6a6";
  context.strokeText(levelText, x, 106);
  context.fillText(levelText, x, 106);
  context.strokeText(stageText, x, 134);
  context.fillText(stageText, x, 134);

  context.font = "18px Consolas, monospace";
  context.fillStyle = checkpointState.active && checkpointState.level === currentLevel ? "#dfff82" : "#d6d6c8";
  context.strokeText(checkpointText, x, 162);
  context.fillText(checkpointText, x, 162);

  if (bossManager.defeated) {
    context.fillStyle = "#ffef8a";
    context.font = "24px Consolas, monospace";
    context.strokeText(bossDefeatedText, x, 194);
    context.fillText(bossDefeatedText, x, 194);
  }
  context.restore();
}

function drawProjectiles() {
  context.save();
  projectileManager.projectiles.forEach((projectile) => {
    const x = projectile.x - projectile.width / 2;
    const outlineWidth = projectile.width + 4;
    const outlineX = projectile.x - outlineWidth / 2;
    const gradient = context.createLinearGradient(projectile.x, projectile.y, projectile.x, projectile.y + projectile.height);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.45, "rgba(255, 242, 115, 1)");
    gradient.addColorStop(1, "rgba(255, 132, 38, 0.45)");

    context.fillStyle = "rgba(0, 0, 0, 0.58)";
    context.fillRect(outlineX, projectile.y - 1, outlineWidth, projectile.height + 2);

    context.fillStyle = "rgba(255, 70, 20, 0.28)";
    context.fillRect(projectile.x - projectile.width, projectile.y - 2, projectile.width * 2, projectile.height + 4);

    context.fillStyle = gradient;
    context.fillRect(x, projectile.y, projectile.width, projectile.height);
  });
  context.restore();
}

function drawRocketSmoke() {
  context.save();
  rocketManager.smokeParticles.forEach((smoke) => {
    const progress = smoke.age / smoke.duration;
    const alpha = Math.max(0, 0.34 * (1 - progress));
    context.fillStyle = `rgba(168, 170, 154, ${alpha})`;
    context.beginPath();
    context.arc(smoke.x, smoke.y, smoke.radius, 0, 2 * Math.PI);
    context.fill();
  });
  context.restore();
}

function drawRockets() {
  context.save();
  rocketManager.missiles.forEach((missile) => {
    context.save();
    context.translate(missile.x, missile.y);
    context.rotate(missile.angle);

    const flameFrame = rocketAssets.flameFrames[Math.floor(missile.age * 18) % rocketAssets.flameFrames.length];
    if (flameFrame?.complete && flameFrame.naturalWidth > 0) {
      context.drawImage(flameFrame, -ROCKET_WIDTH * 0.88, -ROCKET_HEIGHT * 0.38, ROCKET_WIDTH * 0.64, ROCKET_HEIGHT * 0.76);
    } else {
      context.fillStyle = "rgba(255, 188, 47, 0.85)";
      context.beginPath();
      context.moveTo(-ROCKET_WIDTH * 0.54, 0);
      context.lineTo(-ROCKET_WIDTH * 0.88, -ROCKET_HEIGHT * 0.28);
      context.lineTo(-ROCKET_WIDTH * 0.88, ROCKET_HEIGHT * 0.28);
      context.closePath();
      context.fill();
    }

    const missileFrame = rocketAssets.missileFrames[0];
    if (missileFrame?.complete && missileFrame.naturalWidth > 0) {
      context.drawImage(missileFrame, -ROCKET_WIDTH / 2, -ROCKET_HEIGHT / 2, ROCKET_WIDTH, ROCKET_HEIGHT);
    } else {
      context.fillStyle = "#e7f0df";
      context.fillRect(-ROCKET_WIDTH / 2, -ROCKET_HEIGHT / 4, ROCKET_WIDTH * 0.72, ROCKET_HEIGHT / 2);
      context.fillStyle = "#c83c2f";
      context.beginPath();
      context.moveTo(ROCKET_WIDTH / 2, 0);
      context.lineTo(ROCKET_WIDTH * 0.22, -ROCKET_HEIGHT / 2);
      context.lineTo(ROCKET_WIDTH * 0.22, ROCKET_HEIGHT / 2);
      context.closePath();
      context.fill();
    }

    context.restore();
  });
  context.restore();
}

function drawRocketHud() {
  if (!rocketManager.unlocked) return;

  const size = ROCKET_HUD_SIZE;
  const x = LOGICAL_WIDTH - size - 26;
  const y = LOGICAL_HEIGHT - size - 104;
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const cooldownRatio = rocketManager.cooldownDuration > 0 ? rocketManager.cooldown / rocketManager.cooldownDuration : 0;

  context.save();
  context.fillStyle = "rgba(7, 14, 12, 0.78)";
  context.strokeStyle = rocketManager.cooldown <= 0 ? "#dfff82" : "#7d8c5a";
  context.lineWidth = 3;
  context.fillRect(x, y, size, size);
  context.strokeRect(x, y, size, size);

  if (rocketAssets.icon.complete && rocketAssets.icon.naturalWidth > 0) {
    context.imageSmoothingEnabled = false;
    context.drawImage(rocketAssets.icon, x + 8, y + 8, size - 16, size - 16);
  } else {
    context.fillStyle = "#dfff82";
    context.fillRect(x + 18, y + 26, size - 32, 10);
  }

  if (cooldownRatio > 0) {
    context.save();
    context.beginPath();
    context.rect(x, y, size, size);
    context.clip();

    context.fillStyle = "rgba(0, 0, 0, 0.64)";
    context.beginPath();
    context.moveTo(centerX, centerY);
    context.arc(centerX, centerY, size * 0.58, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * cooldownRatio);
    context.closePath();
    context.fill();
    context.restore();

    context.font = "18px Consolas, monospace";
    context.fillStyle = "#fff6a6";
    context.lineWidth = 3;
    context.strokeStyle = "rgba(0, 0, 0, 0.85)";
    const text = Math.ceil(rocketManager.cooldown).toString();
    const textWidth = context.measureText(text).width;
    context.strokeText(text, centerX - textWidth / 2, centerY + 6);
    context.fillText(text, centerX - textWidth / 2, centerY + 6);
  }

  context.fillStyle = "#07100f";
  context.fillRect(x + size - 27, y + size - 20, 23, 16);
  context.strokeStyle = "#dfff82";
  context.lineWidth = 1;
  context.strokeRect(x + size - 27, y + size - 20, 23, 16);
  context.font = "12px Consolas, monospace";
  context.fillStyle = "#fff6a6";
  context.fillText("SP", x + size - 24, y + size - 7);
  context.restore();
}

function drawEnemyLasers() {
  context.save();
  enemyLaserManager.lasers.forEach((laser) => {
    const endX = laser.x - Math.cos(laser.theta) * laser.length;
    const endY = laser.y - Math.sin(laser.theta) * laser.length;
    const isBossLaser = laser.type === "boss";
    const lineWidth = laser.lineWidth ?? ENEMY_LASER_LINE_WIDTH;
    const bossLaserColors = laser.colors ?? {
      fade: "rgba(255, 20, 20, 0)",
      core: "rgba(255, 34, 34, 0.86)",
      tip: "rgba(255, 220, 220, 1)",
      glowOuter: "rgba(255, 20, 20, 0.25)",
      glowInner: "rgba(255, 75, 75, 0.58)",
    };
    const gradient = context.createLinearGradient(endX, endY, laser.x, laser.y);
    if (isBossLaser) {
      gradient.addColorStop(0, bossLaserColors.fade);
      gradient.addColorStop(0.45, bossLaserColors.core);
      gradient.addColorStop(1, bossLaserColors.tip);
    } else {
      gradient.addColorStop(0, "rgba(72, 255, 128, 0)");
      gradient.addColorStop(0.45, "rgba(92, 255, 150, 0.75)");
      gradient.addColorStop(1, "rgba(210, 255, 220, 1)");
    }

    context.lineCap = "round";
    context.strokeStyle = "rgba(0, 0, 0, 0.58)";
    context.lineWidth = lineWidth + (isBossLaser ? 20 : 14);
    context.beginPath();
    context.moveTo(endX, endY);
    context.lineTo(laser.x, laser.y);
    context.stroke();

    context.strokeStyle = isBossLaser ? bossLaserColors.glowOuter : "rgba(62, 255, 126, 0.22)";
    context.lineWidth = lineWidth + (isBossLaser ? 13 : 8);
    context.beginPath();
    context.moveTo(endX, endY);
    context.lineTo(laser.x, laser.y);
    context.stroke();

    context.strokeStyle = isBossLaser ? bossLaserColors.glowInner : "rgba(91, 255, 150, 0.45)";
    context.lineWidth = lineWidth + (isBossLaser ? 7 : 4);
    context.beginPath();
    context.moveTo(endX, endY);
    context.lineTo(laser.x, laser.y);
    context.stroke();

    context.strokeStyle = gradient;
    context.lineWidth = lineWidth;
    context.beginPath();
    context.moveTo(endX, endY);
    context.lineTo(laser.x, laser.y);
    context.stroke();
  });
  context.restore();
}

function drawBossSpecialTelegraph() {
  const boss = bossManager.boss;
  if (!boss || boss.specialTelegraphRemaining <= 0) return;

  const specialConfig = getCurrentBossConfig().specialAttack;
  if (!specialConfig) return;
  if (specialConfig.type !== "fan") return;

  const progress = 1 - boss.specialTelegraphRemaining / boss.specialTelegraphDuration;
  const pulse = 0.45 + Math.sin(progress * Math.PI * 6) * 0.18;
  const radius = 390;
  const angleRange = specialConfig.endAngle - specialConfig.startAngle;

  context.save();
  context.lineCap = "round";
  context.strokeStyle = `rgba(88, 226, 255, ${0.18 + pulse * 0.28})`;
  context.lineWidth = 5;
  context.beginPath();
  context.arc(boss.x, boss.y, radius, specialConfig.startAngle, specialConfig.endAngle);
  context.stroke();

  for (let index = 0; index < specialConfig.projectileCount; index += 1) {
    const ratio = specialConfig.projectileCount === 1 ? 0.5 : index / (specialConfig.projectileCount - 1);
    const theta = specialConfig.startAngle + angleRange * ratio;
    const endX = boss.x + Math.cos(theta) * radius;
    const endY = boss.y + Math.sin(theta) * radius;
    const gradient = context.createLinearGradient(boss.x, boss.y, endX, endY);
    gradient.addColorStop(0, "rgba(220, 252, 255, 0.65)");
    gradient.addColorStop(1, "rgba(35, 210, 255, 0)");

    context.strokeStyle = gradient;
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(boss.x, boss.y);
    context.lineTo(endX, endY);
    context.stroke();
  }

  context.fillStyle = `rgba(220, 252, 255, ${0.28 + pulse * 0.35})`;
  context.beginPath();
  context.arc(boss.x, boss.y, 12 + progress * 10, 0, 2 * Math.PI);
  context.fill();
  context.restore();
}

function drawLaserTankImpacts() {
  context.save();
  laserTankImpactManager.impacts.forEach((impact) => {
    const progress = Math.max(0, impact.remainingTime / impact.duration);
    const radius = LASER_TANK_IMPACT_RADIUS * progress;
    const glowRadius = radius * 1.7;

    context.globalAlpha = progress;
    context.lineCap = "round";
    context.fillStyle = "rgba(0, 0, 0, 0.42)";
    context.beginPath();
    context.arc(impact.x, impact.y, glowRadius * 1.1, 0, 2 * Math.PI);
    context.fill();

    context.strokeStyle = "rgba(0, 0, 0, 0.75)";
    context.lineWidth = 12 * progress;
    context.beginPath();
    context.moveTo(impact.x - radius * 1.15, impact.y);
    context.lineTo(impact.x + radius * 1.15, impact.y);
    context.moveTo(impact.x, impact.y - radius * 1.15);
    context.lineTo(impact.x, impact.y + radius * 1.15);
    context.stroke();

    context.strokeStyle = "rgba(105, 255, 160, 0.35)";
    context.lineWidth = 8 * progress;
    context.beginPath();
    context.arc(impact.x, impact.y, glowRadius, 0, 2 * Math.PI);
    context.stroke();

    context.strokeStyle = "rgba(218, 255, 224, 0.95)";
    context.lineWidth = 2.5;
    context.beginPath();
    context.moveTo(impact.x - radius, impact.y);
    context.lineTo(impact.x + radius, impact.y);
    context.moveTo(impact.x, impact.y - radius);
    context.lineTo(impact.x, impact.y + radius);
    context.stroke();

    context.fillStyle = "rgba(140, 255, 165, 0.9)";
    context.beginPath();
    context.arc(impact.x, impact.y, Math.max(2, radius * 0.25), 0, 2 * Math.PI);
    context.fill();
  });
  context.restore();
}

function drawProjectileImpacts() {
  context.save();
  projectileImpactManager.impacts.forEach((impact) => {
    const progress = Math.max(0, impact.remainingTime / impact.duration);
    const age = 1 - progress;
    const radius = impact.radius * (0.45 + age * 0.9);

    context.globalAlpha = progress;
    context.lineCap = "round";

    context.fillStyle = "rgba(0, 0, 0, 0.55)";
    context.beginPath();
    context.arc(impact.x, impact.y, radius * 1.15, 0, 2 * Math.PI);
    context.fill();

    context.strokeStyle = "rgba(255, 246, 165, 0.35)";
    context.lineWidth = 10 * progress;
    context.beginPath();
    context.arc(impact.x, impact.y, radius, 0, 2 * Math.PI);
    context.stroke();

    context.strokeStyle = "rgba(255, 156, 45, 0.92)";
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(impact.x - radius, impact.y);
    context.lineTo(impact.x + radius, impact.y);
    context.moveTo(impact.x, impact.y - radius);
    context.lineTo(impact.x, impact.y + radius);
    context.stroke();

    context.fillStyle = "rgba(255, 255, 220, 0.96)";
    context.beginPath();
    context.arc(impact.x, impact.y, Math.max(3, radius * 0.18), 0, 2 * Math.PI);
    context.fill();
  });
  context.restore();
}

function drawRocketExplosions() {
  context.save();
  rocketExplosionManager.explosions.forEach((explosion) => {
    const progress = 1 - Math.max(0, explosion.remainingTime / explosion.duration);
    const alpha = Math.max(0, 1 - progress);
    const radius = explosion.radius * (0.32 + progress * 0.9);
    const coreRadius = explosion.radius * Math.max(0.08, 0.28 * (1 - progress));

    const glow = context.createRadialGradient(explosion.x, explosion.y, 0, explosion.x, explosion.y, radius);
    glow.addColorStop(0, `rgba(255, 255, 220, ${0.95 * alpha})`);
    glow.addColorStop(0.24, `rgba(255, 196, 54, ${0.78 * alpha})`);
    glow.addColorStop(0.58, `rgba(255, 86, 24, ${0.42 * alpha})`);
    glow.addColorStop(1, "rgba(255, 70, 20, 0)");

    context.globalAlpha = 1;
    context.fillStyle = glow;
    context.beginPath();
    context.arc(explosion.x, explosion.y, radius, 0, 2 * Math.PI);
    context.fill();

    context.strokeStyle = `rgba(255, 236, 132, ${0.82 * alpha})`;
    context.lineWidth = 5 * alpha;
    context.beginPath();
    context.arc(explosion.x, explosion.y, radius * 0.74, 0, 2 * Math.PI);
    context.stroke();

    context.fillStyle = `rgba(255, 250, 225, ${0.88 * alpha})`;
    context.beginPath();
    context.arc(explosion.x, explosion.y, coreRadius, 0, 2 * Math.PI);
    context.fill();

    explosion.particles.forEach((particle) => {
      const particleAlpha = alpha * (0.55 + particle.colorMix * 0.4);
      context.fillStyle = particle.colorMix > 0.45
        ? `rgba(255, 222, 98, ${particleAlpha})`
        : `rgba(170, 164, 142, ${particleAlpha * 0.72})`;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius * (1 - progress * 0.35), 0, 2 * Math.PI);
      context.fill();
    });
  });
  context.restore();
}

function drawGroundLaserImpactFlashes() {
  context.save();
  groundLaserImpactFlashManager.impacts.forEach((impact) => {
    const progress = Math.max(0, impact.remainingTime / impact.duration);
    const age = 1 - progress;
    const flicker = 0.9 + Math.sin(age * 36) * 0.1;
    const isBossLaser = impact.laserType === "boss";
    const coreColor = isBossLaser ? "rgba(255, 235, 235, 0.95)" : "rgba(220, 255, 230, 0.95)";
    const glowColor = isBossLaser ? "rgba(255, 42, 42, 0.48)" : "rgba(70, 255, 142, 0.45)";
    const outerGlowColor = isBossLaser ? "rgba(255, 20, 20, 0.18)" : "rgba(50, 255, 126, 0.16)";
    const radius = GROUND_LASER_IMPACT_FLASH_RADIUS * (0.55 + age * 0.45);

    context.lineCap = "round";

    context.globalAlpha = progress * 0.75;
    context.fillStyle = "rgba(0, 0, 0, 0.42)";
    context.beginPath();
    context.ellipse(impact.x, impact.y + 1, radius * 1.6, radius * 0.45, 0, 0, 2 * Math.PI);
    context.fill();

    context.globalAlpha = progress * flicker;
    context.strokeStyle = "rgba(0, 0, 0, 0.72)";
    context.lineWidth = 8 * progress;
    context.beginPath();
    context.moveTo(impact.x, impact.y + 2);
    context.lineTo(impact.x, impact.y - radius * 1.65);
    context.stroke();

    context.globalAlpha = progress * flicker;
    context.fillStyle = outerGlowColor;
    context.beginPath();
    context.ellipse(impact.x, impact.y, radius * 1.35, radius * 0.34, 0, 0, 2 * Math.PI);
    context.fill();

    context.globalAlpha = progress * flicker;
    context.strokeStyle = glowColor;
    context.lineWidth = 6 * progress;
    context.beginPath();
    context.arc(impact.x, impact.y, radius, Math.PI * 1.05, Math.PI * 1.95);
    context.stroke();

    context.globalAlpha = progress * flicker;
    context.strokeStyle = coreColor;
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(impact.x, impact.y);
    context.lineTo(impact.x, impact.y - radius * 1.45);
    context.moveTo(impact.x - radius * 0.45, impact.y - radius * 0.28);
    context.lineTo(impact.x + radius * 0.45, impact.y - radius * 0.28);
    context.stroke();

    context.globalAlpha = progress * flicker;
    context.fillStyle = coreColor;
    context.beginPath();
    context.arc(impact.x, impact.y, Math.max(3, radius * 0.13), 0, 2 * Math.PI);
    context.fill();
  });
  context.restore();
}

function drawHealthDrops() {
  context.save();
  healthDropManager.drops.forEach((drop) => {
    const pulse = 1 + Math.sin(drop.pulseTime * drop.pulseSpeed) * drop.pulseScale;
    const boxSize = Math.min(drop.width, drop.height);
    const half = boxSize / 2;

    context.save();
    context.translate(drop.x, drop.y);
    context.scale(pulse, pulse);

    context.fillStyle = "rgba(0, 0, 0, 0.62)";
    context.fillRect(-half - 4, -half - 4, boxSize + 8, boxSize + 8);
    context.strokeStyle = "rgba(0, 0, 0, 0.95)";
    context.lineWidth = 6;
    context.strokeRect(-half - 2, -half - 2, boxSize + 4, boxSize + 4);

    context.fillStyle = "rgba(15, 150, 78, 0.72)";
    context.strokeStyle = "rgba(170, 255, 205, 1)";
    context.lineWidth = 3;
    context.fillRect(-half, -half, boxSize, boxSize);
    context.strokeRect(-half, -half, boxSize, boxSize);

    context.fillStyle = "rgba(255, 255, 255, 0.16)";
    context.fillRect(-half + 6, -half + 6, boxSize - 12, 7);

    context.lineCap = "round";
    context.strokeStyle = "rgba(0, 0, 0, 0.86)";
    context.lineWidth = 8;
    context.beginPath();
    context.moveTo(-half * 0.38, half * 0.34);
    context.lineTo(half * 0.28, -half * 0.32);
    context.stroke();

    context.strokeStyle = "#f4f7f0";
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(-half * 0.38, half * 0.34);
    context.lineTo(half * 0.28, -half * 0.32);
    context.stroke();

    context.strokeStyle = "#b9c2ba";
    context.lineWidth = 3;
    context.beginPath();
    context.arc(half * 0.34, -half * 0.38, half * 0.2, 0.35 * Math.PI, 1.65 * Math.PI);
    context.stroke();

    context.strokeStyle = "rgba(0, 0, 0, 0.78)";
    context.lineWidth = 6;
    context.beginPath();
    context.arc(half * 0.34, -half * 0.38, half * 0.2, 0.35 * Math.PI, 1.65 * Math.PI);
    context.stroke();

    context.strokeStyle = "#d9e4db";
    context.lineWidth = 3;
    context.beginPath();
    context.arc(half * 0.34, -half * 0.38, half * 0.2, 0.35 * Math.PI, 1.65 * Math.PI);
    context.stroke();

    context.fillStyle = "#f4f7f0";
    context.beginPath();
    context.arc(-half * 0.45, half * 0.42, half * 0.13, 0, 2 * Math.PI);
    context.fill();

    context.restore();
  });
  context.restore();
}

function drawBossSpectralBalls() {
  const boss = bossManager.boss;
  const attack = boss?.spectralAttack;
  if (!boss || !attack) return;

  context.save();

  const readyBalls = attack.balls.filter((ball) => ball.state !== "fired" && ball.state !== "expired");
  if (readyBalls.length > 1) {
    context.strokeStyle = "rgba(142, 112, 255, 0.26)";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(readyBalls[0].x, readyBalls[0].y);
    context.lineTo(readyBalls[readyBalls.length - 1].x, readyBalls[readyBalls.length - 1].y);
    context.stroke();
  }

  attack.balls.forEach((ball) => {
    if (ball.state === "expired") return;

    if (ball.trail?.length) {
      ball.trail.forEach((point, index) => {
        const trailRatio = (index + 1) / ball.trail.length;
        const trailRadius = ball.radius * 0.22 + ball.radius * 0.7 * trailRatio;
        context.fillStyle = `rgba(125, 96, 255, ${0.08 + trailRatio * 0.28})`;
        context.beginPath();
        context.arc(point.x, point.y, trailRadius, 0, 2 * Math.PI);
        context.fill();
      });
    }

    const pulse = ball.state === "fired" ? 1 : 0.92 + Math.sin(performance.now() / 100 + ball.id) * 0.08;
    const radius = ball.radius * pulse;
    const glow = context.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, radius * 2.2);
    glow.addColorStop(0, "rgba(235, 248, 255, 0.95)");
    glow.addColorStop(0.35, "rgba(116, 188, 255, 0.72)");
    glow.addColorStop(0.75, "rgba(145, 82, 255, 0.26)");
    glow.addColorStop(1, "rgba(145, 82, 255, 0)");

    context.fillStyle = glow;
    context.beginPath();
    context.arc(ball.x, ball.y, radius * 2.2, 0, 2 * Math.PI);
    context.fill();

    context.fillStyle = ball.state === "fired" ? "rgba(218, 238, 255, 0.96)" : "rgba(196, 224, 255, 0.88)";
    context.beginPath();
    context.arc(ball.x, ball.y, radius, 0, 2 * Math.PI);
    context.fill();

    context.strokeStyle = "rgba(165, 105, 255, 0.92)";
    context.lineWidth = 2;
    context.beginPath();
    context.arc(ball.x, ball.y, radius * 1.25, 0, 2 * Math.PI);
    context.stroke();

    if (ball.state === "fired") {
      context.strokeStyle = "rgba(110, 200, 255, 0.32)";
      context.lineWidth = 5;
      context.beginPath();
      context.moveTo(ball.x - ball.vx * 0.045, ball.y - ball.vy * 0.045);
      context.lineTo(ball.x, ball.y);
      context.stroke();
    }
  });

  context.restore();
}

function drawCanvasPowerUps() {
  context.save();
  if (powerUpManager.cadenceCore.active) drawCadenceCorePowerUp(powerUpManager.cadenceCore.active);
  context.restore();
}

function drawCadenceCorePowerUp(powerUp) {
  const pulse = 0.86 + Math.sin(powerUp.pulseTime * 7) * 0.14;
  const radius = powerUp.width * 0.32 * pulse;

  context.save();
  context.translate(powerUp.x, powerUp.y);
  context.rotate(powerUp.pulseTime * 2.4);
  context.fillStyle = "rgba(0, 0, 0, 0.5)";
  context.beginPath();
  context.arc(0, 0, powerUp.width * 0.54, 0, 2 * Math.PI);
  context.fill();

  context.strokeStyle = "rgba(130, 236, 255, 0.76)";
  context.lineWidth = 4;
  context.beginPath();
  context.arc(0, 0, powerUp.width * 0.42, 0, 2 * Math.PI);
  context.stroke();

  context.strokeStyle = "rgba(255, 248, 128, 0.9)";
  context.lineWidth = 3;
  for (let index = 0; index < 4; index += 1) {
    const angle = index * Math.PI / 2;
    context.beginPath();
    context.moveTo(Math.cos(angle) * powerUp.width * 0.16, Math.sin(angle) * powerUp.width * 0.16);
    context.lineTo(Math.cos(angle) * powerUp.width * 0.48, Math.sin(angle) * powerUp.width * 0.48);
    context.stroke();
  }

  const gradient = context.createRadialGradient(0, 0, 0, 0, 0, radius);
  gradient.addColorStop(0, "rgba(255, 255, 235, 1)");
  gradient.addColorStop(0.5, "rgba(255, 220, 76, 0.95)");
  gradient.addColorStop(1, "rgba(44, 210, 255, 0.25)");
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(0, 0, radius, 0, 2 * Math.PI);
  context.fill();
  context.restore();
}

function formatLastLaserTheta() {
  if (!enemyLaserManager.lastShot) return "n/a";
  return `${(enemyLaserManager.lastShot.theta * 180 / Math.PI).toFixed(1)} grados`;
}

function formatLastLaserComponent(component) {
  if (!enemyLaserManager.lastShot) return "n/a";
  return enemyLaserManager.lastShot[component].toFixed(1);
}

function formatBossShotTheta() {
  if (!bossManager.lastShot) return "n/a";
  const shots = bossManager.lastShot.shots ?? [bossManager.lastShot];
  return shots
    .map((shot, index) => `L${index + 1}: ${shot.theta.toFixed(3)} rad | ${(shot.theta * 180 / Math.PI).toFixed(1)} grados`)
    .join(" / ");
}

function formatBossShotComponent(component) {
  if (!bossManager.lastShot) return "n/a";
  const shots = bossManager.lastShot.shots ?? [bossManager.lastShot];
  return shots.map((shot, index) => `L${index + 1}:${shot[component].toFixed(1)}`).join(" / ");
}

function getBossSpecialDebugState() {
  const boss = bossManager.boss;
  const specialConfig = getCurrentBossConfig().specialAttack;
  if (!boss || !specialConfig) return "n/a";
  if (specialConfig.type === "spectralLine") {
    const attack = boss.spectralAttack;
    if (!attack) return `cooldown ${boss.specialAttackCooldown.toFixed(2)}s`;
    return `${attack.state} bola ${Math.min(attack.nextShotIndex + 1, attack.balls.length)}/${attack.balls.length}`;
  }
  if (boss.specialTelegraphRemaining > 0) return `telegraph ${boss.specialTelegraphRemaining.toFixed(2)}s`;
  return `cooldown ${boss.specialAttackCooldown.toFixed(2)}s`;
}

function formatBossSpecialFanAngles() {
  const specialConfig = getCurrentBossConfig().specialAttack;
  if (!specialConfig) return "n/a";
  if (specialConfig.type === "spectralLine") return `${specialConfig.projectileCount} bolas | ${specialConfig.shotInterval}s`;

  const startDegrees = specialConfig.startAngle * 180 / Math.PI;
  const endDegrees = specialConfig.endAngle * 180 / Math.PI;
  return `${specialConfig.projectileCount} lasers | ${startDegrees.toFixed(0)}-${endDegrees.toFixed(0)} grados`;
}

function formatBossPlayerHealthDropsDebug(boss) {
  if (!boss) return "n/a";

  const drops = getCurrentBossConfig().playerHealthDrops;
  if (!drops?.length) return String(boss.playerLowHealthDropReleased);

  return drops
    .map((drop, index) => `${Math.round(drop.hpRatio * 100)}%:${Boolean(boss.playerHealthDropsReleased[index])}`)
    .join(" ");
}

function getBossDebugState() {
  if (bossManager.defeated) return "derrotado";
  if (bossManager.boss) return bossManager.boss.hasEnteredCombat ? "activo" : "entrando";
  if (bossManager.created) return "creado sin instancia";
  return "no creado";
}

function drawMuzzleFlash() {
  context.save();
  muzzleFlashes.forEach((flash) => {
    const muzzleConfig = weapon.muzzlePoints.find((point) => point.id === flash.muzzleId);
    if (!muzzleConfig) return;

    const muzzle = getMuzzlePoint(muzzleConfig);
    const progress = flash.activeTime / MUZZLE_FLASH_DURATION;
    const radius = 9 + 10 * progress;

    context.globalAlpha = 0.35 + 0.65 * progress;
    context.fillStyle = "#fff0b8";
    context.beginPath();
    context.arc(muzzle.x, muzzle.y, radius * 0.62, 0, 2 * Math.PI);
    context.fill();

    context.fillStyle = "rgba(255, 35, 18, 0.7)";
    context.beginPath();
    context.arc(muzzle.x, muzzle.y + radius * 0.08, radius * 0.82, 0, 2 * Math.PI);
    context.fill();

    context.fillStyle = "#ff2b12";
    context.beginPath();
    context.moveTo(muzzle.x, muzzle.y - radius * 1.38);
    context.lineTo(muzzle.x - radius * 0.62, muzzle.y + radius * 0.28);
    context.lineTo(muzzle.x, muzzle.y + radius * 0.05);
    context.lineTo(muzzle.x + radius * 0.62, muzzle.y + radius * 0.28);
    context.closePath();
    context.fill();

    context.fillStyle = "#ffb02e";
    context.beginPath();
    context.moveTo(muzzle.x, muzzle.y - radius * 0.82);
    context.lineTo(muzzle.x - radius * 0.28, muzzle.y + radius * 0.08);
    context.lineTo(muzzle.x + radius * 0.28, muzzle.y + radius * 0.08);
    context.closePath();
    context.fill();
  });
  context.restore();
}

function drawMuzzleSmoke() {
  context.save();
  muzzleSmokeParticles.forEach((smoke) => {
    const progress = Math.max(0, 1 - smoke.age / smoke.duration);
    const radius = smoke.radius;

    context.globalAlpha = progress * 0.52;
    context.fillStyle = "rgba(62, 52, 46, 0.72)";
    context.beginPath();
    context.ellipse(smoke.x, smoke.y, radius * 1.15, radius * 0.72, 0, 0, 2 * Math.PI);
    context.fill();

    context.globalAlpha = progress * 0.32;
    context.fillStyle = "rgba(210, 190, 160, 0.58)";
    context.beginPath();
    context.ellipse(smoke.x - radius * 0.12, smoke.y - radius * 0.15, radius * 0.82, radius * 0.5, 0, 0, 2 * Math.PI);
    context.fill();
  });
  context.restore();
}

function drawTankDust() {
  context.save();
  tankDustManager.particles.forEach((particle) => {
    const progress = Math.max(0, 1 - particle.age / particle.duration);
    const radius = particle.radius;

    context.globalAlpha = progress * 0.76;
    context.fillStyle = "rgba(94, 64, 29, 0.78)";
    context.beginPath();
    context.ellipse(particle.x, particle.y, radius * 1.55, radius * 0.72, 0, 0, 2 * Math.PI);
    context.fill();

    context.globalAlpha = progress * 0.48;
    context.fillStyle = "rgba(220, 178, 92, 0.72)";
    context.beginPath();
    context.ellipse(particle.x - radius * 0.18, particle.y - radius * 0.18, radius, radius * 0.48, 0, 0, 2 * Math.PI);
    context.fill();
  });
  context.restore();
}

function drawEnemyHealthBars() {
  context.save();
  enemyManager.enemies.forEach((enemy) => {
    const barWidth = enemy.width * 0.72;
    const barHeight = 5;
    const barX = enemy.x - barWidth / 2;
    const barY = enemy.y - enemy.height / 2 - 12;
    const hpRatio = Math.max(0, enemy.hp / enemy.maxHp);

    context.fillStyle = "rgba(0, 0, 0, 0.55)";
    context.fillRect(barX, barY, barWidth, barHeight);
    context.fillStyle = "#55ff7a";
    context.fillRect(barX, barY, barWidth * hpRatio, barHeight);
  });
  context.restore();
}

function drawBossHealthBar() {
  const boss = bossManager.boss;
  if (!boss || gameState.stage !== STAGES.BOSS) return;

  const barWidth = 620;
  const barHeight = 18;
  const barX = (LOGICAL_WIDTH - barWidth) / 2;
  const barY = 22;
  const hpRatio = Math.max(0, boss.hp / boss.maxHp);
  const label = `BOSS  ${boss.hp} / ${boss.maxHp}`;

  context.save();
  context.fillStyle = "rgba(0, 0, 0, 0.68)";
  context.fillRect(barX - 8, barY - 8, barWidth + 16, barHeight + 34);
  context.strokeStyle = "rgba(255, 65, 65, 0.95)";
  context.lineWidth = 3;
  context.strokeRect(barX - 8, barY - 8, barWidth + 16, barHeight + 34);

  context.fillStyle = "rgba(55, 0, 0, 0.92)";
  context.fillRect(barX, barY, barWidth, barHeight);
  context.fillStyle = "#ff3a3a";
  context.fillRect(barX, barY, barWidth * hpRatio, barHeight);
  context.strokeStyle = "#ffd0d0";
  context.lineWidth = 2;
  context.strokeRect(barX, barY, barWidth, barHeight);

  context.font = "18px Consolas, monospace";
  context.fillStyle = "#ffe3e3";
  context.lineWidth = 4;
  context.strokeStyle = "rgba(0, 0, 0, 0.9)";
  context.strokeText(label, barX, barY + 42);
  context.fillText(label, barX, barY + 42);
  context.restore();
}

function drawTrajectory(trajectoryConfig) {
  context.strokeStyle = trajectoryConfig.color;
  context.lineWidth = 3;
  context.beginPath();
  for (let x = 0; x <= LOGICAL_WIDTH; x += 4) {
    const y = calculateTrajectoryY(trajectoryConfig, x);
    if (x === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  }
  context.stroke();
}

function drawTankCoordinates(entity, label, color) {
  context.fillStyle = color;
  drawDebugText(`${label}: X=${entity.x}, Y=${entity.y}`, entity.x, Math.max(18, entity.y - 10));
  context.strokeStyle = color;
  context.strokeRect(entity.x, entity.y, entity.width, entity.height);
}

function drawMuzzleDebugPoints() {
  context.save();
  context.lineWidth = 2;
  context.font = "16px Consolas, monospace";

  getAllMuzzlePoints().forEach((muzzle) => {
    const isActive = muzzle.id <= weapon.level;
    context.strokeStyle = isActive ? "#ff2cff" : "#ffffff";
    context.fillStyle = isActive ? "#ffecff" : "#ffffff";
    context.beginPath();
    context.moveTo(muzzle.x - 8, muzzle.y);
    context.lineTo(muzzle.x + 8, muzzle.y);
    context.moveTo(muzzle.x, muzzle.y - 8);
    context.lineTo(muzzle.x, muzzle.y + 8);
    context.stroke();
    context.beginPath();
    context.arc(muzzle.x, muzzle.y, 3, 0, 2 * Math.PI);
    context.fill();
    drawDebugText(String(muzzle.id), muzzle.x + 7, muzzle.y - 7);
  });

  context.restore();
}

function drawRocketDebugMarkers() {
  context.save();
  context.lineWidth = 2;
  context.font = "16px Consolas, monospace";

  rocketManager.missiles.forEach((missile) => {
    context.strokeStyle = "#47f6ff";
    context.fillStyle = "#c9fbff";
    context.beginPath();
    context.moveTo(missile.x, missile.y - 11);
    context.lineTo(missile.x + 11, missile.y);
    context.lineTo(missile.x, missile.y + 11);
    context.lineTo(missile.x - 11, missile.y);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.moveTo(missile.x + Math.cos(missile.angle) * 15, missile.y + Math.sin(missile.angle) * 15);
    context.lineTo(missile.x - Math.sin(missile.angle) * 6, missile.y + Math.cos(missile.angle) * 6);
    context.lineTo(missile.x + Math.sin(missile.angle) * 6, missile.y - Math.cos(missile.angle) * 6);
    context.closePath();
    context.fill();

    drawDebugText(
      `R${missile.id}: X=${missile.x.toFixed(1)}, Y=${missile.y.toFixed(1)}, theta=${missile.angle.toFixed(2)}`,
      missile.x + 14,
      Math.max(18, missile.y - 14),
    );
  });

  context.restore();
}

function drawEnemyCoordinates(enemy) {
  const left = enemy.x - enemy.width / 2;
  const top = enemy.y - enemy.height / 2;

  context.fillStyle = enemy.color;
  drawDebugText(
    `${enemy.label}: ${enemy.trajectory.type}, X=${enemy.x.toFixed(1)}, Y=${enemy.y.toFixed(1)}, HP=${enemy.hp}/${enemy.maxHp}, midline=${enemy.midline}`,
    left,
    Math.max(18, top - 10),
  );
  context.strokeStyle = enemy.color;
  context.strokeRect(left, top, enemy.width, enemy.height);
  context.beginPath();
  context.arc(enemy.x, enemy.y, 4, 0, 2 * Math.PI);
  context.fill();
}

function drawBossDebugBounds() {
  const boss = bossManager.boss;
  if (!boss) return;

  const left = boss.x - boss.width / 2;
  const top = boss.y - boss.height / 2;
  const projectileBounds = getProjectileTargetBounds(boss);
  context.fillStyle = "#ff8080";
  drawDebugText(`Boss hitbox: X=${boss.x.toFixed(1)}, Y=${boss.y.toFixed(1)}`, left, Math.max(18, top - 10));
  context.strokeStyle = "#ff8080";
  context.strokeRect(left, top, boss.width, boss.height);
  context.strokeStyle = "#ffe066";
  context.strokeRect(
    projectileBounds.left,
    projectileBounds.top,
    projectileBounds.right - projectileBounds.left,
    projectileBounds.bottom - projectileBounds.top,
  );
  context.beginPath();
  context.arc(boss.x, boss.y, 4, 0, 2 * Math.PI);
  context.fill();
}

function updateGameplay(deltaSeconds) {
  updateTank(deltaSeconds);
  enemyManager.update(deltaSeconds);
  bossManager.update(deltaSeconds);
  enemyLaserManager.update(deltaSeconds);
  if (!isGameplayActive()) return;

  projectileManager.update(deltaSeconds);
  handleProjectileEnemyCollisions();
  rocketManager.update(deltaSeconds);
  if (!isGameplayActive()) return;

  powerUpManager.update(deltaSeconds);
  healthDropManager.update(deltaSeconds);
  explosionManager.update(deltaSeconds);
  enemyDeathVisualManager.update(deltaSeconds);
  laserTankImpactManager.update(deltaSeconds);
  projectileImpactManager.update(deltaSeconds);
  rocketExplosionManager.update(deltaSeconds);
  groundLaserImpactFlashManager.update(deltaSeconds);
  updateMuzzleFlash(deltaSeconds);
  updateMuzzleSmoke(deltaSeconds);
}

function updatePlayerDying(deltaSeconds) {
  explosionManager.update(deltaSeconds);
  projectileImpactManager.update(deltaSeconds);
  rocketExplosionManager.update(deltaSeconds);
  rocketManager.updateSmoke(deltaSeconds);
  updateMuzzleSmoke(deltaSeconds);
}

function updateGame(deltaSeconds) {
  if (gameState.status === GAME_STATES.PLAYING) {
    updateGameplay(deltaSeconds);
    return;
  }

  if (gameState.status === GAME_STATES.PLAYER_DYING) {
    updatePlayerDying(deltaSeconds);
    return;
  }

  if (gameState.status === GAME_STATES.BOSS_DEFEATED) {
    explosionManager.update(deltaSeconds);
    projectileImpactManager.update(deltaSeconds);
    rocketExplosionManager.update(deltaSeconds);
    rocketManager.updateSmoke(deltaSeconds);
    updateMuzzleSmoke(deltaSeconds);
  }
}

function positionTankSprite() {
  tankSprite.style.display = tank.visible ? "block" : "none";
  positionSpriteFromTopLeft(tankSprite, tank);
}

let previousTime = performance.now();

function render(currentTime) {
  const deltaSeconds = Math.min((currentTime - previousTime) / 1000, 0.05);
  previousTime = currentTime;
  updateGame(deltaSeconds);
  context.clearRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
  drawTankDust();
  drawProjectiles();
  drawRocketSmoke();
  drawRockets();
  drawBossSpecialTelegraph();
  drawBossSpectralBalls();
  drawEnemyLasers();
  drawLaserTankImpacts();
  drawProjectileImpacts();
  drawRocketExplosions();
  drawGroundLaserImpactFlashes();
  drawHealthDrops();
  drawCanvasPowerUps();
  drawMuzzleSmoke();
  drawMuzzleFlash();
  drawEnemyHealthBars();
  drawBossHealthBar();
  positionTankSprite();
  enemyManager.enemies.forEach((enemy) => positionSpriteFromCenter(enemy.sprite, enemy));
  if (bossManager.boss) positionSpriteFromAnchor(bossManager.boss.sprite, bossManager.boss);
  enemyDeathVisualManager.visuals.forEach((visual) => positionSpriteFromCenter(visual.sprite, visual));
  explosionManager.explosions.forEach((explosion) => positionSpriteFromAnchor(explosion.sprite, explosion));
  if (powerUpManager.heavyMachineGun.active) {
    positionSpriteFromCenter(powerUpManager.heavyMachineGun.active.sprite, powerUpManager.heavyMachineGun.active);
  }
  if (powerUpManager.rocketLauncher.active) {
    positionSpriteFromCenter(powerUpManager.rocketLauncher.active.sprite, powerUpManager.rocketLauncher.active);
  }
  if (powerUpManager.rocketUpgrade.active) {
    positionSpriteFromCenter(powerUpManager.rocketUpgrade.active.sprite, powerUpManager.rocketUpgrade.active);
  }
  if (debug.enabled && gameState.status !== GAME_STATES.LEVEL_COMPLETE && gameState.status !== GAME_STATES.LEVEL_PREVIEW) drawDebug();
  updateDebugPresentationPanelVisibility();
  drawScoreHud();
  drawRocketHud();
  requestAnimationFrame(render);
}

window.addEventListener("keydown", (event) => {
  if (event.code === "ArrowLeft" || event.code === "ArrowRight" || event.code === "Space" || event.code === "Escape") {
    event.preventDefault();
  }

  if (event.code === "Escape" && !event.repeat) {
    togglePause();
    return;
  }

  if (event.code === "KeyQ" && !event.repeat) {
    debug.enabled = !debug.enabled;
    if (!debug.enabled) debug.presentationPanelOpen = false;
    return;
  }

  if (!isGameplayActive()) return;

  if (event.code === "KeyA" || event.code === "ArrowLeft") input.left = true;
  if (event.code === "KeyD" || event.code === "ArrowRight") input.right = true;
  if (event.code === "Space") input.fire = true;
});

window.addEventListener("keyup", (event) => {
  if (event.code === "KeyA" || event.code === "ArrowLeft") input.left = false;
  if (event.code === "KeyD" || event.code === "ArrowRight") input.right = false;
  if (event.code === "Space") input.fire = false;
});

window.addEventListener("blur", () => {
  clearInputState();
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) clearInputState();
});

checkpointButton.addEventListener("click", restoreLevelCheckpoint);
retryButton.addEventListener("click", restartCurrentLevel);
mainMenuButton.addEventListener("click", returnToMainMenu);
continueButton.addEventListener("click", resumeGame);
pauseRestartButton.addEventListener("click", restartCurrentLevel);
pauseMenuButton.addEventListener("click", returnToMainMenu);
nextLevelButton.addEventListener("click", startNextLevel);
levelCompleteMenuButton.addEventListener("click", returnToMainMenu);
nextLevelMenuButton.addEventListener("click", returnToMainMenu);
startGameButton.addEventListener("click", restartCurrentLevel);
debugPresentationToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  setDebugPresentationPanelOpen(!debug.presentationPanelOpen);
});
debugLoadStageButton.addEventListener("click", () => {
  applyDebugPresentationStage(debugStageSelect.value);
  setDebugPresentationPanelOpen(false);
});
debugRestartLevelButton.addEventListener("click", restartCurrentLevelFromDebug);

["pointerdown", "pointerup", "click", "dblclick", "mousedown", "mouseup"].forEach((eventName) => {
  [debugPresentationToggle, debugPresentationPanel].forEach((element) => {
    element.addEventListener(eventName, (event) => {
      event.stopPropagation();
    });
  });
});

debugPresentationPanel.addEventListener("keydown", (event) => {
  event.stopPropagation();
  if (event.code === "Escape" && !event.repeat) {
    event.preventDefault();
    togglePause();
    return;
  }
  if (event.code === "Space") event.preventDefault();
});

requestAnimationFrame(render);
