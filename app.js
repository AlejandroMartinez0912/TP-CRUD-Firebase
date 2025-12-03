// ---------------- IMPORTS ----------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import { 
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// ---------------- CONFIG FIREBASE ----------------
const firebaseConfig = {
  apiKey: "AIzaSyD1tue1SGd6QapSSEVc9X5sNdTZEz5prLY",
  authDomain: "crud-firebase-pylp2025.firebaseapp.com",
  projectId: "crud-firebase-pylp2025",
  storageBucket: "crud-firebase-pylp2025.firebasestorage.app",
  messagingSenderId: "707303615982",
  appId: "1:707303615982:web:1a55c3761ac947b2cff2ff",
  measurementId: "G-JCMF4ZVZCM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();


// referencias del DOM
const loginDiv = document.getElementById("login");
const appDiv = document.getElementById("app");


// ---------------- LOGIN ----------------
document.getElementById("btnLogin").onclick = () => {
  const emailValue = document.getElementById("email").value;
  const passwordValue = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, emailValue, passwordValue)
    .catch(err => alert(err.message));
};
// ---------------- REGISTRO ----------------
document.getElementById("btnRegistro").onclick = () => {
  const emailValue = document.getElementById("email").value;
  const passwordValue = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, emailValue, passwordValue)
    .catch(err => alert(err.message));
};

// ---------------- LOGOUT ----------------
document.getElementById("btnLogout").onclick = () => signOut(auth);


// ---------------- DETECTAR USUARIO ----------------
onAuthStateChanged(auth, user => {
  if (user) {
    loginDiv.style.display = "none";
    appDiv.style.display = "block";
    cargarTareas();
  } else {
    loginDiv.style.display = "block";
    appDiv.style.display = "none";
  }
});


// ---------------- CRUD FIRESTORE ----------------
async function cargarTareas() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "tareas"));
  
  querySnapshot.forEach(docu => {
    const tarea = docu.data();

    const li = document.createElement("li");
    li.innerHTML = `
      <b>${tarea.titulo}</b> - ${tarea.descripcion}
      <button onclick="eliminar('${docu.id}')">Eliminar</button>
      <button onclick="editar('${docu.id}', '${tarea.titulo}', '${tarea.descripcion}')">Editar</button>
    `;
    lista.appendChild(li);
  });
}

document.getElementById("btnAgregar").onclick = async () => {
  await addDoc(collection(db, "tareas"), {
    titulo: titulo.value,
    descripcion: descripcion.value
  });
  cargarTareas();
};

window.eliminar = async (id) => {
  await deleteDoc(doc(db, "tareas", id));
  cargarTareas();
};

window.editar = async (id, tituloAnt, descAnt) => {
  const nuevoTitulo = prompt("Nuevo título:", tituloAnt);
  const nuevaDesc = prompt("Nueva descripción:", descAnt);

  await updateDoc(doc(db, "tareas", id), {
    titulo: nuevoTitulo,
    descripcion: nuevaDesc
  });

  cargarTareas();
};
