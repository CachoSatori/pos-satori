# Pruebas Manuales para pos-satori

## 1. Autenticación
- [ ] **Login válido:**  
  _Esperado:_ Redirige a `/dashboard`, Sentry registra usuario y rol.
- [ ] **Login inválido:**  
  _Esperado:_ Muestra mensaje de error, no redirige.
- [ ] **Logout:**  
  _Esperado:_ Redirige a `/login`, limpia la sesión.

## 2. Dashboard
- [ ] **Visualización de listas:**  
  _Esperado:_ Datos visibles, diseño responsive en mobile.
- [ ] **Filtro por ubicación:**  
  _Esperado:_ Las órdenes se filtran correctamente por `ubicacionId`.

## 3. Reportes
- [ ] **Filtros de fecha y ubicación:**  
  _Esperado:_ Fetch filtrado, total calculado correctamente.
- [ ] **Internacionalización en Reports:**  
  _Esperado:_ Cambiar idioma actualiza textos de reportes.

## 4. Rutas de Administración
- [ ] **CRUD de productos:**  
  _Esperado:_ Solo usuarios admin pueden acceder, cambios reflejados en Firestore.
- [ ] **CRUD de mesas:**  
  _Esperado:_ Solo admin, operaciones reflejadas en base de datos.

## 5. Notificaciones
- [ ] **Push notifications:**  
  _Esperado:_ Recibe notificaciones FCM, maneja correctamente en modo offline.

## 6. Modo Offline
- [ ] **Agregar orden offline:**  
  _Esperado:_ Orden persiste localmente y se sincroniza al volver online.

## 7. Internacionalización (i18n)
- [ ] **Cambio de idioma:**  
  _Esperado:_ Toda la UI (incluyendo reportes) cambia entre español e inglés.

## 8. Verificación de Seguridad y Calidad
- [ ] **Sentry:**  
  _Esperado:_ Los errores críticos se reportan en Sentry.
- [ ] **Reglas de Firebase:**  
  _Esperado:_ Escrituras denegadas sin autenticación.
- [ ] **Mobile:**  
  _Esperado:_ UI usable y sin errores en viewport tipo iPhone-X.

---

<!-- Test final: Marca cada ítem tras validarlo manualmente antes de release. -->