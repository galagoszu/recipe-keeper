# Recipe Keeper

Crea y desarrolla una aplicación Mobile First llamada Grimorio Dev, desarrollada por ArkanDev.

La aplicación debe ser un cuaderno digital de recetas, simple, rápido, moderno y fácil de usar, pensado para reemplazar un cuaderno tradicional de recetas, pero agregando las ventajas de una aplicación: búsqueda rápida, organización, respaldo en la nube, sincronización entre dispositivos, importación de recetas, OCR, edición y posibilidad de compartir recetas fácilmente.

La filosofía principal del producto debe ser:

"La simplicidad de un cuaderno de recetas, con la comodidad de una aplicación moderna."

No quiero una red social de recetas ni una aplicación recargada. La prioridad es que una persona pueda:

Abrir → buscar → leer → preparar → guardar sus propias experiencias → compartir.

---

1. NOMBRE Y MARCA

Nombre de la aplicación:

Grimorio Dev

Desarrollador:

ArkanDev

Mostrar "Desarrollado por ArkanDev" de forma discreta, sin quitar protagonismo a las recetas.

---

2. OBJETIVO PRINCIPAL

La aplicación debe permitir que una persona pueda:

- crear recetas
- editar recetas
- eliminar recetas
- buscar recetas rápidamente
- organizar recetas por categorías
- utilizar palabras clave
- agregar ingredientes con cantidades y unidades
- agregar imágenes
- escribir el procedimiento
- escribir una descripción de la receta
- agregar comentarios personales con fecha
- compartir recetas como texto
- exportar recetas en un formato propio
- importar recetas recibidas de otros usuarios
- importar recetas pegando texto
- escanear recetas mediante OCR
- revisar y corregir recetas importadas antes de guardarlas
- mantener el autor original de una receta
- compartir recetas entre usuarios sin perder su origen
- sincronizar toda la información entre dispositivos
- recuperar las recetas al iniciar sesión desde otro teléfono o dispositivo.

La aplicación debe utilizar la menor cantidad de conexión a Internet posible y permitir consultar información previamente sincronizada cuando técnicamente sea posible.

---

3. PRINCIPIOS DE DISEÑO

La aplicación debe ser:

- Mobile First
- rápida
- limpia
- intuitiva
- minimalista
- moderna
- fácil de aprender
- fácil de utilizar con una sola mano
- con botones claramente identificables
- con pocos pasos para las acciones frecuentes.

No llenar las pantallas con botones innecesarios.

Las funciones principales deben estar siempre visibles o ser fácilmente accesibles.

---

4. IDENTIDAD VISUAL Y PALETAS

La interfaz debe utilizar:

- fondos blancos o neutros
- tipografía clara
- tarjetas limpias
- botones grandes
- iconos sencillos
- buen contraste
- espacios adecuados entre elementos.

El usuario podrá seleccionar una paleta de colores desde su perfil.

La paleta debe afectar principalmente:

- botones
- botones de acción
- elementos destacados
- iconos activos
- elementos seleccionados
- encabezados secundarios
- navegación.

Mantener colores neutros como base para no afectar la legibilidad de las recetas.

PALETA VERDE

#111111
#00A86B
#00D084
#FFFFFF

PALETA AZUL

#111827
#2563EB
#38BDF8
#FFFFFF

PALETA MORADA

#17131F
#7C3AED
#A855F7
#FFFFFF

PALETA ROSADA

#181116
#DB2777
#F472B6
#FFFFFF

PALETA NARANJA

#191411
#EA580C
#FB923C
#FFFFFF

PALETA ROJA

#171111
#DC2626
#F87171
#FFFFFF

PALETA ÁMBAR

#171510
#D97706
#FBBF24
#FFFFFF

PALETA TURQUESA

#101819
#0D9488
#2DD4BF
#FFFFFF

PALETA ROSA INTENSO

#181313
#E11D48
#FB7185
#FFFFFF

Guardar la selección de color del usuario en su configuración.

---

5. ICONOGRAFÍA Y ACCIONES

Utilizar una convención visual consistente en toda la aplicación.

- ✅ Verde = aceptar, guardar o validar
- ✏️ Lápiz = editar
- ❌ Rojo = cancelar, deshacer o eliminar
- 🗑️ = eliminar
- 🔍 = buscar
- ➕ = agregar
- 👤 = perfil
- 📋 = copiar
- 📤 = compartir
- 📥 = importar
- 📷 = escanear

Cuando una acción sea destructiva, utilizar una confirmación.

No utilizar iconos diferentes para representar la misma acción en diferentes pantallas.

---

6. CUENTA DE USUARIO

Cada usuario debe tener una cuenta individual.

Datos:

- nombre del propietario
- nombre de usuario
- correo electrónico
- contraseña
- nombre personalizado del libro
- paleta de colores.

Ejemplo:

Nombre:

Tamara

Nombre de usuario:

tamara77

Correo:

usuario@correo.com

Nombre del libro:

Recetas de Tamara

El nombre del usuario será utilizado como identificador visible del creador de las recetas.

---

7. AUTENTICACIÓN

Implementar autenticación real.

Permitir:

- registrarse
- iniciar sesión
- cerrar sesión
- recuperar acceso mediante los mecanismos disponibles
- cambiar contraseña
- cambiar correo.

El correo electrónico debe ser único.

No permitir que dos cuentas utilicen el mismo correo.

Las contraseñas nunca deben almacenarse en texto plano.

Utilizar un sistema seguro de autenticación.

---

8. PRIMER INICIO DE LA APLICACIÓN

Cuando una persona utilice la aplicación por primera vez debe aparecer un proceso inicial de configuración.

Solicitar:

1. Nombre del propietario.
2. Nombre de usuario.
3. Correo electrónico.
4. Contraseña.
5. Nombre del libro de recetas.
6. Selección de paleta.

Ejemplo:

Nombre:

Tamara

Usuario:

tamara77

Nombre del libro:

Recetas de Tamara

Una vez completado el registro, entrar directamente al libro.

---

9. CAMBIO DE DISPOSITIVO Y RESPALDO

La aplicación debe almacenar la información de manera persistente en la nube mediante una base de datos/backend.

Cuando el usuario cambie de teléfono:

1. instalar Grimorio Dev
2. iniciar sesión con correo y contraseña
3. recuperar automáticamente toda su información.

Debe recuperar:

- recetas
- ingredientes
- cantidades
- unidades
- categorías
- subcategorías
- palabras clave
- imágenes
- procedimientos
- descripciones
- comentarios personales
- configuraciones
- nombre del libro
- paleta
- nombre de usuario.

No utilizar almacenamiento local como único sistema de respaldo.

El almacenamiento local puede utilizarse como caché/offline, pero la información principal debe estar respaldada en la nube.

---

10. PÁGINA DE INICIO

La página principal debe ser sencilla.

En la parte superior mostrar:

Nombre personalizado del libro

Ejemplo:

Recetas de Tamara

En la esquina superior derecha:

👤 Perfil

El nombre del libro no debe tener un botón de edición permanente en la página principal.

Para modificarlo se debe ingresar a Perfil/Configuración.

---

11. ACCIONES PRINCIPALES DE INICIO

En la página principal destacar:

🔍 Buscar receta

➕ Nueva receta

También permitir acceder fácilmente a:

📥 Importar receta

📷 Escanear receta

Debajo mostrar el índice/listado de recetas.

La prioridad visual debe ser:

1. buscar
2. abrir receta
3. crear receta.

---

12. PERFIL Y CONFIGURACIÓN

Al presionar 👤 se debe abrir Perfil/Configuración.

Permitir modificar:

- nombre
- nombre de usuario
- correo
- contraseña
- nombre del libro
- paleta de colores.

Todas las opciones configuradas inicialmente deben poder modificarse posteriormente.

---

13. CAMBIO DE NOMBRE DE USUARIO

Si el usuario cambia su nombre de usuario:

- actualizar el nombre visible del autor en todas sus recetas propias.
- mantener internamente la relación mediante un ID único de usuario.
- no utilizar el nombre de usuario como clave primaria de las recetas.

Ejemplo:

Antes:

Autor: Tamara

Después de cambiar usuario:

Autor: Tamara77

Todas las recetas propias deben mostrar el nuevo nombre.

Esto NO debe modificar el autor original de recetas que pertenecen a otros usuarios.

---

14. ÍNDICE DE RECETAS

La aplicación debe funcionar como un índice digital.

Cada vez que se cree o importe una receta, debe aparecer automáticamente en el índice.

El índice debe mostrar como mínimo:

- nombre
- categoría
- subcategoría
- autor/origen
- imagen si existe.

Permitir búsqueda mediante:

- nombre
- palabras clave
- categoría
- subcategoría
- autor.

La búsqueda debe ser rápida.

Debe ignorar diferencias básicas entre mayúsculas y minúsculas.

Cuando sea posible, debe tolerar diferencias de acentuación.

---

15. CATEGORÍAS

Utilizar inicialmente estas categorías.

SALADO

- Masas y Panes
- Antojos y Comida Rápida
- Entradas
- Cocina Internacional
- Platos Principales

DULCE

- Masas Dulces
- Frituras Dulces
- Repostería
- Postres
- Dulces

La arquitectura debe permitir agregar nuevas categorías y subcategorías posteriormente sin rediseñar toda la aplicación.

Cada receta debe poder tener:

- categoría principal
- subcategoría
- palabras clave.

---

16. CREAR NUEVA RECETA

Al presionar:

➕ Nueva receta

abrir un formulario simple.

Campos:

Nombre de la receta

Ejemplo:

Torta de Durazno y Manjar

Categoría

Ejemplo:

Dulce

Subcategoría

Ejemplo:

Repostería

Palabras clave

Ejemplo:

torta, durazno, manjar, cumpleaños, postre

Las palabras clave deben utilizarse para mejorar la búsqueda.

---

17. DESCRIPCIÓN DE LA RECETA

Después del título y antes de los ingredientes debe existir un campo:

Descripción

Este campo debe explicar de qué trata la receta.

Puede contener:

- descripción general
- características
- ocasión
- recomendaciones generales
- información introductoria.

Ejemplo:

"Esta es una torta húmeda de durazno y manjar, ideal para cumpleaños."

La descripción debe ser diferente del procedimiento.

---

18. AUTOR Y ORIGEN

Toda receta debe tener información de origen.

RECETA CREADA POR EL USUARIO

Mostrar:

Autor: Tamara

utilizando el nombre de usuario actual.

RECETA IMPORTADA DESDE TEXTO

Mostrar:

Autor: Copiada de

y permitir al usuario escribir opcionalmente de dónde obtuvo la receta.

Ejemplo:

Autor: Copiada de

Fuente: Blog de cocina de María

RECETA COMPARTIDA

Mostrar:

Autor: Tamara

Compartida por: Pedro

El autor original nunca debe perderse.

---

19. INGREDIENTES

Agregar una sección:

Ingredientes

Cada ingrediente debe ser estructurado.

Debe contener:

- cantidad
- unidad
- nombre del ingrediente
- opcionalmente una nota.

Ejemplos:

200 g Harina sin polvo

100 ml Leche

2 un Huevos

1 pizca Sal

No guardar los ingredientes solamente como texto.

Guardar los valores de forma estructurada.

Ejemplo conceptual:

quantity: 200

unit: g

name: Harina sin polvo

Esto permitirá futuras funciones como búsqueda, edición y conversión.

---

20. PLACEHOLDER DE INGREDIENTES

Utilizar como placeholder:

0.0 gramos Harina sin polvo

El texto debe aparecer en gris y diferenciarse claramente del contenido ingresado.

---

21. UNIDADES Y MEDIDAS

Utilizar inicialmente las siguientes unidades.

⚖️ PESO

- Kilogramo (kg)
- Gramo (g)
- Miligramo (mg)
- Libra (lb)
- Onza (oz)

🥛 VOLUMEN

- Litro (L)
- Mililitro (ml)
- Galón (gal)
- Cuarto (qt)
- Pinta (pt)
- Taza (cup)
- Onza líquida (fl oz)

🥄 MEDIDAS CULINARIAS

- Cucharada (tbsp)
- Cucharadita (tsp)
- ½ cucharada
- ½ cucharadita
- Pizca
- Una pizca
- Puñado
- Chorrito
- Gota
- Al gusto
- A gusto / según preferencia

🍳 CANTIDADES / UNIDADES

- Unidad (un)
- Porción
- Rebanada
- Rodaja
- Trozo
- Pedazo
- Tira
- Cubo
- Bola
- Hoja
- Rama
- Ramita
- Diente
- Cabeza

La arquitectura debe permitir agregar nuevas unidades posteriormente.

---

22. EDICIÓN DE INGREDIENTES

Mientras se está creando un ingrediente debe aparecer como un elemento editable.

Mostrar:

✅ aceptar/agregar

❌ cancelar/eliminar.

Mientras está siendo editado puede utilizarse un contenedor visual para diferenciarlo.

Una vez aceptado:

- dejar de mostrarlo dentro del rectángulo de edición.
- mostrarlo como una línea limpia dentro de la lista.

Ejemplo:

200 g Harina sin polvo

100 ml Leche

2 un Huevos

Cada ingrediente ya agregado debe tener:

✏️ Editar

🗑️ Eliminar

Al presionar editar:

- permitir modificar cantidad
- modificar unidad
- modificar nombre
- modificar nota
- mostrar ✅ para validar
- mostrar ❌ para cancelar.

Al eliminar, solicitar confirmación.

---

23. PROCEDIMIENTO

Después de los ingredientes:

Preparación

Permitir escribir el procedimiento completo.

Debe permitir varios pasos.

Ejemplo:

1. Precalentar el horno.
2. Batir los huevos.
3. Incorporar la harina.
4. Agregar la leche.
5. Hornear durante 40 minutos.

El procedimiento debe ser independiente de:

- descripción
- ingredientes
- comentarios personales.

---

24. IMÁGENES

Permitir agregar imágenes a las recetas.

El usuario podrá:

- seleccionar una imagen del dispositivo
- tomar una fotografía cuando sea compatible
- visualizarla
- eliminarla.

No hacer obligatorio agregar imágenes.

Las imágenes deben quedar asociadas a la receta y almacenarse de forma persistente.

---

25. COMENTARIOS PERSONALES

Después de la preparación agregar:

Mis comentarios

Esta sección sirve para registrar experiencias personales del usuario al preparar la receta.

Cada comentario debe contener:

- fecha
- texto.

La fecha debe registrarse automáticamente.

Ejemplos:

05/08/2026

"Preparación en horno eléctrico a 250° durante 1 hora para que quede bien."

26/11/2026

"Cambié la harina por Maicena. Utilicé 1 kilo de harina por 1 kilo de Maicena y quedó crocante."

Permitir:

- agregar
- editar
- eliminar.

La fecha puede editarse manualmente si el usuario necesita registrar una experiencia anterior.

Los comentarios personales deben mantenerse separados del procedimiento original.

---

26. VISUALIZACIÓN DE UNA RECETA

Una receta abierta debe tener una estructura limpia y fácil de leer.

Orden recomendado:

1. Nombre
2. Autor/origen
3. Categoría
4. Subcategoría
5. Palabras clave
6. Imagen
7. Descripción
8. Ingredientes
9. Preparación
10. Mis comentarios
11. Acciones.

Ejemplo conceptual:

Torta de Durazno y Manjar

Autor: Tamara

Categoría: Dulce
Subcategoría: Repostería

[Imagen]

Descripción

Torta húmeda de durazno y manjar, ideal para cumpleaños.

Ingredientes

200 g Harina sin polvo
100 ml Leche
2 un Huevos
1 pizca Sal

Preparación

1. Precalentar el horno.
2. Batir los huevos.
3. Incorporar la harina.
4. Agregar la leche.
5. Hornear.

Mis comentarios

05/08/2026

Preparación en horno eléctrico a 250° durante 1 hora.

---

27. EDITAR RECETA

Cada receta debe tener:

✏️ Editar

Al entrar en edición:

- permitir modificar todos los campos
- modificar ingredientes
- modificar descripción
- modificar procedimiento
- modificar categorías
- modificar palabras clave
- modificar imágenes
- administrar comentarios.

Mostrar:

✅ Guardar cambios

❌ Cancelar

Si se cancela, evitar perder accidentalmente cambios no guardados.

---

28. ELIMINAR RECETA

Agregar opción:

🗑️ Eliminar

Al presionarla mostrar:

"¿Estás seguro de que deseas eliminar esta receta?"

Opciones:

❌ Cancelar

✅ Eliminar

No eliminar inmediatamente sin confirmación.

---

29. COMPARTIR RECETA COMO TEXTO

Agregar:

📋 Compartir receta

La aplicación debe generar automáticamente un texto limpio y ordenado.

Ejemplo:

━━━━━━━━━━━━━━━━
TORTA DE DURAZNO Y MANJAR
━━━━━━━━━━━━━━━━

Autor: Tamara

Categoría: Dulce
Subcategoría: Repostería

DESCRIPCIÓN

Torta húmeda de durazno y manjar, ideal para cumpleaños.

INGREDIENTES

• 200 g Harina sin polvo
• 100 ml Leche
• 2 un Huevos
• 1 pizca Sal

PREPARACIÓN

1. Precalentar el horno.
2. Batir los huevos.
3. Incorporar la harina.
4. Agregar la leche.
5. Hornear.

MIS COMENTARIOS

05/08/2026

Preparación en horno eléctrico a 250° durante 1 hora.

Debe poder:

- copiar al portapapeles
- compartir mediante el sistema del dispositivo.

El usuario debe poder enviarlo principalmente por:

- WhatsApp
- correo
- mensajes
- notas
- redes sociales
- cualquier aplicación que permita pegar texto.

---

30. DOS FORMAS DIFERENTES DE COMPARTIR

Debe existir una diferencia clara entre:

Compartir como texto

Para personas que no necesariamente utilizan Grimorio Dev.

Generar texto legible y copiar/compartir.

Compartir como receta Grimorio Dev

Para enviar una receta estructurada que pueda ser importada directamente por otra instalación de Grimorio Dev.

No confundir ambas funciones.

---

31. FORMATO PROPIO DE RECETAS

Crear un formato liviano y propio para intercambio entre usuarios.

Utilizar como extensión:

.arkrecipe

El archivo debe contener estructuradamente:

- versión del formato
- ID de receta
- nombre
- categoría
- subcategoría
- palabras clave
- descripción
- ingredientes
- cantidades
- unidades
- procedimiento
- imágenes si existen
- comentarios si corresponde
- autor original
- información de origen
- información de compartición.

No incluir:

- contraseñas
- tokens
- credenciales
- información privada innecesaria.

El archivo debe ser lo más pequeño posible.

---

32. EXPORTAR RECETA

Agregar:

📤 Exportar receta

El usuario debe poder generar el archivo ".arkrecipe".

Debe poder compartirlo utilizando las aplicaciones disponibles en el teléfono.

Principalmente:

- WhatsApp
- correo
- archivos
- almacenamiento
- otros medios compatibles.

---

33. IMPORTAR RECETA DE GRIMORIO DEV

Dentro de "Agregar receta" mostrar opciones claras:

➕ Nueva receta

📥 Importar receta Grimorio Dev

📋 Importar desde texto

📷 Escanear receta

Al seleccionar:

📥 Importar receta Grimorio Dev

permitir seleccionar un archivo ".arkrecipe".

La aplicación debe reconocerlo automáticamente.

Mostrar una vista previa.

Ejemplo:

"Se encontró una receta"

Torta de Durazno y Manjar

Autor original: Tamara

¿Deseas agregar esta receta a tu libro?

Opciones:

❌ Cancelar

✅ Agregar receta

No guardar automáticamente sin confirmación.

---

34. ORIGEN Y TRAZABILIDAD

Esto es fundamental.

Una receta debe conservar siempre su autor original.

Ejemplo:

Tamara crea:

Torta de Durazno

Autor: Tamara

Tamara comparte la receta con Pedro.

Pedro importa:

Autor: Tamara

Compartida por: Pedro

Pedro posteriormente comparte la misma receta con Juan.

Juan debe seguir viendo:

Autor: Tamara

y la información correspondiente de que fue compartida.

NO reemplazar el autor original por el último usuario que compartió la receta.

El sistema debe mantener internamente:

- autor original
- usuario que importó
- usuario que compartió
- historial de origen cuando sea necesario.

---

35. COPIAR/DUPLICAR UNA RECETA

Permitir duplicar una receta para que el usuario pueda crear una versión propia.

Al duplicar:

- crear una nueva receta independiente
- no modificar la receta original
- conservar el autor original como referencia
- registrar que fue copiada/importada
- permitir editar libremente la nueva versión.

Esto es especialmente importante para recetas compartidas por otros usuarios.

---

36. IMPORTAR DESDE TEXTO

Dentro de:

➕ Agregar receta

debe existir:

📋 Importar desde texto

Permitir pegar texto obtenido desde:

- páginas web
- blogs
- libros digitales
- PDF
- WhatsApp
- notas
- documentos
- cualquier fuente de texto.

Ejemplo:

Torta de manzana

Ingredientes:

500 gramos de harina
200 gramos de azúcar
2 huevos
1 taza de leche

Preparación:

Mezclar los ingredientes...

Hornear durante 40 minutos.

La aplicación debe analizar el contenido.

---

37. ESTRUCTURACIÓN AUTOMÁTICA DEL TEXTO

Al pegar una receta, intentar detectar automáticamente:

- título
- descripción
- ingredientes
- cantidades
- unidades
- nombres de ingredientes
- procedimiento
- palabras clave.

La aplicación debe reconocer diferentes formas de escribir encabezados.

Por ejemplo:

Ingredientes

Ingredientes:

Para los ingredientes

INGREDIENTES

deben considerarse equivalentes.

Para preparación:

Preparación

Preparación:

Procedimiento

Paso a paso

Elaboración

deben poder reconocerse como la sección correspondiente.

---

38. VALIDACIÓN ANTES DE GUARDAR UNA RECETA IMPORTADA

MUY IMPORTANTE.

Nunca guardar automáticamente una receta analizada desde texto.

Después de analizar:

1. mostrar la receta estructurada
2. mostrar todos los campos detectados
3. permitir editar
4. permitir corregir ingredientes
5. permitir corregir cantidades
6. permitir corregir unidades
7. permitir corregir procedimiento
8. permitir agregar información faltante
9. permitir eliminar errores
10. confirmar.

Mostrar:

Revisa la receta antes de guardarla.

Acciones:

✏️ Editar

❌ Cancelar

✅ Confirmar receta

Solo después de presionar:

✅ Confirmar receta

se debe guardar definitivamente.

---

39. ESCANEAR RECETA

Agregar:

📷 Escanear receta

Debe permitir:

- abrir cámara
- fotografiar una receta
- seleccionar una imagen existente.

Utilizar OCR cuando esté disponible.

Debe funcionar para:

- libros
- hojas
- fotografías
- pantallas
- documentos impresos.

Flujo:

1. seleccionar/tomar imagen
2. reconocer texto
3. analizar estructura
4. detectar receta
5. mostrar vista previa
6. permitir correcciones
7. validar
8. guardar.

Nunca guardar automáticamente una receta obtenida mediante OCR.

---

40. DETECCIÓN DE RECETAS

La aplicación debe asumir una estructura habitual:

TÍTULO

DESCRIPCIÓN

INGREDIENTES

PREPARACIÓN

COMENTARIOS

Pero debe ser flexible.

Debe poder interpretar pequeñas diferencias de estructura y redacción.

La aplicación debe normalizar diferentes formatos de recetas hacia el formato interno de Grimorio Dev.

---

41. FUNCIONAMIENTO CON POCA CONEXIÓN

La aplicación debe requerir la menor conexión posible.

Cuando el usuario ya haya iniciado sesión y tenga recetas sincronizadas:

- permitir consultar recetas almacenadas localmente cuando sea posible
- permitir buscar recetas disponibles localmente
- permitir realizar cambios localmente
- sincronizar los cambios cuando vuelva Internet.

La nube debe utilizarse principalmente para:

- autenticación
- respaldo
- sincronización
- almacenamiento de recetas
- almacenamiento de imágenes
- recuperación en nuevos dispositivos.

No depender permanentemente de Internet para leer una receta que ya está disponible localmente.

---

42. SINCRONIZACIÓN

Cada usuario debe tener un ID único.

Cada receta debe tener un ID único.

No utilizar:

- nombre de receta
- correo
- nombre de usuario

como identificadores primarios.

La sincronización debe contemplar:

- recetas
- ingredientes
- comentarios
- imágenes
- categorías
- configuración.

Evitar pérdida de datos.

Si existe una modificación local pendiente de sincronización, debe sincronizarse cuando vuelva la conexión.

---

43. MODELO DE DATOS

Diseñar una arquitectura escalable.

Como mínimo considerar entidades equivalentes a:

USER

USER_SETTINGS

RECIPE

INGREDIENT

CATEGORY

SUBCATEGORY

RECIPE_KEYWORD

RECIPE_IMAGE

RECIPE_COMMENT

RECIPE_ORIGIN

RECIPE_SHARE

El modelo debe separar correctamente los datos.

No almacenar toda una receta únicamente como un bloque de texto.

Los ingredientes deben ser datos estructurados.

Ejemplo:

quantity: 200

unit: g

name: Harina sin polvo

Esto permitirá futuras funcionalidades.

---

44. RELACIÓN ENTRE USUARIOS Y RECETAS

Una receta debe estar relacionada con su propietario mediante ID.

Debe diferenciar:

- propietario actual
- autor original
- usuario que importó
- usuario que compartió.

Una receta importada no debe convertirse automáticamente en propiedad del autor original.

Cuando Pedro importa una receta de Tamara:

Pedro puede tener una copia de la receta en su propio libro.

La receta original de Tamara nunca debe modificarse.

---

45. SEGURIDAD

Implementar:

- autenticación segura
- contraseñas protegidas
- autorización por usuario
- acceso restringido a información privada
- almacenamiento seguro.

Un usuario no debe poder modificar o eliminar directamente las recetas privadas de otro usuario.

Los archivos ".arkrecipe" no deben contener información sensible.

---

46. DISEÑO RESPONSIVE

Aunque la prioridad es Mobile First, debe funcionar correctamente en:

- teléfonos
- tablets
- computadores.

En móvil:

- formularios verticales
- botones grandes
- navegación simple
- lectura cómoda.

En pantallas grandes:

- aprovechar el espacio
- mantener una anchura cómoda de lectura
- evitar líneas de texto excesivamente largas.

---

47. NAVEGACIÓN PRINCIPAL

Mantener una navegación simple.

Estructura conceptual:

INICIO

→ Buscar

→ Nueva receta

→ Importar receta

→ Escanear receta

→ Abrir receta

→ Editar receta

→ Compartir

→ Perfil

No convertir todas estas opciones en botones gigantes al mismo tiempo.

Las funciones menos frecuentes pueden estar dentro de "Agregar receta" o un menú secundario.

---

48. ACCIONES DE UNA RECETA

Una receta abierta debe permitir fácilmente:

✏️ Editar

📋 Copiar texto

📤 Compartir

📥 Exportar

🗑️ Eliminar

No saturar visualmente la página.

Las acciones pueden organizarse mediante botones principales y un menú de acciones secundarias.

---

49. EXPERIENCIA DE USUARIO

La aplicación debe sentirse como un cuaderno digital.

La persona debe poder:

abrir → buscar → encontrar → leer.

Crear una receta debe requerir pocos pasos.

Agregar un ingrediente debe ser rápido.

Editar un ingrediente debe ser intuitivo.

Compartir debe ser inmediato.

Importar una receta debe requerir solamente:

seleccionar → revisar → aceptar.

No crear procesos innecesariamente largos.

---

50. EVITAR SOBRECARGAR LA INTERFAZ

No utilizar:

- demasiadas animaciones
- demasiados colores simultáneamente
- botones innecesarios
- menús complicados
- formularios gigantes
- elementos decorativos que dificulten la lectura.

Las recetas son el contenido principal.

La interfaz debe estar al servicio de las recetas.

---

51. ARQUITECTURA TÉCNICA

No crear solamente una maqueta visual.

La aplicación debe tener una arquitectura funcional y preparada para producción.

Implementar correctamente:

- autenticación
- base de datos
- almacenamiento
- relaciones
- persistencia
- sincronización
- manejo de usuarios
- manejo de recetas
- almacenamiento de imágenes.

Si se utiliza Supabase, Firebase u otra solución compatible con el stack de Lovable, utilizarla correctamente como backend real.

No depender de datos ficticios o únicamente de localStorage para la información principal.

---

52. MANEJO DE ERRORES

La aplicación debe mostrar mensajes claros cuando:

- falle el inicio de sesión
- exista un correo ya registrado
- falle una sincronización
- no exista conexión
- una receta no pueda importarse
- un archivo no sea válido
- el OCR no pueda reconocer correctamente el contenido
- falten datos obligatorios.

Los mensajes deben ser comprensibles para un usuario común.

No mostrar errores técnicos innecesarios.

---

53. RECUPERACIÓN Y SINCRONIZACIÓN

Si el usuario inicia sesión desde un nuevo dispositivo:

- recuperar automáticamente sus recetas
- recuperar configuración
- recuperar imágenes
- recuperar comentarios.

La aplicación debe indicar visualmente cuando los datos estén sincronizados si esto es necesario.

Si está temporalmente sin conexión:

mostrar un estado discreto como:

"Sin conexión — cambios guardados localmente"

y posteriormente:

"Sincronizado"

---

54. DATOS OBLIGATORIOS Y OPCIONALES

Para crear una receta deben ser obligatorios como mínimo:

- nombre.

Categoría, subcategoría, palabras clave, descripción, imágenes, ingredientes, preparación y comentarios pueden manejarse según corresponda.

No obligar al usuario a completar campos que no sean necesarios.

Por ejemplo, una persona puede guardar inicialmente una receta solamente con:

Nombre

Ingredientes

y completar la preparación posteriormente.

---

55. RECETAS INCOMPLETAS

Permitir guardar una receta como borrador si el usuario todavía no la ha terminado.

Ejemplo:

Estado:

Borrador

Después podrá editarla y completarla.

Esto es especialmente útil cuando una persona está anotando una receta mientras cocina.

---

56. ORDEN DEL ÍNDICE

Permitir inicialmente ordenar por:

- más reciente
- nombre
- categoría.

Mantener la interfaz simple.

Dejar preparada la arquitectura para futuros filtros.

---

57. BÚSQUEDA

La búsqueda debe ser una de las funciones principales de la aplicación.

Ejemplos:

Buscar:

"torta"

debe encontrar:

"Torta de Durazno"

Buscar:

"durazno"

también debe encontrarla.

Buscar:

"manjar"

también debe encontrarla si está en las palabras clave o contenido indexado.

Buscar:

"postre"

debe encontrar recetas asociadas a esa categoría o palabra clave.

---

58. COMPATIBILIDAD INTERNACIONAL

Aunque la aplicación pueda utilizarse inicialmente en Chile, diseñar las unidades y estructura para usuarios internacionales.

No limitar las unidades únicamente al sistema chileno.

Utilizar abreviaciones internacionales.

Preparar la arquitectura para futuras traducciones.

No asumir que todos los usuarios utilizarán:

- gramos
- kilos
- mililitros
- grados Celsius.

La estructura debe permitir posteriormente agregar:

- Fahrenheit
- libras
- onzas
- tazas
- otras unidades.

---

59. POSIBLES FUNCIONES FUTURAS

Dejar la arquitectura preparada para futuras funcionalidades como:

- conversión de unidades
- escalado de recetas
- cambiar cantidad de porciones
- favoritos
- etiquetas
- filtros avanzados
- exportar PDF
- respaldo manual
- impresión
- traducción
- múltiples idiomas
- múltiples libros de recetas.

NO implementar estas funcionalidades todavía si complican el MVP.

Solo preparar la arquitectura para que puedan agregarse posteriormente.

---

60. FASES DE DESARROLLO

Implementar el proyecto progresivamente.

FASE 1 — NÚCLEO

Implementar primero:

- registro
- inicio de sesión
- perfil
- configuración
- nombre del libro
- paletas
- base de datos
- crear receta
- editar receta
- eliminar receta
- índice
- búsqueda
- categorías
- subcategorías
- palabras clave
- ingredientes
- unidades
- descripción
- preparación
- imágenes.

FASE 2 — EXPERIENCIA

Después implementar:

- comentarios personales
- fechas
- borradores
- compartir como texto
- copiar al portapapeles
- confirmaciones
- mejoras visuales
- edición avanzada.

FASE 3 — INTERCAMBIO

Implementar:

- ".arkrecipe"
- exportación
- importación
- autor original
- compartida por
- duplicación
- trazabilidad.

FASE 4 — IMPORTACIÓN INTELIGENTE

Implementar:

- pegar texto
- análisis
- detección de título
- detección de ingredientes
- detección de cantidades
- detección de unidades
- detección de preparación
- palabras clave
- vista previa
- corrección
- validación.

FASE 5 — OCR

Implementar:

- cámara
- selección de imagen
- OCR
- estructuración
- revisión
- corrección
- validación.

FASE 6 — OFFLINE Y SINCRONIZACIÓN AVANZADA

Implementar:

- caché local
- lectura offline
- cambios offline
- sincronización posterior
- recuperación desde otros dispositivos
- manejo de conflictos.

---

61. REGLA FUNDAMENTAL

No sacrificar simplicidad por agregar funcionalidades.

La aplicación debe sentirse primero como:

un cuaderno de recetas

y solamente después como:

una aplicación tecnológica.

Toda nueva funcionalidad debe responder:

«"¿Esto hace más fácil guardar, encontrar, leer, preparar o compartir una receta?"»

Si no mejora alguna de esas acciones, no debe incorporarse al flujo principal.

---

62. RESULTADO ESPERADO

El resultado debe ser una aplicación real y funcional llamada:

GRIMORIO DEV

Debe permitir que una persona tenga su propio libro digital de recetas, pueda personalizarlo, guardar recetas propias, importar recetas, compartirlas, recuperar toda su información al cambiar de dispositivo y mantener el origen de las recetas compartidas.

Debe ser sencilla para una persona que solamente quiere anotar una receta, pero suficientemente estructurada para permitir posteriormente funciones avanzadas.

La experiencia principal debe mantenerse:

ABRIR → BUSCAR → ENCONTRAR → LEER → COCINAR

y:

CREAR → GUARDAR → ORGANIZAR → COMPARTIR

La aplicación debe estar desarrollada por:

ArkanDev

y el nombre visible del producto debe ser:

Grimorio Dev

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/19c1924c-8589-465d-bdef-12f609ac40aa).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
