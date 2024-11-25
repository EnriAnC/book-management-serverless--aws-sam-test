# Prueba de Backend Serverless con AWS SAM

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

## Detalles de Configuración

### 1. **Recursos de IAM**

Los recursos de IAM se utilizan para proporcionar permisos adecuados para interactuar con los servicios de AWS desde las funciones Lambda, AppSync y Step Functions.

#### Roles y Políticas de IAM
- **RoleAppSyncDynamoDB:** Permite que AppSync acceda a DynamoDB.
- **StepFunctionsResolverExecutionRole:** Permite a AppSync invocar Step Functions.
- **StateMachineLambdaInvokeRole:** Permite a Step Functions invocar funciones Lambda.
- **Política DynamoDBCrudPolicy:** Asociada a las funciones Lambda que acceden a la tabla `BookManagementTable`.

### 2. **API GraphQL de AppSync**

La API GraphQL está configurada para usar autenticación con Amazon Cognito. Los resolutores están conectados a diferentes fuentes de datos, como DynamoDB y Step Functions. La API es responsable de gestionar las interacciones con la base de datos y la orquestación de flujos de trabajo complejos mediante Step Functions.

#### Esquema GraphQL
El esquema de GraphQL define las operaciones de consulta y mutación que los clientes pueden realizar, permitiendo gestionar libros, autores y géneros.

### 3. **Funciones Lambda**

Cada función Lambda es responsable de una tarea específica. Las funciones CRUD gestionan libros, autores y géneros, mientras que la `AuditFunction` se utiliza para registrar las acciones realizadas. Estas funciones interactúan con DynamoDB y otros recursos como Step Functions.

### 4. **Step Functions**

El flujo de trabajo de Step Functions (`SaveBookStateMachine`) maneja la creación de un libro, la asociación de géneros, y la auditoría de las operaciones. Este flujo orquestado permite que las acciones sean secuenciales y fáciles de gestionar.

## Visualización Infraestructura

![application-composer-template yaml](https://github.com/user-attachments/assets/de4a81e7-a679-4f5d-b269-0aa924f0c252)
