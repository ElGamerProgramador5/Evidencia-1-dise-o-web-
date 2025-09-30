-- Script: schema_recetas.sql
CREATE DATABASE IF NOT EXISTS consultorio;
USE consultorio;

-- Médicos (usuarios para login)
CREATE TABLE medicos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pacientes
CREATE TABLE pacientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  fecha_nacimiento DATE,
  genero VARCHAR(10),
  telefono VARCHAR(30),
  creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla N:M médicos-pacientes (registro de relaciones)
CREATE TABLE medico_paciente (
  id INT AUTO_INCREMENT PRIMARY KEY,
  medico_id INT NOT NULL,
  paciente_id INT NOT NULL,
  asociacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (medico_id, paciente_id),
  FOREIGN KEY (medico_id) REFERENCES medicos(id) ON DELETE CASCADE,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE
);

-- Catálogo de medicamentos
CREATE TABLE medicamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT,
  creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recetas (cabecera)
CREATE TABLE recetas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  medico_id INT NOT NULL,
  paciente_id INT NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  motivo TEXT,
  instrucciones_generales TEXT,
  FOREIGN KEY (medico_id) REFERENCES medicos(id) ON DELETE RESTRICT,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE RESTRICT
);

-- Items de receta (medicamento + posologia)
CREATE TABLE receta_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  receta_id INT NOT NULL,
  medicamento_id INT NOT NULL,
  dosis VARCHAR(200) NOT NULL, -- e.g. "500 mg", "1 tableta"
  posologia TEXT NOT NULL,     -- e.g. "1 cada 8 horas por 7 días"
  observaciones TEXT,
  FOREIGN KEY (receta_id) REFERENCES recetas(id) ON DELETE CASCADE,
  FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id) ON DELETE RESTRICT
);

-- Datos de prueba
INSERT INTO medicos (nombre, email, password_hash) VALUES
('Dra. Ana Perez','ana.perez@hospital.test','$2b$12$EXAMPLEHASH'); -- reemplaza hash

INSERT INTO pacientes (nombre, fecha_nacimiento, genero) VALUES
('Juan Perez','1985-04-10','M'),
('María López','1990-09-21','F');

INSERT INTO medico_paciente (medico_id, paciente_id) VALUES
(1,1),(1,2);

INSERT INTO medicamentos (nombre, descripcion) VALUES
('Paracetamol','Analgésico y antipirético'),
('Amoxicilina','Antibiótico, aminopenicilina');

-- Ejemplo de receta
INSERT INTO recetas (medico_id, paciente_id, motivo, instrucciones_generales)
VALUES (1,1,'Infección respiratoria leve','Tomar en ayunas');

INSERT INTO receta_items (receta_id, medicamento_id, dosis, posologia, observaciones)
VALUES (1,2,'500 mg','Una cada 8 horas por 7 días','No tomar con alcohol'),
(1,1,'500 mg','Una cada 6-8 horas según dolor','Máximo 4g/día');
