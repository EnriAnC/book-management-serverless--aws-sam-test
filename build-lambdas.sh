#!/bin/bash

# Ruta a la carpeta que contiene todas tus funciones Lambda
LAMBDAS_DIR="./functions"

# Recorre todas las carpetas dentro de la carpeta de Lambdas
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

# Espera a que todos los procesos en segundo plano terminen
wait

echo "All applicable Lambdas built successfully!"
