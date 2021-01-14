//aqui estamos guardando en cache las paginas para que puedan seguir sirviendo de alguna manera sin conexion a internet, por eso con / cacheamos la pagina principalj
const nombreCache = "apv-v7";
const archivos = [
  "/",
  "./index.html",
  "./error.html",
  "./js/app.js",
  "./js/apv.js",
  "./css/bootstrap.css",
  "./css/styles.css",
];
//Cuando se instala el service Worker lo que quiere decir que solo se ejecuta una vez porque se instala y ya si recargamos la pagina ya no obtenemos estas salidas
self.addEventListener("install", (e) => {
  console.log("Instalando el Service Worker");

  //console.log(e);

  //Aqui en el install esperamos hasta que se descarguen todos los archivos que queremos guardar en el cache para poder usarlos despues sin conexion entonces poner esto en el install es el mejor lugar
  e.waitUntil(
    caches.open(nombreCache).then((cache) => {
      console.log("cacheando");
      cache.addAll(archivos);
    })
  );
});

self.addEventListener("activate", (e) => {
  console.log("Service Worker Activado");

  //console.log(e);
  e.waitUntil(
    caches.keys().then((keys) => {
      //console.log(keys);
      return Promise.all(
        //borramos las otras versiones del cache y solo traemos la que coincide con la actual
        keys
          .filter((key) => key !== nombreCache)
          .map((key) => caches.delete(key))
      );
    })
  );
});

//Evento fetch para descargar archivos estaticos
self.addEventListener("fetch", (e) => {
  console.log("Fetch ...", e);

  e.respondWith(
    caches
      .match(e.request)
      .then((respuestaCache) => {
        return respuestaCache || fetch(e.request);
      })
      .catch(() => caches.match("./error.html"))
  );
});
