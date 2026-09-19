# LaserBlast — Roadmap y Fuente de Verdad

Este documento es la fuente de verdad del proyecto LaserBlast.

No cambiar decisiones marcadas como CERRADO sin discutirlas primero.

---

## 1. Concepto general — CERRADO

LaserBlast es un videojuego web 2D arcade para navegador, desarrollado con:

- HTML
- CSS
- JavaScript vanilla
- Canvas 2D
- Assets GIF/WebP/imagen
- Sin framework
- Sin backend
- Sin base de datos
- Desplegable como sitio estático

Resolución lógica fija:

```text
1200 x 675
```

El juego debe mantener escalado responsive sin deformar el escenario ni depender directamente de `window.innerWidth` / `window.innerHeight` para las coordenadas internas.

---

## 2. Objetivo académico — CERRADO

El proyecto debe demostrar el uso de funciones trigonométricas dentro de un videojuego 2D.

Las ecuaciones matemáticas usadas en la exposición deben coincidir con las ecuaciones reales que controlan el movimiento de las entidades del juego.

Funciones utilizadas o planificadas:

- seno;
- coseno;
- transformaciones de amplitud;
- transformaciones de período;
- frecuencia/ciclos;
- fase/desfase;
- combinaciones controladas;
- secante para la fase especial del Boss 5.

---

## 3. Estado actual implementado — CERRADO

Actualmente están cerrados/implementados:

- Nivel 1 completo y balanceado.
- Nivel 2 implementado y jugable a nivel de configuración/código.
- Boss 2 implementado.
- Menú principal definitivo.
- Menú principal y overlays en ajuste responsive para pantallas pequeñas.
- Sistema global de pausa.
- Game Over.
- Nivel Superado.
- Panel de presentación/debug con `Q`.
- Selector de presentación/debug con Nivel 1 y Nivel 2.
- Música por stage implementada para Inicio, Nudo y Boss.
- Deploy en Netlify conectado a `main` con despliegue automático por push.
- Versionador visual en pantalla para verificar despliegues.

---

## 4. Controles — CERRADO

```text
A / D o Flecha izquierda / Flecha derecha -> mover tanque
ESPACIO -> disparar
ESC -> pausa / continuar
Q -> presentación / debug
```

La pausa solo debe activarse desde gameplay real.

---

## 5. Sistema de coordenadas — CERRADO

Sistema lógico interno:

```text
1200 x 675
```

Todas las entidades del juego deben trabajar sobre ese sistema.

El canvas y los sprites HTML se escalan visualmente de forma responsive, pero la lógica del juego permanece en coordenadas 1200 x 675.

---

## 6. Tanque del jugador — CERRADO

El tanque:

- se mueve horizontalmente;
- no sale del mundo lógico;
- dispara verticalmente hacia arriba;
- conserva su posición Y de suelo;
- tiene HP real en estado JavaScript;
- puede recibir daño de láseres enemigos.

HP:

```text
maxHp = 100
hp inicial = 100
```

No hay Game Over instantáneo por lógica externa: el Game Over ocurre cuando el HP llega a 0 y termina la animación de muerte.

---

## 7. Arma del jugador — CERRADO

El máximo definitivo será de 4 cañones simultáneos.

No habrá cañón 5 ni cañón 6.

Muzzle points definitivos:

```js
const weapon = {
  level: 1,
  projectileDamage: 2,
  muzzlePoints: [
    { id: 1, offsetX: -8,  offsetY: -50 },
    { id: 2, offsetX: 15,  offsetY: -50 },
    { id: 3, offsetX: -48, offsetY: -28 },
    { id: 4, offsetX: 65,  offsetY: -28 },
  ],
};
```

No recalibrar estos offsets sin una tarea explícita de calibración visual.

Cadencia base actual:

```text
fireInterval = 0.09
```

Daño base actual:

```text
projectileDamage = 2
```

---

## 8. Progresión definitiva del arma — CERRADO

La mejora obtenida en un nivel debe conservarse al avanzar al siguiente.

### Nivel 1

- Inicia con 1 cañón.
- Heavy durante el Nudo -> 2 cañones.

### Nivel 2

- Inicia conservando los 2 cañones.
- Heavy durante el Nudo -> 3 cañones.

### Nivel 3

- Inicia conservando los 3 cañones.
- Heavy durante el Nudo -> 4 cañones.

### Nivel 4

- Inicia con 4 cañones.
- Heavy durante el Nudo -> mejora de cadencia.
- Valor de referencia actual:

```text
fireInterval 0.09 -> 0.07
```

Este valor podrá calibrarse durante las pruebas del Nivel 4.

### Nivel 5

- Inicia con 4 cañones.
- Conserva la mejora de cadencia del Nivel 4.
- Heavy durante el Nudo -> mejora de daño.
- Valor de referencia actual:

```text
projectileDamage 2 -> 3
```

Este valor podrá calibrarse durante las pruebas del Nivel 5.

---

## 9. Heavy Machine Gun — CERRADO

Asset:

```text
assets/gif/Heavy Machine Gun.webp
```

Heavy Machine Gun no es aleatorio.

Debe aparecer en momentos definidos por configuración del nivel/stage.

En Nivel 1:

```text
kill normal #17
```

El Heavy:

- cae hasta la línea de suelo;
- puede ser recogido por el tanque;
- no suma score;
- no cuenta como enemigo;
- no afecta spawn;
- se elimina completamente al recogerlo o expirar.

---

## 10. Enemigos normales — CERRADO PARA NIVEL 1

Assets:

```text
assets/gif/nave2.gif
assets/gif/nave2.2.gif
```

Los sprites no están amarrados a una función específica.

Combinaciones válidas:

- `nave2.gif` + seno
- `nave2.gif` + coseno
- `nave2.2.gif` + seno
- `nave2.2.gif` + coseno

El sistema de spawn debe mantener variedad controlada y determinista.

Los enemigos usan coordenadas de centro:

```text
enemy.x = centro X
enemy.y = centro Y
```

Al llegar a bordes horizontales:

```js
enemy.direction *= -1;
```

No se eliminan por llegar al borde.

Solo se eliminan actualmente cuando:

```text
enemy.hp <= 0
```

---

## 11. Configuración matemática Nivel 1 — CERRADO

Sistema lógico:

```text
1200 x 675
```

Carriles verticales:

```text
D = 100, 190, 280
```

Amplitud:

```text
A = 40
```

Período:

```text
T = 1200
```

Trayectorias:

```text
y = D + 40 * sin((2π / 1200) * x)
y = D + 40 * cos((2π / 1200) * x)
```

Velocidad horizontal enemigos normales:

```text
180 unidades/segundo
```

HP enemigo normal Nivel 1:

```text
30
```

---

## 12. Stages Nivel 1 — CERRADO

Flujo automático:

```text
INICIO -> NUDO -> BOSS
```

### INICIO

- Máximo 3 enemigos normales simultáneos.
- Intervalo de spawn: 2.4 segundos.
- Termina al alcanzar 10 enemigos normales destruidos.

### NUDO

- Máximo 4 enemigos normales simultáneos.
- Intervalo de spawn: 1.9 segundos.
- Termina al alcanzar 25 kills normales totales.

### Entrada a BOSS

Al llegar a 25 kills:

- se detiene el spawn de enemigos normales;
- las naves normales que ya estaban vivas NO se eliminan administrativamente;
- el jugador debe destruir las naves restantes;
- el Boss aparece únicamente cuando la colección de enemigos normales queda vacía.

---

## 13. Score — CERRADO

Score inicial:

```text
0
```

Enemigo normal destruido:

```text
10 puntos
```

El score no se usa como contador interno de progreso.

Existe contador independiente:

```text
normalEnemiesDestroyed
```

---

## 14. Drops de salud — CERRADO

El drop de salud sí es aleatorio.

Configuración Nivel 1:

```text
dropChance = 0.20
healAmount = 25
```

Al recoger salud:

```js
tank.hp = Math.min(tank.maxHp, tank.hp + healAmount);
```

El drop:

- no suma score;
- no modifica arma;
- no cuenta como enemigo;
- no afecta spawn.

---

## 15. Láseres enemigos normales — CERRADO

Cada nave dispara hacia la posición que tenía el tanque en el instante del disparo.

Cálculo:

```js
dx = tankCenterX - enemy.x;
dy = tankCenterY - enemy.y;
theta = Math.atan2(dy, dx);
vx = laserSpeed * Math.cos(theta);
vy = laserSpeed * Math.sin(theta);
```

Después de creado, el láser no persigue al tanque.

El movimiento posterior es:

```js
x += vx * deltaSeconds;
y += vy * deltaSeconds;
```

Nivel 1:

```text
damage = 5
```

---

## 16. Impactos y explosiones — CERRADO PARA NIVEL 1

Explosión de nave:

```text
assets/gif/exploción3.gif
```

Explosión de suelo por láser:

```text
assets/gif/exploción2.gif
```

El GIF de explosión de suelo tiene retraso interno por frame transparente inicial.

Para evitar sincronización visual de varios GIF iguales:

```text
restartOnCreate = true
```

Esto fuerza una URL única por instancia y evita que el navegador sincronice varias explosiones.

---

## 17. Boss 1 — CERRADO

Asset:

```text
assets/gif/jefe1.gif
```

HP actual:

```text
maxHp = 700
```

Movimiento:

```text
trajectory.type = sin
midline = 180
amplitude = 70
period = 1000
speed = 145
```

Láser:

```text
speed = 420
damage = 15
fireInterval = 0.95
```

Patrón ofensivo:

```text
1 -> 1 -> 2 -> repetir
```

El tercer ataque genera dos láseres simultáneos.

Spread:

```text
10 grados
```

Cálculo:

```js
theta = Math.atan2(dy, dx);
spreadRadians = 10 * Math.PI / 180;
theta1 = theta - spreadRadians;
theta2 = theta + spreadRadians;
```

Los láseres del ataque doble no son homing.

---

## 18. Menú principal — CERRADO

El menú principal definitivo incluye:

- `assets/gif/inicio.gif` como visual principal;
- título `LASERBLAST`;
- subtítulo `PROYECTO DE TRIGONOMETRÍA`;
- botón `INICIAR`;
- controles visibles:
  - A / D o flechas -> mover;
  - ESPACIO -> disparar;
  - ESC -> pausa / continuar;
  - Q -> presentación / debug.

Mientras `gameState.status === MENU`, el gameplay debe permanecer detenido.

---

## 19. Sistema global de pausa — CERRADO

Estado:

```text
PAUSED
```

Durante `PLAYING`, al presionar `ESC`:

- pasar a `PAUSED`;
- congelar completamente gameplay;
- mostrar overlay de pausa.

Durante `PAUSED`, al presionar `ESC`:

- continuar la partida.

El overlay muestra:

```text
PAUSA
CONTINUAR
REINICIAR NIVEL
MENÚ PRINCIPAL
```

No debe activarse desde:

- MENU;
- GAME_OVER;
- LEVEL_COMPLETE;
- LEVEL_PREVIEW;
- PLAYER_DYING;
- BOSS_DEFEATED.

---

## 20. Debug / Presentación — CERRADO PARA NIVEL 1

Tecla:

```text
Q
```

El panel de presentación permite cargar stages para exposición.

Cuando se carga una partida desde el panel de debug:

- se considera modo de prueba;
- al morir o derrotar Boss no debe mandar a pantallas finales;
- debe permitir reiniciar/cargar desde el panel.

---

## 21. Deploy — CERRADO

El proyecto está desplegado en Netlify.

El deploy está conectado a:

```text
main
```

Cada push a `main` dispara despliegue automático.

Existe un versionador visible en pantalla para verificar si el despliegue tomó la última actualización.

---

## 22. Roadmap niveles 2–5

Nivel 2 ya fue implementado en código.

Niveles 3–5 no deben implementarse sin una tarea explícita.

### Nivel 2 — IMPLEMENTADO / PENDIENTE DE BALANCE FINAL

- Enemigos con transformación de amplitud y período implementados.
- Inicia con 2 cañones.
- Heavy durante Nudo -> 3 cañones.
- Boss 2 implementado con `assets/gif/Jefe2.gif`.
- Selector debug/presentación permite cargar Nivel 2.
- Pendiente: prueba completa de gameplay y ajuste fino de balance si hace falta.

### Nivel 3 — PENDIENTE

- Enemigos con frecuencia/ciclos.
- Inicia conservando 3 cañones.
- Heavy durante Nudo -> 4 cañones.
- Boss 3.

### Nivel 4 — PENDIENTE

- Enemigos con fase/desfase.
- Inicia con 4 cañones.
- Heavy durante Nudo -> mejora de cadencia.
- Referencia: `fireInterval 0.09 -> 0.07`.
- Boss 4 seno + coseno.

### Nivel 5 — PENDIENTE

- Enemigos con combinaciones controladas.
- Inicia con 4 cañones y cadencia mejorada.
- Heavy durante Nudo -> mejora de daño.
- Referencia: `projectileDamage 2 -> 3`.
- Boss 5.
- Fase especial con secante.
- Victoria final.

---

## 23. Boss 5 — movimiento principal

Movimiento principal planificado:

```text
y = 190
  + 40 sin((2π/500)x)
  + 30 cos((2π/250)x)
```

Rango aproximado:

```text
120–260
```

---

## 24. Boss 5 — fase especial con secante — CERRADO

Corregir cualquier referencia anterior a tangente.

La función especial definida es SECANTE:

```text
y = 190 + 30 sec((π/300)x)
```

Equivalente a:

```text
y = 190 + 30 / cos((π/300)x)
```

Discontinuidades/asíntotas:

```text
x = 150 + 300k
```

Dentro del ancho lógico de 1200:

```text
x = 150, 450, 750, 1050
```

La idea visual continúa siendo que el Boss solo se representa en las ramas/rangos visibles válidos de la función.

Cuando la función se acerque a una asíntota y el resultado salga del rango visual:

```text
Boss desaparece
```

Cuando la siguiente rama vuelva a producir valores válidos:

```text
Boss reaparece
```

Esto debe explicarse como traducción de una propiedad matemática real a una mecánica visual.

---

## 25. Audio — PARCIALMENTE IMPLEMENTADO

Música por stage implementada.

Archivos actuales:

- `assets/audio/music/inicio.ogg`
- `assets/audio/music/nudo.ogg`
- `assets/audio/music/boss.ogg`

El juego cambia la música según el stage:

- Inicio;
- Nudo;
- Boss.

Pendiente:

- SFX de disparo;
- SFX de impacto;
- SFX de explosión;
- SFX de recoger power-up;
- SFX de daño al tanque;
- SFX de pausa.

Por políticas del navegador, el audio debe iniciar después de interacción del jugador, por ejemplo al presionar `INICIAR`.

---

## 26. Pendientes próximos

Siguientes sistemas o niveles se implementarán por tareas separadas:

1. SFX del sistema de audio.
2. Checkpoints persistentes por nivel.
3. Balance/prueba final del Nivel 2.
4. Nivel 3.
5. Boss 3.
6. Niveles 4–5.
7. Boss final y victoria final.
8. Documento académico.
9. Preparación de exposición.

---

## 27. Regla de trabajo

No implementar cambios futuros solo porque aparecen en este roadmap.

Cada sistema debe implementarse en una tarea explícita, manteniendo intacto lo ya cerrado.
