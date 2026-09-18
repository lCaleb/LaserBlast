const LOGICAL_WIDTH = 1200;
const LOGICAL_HEIGHT = 675;

const canvas = document.querySelector("#game-canvas");
const context = canvas.getContext("2d");
const stage = document.querySelector(".game-stage");
const tankSprite = document.querySelector("#tank-sprite");
const debugPresentationToggle = document.querySelector("#debug-presentation-toggle");
const debugPresentationPanel = document.querySelector("#debug-presentation-panel");
const debugStageSelect = document.querySelector("#debug-stage-select");
const debugLoadStageButton = document.querySelector("#debug-load-stage-button");
const debugRestartLevelButton = document.querySelector("#debug-restart-level-button");
const gameOverOverlay = document.querySelector("#game-over-overlay");
const gameOverScore = document.querySelector("#game-over-score");
const gameOverLevel = document.querySelector("#game-over-level");
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
const PROJECTILE_SPEED = 520;
const TANK_WIDTH = 165;
const TANK_HEIGHT = 82;
const TANK_START_X = (LOGICAL_WIDTH - TANK_WIDTH) / 2;
const TANK_START_Y = 550;
const TANK_MAX_HP = 100;
const STARTING_WEAPON_LEVEL = 1;
const PROJECTILE_FIRE_INTERVAL = 0.09;
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

const STAGES = {
  INICIO: "INICIO",
  NUDO: "NUDO",
  BOSS: "BOSS",
};

const GAME_STATES = {
  MENU: "MENU",
  PLAYING: "PLAYING",
  PLAYER_DYING: "PLAYER_DYING",
  BOSS_DEFEATED: "BOSS_DEFEATED",
  LEVEL_COMPLETE: "LEVEL_COMPLETE",
  LEVEL_PREVIEW: "LEVEL_PREVIEW",
  GAME_OVER: "GAME_OVER",
};

const LEVEL_CONFIG = {
  1: {
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
  2: { normalEnemy: { hp: 40 } },
  3: { normalEnemy: { hp: 50 } },
  4: { normalEnemy: { hp: 60 } },
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
};

let currentLevel = 1;

const gameState = {
  status: GAME_STATES.MENU,
  score: 0,
  stage: STAGES.INICIO,
  normalEnemiesDestroyed: 0,
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

const weapon = {
  level: STARTING_WEAPON_LEVEL,
  projectileDamage: 2,
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
      this.fireCooldown = PROJECTILE_FIRE_INTERVAL;
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

  update(deltaSeconds) {
    this.trySpawnHeavyMachineGun();
    this.updateHeavyMachineGun(deltaSeconds);
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

  clear() {
    this.removeHeavyMachineGun();
    this.heavyMachineGun.generated = false;
    this.heavyMachineGun.collected = false;
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
        healTank(getCurrentHealthDropConfig().healAmount);
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
  spawnTimer: 0,

  update(deltaSeconds) {
    const stageConfig = getCurrentStageConfig();
    if (!stageConfig.spawnsNormalEnemies) return;

    this.spawnTimer -= deltaSeconds;
    while (this.enemies.length < stageConfig.maxNormalEnemies && this.spawnTimer <= 0) {
      this.createEnemy();
      this.spawnTimer += stageConfig.spawnInterval;
    }

    this.enemies.forEach((enemy) => updateEnemy(enemy, deltaSeconds));
  },

  createEnemy() {
    const variant = this.getNextVariant();
    const typeConfig = buildEnemyConfig(variant.spriteKey, variant.functionKey);
    const midline = this.getNextLane();
    const maxHp = getCurrentEnemyHp();
    const trajectoryConfig = getCurrentNormalEnemyTrajectoryConfig();
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
        amplitude: trajectoryConfig.amplitude,
        period: trajectoryConfig.period,
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
      trajectory: { ...config.trajectory },
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
  },

  update(deltaSeconds) {
    this.tryCreateBoss();
    const boss = this.boss;
    if (!boss || this.defeated) return;

    updateBoss(boss, deltaSeconds);
    this.updateBossFire(boss, deltaSeconds);
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

  damageBoss(damage) {
    const boss = this.boss;
    if (!boss || this.defeated || boss.deathProcessed) return;

    boss.hp = Math.max(0, boss.hp - damage);
    if (boss.hp <= 0) this.defeatBoss();
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

function getCurrentLevelStartConfig() {
  return getCurrentLevelConfig().start;
}

function getCurrentStageConfig() {
  return getCurrentLevelConfig().stages[gameState.stage];
}

function getCurrentNormalEnemyTrajectoryConfig() {
  return getCurrentLevelConfig().normalEnemy.trajectory;
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
  gameOverOverlay.hidden = false;
}

function hideGameOver() {
  gameOverOverlay.hidden = true;
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

function showMainMenu() {
  mainMenuOverlay.hidden = false;
}

function hideMainMenu() {
  mainMenuOverlay.hidden = true;
}

function hideAllOverlays() {
  hideGameOver();
  hideLevelComplete();
  hideNextLevelPreview();
  hideMainMenu();
}

function cleanupCurrentAttempt() {
  projectileManager.clear();
  enemyLaserManager.clear();
  enemyManager.reset();
  bossManager.clear();
  explosionManager.clear();
  enemyDeathVisualManager.clear();
  laserTankImpactManager.clear();
  projectileImpactManager.clear();
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
  enemyLaserManager.clear();
  enemyManager.reset();
  bossManager.clear();
  explosionManager.clear();
  enemyDeathVisualManager.clear();
  laserTankImpactManager.clear();
  projectileImpactManager.clear();
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

function resetCurrentLevelState() {
  const startConfig = getCurrentLevelStartConfig();

  gameState.score = 0;
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
  enemyManager.spawnTimer = 0;
}

function restartCurrentLevel() {
  cleanupCurrentAttempt();
  debug.presentationModeActive = false;
  resetCurrentLevelState();
  hideAllOverlays();
}

function returnToMainMenu() {
  cleanupCurrentAttempt();
  debug.presentationModeActive = false;
  currentLevel = 1;
  resetCurrentLevelState();
  gameState.status = GAME_STATES.MENU;
  hideAllOverlays();
  showMainMenu();
}

function goToNextLevelPreview() {
  if (gameState.status !== GAME_STATES.LEVEL_COMPLETE) return;

  cleanupCompletedLevel();
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

function getDebugPresentationStageConfig(stageName) {
  const level = 1;
  const levelConfig = LEVEL_CONFIG[level];
  const debugConfig = DEBUG_PRESENTATION_CONFIG[level];
  const inicioTarget = levelConfig.stages[STAGES.INICIO].normalKillTarget;
  const nudoTarget = levelConfig.stages[STAGES.NUDO].normalKillTarget;
  const killsByStage = {
    [STAGES.INICIO]: 0,
    [STAGES.NUDO]: inicioTarget,
    [STAGES.BOSS]: nudoTarget,
  };
  const normalEnemiesDestroyed = killsByStage[stageName] ?? 0;

  return {
    level,
    stage: stageName,
    normalEnemiesDestroyed,
    score: normalEnemiesDestroyed * SCORE_CONFIG.normalEnemyDestroyed,
    weaponLevel: debugConfig.weaponLevelByStage[stageName] ?? levelConfig.start.weaponLevel,
    tankHp: levelConfig.start.tankHp,
  };
}

function applyDebugPresentationStage(stageName) {
  const config = getDebugPresentationStageConfig(stageName);

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
  enemyManager.spawnTimer = 0;
  configureDebugPresentationHeavyState(config);

  if (config.stage === STAGES.BOSS) {
    bossManager.tryCreateBoss();
  }

  updateDebugPresentationPanelVisibility();
}

function configureDebugPresentationHeavyState(config) {
  const heavyConfig = LEVEL_CONFIG[config.level].powerUps?.heavyMachineGun;
  const heavyWasAvailable = Boolean(heavyConfig && config.normalEnemiesDestroyed >= heavyConfig.normalKillTrigger);

  powerUpManager.heavyMachineGun.generated = heavyWasAvailable;
  powerUpManager.heavyMachineGun.collected = heavyWasAvailable;
  powerUpManager.heavyMachineGun.active = null;
}

function restartCurrentLevelFromDebug() {
  restartCurrentLevel();
  updateDebugPresentationPanelVisibility();
}

function setDebugPresentationPanelOpen(isOpen) {
  debug.presentationPanelOpen = isOpen;
  if (isOpen) {
    debugStageSelect.value = Object.values(STAGES).includes(gameState.stage) ? gameState.stage : STAGES.INICIO;
  }
  updateDebugPresentationPanelVisibility();
}

function showDebugTerminalControls() {
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
  tank.x += direction * TANK_SPEED * deltaSeconds;
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
  const angle = (2 * Math.PI / entity.trajectory.period) * x;
  const wave = entity.trajectory.type === "cos" ? Math.cos(angle) : Math.sin(angle);
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
  powerUpManager.trySpawnHeavyMachineGun();
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

  if (stageName === STAGES.BOSS) {
    enemyManager.clearNormalEnemies();
    bossManager.tryCreateBoss();
  }
}

function isProjectileCollidingWithEnemy(projectile, enemy) {
  return Boolean(getProjectileEnemyOverlap(projectile, enemy));
}

function getProjectileEnemyOverlap(projectile, enemy) {
  const projectileLeft = projectile.x - projectile.width / 2;
  const projectileRight = projectile.x + projectile.width / 2;
  const projectileTop = projectile.y;
  const projectileBottom = projectile.y + projectile.height;
  const enemyLeft = enemy.x - enemy.width / 2;
  const enemyRight = enemy.x + enemy.width / 2;
  const enemyTop = enemy.y - enemy.height / 2;
  const enemyBottom = enemy.y + enemy.height / 2;

  const left = Math.max(projectileLeft, enemyLeft);
  const right = Math.min(projectileRight, enemyRight);
  const top = Math.max(projectileTop, enemyTop);
  const bottom = Math.min(projectileBottom, enemyBottom);

  if (right < left || bottom < top) return null;

  return {
    left,
    right,
    top,
    bottom,
    enemyBottom,
  };
}

function getProjectileEnemyImpactPoint(projectile, enemy) {
  const overlap = getProjectileEnemyOverlap(projectile, enemy);
  if (!overlap) return null;

  return {
    x: (overlap.left + overlap.right) / 2,
    y: overlap.enemyBottom,
  };
}

function getNormalEnemyProjectileImpactRadius(enemy) {
  return Math.max(6.5, Math.min(11.5, enemy.width * 0.12));
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

  tank.hp = Math.max(0, tank.hp - damage);
  if (tank.hp <= 0) beginTankDeath();
}

function healTank(healAmount) {
  tank.hp = Math.min(tank.maxHp, tank.hp + healAmount);
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
  const waveFunction = trajectory.type === "cos" ? "Math.cos" : "Math.sin";
  return `y = ${trajectory.midline} + ${trajectory.amplitude} * ${waveFunction}((2 * Math.PI / ${trajectory.period}) * x)`;
}

function getActiveTrajectoryConfigs() {
  const configs = new Map();

  enemyManager.enemies.forEach((enemy) => {
    const key = `${enemy.typeKey}-${enemy.midline}`;
    if (configs.has(key)) return;
    configs.set(key, {
      color: enemy.color,
      label: `${enemy.trajectory.type} carril ${enemy.midline}`,
      trajectory: enemy.trajectory,
    });
  });

  if (gameState.stage === STAGES.BOSS && (bossManager.boss || bossManager.created)) {
    configs.set("boss-1", {
      color: "#55ff7a",
      label: "Boss 1 seno",
      trajectory: bossManager.boss?.trajectory ?? getCurrentBossConfig().trajectory,
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
  panelY += 24;

  if (gameState.stage === STAGES.BOSS || bossManager.defeated) {
    const boss = bossManager.boss;
    const bossConfig = getCurrentBossConfig();
    const bossTrajectory = boss?.trajectory ?? bossConfig.trajectory;
    context.fillStyle = "#ff8080";
    drawDebugText(`Boss estado: ${getBossDebugState()}`, panelX, panelY);
    drawDebugText(`HP Boss: ${boss ? `${boss.hp}/${boss.maxHp}` : "n/a"}`, panelX + 250, panelY);
    panelY += 20;
    drawDebugText(`Boss funcion: ${bossTrajectory.type}`, panelX, panelY);
    drawDebugText(`D=${bossTrajectory.midline} | A=${bossTrajectory.amplitude} | T=${bossTrajectory.period}`, panelX + 250, panelY);
    panelY += 20;
    drawDebugText(`Boss ecuacion: ${getTrajectoryEquation(bossTrajectory)}`, panelX, panelY);
    panelY += 20;
    drawDebugText(`Boss X=${boss ? boss.x.toFixed(1) : "n/a"} | Y=${boss ? boss.y.toFixed(1) : "n/a"} | dir=${boss ? boss.direction : "n/a"}`, panelX, panelY);
    panelY += 20;
    drawDebugText(`Boss ataques: ${bossManager.attackCounter}`, panelX, panelY);
    drawDebugText(`Proximo ataque: ${getBossNextAttackType()}`, panelX + 250, panelY);
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
    drawDebugText(
      `A = ${trajectoryConfig.trajectory.amplitude} | D = ${trajectoryConfig.trajectory.midline} | Periodo = ${trajectoryConfig.trajectory.period}`,
      panelX,
      panelY + 20,
    );
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

function drawScoreHud() {
  const scoreText = `PUNTOS: ${gameState.score}`;
  const hpText = `VIDA: ${tank.hp}/${tank.maxHp}`;
  const levelText = `NIVEL ${currentLevel}`;
  const stageText = gameState.stage;
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
  const barWidth = 170;
  const barHeight = 10;
  const x = LOGICAL_WIDTH - Math.max(scoreWidth, hpWidth, levelWidth, stageWidth, barWidth) - 24;

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

  if (bossManager.defeated) {
    context.fillStyle = "#ffef8a";
    context.strokeText(bossDefeatedText, x, 166);
    context.fillText(bossDefeatedText, x, 166);
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

function drawEnemyLasers() {
  context.save();
  enemyLaserManager.lasers.forEach((laser) => {
    const endX = laser.x - Math.cos(laser.theta) * laser.length;
    const endY = laser.y - Math.sin(laser.theta) * laser.length;
    const isBossLaser = laser.type === "boss";
    const lineWidth = laser.lineWidth ?? ENEMY_LASER_LINE_WIDTH;
    const gradient = context.createLinearGradient(endX, endY, laser.x, laser.y);
    if (isBossLaser) {
      gradient.addColorStop(0, "rgba(255, 20, 20, 0)");
      gradient.addColorStop(0.45, "rgba(255, 34, 34, 0.86)");
      gradient.addColorStop(1, "rgba(255, 220, 220, 1)");
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

    context.strokeStyle = isBossLaser ? "rgba(255, 20, 20, 0.25)" : "rgba(62, 255, 126, 0.22)";
    context.lineWidth = lineWidth + (isBossLaser ? 13 : 8);
    context.beginPath();
    context.moveTo(endX, endY);
    context.lineTo(laser.x, laser.y);
    context.stroke();

    context.strokeStyle = isBossLaser ? "rgba(255, 75, 75, 0.58)" : "rgba(91, 255, 150, 0.45)";
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
  context.fillStyle = "#ff8080";
  drawDebugText(`Boss hitbox: X=${boss.x.toFixed(1)}, Y=${boss.y.toFixed(1)}`, left, Math.max(18, top - 10));
  context.strokeStyle = "#ff8080";
  context.strokeRect(left, top, boss.width, boss.height);
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
  if (!isGameplayActive()) return;

  powerUpManager.update(deltaSeconds);
  healthDropManager.update(deltaSeconds);
  explosionManager.update(deltaSeconds);
  enemyDeathVisualManager.update(deltaSeconds);
  laserTankImpactManager.update(deltaSeconds);
  projectileImpactManager.update(deltaSeconds);
  groundLaserImpactFlashManager.update(deltaSeconds);
  updateMuzzleFlash(deltaSeconds);
  updateMuzzleSmoke(deltaSeconds);
}

function updatePlayerDying(deltaSeconds) {
  explosionManager.update(deltaSeconds);
  projectileImpactManager.update(deltaSeconds);
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
  drawEnemyLasers();
  drawLaserTankImpacts();
  drawProjectileImpacts();
  drawGroundLaserImpactFlashes();
  drawHealthDrops();
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
  if (debug.enabled && gameState.status !== GAME_STATES.LEVEL_COMPLETE && gameState.status !== GAME_STATES.LEVEL_PREVIEW) drawDebug();
  updateDebugPresentationPanelVisibility();
  drawScoreHud();
  requestAnimationFrame(render);
}

window.addEventListener("keydown", (event) => {
  if (event.code === "ArrowLeft" || event.code === "ArrowRight" || event.code === "Space") {
    event.preventDefault();
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
  if (!isGameplayActive()) return;

  if (event.code === "KeyA" || event.code === "ArrowLeft") input.left = false;
  if (event.code === "KeyD" || event.code === "ArrowRight") input.right = false;
  if (event.code === "Space") input.fire = false;
});

window.addEventListener("blur", () => {
  clearInputState();
});

retryButton.addEventListener("click", restartCurrentLevel);
mainMenuButton.addEventListener("click", returnToMainMenu);
nextLevelButton.addEventListener("click", goToNextLevelPreview);
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
  if (event.code === "Space") event.preventDefault();
});

requestAnimationFrame(render);
