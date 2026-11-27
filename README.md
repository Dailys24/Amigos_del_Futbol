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
