<template>
  <div class="estudiantes-list-container">
    <h2>Listado de Estudiantes</h2>
    <p v-if="loading">Cargando estudiantes...</p>
    <p v-if="error" class="error-message">{{ error }}</p>
    <div v-else-if="estudiantes.length" class="estudiantes-grid">
      <div
        v-for="estudiante in estudiantes"
        :key="estudiante.url"
        class="estudiante-card"
      >
        <div class="estudiante-info">
          <router-link
            :to="{
              name: 'EstudianteDetail',
              params: { estudianteUrl: estudiante.url },
            }"
            class="estudiante-link"
          >
            {{ estudiante.nombre }} {{ estudiante.apellido }}
          </router-link>
          <p class="cedula">Cédula: {{ estudiante.cedula }}</p>
        </div>
        <div class="estudiante-actions">
          <router-link
            :to="{
              name: 'EstudianteEdit',
              params: { estudianteUrl: estudiante.url },
            }"
            class="edit-button"
          >
            Editar
          </router-link>
          <button
            @click="eliminarEstudiante(estudiante.url)"
            class="delete-button"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
    <p v-else>No hay estudiantes registrados.</p>
    <router-link to="/estudiantes/nuevo" class="add-button"
      >Agregar Nuevo Estudiante</router-link
    >
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "EstudiantesList",
  data() {
    return {
      estudiantes: [],
      loading: true,
      error: null,
    };
  },
  async created() {
    await this.fetchEstudiantes();
  },
  methods: {
    async fetchEstudiantes() {
      try {
        this.loading = true;
        this.error = null;
        const response = await api.get("estudiantes/");
        this.estudiantes = response.data.results || response.data;
        console.log("Estudiantes cargados:", this.estudiantes);
      } catch (err) {
        console.error("Error al cargar estudiantes:", err.response || err);
        this.error =
          "No se pudieron cargar los estudiantes. Asegúrate de estar logueado.";
      } finally {
        this.loading = false;
      }
    },
    async eliminarEstudiante(url) {
      if (confirm("¿Estás seguro de que quieres eliminar este estudiante?")) {
        try {
          await api.delete(url);
          this.estudiantes = this.estudiantes.filter((est) => est.url !== url);
          alert("Estudiante eliminado exitosamente");
        } catch (err) {
          console.error("Error al eliminar estudiante:", err.response || err);
          alert("Error al eliminar el estudiante");
        }
      }
    },
  },
};
</script>

<style scoped>
.estudiantes-list-container {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

ul {
  list-style: none;
  padding: 0;
}

.estudiante-item {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.estudiante-item:last-child {
  border-bottom: none;
}

.estudiante-item a {
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
}

.estudiante-item a:hover {
  text-decoration: underline;
}

.add-button {
  display: block;
  width: fit-content;
  margin: 20px auto 0;
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  text-align: center;
  transition: background-color 0.3s ease;
}

.add-button:hover {
  background-color: #218838;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
}

.estudiantes-grid {
  display: grid;
  gap: 15px;
  margin-bottom: 20px;
}

.estudiante-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.estudiante-info {
  flex: 1;
}

.estudiante-link {
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
  font-size: 1.1em;
}

.estudiante-link:hover {
  text-decoration: underline;
}

.cedula {
  margin: 5px 0 0 0;
  color: #666;
  font-size: 0.9em;
}

.estudiante-actions {
  display: flex;
  gap: 10px;
}

.edit-button {
  padding: 5px 15px;
  background-color: #ffc107;
  color: #212529;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9em;
  transition: background-color 0.3s ease;
}

.edit-button:hover {
  background-color: #e0a800;
}

.delete-button {
  padding: 5px 15px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.3s ease;
}

.delete-button:hover {
  background-color: #c82333;
}
</style>
