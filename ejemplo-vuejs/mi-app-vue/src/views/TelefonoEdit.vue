<template>
  <div class="telefono-edit-container">
    <h2>Editar Número Telefónico</h2>
    <p v-if="loading">Cargando datos del teléfono...</p>
    <p v-if="error" class="error-message">{{ error }}</p>

    <form v-if="telefono" @submit.prevent="actualizarTelefono">
      <div class="form-group">
        <label for="telefono">Número Telefónico:</label>
        <input type="text" id="telefono" v-model="telefono.telefono" required />
      </div>
      <div class="form-group">
        <label for="tipo">Tipo:</label>
        <select id="tipo" v-model="telefono.tipo" required>
          <option value="">Seleccionar tipo</option>
          <option value="celular">Celular</option>
          <option value="casa">Casa</option>
          <option value="trabajo">Trabajo</option>
          <option value="otro">Otro</option>
        </select>
      </div>
      <div class="form-actions">
        <button type="submit" :disabled="saving">
          {{ saving ? "Guardando..." : "Actualizar" }}
        </button>
        <button type="button" @click="volver" class="cancel-button">
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "TelefonoEdit",
  props: ["telefonoUrl"],
  data() {
    return {
      telefono: null,
      loading: true,
      saving: false,
      error: null,
    };
  },
  async created() {
    const decodedUrl = decodeURIComponent(this.telefonoUrl);
    await this.fetchTelefono(decodedUrl);
  },
  methods: {
    async fetchTelefono(url) {
      try {
        this.loading = true;
        this.error = null;
        const response = await api.get(url);
        this.telefono = response.data;
      } catch (err) {
        console.error("Error al cargar teléfono:", err.response || err);
        this.error = "No se pudo cargar los datos del teléfono.";
      } finally {
        this.loading = false;
      }
    },
    async actualizarTelefono() {
      try {
        this.saving = true;
        this.error = null;
        const decodedUrl = decodeURIComponent(this.telefonoUrl);
        await api.put(decodedUrl, this.telefono);
        alert("Número telefónico actualizado exitosamente");
        this.volver();
      } catch (err) {
        console.error("Error al actualizar teléfono:", err.response || err);
        this.error = "Error al actualizar el número telefónico.";
      } finally {
        this.saving = false;
      }
    },
    volver() {
      if (this.telefono && this.telefono.estudiante) {
        this.$router.push({
          name: "EstudianteDetail",
          params: {
            estudianteUrl: encodeURIComponent(this.telefono.estudiante),
          },
        });
      } else {
        this.$router.push({ name: "EstudiantesList" });
      }
    },
  },
};
</script>

<style scoped>
.telefono-edit-container {
  max-width: 500px;
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
select {
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
  border: none;
  border-radius: 4px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button[type="submit"] {
  background-color: #007bff;
  color: white;
}

button[type="submit"]:hover:not(:disabled) {
  background-color: #0056b3;
}

button[type="submit"]:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.cancel-button {
  background-color: #6c757d;
  color: white;
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
