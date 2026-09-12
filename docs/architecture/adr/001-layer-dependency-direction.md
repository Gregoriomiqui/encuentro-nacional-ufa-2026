# ADR-001: Dirección de dependencias por capas

- Estado: accepted
- Fecha: 2026-09-11
- Decisores: Equipo de desarrollo UFA
- Reemplaza: Ninguno

## Contexto

El frontend integra proveedores externos y reglas de inscripción. Sin límites explícitos, los casos de uso terminan acoplados a Make, Firebase o Supabase, lo que hace difícil probar y reemplazar integraciones.

## Decisión

Cada contexto funcional usa las capas `domain`, `application`, `infrastructure` y `presentation`. La aplicación depende de dominio y define puertos; infraestructura implementa adaptadores; presentación o `app` compone casos de uso y adaptadores. ESLint impide imports desde dominio o aplicación hacia capas externas.

## Consecuencias

- Beneficios: pruebas unitarias aisladas y reemplazo controlado de proveedores.
- Costos y riesgos: los casos de uso que colaboran con el exterior requieren puertos y composición explícita.
- Acciones de seguimiento: mantener las reglas ESLint y registrar futuras excepciones como ADR.