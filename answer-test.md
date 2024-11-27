## Introducción
Esta prueba está diseñada para evaluar conocimientos teóricos y prácticos en AWS, incluyendo DynamoDB, Cognito, Lambda, Step Functions y AppSync. El objetivo final es desarrollar una API para gestionar una base de datos de libros y autores, implementando operaciones CRUD y relaciones entre entidades.

---

## Parte Teórica: Preguntas y Respuestas

### DynamoDB

1. **Diferencia entre clave de partición y clave de ordenación**  
   - **Clave de partición (Partition Key):** Atributo principal que determina cómo se distribuyen los datos en los nodos físicos. Actúa como identificador único para cada ítem si no se utiliza una clave de ordenación.  
   - **Clave de ordenación (Sort Key):** Se usa junto con la clave de partición en tablas con esquema de clave compuesta. Permite almacenar múltiples ítems con la misma clave de partición, organizados por clave de ordenación.  
   - **Uso en queries:** La clave de partición es obligatoria, mientras que la clave de ordenación es opcional y útil para aplicar filtros específicos.  
   - **En operaciones (put, update, delete):** Si la tabla tiene clave de ordenación, es obligatorio proporcionar ambos valores para identificar unívocamente un ítem.

2. **Estrategias para garantizar la vitalidad de los datos en DynamoDB**  
   - Configuración de **backups automáticos** con Amazon DynamoDB Backup and Restore.  
   - Uso de **tablas globales** para replicación multi-región.  
   - Implementación de **TTL (Time-to-Live)** para eliminar datos obsoletos automáticamente.  
   - Monitoreo continuo mediante **Amazon CloudWatch**.  
   - Diseño optimizado de la tabla para evitar particiones calientes.

---

### Amazon Cognito

1. **Componentes principales de Amazon Cognito**  
   - **User Pools:** Manejan registro, autenticación y federación con terceros. Incluyen características como MFA y autenticación basada en contraseñas.  
   - **Identity Pools:** Proveen acceso temporal a recursos de AWS (como S3 o DynamoDB) utilizando identidades autenticadas o no autenticadas.

2. **Proceso de autenticación y autorización**  
   - **Autenticación:**  
     1. Los usuarios inician sesión o se registran en un User Pool.  
     2. Cognito genera tokens (ID token, Access token y Refresh token) en formato JWT.  
     3. Estos tokens permiten autenticarse contra APIs o servicios como AppSync.  
   - **Autorización:**  
     1. Los tokens se intercambian por credenciales temporales de AWS a través de un Identity Pool.  
     2. Estas credenciales permiten acceder a servicios como DynamoDB o S3 de manera segura.

---

### Lambda, Step Functions y AppSync

1. **AWS Lambda en un backend serverless**  
   - Ejecuta lógica de negocios en respuesta a eventos.  
   - Escalabilidad automática y pago por uso.  
   - Integración nativa con servicios como DynamoDB, S3 y Step Functions.

2. **AWS Step Functions para orquestación**  
   - Permite definir flujos de trabajo que incluyen tareas como ejecutar Lambdas o consultar DynamoDB.  
   - Garantiza fiabilidad mediante reintentos automáticos.  
   - Los flujos se configuran usando Amazon States Language (JSON o YAML).

3. **AWS AppSync y su relación con GraphQL**  
   - Proporciona APIs GraphQL escalables.  
   - Permite consultas y mutaciones optimizadas, gestionadas a través de resolvers.  
   - Ofrece suscripciones en tiempo real y manejo offline/online.

---


## Parte Práctica

### Descripción del Ejercicio

Desarrollar una API serverless para la gestión de libros y autores, utilizando **AWS SAM** y los siguientes servicios:  
- **AWS Lambda:** Para las funciones backend.  
- **Step Functions:** Para orquestar flujos de trabajo.  
- **Amazon Cognito:** Para autenticación de usuarios.  
- **AWS AppSync:** Para la capa GraphQL.

#### Requisitos de la API:
1. Operaciones CRUD para libros y autores.
2. Relación entre entidades:
   - **1 a 1:** Un libro tiene un solo autor.
   - **1 a muchos:** Un autor puede tener varios libros.
   - **Muchos a muchos:** Libros y géneros tienen relaciones bidireccionales.
3. Gestión masiva de datos (ej. eliminación en lote).
4. Despliegue multi-región.

---

### Resolución y detalles de la entrega

# Infraestructura de la Aplicación de Gestión de Libros (Book Management) - AWS SAM

## Descripción General

La aplicación es una solución serverless que permite gestionar libros, autores y géneros utilizando AWS AppSync para la exposición de una API GraphQL, AWS Lambda para la ejecución de lógica de negocio, DynamoDB para almacenamiento y Step Functions para orquestación de flujos de trabajo. La infraestructura está construida y gestionada mediante AWS Serverless Application Model (SAM).


##
# Infraestructura

![application-composer-template yaml](https://github.com/user-attachments/assets/de4a81e7-a679-4f5d-b269-0aa924f0c252)

# Modelo de Base de Datos en DynamoDB

Este modelo Single-Table Design (STTD) está diseñado para gestionar libros, autores y géneros, aprovechando relaciones y consultas eficientes mediante claves de partición (PK) y claves de ordenación (SK).

## Tablas y Claves Principales

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
| **Todos los libros (GSI)**      | `SK = METADATA#BOOK`                                |
| **Todos los autores (GSI)**     | `SK = METADATA#AUTHOR`                                |
| **Todos los generos (GSI)**     | `SK = METADATA#GENRE`                                |
| **Detalles de un libro**        | `PK = BOOK#1 AND SK = METADATA#BOOK`                |
| **Autor de un libro**           | `PK = BOOK#1 AND SK begins_with "AUTHOR#"`          |
| **Géneros de un libro**         | `PK = BOOK#1 AND SK begins_with "GENRE#"`           |
| **Libros de un autor (GSI)**    | `SK = AUTHOR#1 AND PK begins_with "BOOK#"`          |
| **Libros de un género (GSI)**   | `SK = GENRE#1 AND PK begins_with "BOOK#"`           |

## Notas
- El diseño optimiza la estructura para consultas específicas y minimiza el costo de las operaciones en DynamoDB.
- El uso de prefijos como `METADATA#`, `AUTHOR#`, y `GENRE#` facilita la búsqueda eficiente y el modelado flexible de relaciones.

## Componentes Principales

### 1. **API GraphQL (AppSync)**
   - **Servicio:** AWS AppSync
   - **Propósito:** Exponer la API GraphQL   para interactuar con los recursos de la aplicación (libros, autores, géneros).
   - **Autenticación:** Amazon Cognito User Pools.
   - **Tipo de resolutores:** Resolutores de tipo `Mutation` y `Query`, algunos de los cuales están conectados a Step Functions.

### 2. **Autenticación y Gestión de Usuarios**
   - **Servicio:** Amazon Cognito
   - **Recursos:**
     - `BMUserPool`: Un `UserPool` para gestionar la autenticación de usuarios.
     - `BMUserPoolClient`: Cliente asociado al `UserPool` para interactuar con la API.

### 3. **Base de Datos**
   - **Servicio:** Amazon DynamoDB
   - **Tabla:** `BookManagementTable`
     - **Propósito:** Almacenar libros, autores y géneros.
     - **Acceso:** Controlado mediante roles IAM.

### 4. **Orquestación con Step Functions**
   - **Servicio:** AWS Step Functions
   - **Flujos de trabajo:** `SaveBookStateMachine`
     - **Propósito:** Orquestar las funciones de Lambda para manejar la creación de libros, registrar auditoría, y realizar otras tareas complejas.
     - **Tipo de Step Function:** EXPRESS.
     - **Rol asociado:** `StateMachineLambdaInvokeRole` (Permite invocar funciones Lambda desde Step Functions).

### 5. **Funciones Lambda**
   - **Servicio:** AWS Lambda
   - **Funciones clave:**
     - `GetBooksFunction`, `PutBookFunction`, `DeleteBooksFunction`: Funciones CRUD para gestionar libros.
     - `GetAuthorsFunction`, `PutAuthorFunction`, `DeleteAuthorsFunction`: Funciones CRUD para gestionar autores.
     - `GetGenresFunction`, `PutGenreFunction`, `DeleteGenresFunction`: Funciones CRUD para gestionar géneros.
     - `AuditFunction`: Función para registrar auditoría de operaciones.
     - `RewriteGenreBookRelationsFunction`, `CreateGenreBookRelationsFunction`: Funciones para gestionar relaciones entre géneros y libros.
     - `GetBooksSortByGenderFunction`: Función para obtener libros ordenados por género.

### 6. **Roles IAM y Políticas**
   - **RoleAppSyncDynamoDB:** Rol para permitir que AWS AppSync interactúe con DynamoDB.
   - **StepFunctionsResolverExecutionRole:** Rol para permitir que AWS AppSync invoque Step Functions.
   - **StateMachineLambdaInvokeRole:** Rol para permitir que Step Functions invoque funciones Lambda.
   - **Política de DynamoDB:** Cada función Lambda que interactúa con DynamoDB tiene asociada una política para operaciones CRUD sobre la tabla `BookManagementTable`.

### 7. **Resolvadores de AppSync**
   - **Resolver:** `SaveBookResolver`
     - **Propósito:** Inicia la ejecución de Step Functions para guardar un libro y realizar la auditoría correspondiente.

### 8. **StateMachine de Step Functions**
   - **Flujo de trabajo (State Machine):**
     - **Propósito:** Coordina múltiples funciones Lambda en un flujo para crear libros, asociar relaciones de géneros, y realizar auditoría.
     - **Acciones principales:** Invoca `PutBookFunction`, `AuditFunction`, y otros servicios necesarios como DynamoDB.