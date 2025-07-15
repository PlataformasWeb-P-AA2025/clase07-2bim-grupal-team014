import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Login from "../views/Login.vue";
import EstudiantesList from "../views/EstudiantesList.vue";
import EstudianteDetail from "../views/EstudianteDetail.vue";
import EstudianteEdit from "../views/EstudianteEdit.vue";
import EstudianteAdd from "../views/EstudianteAdd.vue";
import TelefonoAdd from "../views/TelefonoAdd.vue";
import TelefonoEdit from "../views/TelefonoEdit.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/AboutView.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/estudiantes",
    name: "EstudiantesList",
    component: EstudiantesList,
    meta: { requiresAuth: true },
  },
  {
    path: "/estudiantes/detalle/:estudianteUrl",
    name: "EstudianteDetail",
    component: EstudianteDetail,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/estudiantes/editar/:estudianteUrl",
    name: "EstudianteEdit",
    component: EstudianteEdit,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/estudiantes/nuevo",
    name: "EstudianteAdd",
    component: EstudianteAdd,
    meta: { requiresAuth: true },
  },
  {
    path: "/estudiantes/:estudianteUrl/telefono/nuevo",
    name: "TelefonoAdd",
    component: TelefonoAdd,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/telefono/editar/:telefonoUrl",
    name: "TelefonoEdit",
    component: TelefonoEdit,
    props: true,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Guard de navegación para rutas que requieren autenticación
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem("authToken")) {
    next("/login"); // Redirige al login si no está autenticado
  } else {
    next();
  }
});

export default router;
