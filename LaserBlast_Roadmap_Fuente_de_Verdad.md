# LaserBlast --- Roadmap y Fuente de Verdad

**Proyecto final --- Cálculo / Trigonometría aplicada a Ingeniería de
Sistemas**\
**Estado del documento:** decisiones consolidadas de diseño y
desarrollo\
**Tecnología:** HTML + CSS + JavaScript vanilla + Canvas 2D\
**Resolución lógica:** 1200 × 675\
**Objetivo de este archivo:** servir como fuente de verdad para el
equipo, ChatGPT y Codex. No cambiar decisiones marcadas como **CERRADO**
sin discutirlas primero.

------------------------------------------------------------------------

## 1. Objetivo académico

El proyecto debe evidenciar cómo se aplican las funciones
trigonométricas en Ingeniería de Sistemas dentro de un contexto
concreto: un videojuego 2D programado para navegador.

El proyecto final solicitado por la profesora debe incluir:

1.  Portada con normas APA.
2.  Introducción.
3.  Problemática y objetivos.
4.  Desarrollo matemático y aplicación, usando programas para programar,
    graficar o recopilar datos.
5.  Conclusiones personales y grupales.
6.  Referencias.
7.  Evidencia de dominio de lo visto durante las semanas 1, 2, 3 y 4.

La aplicación matemática no será decorativa: las ecuaciones usadas en la
exposición deben ser las mismas que controlan el movimiento real de las
entidades del juego.

> **Pendiente académico:** cuando se tengan los temas exactos de las
> semanas 1--4, mapear cada tema a una mecánica, ecuación o demostración
> concreta del juego.

------------------------------------------------------------------------

## 2. Concepto general del juego --- CERRADO

**LaserBlast** será un juego arcade 2D para navegador, inspirado
visualmente en Metal Slug.

El jugador controla un tanque situado en la zona inferior de la
pantalla:

-   movimiento horizontal;
-   disparo vertical tipo ametralladora;
-   combate contra naves enemigas;
-   cinco niveles;
-   cada nivel dividido en **Inicio → Nudo → Boss**;
-   enemigos con trayectorias trigonométricas;
-   bosses con movimientos matemáticos más complejos;
-   láseres enemigos angulados;
-   power-ups;
-   vida persistente durante el progreso;
-   checkpoints por nivel.

No se implementarán backend, base de datos, login, multiplayer, rankings
ni inventarios complejos.

------------------------------------------------------------------------

## 3. Arquitectura técnica --- CERRADO

Estructura actual:

``` text
LaserBlast/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── game.js
└── assets/
    └── gif/
```

Stack:

-   HTML
-   CSS
-   JavaScript vanilla
-   Canvas 2D
-   GIF/WebP/imagenes como sprites

Los GIF animados se mantienen como elementos `<img>` independientes
sobre el Canvas.

El Canvas se utiliza para:

-   proyectiles;
-   láseres;
-   barras de HP;
-   efectos sencillos;
-   curvas trigonométricas de DEBUG;
-   cuadrícula/coordenadas;
-   información de presentación.

------------------------------------------------------------------------

## 4. Sistema de coordenadas --- CERRADO

El juego utiliza coordenadas lógicas:

``` text
1200 × 675
```

La pantalla visible se escala proporcionalmente al viewport.

Esto permite que una ecuación como:

``` text
y = 100 + 40 sin((2π/1200)x)
```

sea siempre la misma independientemente del monitor.

En Canvas:

-   `x` aumenta hacia la derecha;
-   `y` aumenta hacia abajo.

Línea provisional del suelo:

``` text
y ≈ 605
```

El fondo seleccionado tiene aproximadamente 1192 × 670 y se adapta
proporcionalmente.

------------------------------------------------------------------------

# 5. Tanque

## 5.1 Movimiento --- IMPLEMENTADO

Controles:

``` text
A / Flecha izquierda  → izquierda
D / Flecha derecha    → derecha
SPACE                  → disparo continuo
Q                      → DEBUG / presentación
```

Configuración actual:

``` js
tank = {
  x: 95,
  y: 550,
  width: 165,
  height: 82
};

TANK_SPEED = 260;
```

El tanque se limita a los bordes de la resolución lógica.

------------------------------------------------------------------------

## 5.2 Disparo --- IMPLEMENTADO

Los disparos del tanque **NO siguen funciones trigonométricas**.

Son proyectiles verticales:

``` text
x = constante
y disminuye con el tiempo
```

Configuración actual:

``` text
velocidad = 520
cadencia = 0.09 s
daño = 2
```

Aproximadamente:

``` text
11.1 disparos/s por muzzle activo
```

Los proyectiles se eliminan inmediatamente cuando:

-   impactan;
-   salen completamente de pantalla.

No deben acumularse objetos inactivos.

------------------------------------------------------------------------

# 6. Sistema Heavy Machine Gun --- CERRADO

El arma tiene cuatro niveles.

``` text
Nivel de arma 1 → muzzle 1
Nivel de arma 2 → muzzle 1 + 2
Nivel de arma 3 → muzzle 1 + 2 + 3
Nivel de arma 4 → muzzle 1 + 2 + 3 + 4
```

Todos disparan simultáneamente y verticalmente.

## Muzzle points definitivos --- CERRADO

Calibrados visualmente:

``` js
const weapon = {
  level: 1,
  muzzlePoints: [
    { id: 1, offsetX: -8,  offsetY: -50 },
    { id: 2, offsetX: 15,  offsetY: -50 },
    { id: 3, offsetX: -48, offsetY: -28 },
    { id: 4, offsetX: 65,  offsetY: -28 },
  ],
};
```

**NO recalibrar estos valores.**

## Progresión Heavy --- CERRADO

No es aleatoria.

``` text
Inicio del juego → arma nivel 1

Nivel 1 / Nudo → Heavy → arma nivel 2
Nivel 2 / Nudo → Heavy → arma nivel 3
Nivel 3 / Nudo → Heavy → arma nivel 4

Nivel 4 → no Heavy
Nivel 5 → no Heavy
```

El asset disponible es:

``` text
Heavy Machine Gun.webp
```

Al reiniciar desde un checkpoint, el nivel del arma debe corresponder al
progreso alcanzado y no volver arbitrariamente al nivel 1.

------------------------------------------------------------------------

# 7. Enemigos normales

Assets conocidos:

``` text
nave2.gif
nave2.2.gif
```

Los enemigos usan su centro como:

``` text
enemy.x
enemy.y
```

------------------------------------------------------------------------

## 7.1 Trayectorias trigonométricas --- CERRADO

### Nivel 1 --- seno y coseno

Base:

``` text
y = 100 + 40 sin((2π/1200)x)

y = 190 + 40 cos((2π/1200)x)
```

Sistema actual de lanes:

``` text
D = 100, 190, 280
A = 40
T = 1200
```

Forma general:

``` text
y = D + A sin((2π/T)x)
y = D + A cos((2π/T)x)
```

------------------------------------------------------------------------

### Nivel 2 --- transformación de amplitud y período

``` text
A = 35
T = 900
D = 90, 175, 260
```

``` text
y = D + 35 sin((2π/900)x)
```

o:

``` text
y = D + 35 cos((2π/900)x)
```

------------------------------------------------------------------------

### Nivel 3 --- frecuencia / ciclos

``` text
A = 30
T = 600
D = 80, 155, 230, 305
```

Ejemplo:

``` text
y = D + 30 sin((2π/600)x)
```

En una pantalla de ancho 1200 se observan exactamente dos períodos.

------------------------------------------------------------------------

### Nivel 4 --- desfase

``` text
A = 30
T = 600
D = 75, 145, 215, 285, 355
```

Fases:

``` text
0
π/2
π
3π/2
```

Ejemplo:

``` text
y = D + 30 sin((2π/600)x + φ)
```

También pueden existir variantes con coseno.

------------------------------------------------------------------------

### Nivel 5 --- combinación controlada

No usar parámetros completamente aleatorios.

Valores permitidos/propuestos:

``` text
A = 25–35
T = 400, 500 o 600
φ = 0, π/2, π o 3π/2
```

Ejemplos:

``` text
y = 150 + 30 sin((2π/500)x + π/2)

y = 300 + 25 cos((2π/400)x + π)
```

Objetivo académico de progresión:

``` text
Nivel 1 → seno/coseno
Nivel 2 → amplitud y período
Nivel 3 → frecuencia/ciclos
Nivel 4 → fase/desplazamiento
Nivel 5 → combinación de transformaciones
```

------------------------------------------------------------------------

# 8. Movimiento horizontal de enemigos --- DECISIÓN CERRADA / PENDIENTE DE AJUSTE

El comportamiento temporal usado durante el laboratorio, donde la nave
salía por un borde y era eliminada, **NO será el comportamiento final de
combate**.

Una nave normal debe:

``` text
crearse
→ permanecer en combate
→ recorrer su trayectoria trigonométrica
→ alcanzar borde
→ invertir dirección horizontal
→ continuar sobre la misma función
→ conservar HP
→ repetir hasta ser destruida
```

Al llegar a un extremo:

``` js
enemy.direction *= -1;
```

No se crea una nueva nave por tocar un borde.

Tanto `nave2.gif` como `nave2.2.gif` deben poder desplazarse en ambos
sentidos.

La inversión debe considerar el ancho del sprite para evitar que
desaparezca visualmente antes de devolverse.

La nave conserva:

-   `id`
-   `hp`
-   `maxHp`
-   `midline`
-   función
-   parámetros trigonométricos
-   tipo
-   estado

**Este es el siguiente ajuste inmediato pendiente.**

------------------------------------------------------------------------

# 9. Spawn y stages --- DISEÑO CERRADO / BALANCE PROVISIONAL

Cada nivel tiene:

``` text
INICIO
↓
NUDO
↓
BOSS
```

Los enemigos normales aparecen progresivamente hasta alcanzar el máximo
simultáneo.

No aparecen todos de golpe.

Cuando el jugador destruye una nave:

``` text
queda un cupo
→ transcurre intervalo de spawn
→ entra una nueva nave
```

Durante Boss:

``` text
se detiene completamente el spawn normal
```

## Configuración provisional

  ---------------------------------------------------------------------
  Nivel     Máx. Inicio   Máx. Nudo Spawn        Spawn Nudo    Normales
                                    Inicio                       aprox.
                                                             antes Boss
  --------- ----------- ----------- ----------- ----------- -----------
  1                   3           4 2.4 s             1.9 s          25

  2                   4           5 2.2 s             1.7 s          30

  3                   4           6 2.0 s             1.5 s          35

  4                   5           7 1.8 s             1.4 s          40

  5                   6           8 1.6 s             1.2 s          45
  ---------------------------------------------------------------------

Distribución orientativa:

``` text
~40 % de enemigos → Inicio
~60 % → Nudo
después → Boss
```

Duración objetivo aproximada de un nivel:

``` text
2–3 minutos
```

Estos números son **PROVISIONALES DE BALANCE** y se ajustarán mediante
playtesting.

------------------------------------------------------------------------

# 9.1 Relación automática Nivel + Stage + Trayectoria --- CERRADO

Esta sección conecta explícitamente las ecuaciones con el comportamiento
normal del juego.

**No es una configuración que el jugador pueda modificar.** Durante una
partida normal, el juego decide automáticamente qué configuración
utilizar a partir de:

``` text
currentLevel
+
currentStage
```

El panel `Q` descrito más adelante es una herramienta separada
exclusivamente para exposición/debug y permite forzar un nivel o stage
sin alterar el progreso real.

## Flujo automático de creación de una nave normal

``` text
El juego conoce currentLevel
↓
El juego conoce currentStage (Inicio o Nudo)
↓
consulta los límites de spawn de ese nivel/stage
↓
si existe un cupo, crea una nueva nave
↓
elige una configuración matemática válida DEL NIVEL
↓
asigna lane / función / fase permitida / dirección de entrada
↓
la nave conserva esa configuración durante toda su vida
↓
rebota horizontalmente en los extremos
↓
solo desaparece cuando es destruida
↓
queda un cupo
↓
después del intervalo correspondiente puede entrar otra nave
```

Al comenzar `Boss`:

``` text
spawn normal = detenido
```

y se utiliza únicamente la configuración matemática del boss
correspondiente.

## Matriz de comportamiento normal

  --------------------------------------------------------------------------------------------
  Nivel          Matemática de naves  Lanes / línea media D      Inicio         Nudo
                 normales                                                       
  -------------- -------------------- -------------------------- -------------- --------------
  1              seno/coseno, `A=40`, `100, 190, 280`            máx. 3, spawn  máx. 4, spawn
                 `T=1200`                                        2.4 s          1.9 s

  2              seno/coseno, `A=35`, `90, 175, 260`             máx. 4, spawn  máx. 5, spawn
                 `T=900`                                         2.2 s          1.7 s

  3              seno/coseno, `A=30`, `80, 155, 230, 305`        máx. 4, spawn  máx. 6, spawn
                 `T=600`                                         2.0 s          1.5 s

  4              seno/coseno con      `75, 145, 215, 285, 355`   máx. 5, spawn  máx. 7, spawn
                 fase, `A=30`,                                   1.8 s          1.4 s
                 `T=600`,                                                       
                 `φ∈{0,π/2,π,3π/2}`                                             

  5              combinaciones        según patrón predefinido   máx. 6, spawn  máx. 8, spawn
                 controladas:                                    1.6 s          1.2 s
                 `A=25–35`,                                                     
                 `T∈{400,500,600}`,                                             
                 `φ∈{0,π/2,π,3π/2}`                                             
  --------------------------------------------------------------------------------------------

Los valores de cantidad e intervalo siguen siendo **PROVISIONALES DE
BALANCE**, pero la estrategia es **CERRADA**.

## Reglas de asignación de trayectoria

-   Una nave recibe su configuración matemática al nacer y la conserva
    mientras exista.
-   El cambio de dirección horizontal **no cambia su ecuación, lane,
    amplitud, período, fase ni HP**.
-   Tanto `nave2.gif` como `nave2.2.gif` pueden moverse hacia izquierda
    o derecha.
-   Alternar seno/coseno y lanes de forma controlada para dar variedad
    visual.
-   Evitar, cuando sea posible, generar consecutivamente configuraciones
    visualmente idénticas.
-   Puede haber más naves simultáneas que lanes disponibles: diferentes
    naves pueden compartir línea media si usan una combinación válida de
    función, dirección o fase.
-   "Más dificultad" no significa inventar ecuaciones aleatorias fuera
    de las reglas del nivel.
-   En Nivel 5 se eligen únicamente patrones predefinidos/controlados
    para que todas las trayectorias puedan explicarse académicamente.

## Qué significa cada transformación

``` text
A (amplitud) ↓
→ menor desplazamiento vertical respecto a la línea media
→ trayectoria visualmente más achatada

T (período) ↓
→ la función completa ciclos en menos distancia horizontal
→ aumenta la frecuencia visual

D
→ desplaza verticalmente la trayectoria / define su lane

φ
→ desplaza la fase de la función
```

Por tanto, la progresión de dificultad matemática no depende únicamente
de aumentar la cantidad de enemigos: también cambia la forma real de sus
trayectorias.

------------------------------------------------------------------------

# 10. HP y daño

## 10.1 HP normal --- IMPLEMENTADO

Configuración:

``` text
Nivel 1 → 30 HP
Nivel 2 → 40 HP
Nivel 3 → 50 HP
Nivel 4 → 60 HP
Nivel 5 → 70 HP
```

Existe `LEVEL_CONFIG` y `currentLevel`.

Cada instancia recibe:

``` js
enemy.maxHp
enemy.hp
```

Por lo tanto dos enemigos del mismo nivel pueden tener distinto HP
restante.

------------------------------------------------------------------------

## 10.2 Daño del jugador --- IMPLEMENTADO

``` text
projectileDamage = 2
```

Una bala:

``` text
impacta una sola vez
→ resta daño
→ se elimina inmediatamente
```

------------------------------------------------------------------------

## 10.3 Barras de HP --- IMPLEMENTADO

Cada enemigo tiene barra verde delgada sobre la nave.

Proporción:

``` text
hp / maxHp
```

Se dibuja mediante Canvas y sigue al enemigo.

DEBUG muestra:

``` text
HP actual / HP máximo
```

------------------------------------------------------------------------

# 11. Colisiones --- IMPLEMENTADO BASE

Se utiliza AABB.

Como el enemigo utiliza centro:

``` text
left   = x - width/2
right  = x + width/2
top    = y - height/2
bottom = y + height/2
```

El proyectil se compara contra estos límites.

Cuando HP llega a cero:

-   retirar enemigo del arreglo activo;
-   retirar `<img>` del DOM.

No mantener enemigos muertos en memoria.

------------------------------------------------------------------------

# 12. Explosiones

Assets conocidos:

``` text
explosion.gif       → destrucción del tanque
exploción2.gif      → impacto de láser contra suelo
exploción3.gif      → destrucción de nave
```

## Nave --- PENDIENTE

Al morir:

``` text
HP <= 0
→ retirar nave
→ crear exploción3.gif en su última posición
→ reproducir efecto
→ eliminar completamente la explosión
```

La explosión es temporal y visual.

No debe quedar una entidad inactiva almacenada.

------------------------------------------------------------------------

# 13. Láseres enemigos --- DISEÑO CERRADO / PENDIENTE

Las naves dispararán láseres verdes en ángulo.

Aquí aparece otra aplicación explícita de trigonometría.

Si el láser tiene:

``` text
velocidad = v
ángulo = θ
```

se descompone mediante:

``` text
vx = v cos(θ)
vy = v sin(θ)
```

Debe documentarse cuidadosamente la convención angular porque Canvas
tiene eje Y positivo hacia abajo.

El láser:

``` text
se crea
→ se mueve usando vx/vy
→ impacta tanque/suelo o sale
→ se elimina
```

`exploción2.gif` puede utilizarse para el impacto contra el suelo.

------------------------------------------------------------------------

# 14. Vida del jugador

El tanque comienza con:

``` text
100 HP
```

La vida **persiste entre niveles**.

No recuperar automáticamente 100 HP al completar un nivel.

## Daño enemigo provisional

  Nivel     Láser normal
  ------- --------------
  1                    5
  2                   10
  3                   15
  4                   20
  5                   25

Los bosses causan:

``` text
daño normal del nivel + 10
```

Por tanto, provisionalmente:

``` text
Boss 1 → 15
Boss 2 → 20
Boss 3 → 25
Boss 4 → 30
Boss 5 → 35
```

Valores sujetos a balance.

------------------------------------------------------------------------

# 15. Drops de salud --- CERRADO

Las naves pueden soltar salud aleatoriamente.

Valor propuesto:

``` text
+25 HP
```

Máximo:

``` text
100 HP
```

La salud sí puede ser aleatoria.

Heavy Machine Gun **NO** es aleatorio.

Los drops no recogidos deben expirar y eliminarse de memoria/DOM.

------------------------------------------------------------------------

# 16. Bosses --- DISEÑO MATEMÁTICO CERRADO

Cada nivel termina con un boss.

Durante Boss:

-   no aparecen enemigos normales;
-   boss posee mucha más vida;
-   daño superior;
-   trayectoria matemática diferenciada.

## Boss 1

``` text
y = 180 + 70 sin((2π/1000)x)
```

## Boss 2

``` text
y = 180 + 65 cos((2π/800)x)
```

## Boss 3

``` text
y = 180 + 55 sin((2π/600)x)
```

## Boss 4 --- combinación seno + coseno

``` text
y = 180
  + 45 sin((2π/600)x)
  + 25 cos((2π/300)x)
```

Rango aproximado previsto:

``` text
110–250
```

El movimiento debe sentirse más agresivo/picado que los bosses
anteriores.

## Boss 5 --- movimiento principal

``` text
y = 190
  + 40 sin((2π/500)x)
  + 30 cos((2π/250)x)
```

Rango aproximado:

``` text
120–260
```

------------------------------------------------------------------------

# 17. Boss final --- fase especial con tangente --- CERRADO

El Boss 5 tendrá una fase especial basada en:

``` text
y = 190 + 30 tan((π/300)x)
```

Rango visual permitido aproximado:

``` text
70 ≤ y ≤ 350
```

La tangente tiene discontinuidades/asíntotas.

Cuando la función se aproxime a una asíntota y el resultado salga del
rango visual:

``` text
boss desaparece
```

Cuando la siguiente rama de tangente vuelva a producir valores válidos:

``` text
boss reaparece
```

Esto debe sentirse como una especie de teleport/desaparición matemática.

No se trata de esconder arbitrariamente al boss: la desaparición debe
corresponder al comportamiento discontinuo de la función.

Esta mecánica será importante en la exposición para explicar:

-   tangente;
-   discontinuidad;
-   asíntotas;
-   dominio/rango visual;
-   traducción de una propiedad matemática a una mecánica de videojuego.

------------------------------------------------------------------------

# 18. HP de bosses --- PROVISIONAL

``` text
Boss 1 → 200
Boss 2 → 300
Boss 3 → 400
Boss 4 → 500
Boss 5 → 650
```

Ajustar jugando.

------------------------------------------------------------------------

# 19. Score y transición de stages --- PENDIENTE

Una nave normal puede otorgar provisionalmente:

``` text
10 puntos
```

La transición:

``` text
Inicio → Nudo → Boss
```

puede basarse en kills/score configurado.

La intención actual es preferir **cantidad de enemigos derrotados /
progreso del stage** sobre thresholds rígidos prematuros.

Los thresholds exactos deben centralizarse en configuración y ajustarse
después del playtesting.

No dispersar números mágicos.

------------------------------------------------------------------------

# 20. Sistema de checkpoints --- CERRADO

Si el jugador muere en Nivel 3:

``` text
reinicia Nivel 3
```

NO vuelve al Nivel 1.

Persistencia:

``` text
localStorage
```

Guardar únicamente progreso persistente necesario, por ejemplo:

-   nivel desbloqueado/checkpoint;
-   nivel de arma correspondiente al progreso;
-   configuraciones persistentes que realmente sean necesarias.

El estado temporal de una partida vive en memoria JavaScript.

No se necesita `sessionStorage`.

El modo de presentación/debug **NO debe modificar localStorage**.

------------------------------------------------------------------------

# 21. Pantallas y flujo del juego --- CERRADO

Esto forma parte del juego final y **NO debe olvidarse**.

## 21.1 Menú inicial

Antes de iniciar partida debe existir una pantalla de inicio.

Debe permitir comenzar la partida.

Asset disponible:

``` text
inicio.gif
```

Puede utilizarse como parte de la presentación/animación inicial.

Flujo:

``` text
Abrir juego
→ Menú inicial
→ Iniciar partida
→ Nivel correspondiente
```

------------------------------------------------------------------------

## 21.2 Pausa

Debe existir menú de pausa.

Al pausar:

-   detener actualización del gameplay;
-   detener movimiento;
-   detener disparos/spawns;
-   mostrar interfaz de pausa.

Debe permitir al menos:

``` text
Continuar
Reiniciar nivel
Volver al menú
```

La decisión de teclas/UI exacta puede definirse durante implementación.

------------------------------------------------------------------------

## 21.3 Nivel superado

Después de derrotar un boss:

``` text
Nivel superado
```

Debe existir transición clara al siguiente nivel.

La vida restante del tanque continúa.

El arma continúa según la progresión alcanzada.

------------------------------------------------------------------------

## 21.4 Game Over

Cuando:

``` text
tank.hp <= 0
```

mostrar Game Over.

Usar `explosion.gif` para la destrucción del tanque.

Opciones:

``` text
Reintentar nivel actual
Volver al menú
```

Reintentar usa el checkpoint del nivel correspondiente.

------------------------------------------------------------------------

## 21.5 Victoria final

Después de derrotar Boss 5:

``` text
Fin / Victoria
```

Asset disponible:

``` text
fin.gif
```

Debe existir una pantalla final clara que cierre la partida.

------------------------------------------------------------------------

# 22. Panel de presentación académica / configuración --- CERRADO

**Esta funcionalidad es obligatoria para la exposición y no debe
confundirse con el menú normal del jugador.**

El objetivo es poder demostrar rápidamente cualquier parte del proyecto
frente a la profesora sin tener que jugar desde Nivel 1 hasta llegar a
ella.

Debe poder abrirse mediante:

``` text
Q
```

No usar `D`, porque `D` pertenece al movimiento del tanque.

## 22.1 Modo normal

Juego limpio, sin información técnica innecesaria.

En la versión final DEBUG debería iniciar apagado.

------------------------------------------------------------------------

## 22.2 Visualizaciones matemáticas

Panel con controles/checks para mostrar u ocultar:

-   cuadrícula;
-   coordenadas;
-   trayectorias trigonométricas;
-   ecuación activa;
-   parámetros de la función;
-   hitboxes/colisiones;
-   información de entidades;
-   FPS;
-   HP técnico;
-   información relevante del enemigo activo.

Las ecuaciones mostradas deben salir de **los mismos
valores/configuraciones reales usados para mover las naves**.

No duplicar ecuaciones como strings independientes que puedan quedar
desactualizadas.

------------------------------------------------------------------------

## 22.3 Selector de nivel para exposición

Debe ser posible seleccionar:

``` text
Nivel 1
Nivel 2
Nivel 3
Nivel 4
Nivel 5
```

y usar una acción como:

``` text
Cargar
```

Ejemplo de exposición:

``` text
Profesor pide ver Nivel 5
→ abrir Q
→ seleccionar Nivel 5
→ Cargar
→ juego salta directamente al Nivel 5
```

Esto permite demostrar transformaciones avanzadas sin jugar los cuatro
niveles anteriores.

------------------------------------------------------------------------

## 22.4 Selector de stage para exposición

Dentro del nivel seleccionado debe ser posible cargar directamente:

``` text
Inicio
Nudo
Boss
```

Ejemplos:

``` text
Nivel 3 + Nudo
Nivel 4 + Boss
Nivel 5 + Boss
```

Especialmente importante para mostrar:

-   Heavy;
-   incremento de dificultad;
-   funciones de cada nivel;
-   Boss 4;
-   Boss 5;
-   fase tangente.

------------------------------------------------------------------------

## 22.5 Reiniciar nivel desde presentación

El panel debe incluir:

``` text
Reiniciar nivel
```

------------------------------------------------------------------------

## 22.6 Reglas del salto DEBUG

Cuando se cambia nivel o stage desde el panel:

1.  eliminar enemigos existentes;
2.  eliminar proyectiles;
3.  eliminar láseres;
4.  eliminar drops;
5.  eliminar explosiones temporales;
6.  limpiar boss;
7.  reiniciar timers/spawn necesarios;
8.  cargar configuración solicitada.

No deben sobrevivir entidades del stage anterior.

**MUY IMPORTANTE:**

Los saltos de presentación:

``` text
NO modifican localStorage
NO desbloquean progreso real
NO cambian permanentemente el checkpoint
```

Son únicamente herramientas de exposición.

------------------------------------------------------------------------

# 23. Estrategia de audio y música --- CERRADO CON ASSETS PENDIENTES

Se utilizarán tres ambientes musicales principales asociados al stage:

``` text
INICIO → pista Inicio
NUDO   → pista Nudo
BOSS   → pista Boss
```

No es necesario tener 15 canciones diferentes.

Las mismas tres pistas pueden reutilizarse entre niveles si funcionan
bien.

Cuando cambia el stage:

``` text
Inicio → Nudo
```

cambia la música correspondiente.

Cuando entra el boss:

``` text
Nudo → Boss
```

entra la pista de boss.

También podrán existir SFX para:

-   disparo del tanque;
-   Heavy Machine Gun;
-   impacto de bala;
-   láser enemigo;
-   explosión de nave;
-   explosión del tanque;
-   recoger salud;
-   recoger Heavy;
-   menús/victoria si aporta.

Para la entrega final se buscarán pistas/efectos con licencia apropiada
o libre.

Codex integrará archivos concretos que nosotros suministremos; no
depender de que invente/busque assets externos.

------------------------------------------------------------------------

# 24. Assets actuales

Conocidos hasta ahora:

``` text
Tanque.gif
nave2.gif
nave2.2.gif

jefe1.gif
Jefe2.gif
jefe3.gif
jefe4.gif
JefeFin.gif

Heavy Machine Gun.webp

exploción2.gif   → impacto láser/suelo
exploción3.gif   → destrucción nave
explosion.gif    → destrucción tanque

inicio.gif
fin.gif
```

Existe además el fondo seleccionado de estética Metal Slug.

Balas y láseres:

``` text
NO necesitan assets
```

Se dibujarán mediante Canvas.

------------------------------------------------------------------------

# 25. Ciclo de vida de entidades --- REGLA DE ARQUITECTURA CERRADA

Esta regla es especialmente importante por la cadencia de la
ametralladora.

## Enemigo

``` text
crear
→ actualizar
→ recibir daño
→ morir
→ retirar del arreglo
→ retirar sprite DOM
```

Los enemigos normales no se eliminan simplemente por tocar el borde: se
devuelven.

## Proyectil

``` text
crear
→ actualizar
→ colisión O salida de pantalla
→ eliminar inmediatamente
```

## Láser enemigo

``` text
crear
→ actualizar
→ impacto/salida
→ eliminar
```

## Drop

``` text
crear
→ recoger O expirar
→ eliminar
```

## Explosión

``` text
crear
→ reproducir
→ finalizar
→ eliminar
```

## Cambio de stage/restart/debug jump

``` text
cleanup explícito de todas las entidades temporales
```

No mantener grandes arrays de objetos con:

``` js
alive = false
```

de manera permanente.

No implementar object pooling prematuramente.

Primero:

``` text
crear → usar → retirar correctamente
```

y optimizar únicamente si las mediciones demuestran que hace falta.

------------------------------------------------------------------------

# 26. Formación y variedad de enemigos --- ESTRATEGIA

Además de los límites simultáneos, posteriormente pueden aparecer
pequeños grupos:

``` text
2–3 naves
```

con combinaciones como:

-   seno/coseno;
-   lanes diferentes;
-   entradas desde lados opuestos;
-   distintas fases en niveles avanzados.

La variedad debe provenir de configuraciones matemáticas controladas, no
de caos aleatorio que dificulte explicar las funciones durante la
exposición.

------------------------------------------------------------------------

# 27. Dificultad progresiva --- CERRADO CON BALANCE AJUSTABLE

La dificultad aumenta mediante una combinación de:

-   más enemigos simultáneos;
-   menor intervalo de spawn;
-   más HP;
-   mayor daño de láser;
-   cambios de amplitud;
-   cambios de período;
-   mayor frecuencia;
-   desfase;
-   combinación de funciones;
-   bosses más complejos.

No depender únicamente de aumentar HP.

------------------------------------------------------------------------

# 28. DEBUG actual --- IMPLEMENTADO PARCIALMENTE

Actualmente DEBUG:

-   se activa/desactiva con `Q`;
-   dibuja trayectorias de combinaciones activas;
-   muestra tipo;
-   midline;
-   dirección;
-   coordenadas;
-   HP;
-   contador de proyectiles;
-   permite visualizar muzzle points durante desarrollo.

La versión final debe evolucionar hacia el **panel académico descrito en
la sección 22**.

------------------------------------------------------------------------

# 29. Estado actual del desarrollo

## IMPLEMENTADO

-   estructura HTML/CSS/JS;
-   Canvas 2D;
-   resolución lógica 1200 × 675;
-   fondo y tanque;
-   movimiento del tanque;
-   disparo continuo;
-   proyectiles verticales;
-   limpieza de proyectiles fuera de pantalla;
-   muzzle flash;
-   cuatro muzzle points;
-   calibración definitiva de muzzle points;
-   `weapon.level = 1`;
-   configuración inicial de enemigos;
-   seno/coseno;
-   lanes;
-   sprites enemigos;
-   enemy manager;
-   HP por nivel;
-   `currentLevel`;
-   daño centralizado del proyectil;
-   AABB bala-enemigo;
-   eliminación de bala al impacto;
-   reducción de HP;
-   eliminación de enemigo al morir;
-   barras verdes de HP;
-   HP en DEBUG.

## COMPORTAMIENTO ACTUAL QUE DEBE CORREGIRSE

Actualmente algunos enemigos salen del borde, se eliminan y luego
aparece otra instancia con HP completo.

Debe sustituirse por:

``` text
borde → invertir dirección → conservar misma instancia y HP
```

------------------------------------------------------------------------

# 30. Roadmap de implementación desde el estado actual

El orden busca minimizar regresiones y asegurar un MVP jugable antes del
plazo.

## Fase 1 --- Cerrar combate básico

### 1. Movimiento persistente de enemigos

-   rebote horizontal;
-   conservar HP;
-   misma trayectoria;
-   ambos sprites pueden viajar en ambos sentidos.

### 2. Destrucción visual de nave

-   `exploción3.gif`;
-   entidad temporal;
-   cleanup correcto.

### 3. Score

-   sumar al destruir enemigo;
-   preparar progreso de stage.

------------------------------------------------------------------------

## Fase 2 --- Sistema de stages del Nivel 1

### 4. Control automático de progreso y stages

Estados:

``` text
INICIO
NUDO
BOSS
```

### 5. Control automático de spawn por stage

Aplicar:

-   máximos simultáneos;
-   intervalos;
-   reposición de enemigos;
-   límites de kills/score;
-   detener spawn en Boss.

### 6. Heavy Machine Gun del Nivel 1

Durante Nudo:

``` text
Heavy aparece
→ recoger
→ weapon.level 1 → 2
```

------------------------------------------------------------------------

## Fase 3 --- Enemigos atacan

### 7. Láser enemigo

Implementar:

``` text
vx = v cos θ
vy = v sin θ
```

### 8. Colisión láser-tanque

-   HP del tanque;
-   daño;
-   barra/HUD.

### 9. Impacto visual

-   `exploción2.gif`;
-   cleanup.

### 10. Drops de salud

-   probabilidad;
-   +25 HP;
-   máximo 100;
-   expiración/cleanup.

------------------------------------------------------------------------

## Fase 4 --- Boss 1

### 11. Boss Manager

Implementar Boss 1 con:

``` text
y = 180 + 70 sin((2π/1000)x)
```

-   HP;
-   barra;
-   daño;
-   ataques;
-   muerte;
-   detener spawn normal.

### 12. Nivel superado

-   transición;
-   conservar HP;
-   conservar progresión del arma.

------------------------------------------------------------------------

## Fase 5 --- Checkpoints y pantallas

### 13. localStorage

-   checkpoint por nivel;
-   progreso de arma;
-   restauración correcta.

### 14. Menú inicial

-   `inicio.gif`;
-   comenzar/continuar según diseño final.

### 15. Pausa

-   continuar;
-   reiniciar nivel;
-   menú.

### 16. Game Over

-   `explosion.gif`;
-   reintentar nivel actual;
-   menú.

### 17. Pantalla Nivel Superado

### 18. Victoria final

-   `fin.gif`.

------------------------------------------------------------------------

## Fase 6 --- Expandir a niveles 2--5

### Nivel 2

-   período 900;
-   amplitud 35;
-   Heavy → arma 3;
-   Boss 2.

### Nivel 3

-   período 600;
-   dos ciclos;
-   Heavy → arma 4;
-   Boss 3.

### Nivel 4

-   desfases;
-   sin Heavy;
-   Boss 4 seno + coseno.

### Nivel 5

-   combinaciones controladas;
-   sin Heavy;
-   Boss 5;
-   fase especial tangente;
-   victoria final.

------------------------------------------------------------------------

## Fase 7 --- Panel académico de presentación

Implementar panel `Q` completo:

-   grid;
-   coordenadas;
-   curvas;
-   ecuaciones;
-   parámetros;
-   hitboxes;
-   FPS/entidades;
-   selector Nivel 1--5;
-   selector Inicio/Nudo/Boss;
-   Cargar;
-   Reiniciar nivel;
-   cleanup completo al saltar;
-   NO modificar localStorage.

Este panel debe permitir, por ejemplo:

``` text
Q
→ Nivel 5
→ Boss
→ Cargar
```

y mostrar directamente el Boss final para explicar las funciones
utilizadas.

------------------------------------------------------------------------

## Fase 8 --- Audio

Integrar:

``` text
música Inicio
música Nudo
música Boss
```

y SFX disponibles.

Gestionar correctamente:

-   cambio de pista por stage;
-   pausa;
-   reinicio;
-   Game Over;
-   victoria.

------------------------------------------------------------------------

## Fase 9 --- Balance y polish

Playtesting:

-   HP;
-   daño;
-   spawn;
-   número de enemigos;
-   cadencia;
-   velocidad;
-   bosses;
-   frecuencia de drops;
-   duración de niveles.

Objetivo:

``` text
~2–3 min por nivel
```

sin sacrificar claridad matemática.

------------------------------------------------------------------------

## Fase 10 --- Entrega

-   DEBUG apagado por defecto;
-   comprobar menú y flujo completo;
-   comprobar checkpoints;
-   comprobar cleanup;
-   comprobar responsive;
-   comprobar audio;
-   comprobar panel académico;
-   probar Nivel 1 → victoria;
-   probar salto directo Nivel 5/Boss;
-   desplegar frontend estático;
-   terminar documento académico;
-   preparar exposición.

------------------------------------------------------------------------

# 31. Estrategia para la exposición

La exposición no debe limitarse a decir "usamos seno".

Mostrar en vivo:

1.  abrir panel `Q`;
2.  seleccionar Nivel 1;
3.  activar cuadrícula + trayectoria + ecuación;
4.  mostrar nave siguiendo seno/coseno;
5.  explicar amplitud, período y línea media;
6.  saltar a Nivel 3 para mostrar dos ciclos;
7.  saltar a Nivel 4 para mostrar fase;
8.  saltar a Nivel 5 para mostrar combinación;
9.  cargar Boss 4 para mostrar suma seno + coseno;
10. cargar Boss 5 y su fase tangente;
11. explicar discontinuidad/asíntota;
12. mostrar láser enemigo y explicar: `vx = v cos θ`, `vy = v sin θ`.

Así el videojuego funciona simultáneamente como:

``` text
aplicación
+ simulación matemática
+ herramienta de exposición
```

------------------------------------------------------------------------

# 32. Reglas para futuras modificaciones con Codex

Antes de pedir un cambio:

1.  revisar este documento;
2.  identificar si la decisión ya está cerrada;
3.  cambiar una responsabilidad importante por iteración cuando sea
    posible;
4.  probar visualmente;
5.  ejecutar validación de sintaxis;
6.  actualizar este roadmap si cambia una decisión;
7.  commit/push en checkpoints estables.

No permitir que Codex decida silenciosamente:

-   balance global;
-   arquitectura de stages;
-   progresión;
-   checkpoints;
-   fórmulas matemáticas;
-   comportamiento de bosses;
-   persistencia.

Codex implementa las decisiones del diseño; los cambios estructurales se
acuerdan primero.

------------------------------------------------------------------------

# 33. Próximo paso exacto

Desde el estado actual:

**Corregir movimiento de enemigos normales para que al alcanzar los
bordes inviertan dirección conservando la misma instancia y el mismo
HP.**

Después validar:

``` text
nave recibe daño
→ barra baja
→ llega al borde
→ se devuelve
→ conserva HP reducido
→ vuelve a cruzar
→ puede ser destruida
```

Una vez validado:

``` text
implementar exploción3.gif
```

Después:

``` text
score → Control automático de progreso y stages → Control automático de spawn → Heavy Nivel 1
```

------------------------------------------------------------------------

## Estado de las decisiones

**CERRADO:** concepto, tecnología, coordenadas, progresión matemática,
muzzle points, Heavy, stages, checkpoints, panel de exposición, bosses y
tangente, estrategia de audio, lifecycle.

**IMPLEMENTADO:** base gráfica, tanque, disparo, enemigos
trigonométricos L1, HP, barras y colisión proyectil-enemigo.

**PROVISIONAL:** cifras de balance como HP de bosses, daño, cantidad de
enemigos, intervalos y thresholds exactos.

**PENDIENTE:** gameplay restante, pantallas, stages reales, láseres,
bosses, audio, presentación completa, niveles 2--5, persistencia y
despliegue.
