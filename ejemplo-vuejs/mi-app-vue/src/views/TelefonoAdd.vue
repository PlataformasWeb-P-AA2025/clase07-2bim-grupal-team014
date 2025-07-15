<template>
  <div class="telefono-add-container">
    <h2>Agregar Número Telefónico</h2>
    <p v-if="error" class="error-message">{{ error }}</p>

    <form @submit.prevent="agregarTelefono">
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
          {{ saving ? "Guardando..." : "Agregar" }}
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
  name: "TelefonoAdd",
  props: ["estudianteUrl"],
  data() {
    return {
      telefono: {
        telefono: "",
        tipo: "",
        estudiante: "",
      },
      saving: false,
      error: null,
    };
  },
  created() {
    this.telefono.estudiante = decodeURIComponent(this.estudianteUrl);
  },
  methods: {
    async agregarTelefono() {
      try {
        this.saving = true;
        this.error = null;
        await api.post("numerosts/", this.telefono);
        alert("Número telefónico agregado exitosamente");
        this.volver();
      } catch (err) {
        console.error("Error al agregar teléfono:", err.response || err);
        this.error = "Error al agregar el número telefónico.";
      } finally {
        this.saving = false;
      }
    },
    volver() {
      this.$router.push({
        name: "EstudianteDetail",
        params: { estudianteUrl: this.estudianteUrl },
      });
    },
  },
};
</script>

<style scoped>
.telefono-add-container {
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
  background-color: #28a745;
  color: white;
}

button[type="submit"]:hover:not(:disabled) {
  background-color: #218838;
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
  margin-bottom: 15px;
  font-size: 0.9em;
}
</style>
