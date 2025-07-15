<template>
  <div class="estudiante-edit-container">
    <h2>Editar Estudiante</h2>
    <p v-if="loading">Cargando datos del estudiante...</p>
    <p v-if="error" class="error-message">{{ error }}</p>

    <form v-if="estudiante" @submit.prevent="actualizarEstudiante">
      <div class="form-group">
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" v-model="estudiante.nombre" required />
      </div>
      <div class="form-group">
        <label for="apellido">Apellido:</label>
        <input
          type="text"
          id="apellido"
          v-model="estudiante.apellido"
          required
        />
      </div>
      <div class="form-group">
        <label for="cedula">Cédula:</label>
        <input type="text" id="cedula" v-model="estudiante.cedula" required />
      </div>
      <div class="form-group">
        <label for="correo">Correo:</label>
        <input type="email" id="correo" v-model="estudiante.correo" required />
      </div>
      <div class="form-actions">
        <button type="submit" :disabled="saving">
          {{ saving ? "Guardando..." : "Actualizar" }}
        </button>
        <router-link :to="{ name: 'EstudiantesList' }" class="cancel-button">
          Cancelar
        </router-link>
      </div>
    </form>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "EstudianteEdit",
  props: ["estudianteUrl"],
  data() {
    return {
      estudiante: null,
      loading: true,
      saving: false,
      error: null,
    };
  },
  async created() {
    const decodedUrl = decodeURIComponent(this.estudianteUrl);
    await this.fetchEstudiante(decodedUrl);
  },
  methods: {
    async fetchEstudiante(url) {
      try {
        this.loading = true;
        this.error = null;
        const response = await api.get(url);
        this.estudiante = response.data;
      } catch (err) {
        console.error("Error al cargar estudiante:", err.response || err);
        this.error = "No se pudo cargar los datos del estudiante.";
      } finally {
        this.loading = false;
      }
    },
    async actualizarEstudiante() {
      try {
        this.saving = true;
        this.error = null;
        const decodedUrl = decodeURIComponent(this.estudianteUrl);
        await api.put(decodedUrl, this.estudiante);
        alert("Estudiante actualizado exitosamente");
        this.$router.push({ name: "EstudiantesList" });
      } catch (err) {
        console.error("Error al actualizar estudiante:", err.response || err);
        this.error = "Error al actualizar el estudiante. Verifica los datos.";
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

<style scoped>
.estudiante-edit-container {
  max-width: 600px;
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

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

input[type="text"],
input[type="email"] {
  width: calc(100% - 20px);
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.cancel-button {
  padding: 10px 20px;
  background-color: #6c757d;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

.cancel-button:hover {
  background-color: #5a6268;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
  font-size: 0.9em;
}
</style>
