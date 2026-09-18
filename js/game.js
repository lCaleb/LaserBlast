const LOGICAL_WIDTH = 1200;
const LOGICAL_HEIGHT = 675;

const canvas = document.querySelector("#game-canvas");
const context = canvas.getContext("2d");
const stage = document.querySelector(".game-stage");
const tankSprite = document.querySelector("#tank-sprite");

const ENEMY_SPEED = 180;
const TANK_SPEED = 260;
const PROJECTILE_SPEED = 520;
const PROJECTILE_FIRE_INTERVAL = 0.09;
const MUZZLE_FLASH_DURATION = 0.055;
const ENEMY_LASER_LENGTH = 34;
const ENEMY_LASER_LINE_WIDTH = 3;
const EXPLOSION_ASSET = "assets/gif/exploci\u00f3n3.gif";
const EXPLOSION_DURATION = 0.75;
const EXPLOSION_WIDTH = 80;
const EXPLOSION_HEIGHT = 119;
const ENEMY_DEATH_VISUAL_DELAY = 0.5;

const STAGES = {
  INICIO: "INICIO",
  NUDO: "NUDO",
  BOSS: "BOSS",
};

const LEVEL_CONFIG = {
  1: {
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

let currentLevel = 1;

const gameState = {
  score: 0,
  stage: STAGES.INICIO,
  normalEnemiesDestroyed: 0,
};

const debug = {
  enabled: true,
  gridStep: 100,
  groundY: 605,
};

const tank = {
  x: 95,
  y: 550,
  width: 165,
  height: 82,
};

const weapon = {
  level: 1,
  projectileDamage: 20,
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
    });
  },

  removeExitedProjectiles() {
    this.projectiles = this.projectiles.filter((projectile) => projectile.y + projectile.height > 0);
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
    this.removeExitedLasers();
  },

  updateEnemyFire(enemy, deltaSeconds) {
    const laserConfig = getCurrentEnemyLaserConfig();
    enemy.laserCooldown -= deltaSeconds;

    if (enemy.laserCooldown > 0) return;

    this.createLaser(enemy, laserConfig);
    enemy.laserCooldown += laserConfig.fireInterval;
  },

  createLaser(enemy, laserConfig) {
    const tankCenter = getTankCenter();
    const dx = tankCenter.x - enemy.x;
    const dy = tankCenter.y - enemy.y;
    const theta = Math.atan2(dy, dx);
    const vx = laserConfig.speed * Math.cos(theta);
    const vy = laserConfig.speed * Math.sin(theta);
    const laser = {
      id: this.nextId,
      x: enemy.x,
      y: enemy.y,
      theta,
      vx,
      vy,
      length: ENEMY_LASER_LENGTH,
    };

    this.lasers.push(laser);
    this.lastShot = { theta, vx, vy };
    this.nextId += 1;
  },

  removeExitedLasers() {
    this.lasers = this.lasers.filter((laser) => !hasLaserExited(laser));
  },
};

const explosionManager = {
  explosions: [],
  nextId: 1,

  createExplosion(x, y) {
    const sprite = document.createElement("img");
    const explosion = {
      id: this.nextId,
      sprite,
      x,
      y,
      width: EXPLOSION_WIDTH,
      height: EXPLOSION_HEIGHT,
      remainingTime: EXPLOSION_DURATION,
    };

    sprite.className = "game-sprite";
    sprite.src = EXPLOSION_ASSET;
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

      explosion.sprite.remove();
      this.explosions.splice(index, 1);
    }
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
};

function getEnemySpawnX(typeConfig) {
  if (typeConfig.direction > 0) return -typeConfig.width / 2;
  return LOGICAL_WIDTH + typeConfig.width / 2;
}

function getCurrentEnemyHp() {
  return getCurrentLevelConfig().normalEnemy.hp;
}

function getCurrentLevelConfig() {
  return LEVEL_CONFIG[currentLevel];
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

function getInitialEnemyLaserCooldown(enemyId) {
  const laserConfig = getCurrentEnemyLaserConfig();
  const spreadSlots = enemyVariants.length;
  return ((enemyId - 1) % spreadSlots) * (laserConfig.fireInterval / spreadSlots);
}

function getCurrentHeavyMachineGunConfig() {
  return getCurrentLevelConfig().powerUps?.heavyMachineGun ?? null;
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

function updateTank(deltaSeconds) {
  const direction = Number(input.right) - Number(input.left);
  tank.x += direction * TANK_SPEED * deltaSeconds;
  tank.x = Math.max(0, Math.min(LOGICAL_WIDTH - tank.width, tank.x));
}

function updateMuzzleFlash(deltaSeconds) {
  for (let index = muzzleFlashes.length - 1; index >= 0; index -= 1) {
    muzzleFlashes[index].activeTime -= deltaSeconds;
    if (muzzleFlashes[index].activeTime <= 0) muzzleFlashes.splice(index, 1);
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

function handleProjectileEnemyCollisions() {
  for (let projectileIndex = projectileManager.projectiles.length - 1; projectileIndex >= 0; projectileIndex -= 1) {
    const projectile = projectileManager.projectiles[projectileIndex];
    const enemy = enemyManager.enemies.find((activeEnemy) => isProjectileCollidingWithEnemy(projectile, activeEnemy));

    if (!enemy) continue;

    projectileManager.projectiles.splice(projectileIndex, 1);
    enemy.hp -= weapon.projectileDamage;

    if (enemy.hp <= 0) {
      explosionManager.createExplosion(enemy.x, enemy.y);
      enemyDeathVisualManager.keepSpriteTemporarily(enemy);
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
  }
}

function isProjectileCollidingWithEnemy(projectile, enemy) {
  const projectileLeft = projectile.x - projectile.width / 2;
  const projectileRight = projectile.x + projectile.width / 2;
  const projectileTop = projectile.y;
  const projectileBottom = projectile.y + projectile.height;
  const enemyLeft = enemy.x - enemy.width / 2;
  const enemyRight = enemy.x + enemy.width / 2;
  const enemyTop = enemy.y - enemy.height / 2;
  const enemyBottom = enemy.y + enemy.height / 2;

  return (
    projectileRight >= enemyLeft &&
    projectileLeft <= enemyRight &&
    projectileBottom >= enemyTop &&
    projectileTop <= enemyBottom
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
  drawDebugText(`Max simultaneo: ${stageConfig.maxNormalEnemies}`, panelX, panelY);
  drawDebugText(`Intervalo spawn: ${stageConfig.spawnInterval ?? "sin spawn"}s`, panelX + 250, panelY);
  panelY += 24;
  drawDebugText(`Laseres enemigos: ${enemyLaserManager.lasers.length}`, panelX, panelY);
  drawDebugText(`theta ultimo: ${formatLastLaserTheta()}`, panelX + 250, panelY);
  panelY += 20;
  drawDebugText(`vx ultimo: ${formatLastLaserComponent("vx")}`, panelX, panelY);
  drawDebugText(`vy ultimo: ${formatLastLaserComponent("vy")}`, panelX + 250, panelY);
  panelY += 24;
  drawDebugText(`Heavy generado: ${powerUpManager.heavyMachineGun.generated}`, panelX, panelY);
  drawDebugText(`Heavy activo: ${Boolean(powerUpManager.heavyMachineGun.active)}`, panelX + 250, panelY);
  panelY += 20;
  drawDebugText(`weapon.level: ${weapon.level}`, panelX, panelY);
  panelY += 24;

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
  const levelText = `NIVEL ${currentLevel}`;
  const stageText = gameState.stage;

  context.save();
  context.font = "24px Consolas, monospace";
  context.fillStyle = "#fff6a6";
  context.lineWidth = 4;
  context.strokeStyle = "rgba(0, 0, 0, 0.9)";

  const scoreWidth = context.measureText(scoreText).width;
  const levelWidth = context.measureText(levelText).width;
  const stageWidth = context.measureText(stageText).width;
  const x = LOGICAL_WIDTH - Math.max(scoreWidth, levelWidth, stageWidth) - 24;

  context.strokeText(scoreText, x, 34);
  context.fillText(scoreText, x, 34);
  context.strokeText(levelText, x, 62);
  context.fillText(levelText, x, 62);
  context.strokeText(stageText, x, 90);
  context.fillText(stageText, x, 90);
  context.restore();
}

function drawProjectiles() {
  context.save();
  projectileManager.projectiles.forEach((projectile) => {
    const gradient = context.createLinearGradient(projectile.x, projectile.y, projectile.x, projectile.y + projectile.height);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.45, "rgba(255, 242, 115, 1)");
    gradient.addColorStop(1, "rgba(255, 132, 38, 0.45)");
    context.fillStyle = gradient;
    context.fillRect(projectile.x - projectile.width / 2, projectile.y, projectile.width, projectile.height);
  });
  context.restore();
}

function drawEnemyLasers() {
  context.save();
  enemyLaserManager.lasers.forEach((laser) => {
    const endX = laser.x - Math.cos(laser.theta) * laser.length;
    const endY = laser.y - Math.sin(laser.theta) * laser.length;
    const gradient = context.createLinearGradient(endX, endY, laser.x, laser.y);
    gradient.addColorStop(0, "rgba(72, 255, 128, 0)");
    gradient.addColorStop(0.45, "rgba(92, 255, 150, 0.75)");
    gradient.addColorStop(1, "rgba(210, 255, 220, 1)");

    context.lineCap = "round";
    context.strokeStyle = "rgba(62, 255, 126, 0.22)";
    context.lineWidth = ENEMY_LASER_LINE_WIDTH + 8;
    context.beginPath();
    context.moveTo(endX, endY);
    context.lineTo(laser.x, laser.y);
    context.stroke();

    context.strokeStyle = "rgba(91, 255, 150, 0.45)";
    context.lineWidth = ENEMY_LASER_LINE_WIDTH + 4;
    context.beginPath();
    context.moveTo(endX, endY);
    context.lineTo(laser.x, laser.y);
    context.stroke();

    context.strokeStyle = gradient;
    context.lineWidth = ENEMY_LASER_LINE_WIDTH;
    context.beginPath();
    context.moveTo(endX, endY);
    context.lineTo(laser.x, laser.y);
    context.stroke();
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

function drawMuzzleFlash() {
  context.save();
  muzzleFlashes.forEach((flash) => {
    const muzzleConfig = weapon.muzzlePoints.find((point) => point.id === flash.muzzleId);
    if (!muzzleConfig) return;

    const muzzle = getMuzzlePoint(muzzleConfig);
    const progress = flash.activeTime / MUZZLE_FLASH_DURATION;
    const radius = 8 + 8 * progress;

    context.globalAlpha = 0.35 + 0.65 * progress;
    context.fillStyle = "#fff5a8";
    context.beginPath();
    context.arc(muzzle.x, muzzle.y, radius * 0.55, 0, 2 * Math.PI);
    context.fill();

    context.fillStyle = "#ff7a24";
    context.beginPath();
    context.moveTo(muzzle.x, muzzle.y - radius * 1.3);
    context.lineTo(muzzle.x - radius * 0.55, muzzle.y + radius * 0.25);
    context.lineTo(muzzle.x, muzzle.y + radius * 0.05);
    context.lineTo(muzzle.x + radius * 0.55, muzzle.y + radius * 0.25);
    context.closePath();
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

let previousTime = performance.now();

function render(currentTime) {
  const deltaSeconds = Math.min((currentTime - previousTime) / 1000, 0.05);
  previousTime = currentTime;
  updateTank(deltaSeconds);
  enemyManager.update(deltaSeconds);
  enemyLaserManager.update(deltaSeconds);
  projectileManager.update(deltaSeconds);
  handleProjectileEnemyCollisions();
  powerUpManager.update(deltaSeconds);
  explosionManager.update(deltaSeconds);
  enemyDeathVisualManager.update(deltaSeconds);
  updateMuzzleFlash(deltaSeconds);
  context.clearRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
  drawProjectiles();
  drawEnemyLasers();
  drawMuzzleFlash();
  drawEnemyHealthBars();
  positionSpriteFromTopLeft(tankSprite, tank);
  enemyManager.enemies.forEach((enemy) => positionSpriteFromCenter(enemy.sprite, enemy));
  enemyDeathVisualManager.visuals.forEach((visual) => positionSpriteFromCenter(visual.sprite, visual));
  explosionManager.explosions.forEach((explosion) => positionSpriteFromCenter(explosion.sprite, explosion));
  if (powerUpManager.heavyMachineGun.active) {
    positionSpriteFromCenter(powerUpManager.heavyMachineGun.active.sprite, powerUpManager.heavyMachineGun.active);
  }
  if (debug.enabled) drawDebug();
  drawScoreHud();
  requestAnimationFrame(render);
}

window.addEventListener("keydown", (event) => {
  if (event.code === "ArrowLeft" || event.code === "ArrowRight" || event.code === "Space") {
    event.preventDefault();
  }

  if (event.code === "KeyQ" && !event.repeat) {
    debug.enabled = !debug.enabled;
    return;
  }

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
  input.left = false;
  input.right = false;
  input.fire = false;
});

requestAnimationFrame(render);
