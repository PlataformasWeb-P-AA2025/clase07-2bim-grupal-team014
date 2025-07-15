<template>
  <div class="estudiante-add-container">
    <h2>Agregar Nuevo Estudiante</h2>
    <p v-if="error" class="error-message">{{ error }}</p>

    <form @submit.prevent="agregarEstudiante">
      <div class="form-group">
        <label for="nombre">Nombre:</label>
        <input
          type="text"
          id="nombre"
          v-model="estudiante.nombre"
          required
          placeholder="Ingrese el nombre"
        />
      </div>

      <div class="form-group">
        <label for="apellido">Apellido:</label>
        <input
          type="text"
          id="apellido"
          v-model="estudiante.apellido"
          required
          placeholder="Ingrese el apellido"
        />
      </div>

      <div class="form-group">
        <label for="cedula">Cédula:</label>
        <input
          type="text"
          id="cedula"
          v-model="estudiante.cedula"
          required
          placeholder="Ingrese la cédula"
        />
      </div>

      <div class="form-group">
        <label for="correo">Correo Electrónico:</label>
        <input
          type="email"
          id="correo"
          v-model="estudiante.correo"
          required
          placeholder="Ingrese el correo electrónico"
        />
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="saving">
          {{ saving ? "Guardando..." : "Agregar Estudiante" }}
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
  name: "EstudianteAdd",
  data() {
    return {
      estudiante: {
        nombre: "",
        apellido: "",
        cedula: "",
        correo: "",
      },
      saving: false,
      error: null,
    };
  },
  methods: {
    async agregarEstudiante() {
      try {
        this.saving = true;
        this.error = null;

        // Validaciones básicas
        if (!this.estudiante.nombre.trim()) {
          this.error = "El nombre es obligatorio";
          return;
        }

        if (!this.estudiante.apellido.trim()) {
          this.error = "El apellido es obligatorio";
          return;
        }

        if (!this.estudiante.cedula.trim()) {
          this.error = "La cédula es obligatoria";
          return;
        }

        if (!this.estudiante.correo.trim()) {
          this.error = "El correo es obligatorio";
          return;
        }

        // Petición POST para crear el estudiante
        const response = await api.post("estudiantes/", this.estudiante);

        console.log("Estudiante creado:", response.data);
        alert("Estudiante agregado exitosamente");

        // Redirigir a la lista de estudiantes
        this.$router.push({ name: "EstudiantesList" });
      } catch (err) {
        console.error("Error al agregar estudiante:", err.response || err);

        if (err.response && err.response.data) {
          // Manejar errores específicos del backend
          const errors = err.response.data;
          if (errors.cedula) {
            this.error = "La cédula ya existe o es inválida";
          } else if (errors.correo) {
            this.error = "El correo ya existe o es inválido";
          } else {
            this.error = "Error al agregar el estudiante. Verifica los datos.";
          }
        } else {
          this.error = "Error de conexión. Inténtalo más tarde.";
        }
      } finally {
        this.saving = false;
      }
    },

    limpiarFormulario() {
      this.estudiante = {
        nombre: "",
        apellido: "",
        cedula: "",
        correo: "",
      };
      this.error = null;
    },
  },
};
</script>

<style scoped>
.estudiante-add-container {
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
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

input[type="text"],
input[type="email"] {
  width: calc(100% - 20px);
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
  transition: border-color 0.3s ease;
}

input[type="text"]:focus,
input[type="email"]:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
}

button {
  padding: 12px 24px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover:not(:disabled) {
  background-color: #218838;
}

button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.cancel-button {
  padding: 12px 24px;
  background-color: #6c757d;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-size: 1em;
  font-weight: bold;
  transition: background-color 0.3s ease;
  display: inline-flex;
  align-items: center;
}

.cancel-button:hover {
  background-color: #5a6268;
}

.error-message {
  color: #dc3545;
  text-align: center;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  font-size: 0.9em;
}
</style>
