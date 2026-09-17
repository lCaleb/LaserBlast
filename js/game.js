const LOGICAL_WIDTH = 1200;
const LOGICAL_HEIGHT = 675;

const canvas = document.querySelector("#game-canvas");
const context = canvas.getContext("2d");
const stage = document.querySelector(".game-stage");
const tankSprite = document.querySelector("#tank-sprite");

const ENEMY_MAX_ACTIVE = 3;
const ENEMY_SPAWN_INTERVAL = 1.2;
const ENEMY_SPEED = 180;

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

const enemyTypes = {
  sine: {
    label: "Nave seno",
    asset: "assets/gif/nave2.gif",
    width: 95,
    height: 95,
    speed: ENEMY_SPEED,
    direction: 1,
    color: "#ff7a7a",
    equation: "y = 100 + 40 * Math.sin((2 * Math.PI / 1200) * x)",
    trajectory: {
      type: "sin",
      midline: 100,
      amplitude: 40,
      period: 1200,
    },
  },
  cosine: {
    label: "Nave coseno",
    asset: "assets/gif/nave2.2.gif",
    width: 55,
    height: 33,
    speed: ENEMY_SPEED,
    direction: -1,
    color: "#80d7ff",
    equation: "y = 190 + 40 * Math.cos((2 * Math.PI / 1200) * x)",
    trajectory: {
      type: "cos",
      midline: 190,
      amplitude: 40,
      period: 1200,
    },
  },
};

const enemyManager = {
  enemies: [],
  maxActive: ENEMY_MAX_ACTIVE,
  nextId: 1,
  nextTypeIndex: 0,
  spawnInterval: ENEMY_SPAWN_INTERVAL,
  spawnTimer: 0,
  typeOrder: ["sine", "cosine"],

  update(deltaSeconds) {
    this.spawnTimer -= deltaSeconds;
    while (this.enemies.length < this.maxActive && this.spawnTimer <= 0) {
      this.createEnemy();
      this.spawnTimer += this.spawnInterval;
    }

    this.enemies.forEach((enemy) => updateEnemy(enemy, deltaSeconds));
    this.removeExitedEnemies();
  },

  createEnemy() {
    const typeKey = this.typeOrder[this.nextTypeIndex];
    const typeConfig = enemyTypes[typeKey];
    const sprite = document.createElement("img");
    const enemy = {
      id: this.nextId,
      typeKey,
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
      equation: typeConfig.equation,
      trajectory: typeConfig.trajectory,
    };

    enemy.y = calculateTrajectoryY(enemy, enemy.x);
    sprite.className = "game-sprite";
    sprite.src = enemy.asset;
    sprite.alt = enemy.label;
    stage.appendChild(sprite);

    this.enemies.push(enemy);
    this.nextId += 1;
    this.nextTypeIndex = (this.nextTypeIndex + 1) % this.typeOrder.length;
  },

  removeExitedEnemies() {
    this.enemies = this.enemies.filter((enemy) => {
      if (!hasEnemyExited(enemy)) return true;
      enemy.sprite.remove();
      return false;
    });
  },
};

function getEnemySpawnX(typeConfig) {
  if (typeConfig.direction > 0) return -typeConfig.width / 2;
  return LOGICAL_WIDTH + typeConfig.width / 2;
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

function calculateTrajectoryY(entity, x) {
  const angle = (2 * Math.PI / entity.trajectory.period) * x;
  const wave = entity.trajectory.type === "cos" ? Math.cos(angle) : Math.sin(angle);
  return entity.trajectory.midline + entity.trajectory.amplitude * wave;
}

function updateEnemy(enemy, deltaSeconds) {
  enemy.x += enemy.speed * enemy.direction * deltaSeconds;
  enemy.y = calculateTrajectoryY(enemy, enemy.x);
}

function hasEnemyExited(enemy) {
  if (enemy.direction > 0) return enemy.x - enemy.width / 2 > LOGICAL_WIDTH;
  return enemy.x + enemy.width / 2 < 0;
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
    if (x < LOGICAL_WIDTH) context.fillText(String(x), x + 4, 18);
  }
  for (let y = 0; y <= LOGICAL_HEIGHT; y += debug.gridStep) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(LOGICAL_WIDTH, y);
    context.stroke();
    if (y < LOGICAL_HEIGHT) context.fillText(String(y), 4, y - 5);
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
  context.fillText(`suelo aproximado Y=${debug.groundY}`, 14, debug.groundY - 10);

  Object.values(enemyTypes).forEach(drawTrajectory);

  drawTankCoordinates(tank, "Tanque", "#9effa8");
  enemyManager.enemies.forEach(drawEnemyCoordinates);

  const panelX = 14;
  let panelY = 42;
  context.fillStyle = "#ffffff";
  context.fillText("DEBUG: activo | D para ocultar/mostrar", panelX, LOGICAL_HEIGHT - 16);
  context.fillText(`Enemigos activos: ${enemyManager.enemies.length}/${enemyManager.maxActive}`, panelX, panelY);
  panelY += 24;

  Object.values(enemyTypes).forEach((typeConfig) => {
    context.fillStyle = typeConfig.color;
    context.fillText(typeConfig.equation, panelX, panelY);
    context.fillText(
      `A = ${typeConfig.trajectory.amplitude} | D = ${typeConfig.trajectory.midline} | Periodo = ${typeConfig.trajectory.period}`,
      panelX,
      panelY + 20,
    );
    panelY += 44;
  });

  enemyManager.enemies.forEach((enemy) => {
    context.fillStyle = enemy.color;
    context.fillText(`${enemy.label}: X=${enemy.x.toFixed(1)}, Y=${enemy.y.toFixed(1)}, dir=${enemy.direction}`, panelX, panelY);
    panelY += 20;
  });
  context.restore();
}

function drawTrajectory(typeConfig) {
  context.strokeStyle = typeConfig.color;
  context.lineWidth = 3;
  context.beginPath();
  for (let x = 0; x <= LOGICAL_WIDTH; x += 4) {
    const y = calculateTrajectoryY(typeConfig, x);
    if (x === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  }
  context.stroke();
}

function drawTankCoordinates(entity, label, color) {
  context.fillStyle = color;
  context.fillText(`${label}: X=${entity.x}, Y=${entity.y}`, entity.x, Math.max(18, entity.y - 10));
  context.strokeStyle = color;
  context.strokeRect(entity.x, entity.y, entity.width, entity.height);
}

function drawEnemyCoordinates(enemy) {
  const left = enemy.x - enemy.width / 2;
  const top = enemy.y - enemy.height / 2;

  context.fillStyle = enemy.color;
  context.fillText(`${enemy.label}: X=${enemy.x.toFixed(1)}, Y=${enemy.y.toFixed(1)}`, left, Math.max(18, top - 10));
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
  enemyManager.update(deltaSeconds);
  context.clearRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
  positionSpriteFromTopLeft(tankSprite, tank);
  enemyManager.enemies.forEach((enemy) => positionSpriteFromCenter(enemy.sprite, enemy));
  if (debug.enabled) drawDebug();
  requestAnimationFrame(render);
}

window.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "d") debug.enabled = !debug.enabled;
});

requestAnimationFrame(render);
