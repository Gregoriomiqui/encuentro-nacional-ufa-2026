# Retiro Nacional UFA - Contribuir

¡Gracias por tu interés en contribuir al sitio web del Retiro Nacional UFA!

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Mejoras](#sugerir-mejoras)
- [Pull Requests](#pull-requests)
- [Estándares de Código](#estándares-de-código)

## 📜 Código de Conducta

Este proyecto está asociado con el ministerio de mujeres de la Alianza Cristiana y Misionera en Chile. Esperamos que todos los contribuyentes:

- Sean respetuosos y considerados
- Mantengan un lenguaje apropiado y profesional
- Acepten críticas constructivas con gracia
- Se enfoquen en lo que es mejor para la comunidad
- Muestren empatía hacia otros miembros

## 🤝 Cómo Contribuir

### Para Miembros del Equipo Organizador

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/projectUFA.git
   cd projectUFA
   ```

2. **Crear una rama para tus cambios**
   ```bash
   git checkout -b feature/nombre-de-tu-feature
   ```

3. **Hacer tus cambios**
   - Edita los archivos necesarios
   - Prueba los cambios localmente
   - Asegúrate de seguir los estándares de código

4. **Commit de tus cambios**
   ```bash
   git add .
   git commit -m "Descripción clara de los cambios"
   ```

5. **Push a tu rama**
   ```bash
   git push origin feature/nombre-de-tu-feature
   ```

6. **Crear un Pull Request**
   - Ve a GitHub y crea un PR desde tu rama
   - Describe claramente qué cambios hiciste y por qué
   - Espera la revisión

## 🐛 Reportar Bugs

Si encuentras un bug, por favor:

1. Verifica que no haya sido reportado ya
2. Crea un issue con:
   - Descripción clara del problema
   - Pasos para reproducirlo
   - Comportamiento esperado vs. actual
   - Screenshots si es aplicable
   - Navegador y sistema operativo

## 💡 Sugerir Mejoras

Para sugerir una mejora:

1. Verifica que no haya sido sugerida ya
2. Crea un issue describiendo:
   - La mejora propuesta
   - Por qué sería útil
   - Ejemplos de implementación si es posible

## 🔄 Pull Requests

### Checklist antes de enviar un PR:

- [ ] El código sigue los estándares del proyecto
- [ ] He probado los cambios localmente
- [ ] He actualizado la documentación si es necesario
- [ ] Los cambios no rompen funcionalidad existente
- [ ] He revisado mi código en busca de errores
- [ ] El código es limpio y bien comentado

### Proceso de Revisión:

1. Un revisor evaluará tu PR
2. Puede solicitar cambios o aclaraciones
3. Una vez aprobado, se fusionará a la rama principal
4. Tu contribución será reconocida

## 📝 Estándares de Código

### HTML

- Usa HTML5 semántico
- Cierra todas las etiquetas correctamente
- Usa indentación consistente (2 o 4 espacios)
- Incluye atributos alt en imágenes
- Usa nombres de clase descriptivos

```html
<!-- ✅ Bien -->
<section class="event-info">
    <h2 class="event-title">Título</h2>
    <p class="event-description">Descripción...</p>
</section>

<!-- ❌ Mal -->
<div class="ei">
    <h2>Título</h2>
    <p>Descripción...</p>
</div>
```

### CSS

- Usa variables CSS para colores y valores repetidos
- Agrupa estilos relacionados
- Usa nombres de clase descriptivos en español
- Incluye comentarios para secciones principales
- Mobile-first cuando sea apropiado

```css
/* ✅ Bien */
.section-title {
    font-size: 2rem;
    color: var(--primary-color);
    margin-bottom: var(--spacing-md);
}

/* ❌ Mal */
.st {
    font-size: 32px;
    color: #d91c7a;
    margin-bottom: 24px;
}
```

### JavaScript

- Usa ES6+ features
- Nombres de variables y funciones descriptivos en inglés
- Incluye comentarios JSDoc para funciones importantes
- Maneja errores apropiadamente
- Evita variables globales

```javascript
// ✅ Bien
/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ❌ Mal
function validate(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}
```

## 🔍 Testing

Antes de enviar cambios, prueba:

- [ ] Todas las páginas cargan correctamente
- [ ] La navegación funciona en todas las páginas
- [ ] Los enlaces funcionan correctamente
- [ ] El diseño es responsive (móvil, tablet, desktop)
- [ ] No hay errores en la consola del navegador
- [ ] Las animaciones funcionan suavemente

### Navegadores a probar:

- Chrome/Edge (última versión)
- Firefox (última versión)
- Safari (si es posible)
- Navegadores móviles

## 📞 Contacto

Si tienes preguntas sobre cómo contribuir:

- Abre un issue en GitHub
- Contacta al equipo organizador
- Revisa la documentación en README.md

## 🙏 Agradecimientos

Agradecemos a todos los contribuyentes que ayudan a mejorar este proyecto para el ministerio de mujeres.

---

**Nota**: Este es un proyecto ministerial. Todas las contribuciones deben alinearse con los valores y la misión de la Alianza Cristiana y Misionera en Chile.
