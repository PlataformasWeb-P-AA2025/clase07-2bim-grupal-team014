<template>
  <div class="estudiante-detail-container">
    <h2>Detalle del Estudiante</h2>
    <p v-if="loading">Cargando detalles...</p>
    <p v-if="error" class="error-message">{{ error }}</p>
    <div v-else-if="estudiante">
      <h3>{{ estudiante.nombre }} {{ estudiante.apellido }}</h3>
      <p><strong>Cédula:</strong> {{ estudiante.cedula }}</p>
      <p><strong>Correo:</strong> {{ estudiante.correo }}</p>

      <div class="actions-section">
        <router-link
          :to="{
            name: 'EstudianteEdit',
            params: {
              estudianteUrl: encodeURIComponent(estudianteUrlDecoded),
            },
          }"
          class="edit-button"
        >
          Editar Estudiante
        </router-link>
        <button @click="eliminarEstudiante" class="delete-button">
          Eliminar Estudiante
        </button>
      </div>

      <div class="telefonos-section">
        <div class="section-header">
          <h4>Números Telefónicos:</h4>
          <router-link
            :to="{
              name: 'TelefonoAdd',
              params: {
                estudianteUrl: encodeURIComponent(estudianteUrlDecoded),
              },
            }"
            class="add-telefono-button"
          >
            Agregar Teléfono
          </router-link>
        </div>

        <div v-if="numerosTelefonicos.length" class="telefonos-grid">
          <div
            v-for="numero in numerosTelefonicos"
            :key="numero.url"
            class="telefono-card"
          >
            <div class="telefono-info">
              <span class="telefono-numero">{{ numero.telefono }}</span>
              <span class="telefono-tipo">({{ numero.tipo }})</span>
            </div>
            <div class="telefono-actions">
              <router-link
                :to="{
                  name: 'TelefonoEdit',
                  params: { telefonoUrl: encodeURIComponent(numero.url) },
                }"
                class="edit-telefono-button"
              >
                Editar
              </router-link>
              <button
                @click="eliminarTelefono(numero.url)"
                class="delete-telefono-button"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
        <p v-else>No tiene números telefónicos registrados.</p>
      </div>

      <router-link :to="{ name: 'EstudiantesList' }" class="back-button"
        >Volver al Listado</router-link
      >
    </div>
    <p v-else>Estudiante no encontrado.</p>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "EstudianteDetail",
  props: ["estudianteUrl"],
  data() {
    return {
      estudiante: null,
      numerosTelefonicos: [],
      loading: true,
      error: null,
      estudianteUrlDecoded: "",
    };
  },
  async created() {
    this.estudianteUrlDecoded = decodeURIComponent(this.estudianteUrl);
    await this.fetchEstudianteDetail(this.estudianteUrlDecoded);
    await this.fetchNumerosTelefonicos(this.estudianteUrlDecoded);
  },
  methods: {
    async fetchEstudianteDetail(url) {
      try {
        this.loading = true;
        this.error = null;
        const response = await api.get(url);
        this.estudiante = response.data;
      } catch (err) {
        console.error(
          "Error al cargar detalle del estudiante:",
          err.response || err
        );
        this.error = "No se pudo cargar el detalle del estudiante.";
      } finally {
        this.loading = false;
      }
    },
    async fetchNumerosTelefonicos(estudianteApiUrl) {
      console.log(estudianteApiUrl);
      try {
        const response = await api.get("numerosts/");
        this.numerosTelefonicos = response.data.results.filter(
          (numero) => numero.estudiante === estudianteApiUrl
        );
      } catch (err) {
        console.error(
          "Error al cargar números telefónicos:",
          err.response || err
        );
      }
    },
    async eliminarEstudiante() {
      if (confirm("¿Estás seguro de que quieres eliminar este estudiante?")) {
        try {
          await api.delete(this.estudianteUrlDecoded);
          alert("Estudiante eliminado exitosamente");
          this.$router.push({ name: "EstudiantesList" });
        } catch (err) {
          console.error("Error al eliminar estudiante:", err.response || err);
          alert("Error al eliminar el estudiante");
        }
      }
    },
    async eliminarTelefono(telefonoUrl) {
      if (
        confirm("¿Estás seguro de que quieres eliminar este número telefónico?")
      ) {
        try {
          await api.delete(telefonoUrl);
          this.numerosTelefonicos = this.numerosTelefonicos.filter(
            (tel) => tel.url !== telefonoUrl
          );
          alert("Número telefónico eliminado exitosamente");
        } catch (err) {
          console.error("Error al eliminar teléfono:", err.response || err);
          alert("Error al eliminar el número telefónico");
        }
      }
    },
  },
};
</script>

<style scoped>
.estudiante-detail-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  text-align: left;
}

h2,
h3,
h4 {
  text-align: center;
  color: #333;
  margin-bottom: 15px;
}

p {
  margin-bottom: 10px;
}

ul {
  list-style: disc;
  padding-left: 20px;
  margin-bottom: 20px;
}

li {
  margin-bottom: 5px;
}

.back-button {
  display: block;
  width: fit-content;
  margin: 20px auto 0;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  text-align: center;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
}

.actions-section {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 20px 0;
}

.edit-button {
  padding: 8px 16px;
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
  padding: 8px 16px;
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

.telefonos-section {
  margin: 30px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.add-telefono-button {
  padding: 6px 12px;
  background-color: #28a745;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.8em;
  transition: background-color 0.3s ease;
}

.add-telefono-button:hover {
  background-color: #218838;
}

.telefonos-grid {
  display: grid;
  gap: 10px;
}

.telefono-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: white;
}

.telefono-info {
  display: flex;
  gap: 10px;
  align-items: center;
}

.telefono-numero {
  font-weight: bold;
  color: #333;
}

.telefono-tipo {
  color: #666;
  font-style: italic;
}

.telefono-actions {
  display: flex;
  gap: 8px;
}

.edit-telefono-button {
  padding: 4px 8px;
  background-color: #ffc107;
  color: #212529;
  border-radius: 3px;
  text-decoration: none;
  font-size: 0.8em;
  transition: background-color 0.3s ease;
}

.edit-telefono-button:hover {
  background-color: #e0a800;
}

.delete-telefono-button {
  padding: 4px 8px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.8em;
  transition: background-color 0.3s ease;
}

.delete-telefono-button:hover {
  background-color: #c82333;
}
</style>
