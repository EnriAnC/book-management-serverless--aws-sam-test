#!/bin/bash

# Ruta a la carpeta que contiene todas tus funciones Lambda
LAMBDAS_DIR="./functions"

# Recorre todas las carpetas dentro de la carpeta de Lambdas

# Verifica si existe node_modules, si no, instala las dependencias
if [ ! -d "$LAMBDAS_DIR/node_modules" ]; then
  echo "node_modules not found in $(basename "$LAMBDAS_DIR"). Running 'pnpm install'..."
  (cd "$LAMBDAS_DIR" && pnpm install) &
fi
for dir in "$LAMBDAS_DIR"/*; do
  if [ -d "$dir" ]; then
    if [ -f "$dir/package.json" ]; then
      echo "Building $(basename "$dir")..."
      (cd "$dir" && pnpm run build) &
    else
      echo "Skipping $(basename "$dir") as it does not contain a package.json file."
    fi
  fi
done

RESOLVERS_DIR="./resolvers"

if [ -f "$RESOLVERS_DIR/package.json" ]; then
  echo "Checking $(basename "$RESOLVERS_DIR")..."
  # Verifica si existe node_modules, si no, instala las dependencias
  if [ ! -d "$RESOLVERS_DIR/node_modules" ]; then
    echo "node_modules not found in $(basename "$RESOLVERS_DIR"). Running 'pnpm install'..."
    (cd "$RESOLVERS_DIR" && pnpm install) &
  fi
  echo "Building $(basename "$RESOLVERS_DIR")..."
  (cd "$RESOLVERS_DIR" && pnpm run build) &
else
  echo "Skipping $(basename "$RESOLVERS_DIR") as it does not contain a package.json file."
fi

# Espera a que todos los procesos en segundo plano terminen
wait

echo "All applicable Lambdas and Resolvers built successfully!"
