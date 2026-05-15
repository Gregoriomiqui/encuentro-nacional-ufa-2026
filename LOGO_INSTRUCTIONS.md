# 📋 Instrucciones Rápidas - Logo

## 🎨 Reemplazar el Logo Placeholder

El sitio actualmente usa un logo SVG temporal. Sigue estos pasos para usar el logo oficial:

### Opción 1: Usar el logo PNG de la imagen adjunta

1. **Guardar el logo**
   - Guarda el archivo de imagen PNG que tienes (`LOGO_UFA_CHILE.png`)
   - Asegúrate de que tenga fondo transparente

2. **Renombrar y colocar**
   ```bash
   # Renombra el archivo a:
   logo-ufa.png
   
   # Muévelo a la carpeta assets/:
   mv LOGO_UFA_CHILE.png assets/logo-ufa.png
   ```

3. **Actualizar referencias en HTML**
   
   Busca y reemplaza en los 3 archivos HTML:
   - `index.html`
   - `terminos-y-condiciones.html`
   - `politica-de-privacidad.html`
   
   Cambia:
   ```html
   <img src="assets/logo-ufa.svg" alt="Logo UFAACYM Chile" class="logo">
   ```
   
   Por:
   ```html
   <img src="assets/logo-ufa.png" alt="Logo UFAACYM Chile" class="logo">
   ```

4. **Commit y push**
   ```bash
   git add assets/logo-ufa.png
   git add *.html
   git commit -m "Actualizar con logo oficial"
   git push origin main
   ```

### Opción 2: Convertir y optimizar el logo

Si quieres optimizar el logo para web:

1. **Optimizar con herramientas online**
   - [TinyPNG](https://tinypng.com/) - Comprimir PNG
   - [Squoosh](https://squoosh.app/) - Comprimir y convertir
   - [ImageOptim](https://imageoptim.com/) - App macOS

2. **Dimensiones recomendadas**
   - Tamaño original: 500x500px o similar
   - Para web: 300x300px es suficiente
   - Mantén la proporción (cuadrado preferiblemente)

3. **Formatos sugeridos**
   - **PNG**: Si tiene transparencia (recomendado)
   - **SVG**: Si es vectorial (más escalable)
   - **WebP**: Para mejor compresión (navegadores modernos)

### Opción 3: Usar múltiples formatos (mejor práctica)

Para máxima compatibilidad:

```html
<picture>
  <source srcset="assets/logo-ufa.webp" type="image/webp">
  <source srcset="assets/logo-ufa.png" type="image/png">
  <img src="assets/logo-ufa.png" alt="Logo UFAACYM Chile" class="logo">
</picture>
```

## ✅ Checklist

- [ ] Logo guardado en `assets/`
- [ ] Nombre correcto: `logo-ufa.png` o `logo-ufa.svg`
- [ ] Referencias actualizadas en todos los HTML
- [ ] Logo se ve bien en todos los tamaños
- [ ] Fondo transparente (si es PNG)
- [ ] Cambios commiteados y pusheados

## 🔍 Verificar

Después de actualizar:

1. Abre el sitio localmente o en GitHub Pages
2. Verifica que el logo aparezca en:
   - Header de todas las páginas
   - Footer de todas las páginas
3. Verifica en diferentes tamaños de pantalla:
   - Desktop
   - Tablet
   - Móvil

## 🆘 Problemas Comunes

### El logo no aparece

**Problema**: La imagen no se muestra
**Solución**: 
- Verifica la ruta: `assets/logo-ufa.png`
- Verifica el nombre exacto del archivo
- Limpia el caché del navegador (Ctrl+Shift+R)

### El logo se ve pixelado

**Problema**: Imagen de baja calidad
**Solución**:
- Usa una imagen de mayor resolución (mínimo 300x300px)
- Considera usar SVG para máxima calidad

### El logo es muy grande/pequeño

**Problema**: Tamaño no apropiado
**Solución**:
- El CSS ya controla el tamaño: `.logo { height: 50px; }`
- Para cambiar el tamaño, edita `styles.css`:
  ```css
  .logo {
      height: 60px;  /* Aumenta o disminuye */
      width: auto;
  }
  ```

### Fondo blanco en el logo

**Problema**: Logo PNG con fondo blanco
**Solución**:
- Usa una herramienta para remover el fondo:
  - [Remove.bg](https://www.remove.bg/)
  - Photoshop/GIMP
  - Preview en macOS (seleccionar y borrar)

## 📞 Ayuda

Si tienes problemas:
1. Revisa el README.md
2. Consulta el DEPLOYMENT.md
3. Verifica los errores en la consola del navegador (F12)

---

**Nota**: El logo SVG temporal funcionará mientras actualizas al logo oficial. No hay prisa, pero el logo oficial mejorará significativamente la presentación del sitio.
