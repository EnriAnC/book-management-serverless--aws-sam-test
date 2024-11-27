# Prueba de Backend Serverless con AWS SAM

## Introducción
Esta aplicación fue diseñada para evaluar conocimientos teóricos y prácticos en AWS, incluyendo DynamoDB, Cognito, Lambda, Step Functions y AppSync. El objetivo final es desarrollar una API para gestionar una base de datos de libros y autores, implementando operaciones CRUD y relaciones entre entidades. 
### ``` Las respuestas especificas al Test AWS Backend se encuentran en el archivo answer-test.md ```
 [Click aqui para dirigirse al archivo answer-test.md](answer-test.md)

## Instalación y Build del Proyecto

Antes de realizar el despliegue con `sam build --guided`, es necesario hacer el build de los Resolvers y Lambdas, ya que el proyecto está desarrollado en TypeScript y los archivos de build no se encuentran en este repositorio.

Para facilitar este proceso, se incluye un script `build-lambdas-resolvers.sh` que realiza los siguientes pasos de manera automática:

1. **Verificación de dependencias**: El script primero verifica si los módulos de Node.js están instalados en las carpetas `./functions` y `./resolvers`.
2. **Instalación de dependencias**: Si los módulos no están instalados, el script ejecuta `pnpm install` en cada carpeta correspondiente.
3. **Ejecución del Build**: Una vez las dependencias estén instaladas (si es necesario), el script ejecuta el build de cada Lambda y resolver.

Este enfoque automatiza el proceso y garantiza que las dependencias estén correctamente instaladas antes de proceder con la construcción del proyecto.

Para ejecutar el script, puede correr en la terminal el siguiente comando en la raíz del proyecto:

Para sistemas Unix (Linux, macOS):
```bash
sh build-lambdas-resolvers.sh
```

Para sistemas Windows:
```bash
.\build-lambdas-resolvers.sh
```

---
###

# Algunos detalles del diseño de la Aplicación.
### Infraestructura:
Se puede observar la infraestructura de la aplicación en el siguiente diagrama:
![application-composer-template yaml](https://github.com/user-attachments/assets/de4a81e7-a679-4f5d-b269-0aa924f0c252)



# Modelo de Base de Datos en DynamoDB

Se ha diseñado un modelo Single-Table para gestionar libros, autores y géneros, aprovechando relaciones y consultas eficientes mediante claves de partición (PK), claves de ordenación (SK) e índices secundarios globales (GSI).

## Modelo y uso llaves

### GSIs 
| GSI             | Descripción           |
|-------------------|------------------------|
| **InverseIndex**  | Se invierten las llaves principales `PK (Partition Key)` y `SK (Sort Key)`, tomando los valores `PartitionKey = SK` y `SortKey = PK` .

### **Libros**
| Clave            | Valor                  |
|-------------------|------------------------|
| **PK**           | `BOOK#1`, `BOOK#2`    |
| **SK**           | `METADATA#BOOK`       |

### **Autores**
| Clave            | Valor                  |
|-------------------|------------------------|
| **PK**           | `AUTHOR#1`, `AUTHOR#2`|
| **SK**           | `METADATA#AUTHOR`     |

### **Géneros**
| Clave            | Valor                  |
|-------------------|------------------------|
| **PK**           | `GENRE#1`, `GENRE#2`, `GENRE#3` |
| **SK**           | `METADATA#GENRE`      |

## Relaciones

### **Relación Libro-Autor**
| Clave            | Valor                  |
|-------------------|------------------------|
| **PK**           | `BOOK#1`              |
| **SK**           | `AUTHOR#1`            |

### **Relación Libro-Género**
| Clave            | Valor                  |
|-------------------|------------------------|
| **PK**           | `BOOK#1`              |
| **SK**           | `GENRE#1`, `GENRE#2`  |

## Consultas Soportadas

| Consulta                        | Expresión DynamoDB                                   |
|---------------------------------|-----------------------------------------------------|
| **Todos los libros (InverseIndex)**      | `SK = METADATA#BOOK`                                |
| **Todos los autores (InverseIndex)**     | `SK = METADATA#AUTHOR`                                |
| **Todos los generos (InverseIndex)**     | `SK = METADATA#GENRE`                                |
| **Detalles de un libro**        | `PK = BOOK#1 AND SK = METADATA#BOOK`                |
| **Autor de un libro**           | `PK = BOOK#1 AND SK begins_with "AUTHOR#"`          |
| **Géneros de un libro**         | `PK = BOOK#1 AND SK begins_with "GENRE#"`           |
| **Libros de un autor (InverseIndex)**    | `SK = AUTHOR#1 AND PK begins_with "BOOK#"`          |
| **Libros de un género (InverseIndex)**   | `SK = GENRE#1 AND PK begins_with "BOOK#"`           |

## Notas
- El diseño optimiza la estructura para consultas específicas y minimiza el costo de las operaciones en DynamoDB.
- El uso de prefijos como `METADATA#`, `AUTHOR#`, y `GENRE#` facilita la búsqueda eficiente y el modelado flexible de relaciones.