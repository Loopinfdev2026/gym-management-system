-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('ADMIN', 'OPERADOR');

-- CreateEnum
CREATE TYPE "EstadoSocio" AS ENUM ('ACTIVO', 'INACTIVO', 'VENCIDO', 'SUSPENDIDO');

-- CreateEnum
CREATE TYPE "EstadoMembresia" AS ENUM ('ACTIVA', 'VENCIDA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('PAGO_MOVIL', 'TARJETA', 'EFECTIVO', 'TRANSFERENCIA');

-- CreateEnum
CREATE TYPE "DedoHuella" AS ENUM ('PULGAR_DERECHO', 'INDICE_DERECHO', 'MEDIO_DERECHO', 'ANULAR_DERECHO', 'MENIQUE_DERECHO', 'PULGAR_IZQUIERDO', 'INDICE_IZQUIERDO', 'MEDIO_IZQUIERDO', 'ANULAR_IZQUIERDO', 'MENIQUE_IZQUIERDO');

-- CreateEnum
CREATE TYPE "TipoEventoAcceso" AS ENUM ('ENTRADA', 'SALIDA');

-- CreateEnum
CREATE TYPE "ResultadoAcceso" AS ENUM ('PERMITIDO', 'DENEGADO');

-- CreateEnum
CREATE TYPE "MotivoDenegacion" AS ENUM ('MEMBRESIA_VENCIDA', 'SOCIO_INACTIVO', 'HUELLA_NO_RECONOCIDA', 'SOCIO_SUSPENDIDO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "rol" "RolUsuario" NOT NULL DEFAULT 'OPERADOR',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "ultimo_acceso" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "socios" (
    "id" UUID NOT NULL,
    "cedula" VARCHAR(20) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "telefono" VARCHAR(20),
    "email" VARCHAR(150),
    "fecha_nacimiento" DATE,
    "direccion" TEXT,
    "foto_url" VARCHAR(500),
    "estado" "EstadoSocio" NOT NULL DEFAULT 'INACTIVO',
    "fecha_vencimiento" DATE,
    "notas" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID,

    CONSTRAINT "socios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planes" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "duracion_dias" INTEGER NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "planes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membresias" (
    "id" UUID NOT NULL,
    "socio_id" UUID NOT NULL,
    "plan_id" UUID NOT NULL,
    "fecha_inicio" DATE NOT NULL,
    "fecha_vencimiento" DATE NOT NULL,
    "estado" "EstadoMembresia" NOT NULL DEFAULT 'ACTIVA',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "membresias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id" UUID NOT NULL,
    "socio_id" UUID NOT NULL,
    "membresia_id" UUID,
    "monto" DECIMAL(10,2) NOT NULL,
    "metodo_pago" "MetodoPago" NOT NULL,
    "referencia" VARCHAR(100),
    "fecha_pago" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dias_agregados" INTEGER NOT NULL DEFAULT 30,
    "fecha_vencimiento_anterior" DATE,
    "fecha_vencimiento_nueva" DATE NOT NULL,
    "operador_id" UUID NOT NULL,
    "notas" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "huellas" (
    "id" UUID NOT NULL,
    "socio_id" UUID NOT NULL,
    "dedo" "DedoHuella" NOT NULL,
    "plantilla_hash" TEXT NOT NULL,
    "calidad" INTEGER,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registrado_por" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "huellas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historial_accesos" (
    "id" UUID NOT NULL,
    "socio_id" UUID,
    "huella_id" UUID,
    "tipo_evento" "TipoEventoAcceso" NOT NULL,
    "resultado" "ResultadoAcceso" NOT NULL,
    "motivo_denegacion" "MotivoDenegacion",
    "fecha_hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dispositivo_id" VARCHAR(50),
    "observaciones" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historial_accesos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs_auditoria" (
    "id" UUID NOT NULL,
    "usuario_id" UUID,
    "accion" VARCHAR(100) NOT NULL,
    "entidad" VARCHAR(50) NOT NULL,
    "entidad_id" UUID,
    "datos_anteriores" JSONB,
    "datos_nuevos" JSONB,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_email_idx" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_rol_idx" ON "usuarios"("rol");

-- CreateIndex
CREATE UNIQUE INDEX "socios_cedula_key" ON "socios"("cedula");

-- CreateIndex
CREATE INDEX "socios_cedula_idx" ON "socios"("cedula");

-- CreateIndex
CREATE INDEX "socios_estado_idx" ON "socios"("estado");

-- CreateIndex
CREATE INDEX "socios_fecha_vencimiento_idx" ON "socios"("fecha_vencimiento");

-- CreateIndex
CREATE INDEX "socios_nombre_apellido_idx" ON "socios"("nombre", "apellido");

-- CreateIndex
CREATE INDEX "planes_activo_idx" ON "planes"("activo");

-- CreateIndex
CREATE INDEX "membresias_socio_id_idx" ON "membresias"("socio_id");

-- CreateIndex
CREATE INDEX "membresias_estado_idx" ON "membresias"("estado");

-- CreateIndex
CREATE INDEX "membresias_fecha_vencimiento_idx" ON "membresias"("fecha_vencimiento");

-- CreateIndex
CREATE INDEX "membresias_socio_id_estado_idx" ON "membresias"("socio_id", "estado");

-- CreateIndex
CREATE UNIQUE INDEX "pagos_membresia_id_key" ON "pagos"("membresia_id");

-- CreateIndex
CREATE INDEX "pagos_socio_id_idx" ON "pagos"("socio_id");

-- CreateIndex
CREATE INDEX "pagos_fecha_pago_idx" ON "pagos"("fecha_pago");

-- CreateIndex
CREATE INDEX "pagos_metodo_pago_idx" ON "pagos"("metodo_pago");

-- CreateIndex
CREATE INDEX "pagos_operador_id_idx" ON "pagos"("operador_id");

-- CreateIndex
CREATE INDEX "pagos_fecha_pago_metodo_pago_idx" ON "pagos"("fecha_pago", "metodo_pago");

-- CreateIndex
CREATE INDEX "huellas_socio_id_idx" ON "huellas"("socio_id");

-- CreateIndex
CREATE INDEX "huellas_activo_idx" ON "huellas"("activo");

-- CreateIndex
CREATE INDEX "huellas_socio_id_activo_idx" ON "huellas"("socio_id", "activo");

-- CreateIndex
CREATE INDEX "huellas_dedo_idx" ON "huellas"("dedo");

-- CreateIndex
CREATE INDEX "historial_accesos_socio_id_idx" ON "historial_accesos"("socio_id");

-- CreateIndex
CREATE INDEX "historial_accesos_fecha_hora_idx" ON "historial_accesos"("fecha_hora");

-- CreateIndex
CREATE INDEX "historial_accesos_resultado_idx" ON "historial_accesos"("resultado");

-- CreateIndex
CREATE INDEX "historial_accesos_socio_id_fecha_hora_idx" ON "historial_accesos"("socio_id", "fecha_hora");

-- CreateIndex
CREATE INDEX "historial_accesos_tipo_evento_idx" ON "historial_accesos"("tipo_evento");

-- CreateIndex
CREATE INDEX "logs_auditoria_usuario_id_idx" ON "logs_auditoria"("usuario_id");

-- CreateIndex
CREATE INDEX "logs_auditoria_entidad_idx" ON "logs_auditoria"("entidad");

-- CreateIndex
CREATE INDEX "logs_auditoria_created_at_idx" ON "logs_auditoria"("created_at");

-- CreateIndex
CREATE INDEX "logs_auditoria_accion_idx" ON "logs_auditoria"("accion");

-- AddForeignKey
ALTER TABLE "socios" ADD CONSTRAINT "socios_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membresias" ADD CONSTRAINT "membresias_socio_id_fkey" FOREIGN KEY ("socio_id") REFERENCES "socios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membresias" ADD CONSTRAINT "membresias_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "planes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_socio_id_fkey" FOREIGN KEY ("socio_id") REFERENCES "socios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_membresia_id_fkey" FOREIGN KEY ("membresia_id") REFERENCES "membresias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_operador_id_fkey" FOREIGN KEY ("operador_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "huellas" ADD CONSTRAINT "huellas_socio_id_fkey" FOREIGN KEY ("socio_id") REFERENCES "socios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "huellas" ADD CONSTRAINT "huellas_registrado_por_fkey" FOREIGN KEY ("registrado_por") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_accesos" ADD CONSTRAINT "historial_accesos_socio_id_fkey" FOREIGN KEY ("socio_id") REFERENCES "socios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_accesos" ADD CONSTRAINT "historial_accesos_huella_id_fkey" FOREIGN KEY ("huella_id") REFERENCES "huellas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs_auditoria" ADD CONSTRAINT "logs_auditoria_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
