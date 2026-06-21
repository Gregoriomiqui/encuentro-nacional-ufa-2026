# Guía de Despliegue - GitHub Pages

Esta guía te ayudará a publicar el sitio web del Retiro Nacional UFA en GitHub Pages.

## 📋 Prerrequisitos

- Cuenta de GitHub
- Git instalado en tu computadora
- El proyecto descargado o clonado

## 🚀 Pasos para Desplegar

### 1. Crear un Repositorio en GitHub

1. Ve a [GitHub](https://github.com)
2. Click en el botón "+" en la esquina superior derecha
3. Selecciona "New repository"
4. Llena la información:
   - **Repository name**: `retiro-ufa` (o el nombre que prefieras)
   - **Description**: "Sitio web oficial del Retiro Nacional UFA - UFA ACYM Chile"
   - **Visibility**: Public (para GitHub Pages gratuito)
   - No marques "Add a README file" (ya tienes uno)
5. Click en "Create repository"

### 2. Subir el Proyecto a GitHub

Abre la terminal en la carpeta del proyecto y ejecuta:

```bash
# Inicializar git (si aún no está inicializado)
git init

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit: Sitio web Retiro Nacional UFA"

# Conectar con el repositorio remoto (reemplaza con tu URL)
git remote add origin https://github.com/tu-usuario/retiro-ufa.git

# Renombrar la rama a main (si es necesario)
git branch -M main

# Subir los archivos
git push -u origin main
```

### 3. Activar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en "Settings" (Configuración)
3. En el menú lateral izquierdo, busca "Pages"
4. En "Source" (Fuente):
   - Branch: selecciona `main`
   - Folder: selecciona `/ (root)`
5. Click en "Save" (Guardar)
6. Espera unos minutos

Tu sitio estará disponible en:
```
https://tu-usuario.github.io/retiro-ufa/
```

### 4. Configurar un Dominio Personalizado (Opcional)

Si tienes un dominio propio:

1. En la misma página de GitHub Pages
2. En "Custom domain", ingresa tu dominio: `www.retiroufa.cl`
3. Click en "Save"
4. En tu proveedor de dominio, configura:
   - **CNAME record**: apuntando a `tu-usuario.github.io`
   - **A records** (opcional): apuntando a las IPs de GitHub:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
5. Espera la propagación DNS (puede tomar hasta 48 horas)
6. Marca "Enforce HTTPS" en GitHub Pages

## 📝 Actualizar el Sitio

Cada vez que quieras actualizar el sitio:

```bash
# 1. Hacer tus cambios en los archivos

# 2. Ver qué archivos cambiaron
git status

# 3. Agregar los cambios
git add .

# 4. Hacer commit con un mensaje descriptivo
git commit -m "Actualización: descripción de los cambios"

# 5. Subir los cambios
git push origin main
```

Los cambios aparecerán en tu sitio en unos minutos.

## 🔧 Configuración Adicional

### Actualizar URLs en sitemap.xml

Edita el archivo `sitemap.xml` y reemplaza:
```xml
<loc>https://tu-usuario.github.io/projectUFA/</loc>
```

Con:
```xml
<loc>https://tu-usuario.github.io/retiro-ufa/</loc>
```
(o tu dominio personalizado si lo tienes)

### Actualizar robots.txt

Edita el archivo `robots.txt` y actualiza:
```
Sitemap: https://tu-usuario.github.io/retiro-ufa/sitemap.xml
```

### Agregar el Logo Real

1. Ve a la carpeta `assets/`
2. Reemplaza `logo-ufa.svg` con el logo real
3. O agrega `logo-ufa.png` y actualiza las referencias en los HTML
4. Commit y push:
   ```bash
   git add assets/
   git commit -m "Agregar logo oficial"
   git push origin main
   ```

## 🎨 Personalización

### Cambiar Colores

Edita el archivo `styles.css` y modifica las variables en `:root`:

```css
:root {
    --primary-color: #d91c7a;    /* Color principal */
    --primary-dark: #a81560;     /* Color principal oscuro */
    --primary-light: #f42c8e;    /* Color principal claro */
}
```

### Actualizar Contenido

- **Página principal**: edita `index.html`
- **Términos y condiciones**: edita `terminos-y-condiciones.html`
- **Política de privacidad**: edita `politica-de-privacidad.html`

Después de editar, haz commit y push de los cambios.

## 📊 Analytics (Opcional)

### Google Analytics

1. Crea una cuenta en [Google Analytics](https://analytics.google.com)
2. Obtén tu código de seguimiento
3. Agrega antes del cierre de `</head>` en todos los HTML:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=TU-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'TU-ID');
</script>
```

## 🔒 Seguridad

### HTTPS

GitHub Pages proporciona HTTPS automáticamente. Asegúrate de:
1. Marcar "Enforce HTTPS" en Settings > Pages
2. Todas las imágenes y recursos deben usar HTTPS

### Headers de Seguridad

GitHub Pages configura automáticamente headers de seguridad básicos.

## 🐛 Solución de Problemas

### El sitio no aparece

- Verifica que hayas seleccionado la rama correcta en Settings > Pages
- Espera unos minutos (puede tardar hasta 10 minutos)
- Verifica que no haya errores en los archivos HTML

### Imágenes no cargan

- Verifica que las rutas sean correctas
- Las rutas son relativas: `assets/logo-ufa.svg`
- Verifica que los archivos existan en el repositorio

### Cambios no se reflejan

- Limpia el caché del navegador (Ctrl+Shift+R o Cmd+Shift+R)
- Espera unos minutos (GitHub Pages puede tardar en actualizar)
- Verifica que hayas hecho push correctamente: `git log`

### Error 404

- Verifica que el archivo exista
- Verifica las mayúsculas/minúsculas en los nombres de archivo
- El archivo `404.html` maneja errores automáticamente

## 📱 Testing

Prueba tu sitio en:
- Desktop (Chrome, Firefox, Safari)
- Mobile (iOS Safari, Chrome Android)
- Diferentes tamaños de pantalla

Usa las herramientas de desarrollo del navegador (F12) para:
- Verificar errores en consola
- Probar responsive design
- Revisar tiempos de carga

## 📈 SEO

Para mejorar el SEO:

1. **Google Search Console**
   - Registra tu sitio
   - Envía el sitemap: `https://tu-dominio/sitemap.xml`
   - Monitorea el rendimiento

2. **Meta Tags**
   - Ya están incluidos en los HTML
   - Personaliza las descripciones si es necesario

3. **Open Graph** (para redes sociales)
   - Considera agregar meta tags de Open Graph
   - Para mejor compartición en redes sociales

## 🔄 Mantenimiento

### Actualizaciones Regulares

- Revisa y actualiza fechas del evento
- Actualiza información de contacto
- Revisa enlaces rotos
- Actualiza políticas legales si es necesario

### Backups

GitHub ya es un backup, pero considera:
- Descargar una copia local regularmente
- Mantener copias de imágenes importantes

## 📞 Soporte

Si tienes problemas:

1. Revisa esta guía
2. Consulta la [documentación de GitHub Pages](https://docs.github.com/en/pages)
3. Busca en [GitHub Community](https://github.community/)
4. Crea un issue en el repositorio

## ✅ Checklist Final

Antes de anunciar el sitio públicamente:

- [ ] Todo el contenido está actualizado
- [ ] Las fechas son correctas
- [ ] El logo es el oficial
- [ ] Todos los enlaces funcionan
- [ ] No hay errores en consola
- [ ] El sitio es responsive
- [ ] HTTPS está activado
- [ ] El sitemap está actualizado
- [ ] Google Analytics está configurado (si se usa)
- [ ] Se probó en múltiples navegadores
- [ ] Los términos y política están revisados legalmente

---

¡Tu sitio está listo para el mundo! 🎉

Para cualquier duda adicional, consulta el README.md o la documentación oficial de GitHub Pages.
