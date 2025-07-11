#!/bin/bash

# Cambiar al directorio del proyecto
cd /Users/ismaelgutierrez/mis-proyectos/pos-satori

# Mover y renombrar el archivo serviceAccountKey.json
mv ~/Downloads/pos-satori-firebase-adminsdk-fbsvc-a19ec8da2d.json ./serviceAccountKey.json

# Verificar que el archivo existe
ls -la ./serviceAccountKey.json

# Crear .env con la ruta correcta
echo "FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json" > .env

# Verificar el contenido de .env
cat .env

# Asegurar que .env y serviceAccountKey.json estén en .gitignore (sin duplicados)
grep -qxF ".env" .gitignore || echo ".env" >> .gitignore
grep -qxF "serviceAccountKey.json" .gitignore || echo "serviceAccountKey.json" >> .gitignore

# Verificar el contenido de .gitignore
cat .gitignore