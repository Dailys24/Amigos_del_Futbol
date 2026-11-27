# Liga Futbolito — Dashboard de Estadísticas e Historial

Aplicación web estática (*dark mode*, *responsive* para móvil y escritorio) para consultar y mantener el historial de estadísticas y finanzas del grupo de futbolito por temporada.

## Propósito del proyecto

Centralizar en un enlace público gratuito (alojado en **GitHub Pages**) las tablas de rendimiento y pagos de cada fecha sin depender de bases de datos externas ni servidores de pago:

* **Resumen de líderes:** Calcula automáticamente los punteros de **Mejor Goleador**, **Mejor Arquero** y **Mejor Viejo Crack**.
* **Tablas interactivas y buscador:** Permite filtrar jugadores en tiempo real y navegar entre **Goleadores**, **Arqueros**, **Viejos Crack** y **Finanzas y Cancha**.
* **Historial por año:** Separa los datos por temporada para conservar el registro de años anteriores intacto cuando arranca un nuevo año.

---

## Estructura de archivos

```text
futbol-liga/
├── index.html          # Estructura visual, pestañas, buscador y selector de año
├── js/
│   └── app.js          # Lógica de ordenamiento, fórmulas, líderes y renderizado
└── data/
    └── 2026.js         # Datos de la temporada 2026 (base actual en Fecha 55)
```

---

## Cómo actualizar las tablas en una nueva fecha

1. Abre el archivo de la temporada activa (por ejemplo, `data/2026.js`) directamente en GitHub o en tu editor local.
2. Actualiza `tituloFecha` con la nueva jornada o enfrentamiento.
3. Modifica los arreglos correspondientes dentro de `window.SEASON_DATA["2026"]`:
   * **`goleadores`:** `{ nombre, pj, goles }`. El promedio (`goles / pj`) y el orden del ranking se calculan solos.
   * **`arqueros`:** `{ nombre, pj, golesContra, puntaje }`.
   * **`viejosCrack`:** `{ nombre, pj, goles }`. El puntaje (`pj * 5 + goles * 0.5`) se calcula automáticamente.
   * **`finanzas`:** `{ nombre, p2500, p3000, abono }`. El total de abonos visibles se suma automáticamente.
4. Guarda o haz *commit* de los cambios. GitHub Pages publica la actualización en menos de un minuto.

> **Tip:** Puedes pegar los resultados de la nueva fecha en el chat y pedir que generen el bloque actualizado de `data/2026.js` para copiar y pegar sin errores de sintaxis.

---

## Cómo agregar un nuevo año (ej. 2027, 2028)

1. **Crear el archivo de datos:** Crea `data/2027.js` usando la misma estructura y asignando el objeto a `window.SEASON_DATA["2027"]`:

```javascript
window.SEASON_DATA = window.SEASON_DATA || {};

window.SEASON_DATA["2027"] = {
  anio: "2027",
  tituloFecha: "Temporada 2027 • Fecha 1",
  goleadores: [],
  arqueros: [],
  viejosCrack: [],
  finanzas: []
};
```

2. **Vincular el script en `index.html`:** Agrega la etiqueta `<script>` justo debajo del año anterior:

```html
<script src="data/2026.js"></script>
<script src="data/2027.js"></script>
```

3. **Registrar el año en `js/app.js`:** Añade la entrada en `TEMPORADAS_DISPONIBLES` (pon `"2027"` al inicio si deseas que abra por defecto en el año nuevo):

```javascript
const TEMPORADAS_DISPONIBLES = [
  { id: "2027", label: "2027" },
  { id: "2026", label: "2026" }
];
```

---

## Despliegue en GitHub Pages

1. Sube los archivos al repositorio en GitHub.
2. Ve a **Settings > Pages**.
3. En **Branch**, selecciona `main` y la carpeta `/ (root)`, luego guarda.
4. Accede al enlace generado (`https://<usuario>.github.io/<repositorio>/`).
