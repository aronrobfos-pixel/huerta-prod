// Datos y funciones compartidas entre index.html y calendario.html

const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// riego = cada cuántos días se riega, cosecha = días desde la siembra hasta cosechar
const ESPECIES = {
  "Lechuga":       { icono: "🥬", riego: 2, cosecha: 28 },
  "Tomate cherry": { icono: "🍅", riego: 3, cosecha: 70 },
  "Albahaca":      { icono: "🌿", riego: 2, cosecha: 21 },
  "Rabanito":      { icono: "🌱", riego: 1, cosecha: 25 }
};

// Fechas como texto "AAAA-MM-DD"
function clave(a, m, d) {
  return a + "-" + String(m + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");
}
function claveDeFecha(f) {
  return clave(f.getFullYear(), f.getMonth(), f.getDate());
}
function diasEntre(k1, k2) {
  const a = k1.split("-").map(Number);
  const b = k2.split("-").map(Number);
  return Math.round((Date.UTC(b[0], b[1] - 1, b[2]) - Date.UTC(a[0], a[1] - 1, a[2])) / 86400000);
}
function sumarDias(k, dias) {
  const p = k.split("-").map(Number);
  return claveDeFecha(new Date(p[0], p[1] - 1, p[2] + dias));
}
function formatearFecha(k) {
  const p = k.split("-").map(Number);
  return p[2] + " de " + nombresMeses[p[1] - 1];
}

// Siembras registradas (lo que ya está plantado), guardadas en el navegador
function cargarSiembras() {
  try {
    const lista = JSON.parse(localStorage.getItem("huertaSiembras"));
    return Array.isArray(lista) ? lista.filter(function (s) { return ESPECIES[s.especie] && s.fecha; }) : [];
  } catch (e) {
    return [];
  }
}
function guardarSiembras(lista) {
  try {
    localStorage.setItem("huertaSiembras", JSON.stringify(lista));
  } catch (e) {}
}

// Qué pasa con una siembra en un día: "siembra", "riego", "cosecha" o null
function estadoDia(siembra, k) {
  const e = ESPECIES[siembra.especie];
  const d = diasEntre(siembra.fecha, k);
  if (d === 0) return "siembra";
  if (d === e.cosecha) return "cosecha";
  if (d > 0 && d < e.cosecha && d % e.riego === 0) return "riego";
  return null;
}

// Tareas automáticas de un día, según lo plantado
function eventosDelDia(k, siembras) {
  const lista = [];
  siembras.forEach(function (s) {
    const estado = estadoDia(s, k);
    const e = ESPECIES[s.especie];
    if (estado === "siembra") lista.push({ icono: "🌱", texto: "Siembra de " + s.especie });
    if (estado === "riego") lista.push({ icono: "💧", texto: "Regar " + s.especie });
    if (estado === "cosecha") lista.push({ icono: "🧺", texto: "Cosechar " + s.especie + " " + e.icono });
  });
  return lista;
}
