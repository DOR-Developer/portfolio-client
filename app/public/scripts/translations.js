export default {
	es: {
		nav: {
			home: "Inicio",
			components: "Componentes",
			gallery: "Galería",
			table: "Tabla",
			kanban: "Kanban",
			about: "Sobre mí",
			cv: "CV",
		},
		"html-title": "Portfolio | dordev",
		title: "Bienvenid@ a mi portfolio.",
		cv: {
			full: "Diseño",
			simple: "Simplificado",
			preview: `No se ha podido previsualizar el CV. 
Descárgelo para ver el contenido.`,
			download: "Descargar CV",
		},
		about: `Soy Daniel Otero Rivera, desarrollador de software.
Online quizás me encuentres por el seudónimo "dordev".

He estado aprendiendo programación desde 2019. Anteriormente estudié ilustración y diseño gráfico.

Me adentré en este viaje con tecnologías web a través de un pequeño curso de Desarrollo Web en España, utilizando principalmente JavaScript Vanilla y PHP.

A finales de 2021, comenzé mis estudios oficiales en Desarollo de Aplicaciones Multiplataforma.
Es aquí donde aprendí acerca de las bases de datos relacionales en más profundidad y me adentré en lenguajes fuertemente tipados con Java.
Apredí diferentes entornos Linux y me familiaricé con la terminal del sistema y sus operaciones más importantes.

Desde que acabé mi formación, he estado trabajando a tiempo completo en una pequeña empresa de software SaaS cerca de mi cuidad natal.

Algunas de mis tareas diarias incluyen:

- Recoger necesidades de los clientes y evaluar los pasos necesarios a seguir para imlementar cualquier nueva funcionalidad con éxito.
- Desarrollar componentes personalizados con JavaScript y jQuery, desde cero y extendiendo otras librerías.
- Implementar soluciones frontend trabajando de forma muy cercana con los desarrolladores backend.
- Trabajar con software de control de versiones ( GitLab ) y asegurar la integridad de los archivos desplegados.
- Documentar y comentar el código, además de realizar y mantener actualizado un manual de usuario.
- Atención al cliente a través de un servicio de correos en tiempo real.`,
		credits: {
			images: "Imágenes de Lorem Picsum.",
			icons: "Iconos de Google Fonts.",
            contact: "Contacta conmigo: ", 
		},
		components: {
			info: `A continuación se muestra una previsualización de mis componentes personales, creados con JavaScript y jQuery desde cero.

Actualmente, no están vinculados a ninguna base de datos- La fuente de datos se genera desde la propia demo en JavaScript. Esto es algo que quiero implementar en el futuro.

Al hacer clic sobre la imagen de previsualización, podrás acceder a una demo del componente donde comprobar las funcionalidades disponibles.

* Algunos de los componentes pueden no estar totalmente finalizados y algunos de los botones sean únicamente plantillas para mostrar el diseño. Algunas de las funcionalidades pueden estar incompletas.`,
			/* GALERÍA */
			gallery: `Mi enfoque a la hora de crear este componente fue centrarme en proporcionar una experiencia de usuario sencilla pero altamente personalizable.

En la parte superior del contenedor se puede encontrar un menú que permite al usuario realizar distintas acciones; añadir elementos a la galería, cambiar la cantidad de elementos por línea...

La parte más importante del componente son los elementos de la galería.
Cada elemento fuciona como un componente en sí mismo con las siguientes funcionalidades:

- Haciendo clic en la imagen, se mostrará una versión con su resolución nativa.
- El panel inferior permite editar y eliminar los elementos de la galería.`,
			/* TABLE */
			table: `Este es el primer componente que desarrollé después de aprender jQuery y, actualmente, es el que más funcionalidades tiene. 

He trabajado con componentes de jQWidgets como jqxGrid desde hace un tiempo y siempre me han presentado algún problema como desarrollador a la hora de implementarlos. Este componente pretende incluír todo lo mejor de jqxGrid, reinventando los apartados de usabilidad y personalización.
Cabe resaltar que, aunque está inspirado por jqxGrid, el componente no ha sido construído sobre esa librería, sino partiendo de cero.

Las funcionalidades actuales incluyen ordenación, filtrado, creación, edición y eliminación de datos. 
Además de paginación, minimizado de columnas y exportación a formato .xlsx. 

Todos los botones son funcionales, así que no dudes en acceder a la demo y probar!`,
			/* KANBAN */
			kanban: `La ultima adición a mi libería personal.

Una vez estaba satisfecho con el estaod de las otras librerías, me llevo algún tiempo decidir que concepto implementar a continuación.
Finalmente, decidí desarrollar un kanban personal para poner a prueba mis habilidades.

Todavía le faltan horas para estar finalizado. Desde el lado del usaurio lo único que se puede hacer es mover las tarjetas de una columna a otra, pero de todas formas estoy muy orgulloso de como está quedando.
Mi idea es ir desarrollándolo poco a poco en mi tiempo libre!`,
		},
	},
	en: {
		nav: {
			home: "Home",
			components: "Components",
			gallery: "Gallery",
			table: "Table",
			kanban: "Kanban",
			about: "About me",
			cv: "CV",
		},
		"html-title": "Portfolio | dordev",
		title: "Welcome to my portfolio.",
		cv: {
			full: "Design",
			simple: "Simplified",
			preview: `Couldn't load preview. 
Download CV to view its contents.`,
			download: "Download CV",
		},
		about: `I'm Daniel Otero Rivera, a software developer.
Online you may find me by the pseudonym "dordev".

I've been learning programming since 2019. Previously, I studied arts and graphic design.

I started this journey with web technologies through a brief Web Development course here in Spain, using primarilly Vanilla JavaScript and PHP.
I've put a lot of time and effort getting into CSS to provide the best web experiences I can, using my artistic background as a strong foundation for my web layouts and themes.

At the end of 2021, I started my official Multimedia App Development studies.
There, I learned more deeply about relational databases and I got into heavily typed languages using Java.
I learned different Linux environments and got familiar with the system terminal and the most important operations.

Since I finished my studies, I've been working fulltime at a small SaaS software company near my local town.

Some of my daily tasks involve:

- Collecting feedback from clients and evaluating the steps needed to implement successfully any new functionality.
- Developing custom components with JavaScript and jQuery, from scratch or extending existing libraries.
- Implementing frontend solutions working closely with backend developers.
- Working with version control software ( GitLab ) and ensuring deployed files are production ready.
- Documenting and commenting code, as well as creating and maintaining an user manual.
- Giving custommer support through a live email service.`,
		credits: {
			images: "Images by Lorem Picsum.",
			icons: "Icons by Google Fonts.",
            contact: "Contact me at ", 
		},
		components: {
			info: `Next is a list with previews of some of my custom components, created with JavaScript and jQuery from scratch.

They aren't currently linked to any database and the sample data is generated in JavaScript for demo purposes, which I plan to change in the future.

By clicking the preview image, it will take you to a live demo of the component where you can check for yourself the available functionalities.

* Some components may not be fully finished yet and some buttons might be shown just for a mockup purpose. Some functionalities might still be a work in progress.`,
			/* GALLERY */
			gallery: `My approach towards a gallery component was to provide a simple yet highly customizable user experience.

The control panel at the top of the component allows the user to perform different operations on the gallery itself, such as adding elements and specifying its layout.

The most important part of the component are the gallery elements.
Each element works as an individual component itself with the listed functionalities:

- The image can be clicked to preview a version with the native resolution.
- The bottom panel on each element allows the user to edit and delete the item.`,
			/* TABLE */
			table: `This was the first component I got into after learning jQuery and it's currently the one with the most functionalities imlpemented.

I've worked with jqxGrid from jQWidgets for a while and I've always had some issues with the workflow that I didn't like. This component aims to take the best from jqxGrid and take it to the next level in usability and customization. 
Keep in mind that, although it's inspired by jqxGrid, the component wasn't built on top of it, but from scratch.

The current functionalities include sorting, filtering, adding, editing and deleting.
As well as pagination, column toggling and exporting to .xlsx format.

Every button can be interacted with, so please go have a look!`,
			/* KANBAN */
			kanban: `The latest addition to my personal components library.

After I was happy with the state of the other components, it took me a while to decide which concept to take uppon next.
Finally, I decided to develop a custom kanban to challenge my skills.

It's still far from finished. From an user perspective all that you can do is move the cards around, but I'm still very proud of how it's shaping up. 
I plan on developing it further on my free time! `,
		},
	},
};
