# Retiro Nacional UFA - Sitio Web

Sitio web oficial para el Retiro Nacional de la Unión Femenina Aliancista (UFA) de la Alianza Cristiana y Misionera en Chile.

## 📋 Descripción

Este es un sitio web profesional e informativo diseñado para proporcionar información sobre el Retiro Nacional UFA, incluyendo detalles del evento, proceso de inscripción, términos y condiciones, y política de privacidad.

## 🧱 Modernización Frontend (React 19)

El repositorio incluye un frontend moderno en React 19 + Vite con arquitectura profesional para escalar funcionalidades de negocio.

### Estado de migración (Días 1-5)

1. **Día 1**: Base técnica en Vite + React 19 + TypeScript estricto.
2. **Día 2**: Scaffolding Feature-First + Clean Architecture.
3. **Día 3**: Setup TDD (Vitest + RTL) con pre-commit de calidad.
4. **Día 4**: Vertical slice real implementado con TDD (`registration`).
5. **Día 5**: Gate de calidad en CI (typecheck, lint, test, coverage, build).

### Rutas clave del módulo moderno

- Pipeline de calidad: [.github/workflows/app-quality-gate.yml](.github/workflows/app-quality-gate.yml)
- Versión de Node recomendada: [.nvmrc](.nvmrc)

### Comandos rápidos

```bash
pnpm install
pnpm dev
pnpm test
pnpm test:coverage
pnpm build
```

## 🚀 Características

- **Diseño Responsivo**: Adaptable a todos los dispositivos (móviles, tablets, desktop)
- **HTML5 Semántico**: Estructura clara y accesible
- **CSS Moderno**: Variables CSS, Grid, Flexbox
- **JavaScript Vanilla**: Sin dependencias externas
- **Accesibilidad**: Cumple con estándares WCAG
- **SEO Optimizado**: Meta tags y estructura semántica
- **Clean Code**: Código limpio siguiendo mejores prácticas

## 📁 Estructura del Proyecto

```
projectUFA/
├── index.html                      # Página principal
├── terminos-y-condiciones.html    # Términos y condiciones
├── politica-de-privacidad.html    # Política de privacidad
├── styles.css                      # Estilos CSS
├── script.js                       # JavaScript
├── README.md                       # Este archivo
└── assets/                         # Recursos (logo, imágenes)
    └── logo-ufa.png               # Logo UFAACYM Chile
```

## 🎨 Paleta de Colores

- **Primary Color**: #d91c7a (Rosa/Magenta)
- **Primary Dark**: #a81560
- **Primary Light**: #f42c8e
- **Secondary**: #2c2c2c
- **Accent**: #ff5ba8

## 🔧 Tecnologías Utilizadas

- HTML5
- CSS3 (con variables CSS)
- JavaScript ES6+
- Google Fonts (Montserrat)

## 📦 Instalación y Uso

### Para GitHub Pages:

1. **Clonar o subir el repositorio a GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/tu-usuario/tu-repositorio.git
   git push -u origin main
   ```

2. **Activar GitHub Pages**
   - Ve a Settings > Pages
   - En "Source", selecciona la rama `main` y la carpeta `/ (root)`
   - Guarda los cambios
   - Tu sitio estará disponible en: `https://tu-usuario.github.io/tu-repositorio/`

3. **Agregar el logo**
   - Crea la carpeta `assets` en la raíz del proyecto
   - Coloca el logo con el nombre `logo-ufa.png`
   - Commit y push de los cambios

### Para desarrollo local:

1. **Abrir con un servidor local**
   
   Opción 1 - Python:
   ```bash
   python -m http.server 8000
   ```
   
   Opción 2 - Node.js (con http-server):
   ```bash
   npx http-server
   ```
   
   Opción 3 - VS Code Live Server:
   - Instala la extensión "Live Server"
   - Click derecho en index.html > "Open with Live Server"

2. **Abrir en el navegador**
   ```
   http://localhost:8000
   ```

## 📱 Páginas Incluidas

### 1. Página Principal (index.html)
- Hero section con información del evento
- Sección "Acerca del Evento" con cards informativas
- Sección de inscripción con enlaces a documentos legales
- Sección de contacto
- Footer con enlaces y información

### 2. Términos y Condiciones (terminos-y-condiciones.html)
- Documento completo con términos de inscripción
- Incluye políticas de pago, cancelación y reembolso
- Normas de conducta y responsabilidad
- Diseño profesional y fácil de leer

### 3. Política de Privacidad (politica-de-privacidad.html)
- Detalla el tratamiento de datos personales
- Cumple con la legislación chilena (Ley N° 19.628)
- Información sobre derechos de los usuarios
- Seguridad y conservación de datos

## 🎯 Funcionalidades JavaScript

- **Navegación suave**: Scroll animado entre secciones
- **Animaciones de scroll**: Elementos aparecen al hacer scroll
- **Botón "Volver arriba"**: Aparece después de scroll
- **Navegación activa**: Resalta la página actual
- **Links externos**: Se abren en nueva pestaña con seguridad
- **Responsive**: Adaptación automática a diferentes pantallas

## ♿ Accesibilidad

- Uso de HTML5 semántico
- Contraste de colores adecuado
- Navegación por teclado
- Atributos ARIA cuando es necesario
- Textos alternativos para imágenes
- Focus visible para elementos interactivos

## 📊 SEO

- Meta tags descriptivos
- Títulos únicos por página
- Descripción y keywords
- Estructura de headings correcta
- URLs semánticas
- Sitemap ready

## 🔒 Seguridad

- Links externos con `rel="noopener noreferrer"`
- No se almacenan datos sensibles en el cliente
- Validación de formularios (preparada para futura implementación)
- Política de privacidad completa

## 📝 Personalización

### Cambiar colores:
Edita las variables CSS en `styles.css`:
```css
:root {
    --primary-color: #d91c7a;
    --primary-dark: #a81560;
    /* ... */
}
```

### Cambiar fuentes:
Modifica el enlace de Google Fonts en el `<head>` y la variable:
```css
--font-primary: 'Montserrat', sans-serif;
```

### Actualizar contenido:
- Edita directamente los archivos HTML
- Los textos están claramente estructurados en secciones

## 🚀 Mejoras Futuras

- [ ] Formulario de inscripción funcional
- [ ] Integración con sistema de pagos
- [ ] Galería de fotos de eventos anteriores
- [ ] Blog o sección de noticias
- [ ] Sistema de autenticación para participantes
- [ ] Panel de administración
- [ ] Newsletter/suscripción
- [ ] Integración con redes sociales

## 📄 Licencia

© 2026 UFAACYM Chile. Todos los derechos reservados.

## 👥 Contacto

Para consultas sobre el sitio web o el evento:
- A través de tu iglesia local de la Alianza Cristiana y Misionera
- Canales oficiales de UFAACYM Chile

## 🙏 Créditos

- Diseño y desarrollo: [Tu nombre/equipo]
- Logo: UFAACYM Chile
- Fuentes: Google Fonts (Montserrat)
- Iconos: SVG personalizados

---

Desarrollado con ❤️ para el ministerio de mujeres de la Alianza Cristiana y Misionera en Chile.
