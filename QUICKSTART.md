# 🚀 Inicio Rápido

¿Quieres ver el sitio funcionando **AHORA**? Sigue estos pasos:

## ⚡ 3 Pasos para Verlo Localmente

### 1. Abrir el archivo
```bash
# Opción A: Desde terminal
open index.html

# Opción B: macOS Finder
# Doble click en index.html
```

### 2. O usar un servidor local (recomendado)

**Python** (ya instalado en macOS):
```bash
cd /Users/josemiquilena/Programacion/personal/projectUFA
python3 -m http.server 8000
```
Luego abre: http://localhost:8000

**VS Code** (si lo tienes):
1. Abre la carpeta en VS Code
2. Instala la extensión "Live Server"
3. Click derecho en `index.html` > "Open with Live Server"

### 3. ¡Explora! 🎉

Navega por las páginas:
- 🏠 Página principal
- 📄 Términos y condiciones
- 🔒 Política de privacidad

## 📤 Subir a GitHub Pages

### Paso 1: Crear repositorio en GitHub
```bash
# En terminal, dentro de la carpeta del proyecto:
git init
git add .
git commit -m "Sitio web Retiro Nacional UFA"
```

### Paso 2: Conectar con GitHub
```bash
# Crea un repo en github.com primero, luego:
git remote add origin https://github.com/TU-USUARIO/retiro-ufa.git
git branch -M main
git push -u origin main
```

### Paso 3: Activar GitHub Pages
1. Ve a tu repo en GitHub
2. Settings > Pages
3. Source: `main` branch, `/` root
4. Save

**¡Listo!** Tu sitio estará en: `https://TU-USUARIO.github.io/retiro-ufa/`

## 🎨 Personalizar

### Cambiar el logo
Lee: [LOGO_INSTRUCTIONS.md](LOGO_INSTRUCTIONS.md)

### Cambiar colores
Edita `styles.css`, líneas 15-21:
```css
--primary-color: #d91c7a;  /* Tu color aquí */
```

### Actualizar contenido
- `index.html` - Página principal
- `terminos-y-condiciones.html` - Términos
- `politica-de-privacidad.html` - Privacidad

## 📚 Documentación Completa

- 📖 [README.md](README.md) - Documentación completa
- 🚀 [DEPLOYMENT.md](DEPLOYMENT.md) - Guía de despliegue detallada
- 🤝 [CONTRIBUTING.md](CONTRIBUTING.md) - Cómo contribuir
- 📄 [LICENSE.md](LICENSE.md) - Términos de licencia

## ❓ Preguntas Frecuentes

**¿El logo no aparece?**
Es temporal. Lee [LOGO_INSTRUCTIONS.md](LOGO_INSTRUCTIONS.md) para actualizar.

**¿Cómo actualizo las fechas del evento?**
Edita `index.html`, busca "Próximamente" y actualiza.

**¿Puedo cambiar los términos legales?**
Sí, pero consulta con el equipo legal/pastoral primero.

**¿Cómo agrego un formulario de inscripción?**
Se puede integrar Google Forms, Typeform, o un backend personalizado.

## 🆘 Ayuda

Problemas? Revisa:
1. La consola del navegador (F12)
2. Los archivos de documentación
3. Crea un issue en GitHub

## ✅ Checklist Pre-Publicación

Antes de anunciar el sitio:

- [ ] Logo actualizado al oficial
- [ ] Fechas del evento actualizadas
- [ ] Información de contacto correcta
- [ ] URLs en sitemap.xml actualizadas
- [ ] Probado en móvil y desktop
- [ ] Términos revisados legalmente
- [ ] HTTPS activado en GitHub Pages

---

**¡Felicidades! 🎉**

Tienes un sitio web profesional listo para el Retiro Nacional UFA.

Para más detalles, consulta el [README.md](README.md) completo.
