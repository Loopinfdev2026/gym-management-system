// prisma/seed.ts
import "dotenv/config";
import {
  PrismaClient,
  RolUsuario,
  EstadoSocio,
  EstadoMembresia,
  MetodoPago,
  DedoHuella,
  TipoEventoAcceso,
  ResultadoAcceso,
  MotivoDenegacion,
} from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Iniciando seeders...\n");

  // ==========================================
  // 1. USUARIOS
  // ==========================================
  console.log("Creando usuarios...");

  const admin = await prisma.usuario.upsert({
    where: { email: "admin@gym.com" },
    update: {},
    create: {
      nombre: "Admin Principal",
      email: "admin@gym.com",
      passwordHash: "$2b$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghij",
      rol: RolUsuario.ADMIN,
      activo: true,
    },
  });

  const operador1 = await prisma.usuario.upsert({
    where: { email: "operador1@gym.com" },
    update: {},
    create: {
      nombre: "Carlos Operador",
      email: "operador1@gym.com",
      passwordHash: "$2b$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghij",
      rol: RolUsuario.OPERADOR,
      activo: true,
    },
  });

  const operador2 = await prisma.usuario.upsert({
    where: { email: "operador2@gym.com" },
    update: {},
    create: {
      nombre: "Maria Operadora",
      email: "operador2@gym.com",
      passwordHash: "$2b$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghij",
      rol: RolUsuario.OPERADOR,
      activo: false,
    },
  });

  console.log(`   ${admin.nombre}, ${operador1.nombre}, ${operador2.nombre}\n`);

  // ==========================================
  // 2. PLANES
  // ==========================================
  console.log("Creando planes...");

  const planMensual = await prisma.plan.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      nombre: "Mensual Basico",
      descripcion: "Acceso ilimitado al gimnasio durante 30 dias",
      duracionDias: 30,
      precio: 25.0,
      activo: true,
    },
  });

  const planTrimestral = await prisma.plan.upsert({
    where: { id: "00000000-0000-0000-0000-000000000002" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000002",
      nombre: "Trimestral Premium",
      descripcion: "Acceso al gimnasio y clases dirigidas durante 90 dias",
      duracionDias: 90,
      precio: 65.0,
      activo: true,
    },
  });

  const planAnual = await prisma.plan.upsert({
    where: { id: "00000000-0000-0000-0000-000000000003" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000003",
      nombre: "Anual VIP",
      descripcion: "Acceso total y entrenador personal durante 365 dias",
      duracionDias: 365,
      precio: 220.0,
      activo: true,
    },
  });

  console.log(`   ${planMensual.nombre}, ${planTrimestral.nombre}, ${planAnual.nombre}\n`);

  // ==========================================
  // 3. SOCIOS
  // ==========================================
  console.log("Creando socios...");

  const hoy = new Date();
  const enUnaSemana = new Date();
  enUnaSemana.setDate(hoy.getDate() + 7);
  const haceUnMes = new Date();
  haceUnMes.setMonth(hoy.getMonth() - 1);

  const socioActivo = await prisma.socio.upsert({
    where: { cedula: "V-12345678" },
    update: {},
    create: {
      cedula: "V-12345678",
      nombre: "Juan",
      apellido: "Perez",
      telefono: "0414-1234567",
      email: "juan.perez@email.com",
      fechaNacimiento: new Date("1990-05-15"),
      direccion: "Av. Principal, Caracas",
      estado: EstadoSocio.ACTIVO,
      fechaVencimiento: enUnaSemana,
      notas: "Socio regular",
      createdBy: admin.id,
    },
  });

  const socioVencido = await prisma.socio.upsert({
    where: { cedula: "V-23456789" },
    update: {},
    create: {
      cedula: "V-23456789",
      nombre: "Maria",
      apellido: "Gonzalez",
      telefono: "0424-9876543",
      email: "maria.gonzalez@email.com",
      fechaNacimiento: new Date("1985-11-22"),
      direccion: "Calle 5, Valencia",
      estado: EstadoSocio.VENCIDO,
      fechaVencimiento: haceUnMes,
      notas: "Membresia vencida, llamar",
      createdBy: operador1.id,
    },
  });

  const socioInactivo = await prisma.socio.upsert({
    where: { cedula: "V-34567890" },
    update: {},
    create: {
      cedula: "V-34567890",
      nombre: "Pedro",
      apellido: "Rodriguez",
      telefono: "0416-5555555",
      email: null,
      fechaNacimiento: new Date("2000-02-10"),
      direccion: null,
      estado: EstadoSocio.INACTIVO,
      fechaVencimiento: null,
      notas: "Socio nuevo, sin membresia",
      createdBy: operador1.id,
    },
  });

  const socioSuspendido = await prisma.socio.upsert({
    where: { cedula: "V-45678901" },
    update: {},
    create: {
      cedula: "V-45678901",
      nombre: "Ana",
      apellido: "Martinez",
      telefono: "0412-7777777",
      email: "ana.martinez@email.com",
      fechaNacimiento: new Date("1995-07-08"),
      direccion: "Urb. Los Chaguaramos, Caracas",
      estado: EstadoSocio.SUSPENDIDO,
      fechaVencimiento: enUnaSemana,
      notas: "Suspendido por conducta inapropiada",
      createdBy: admin.id,
    },
  });

  const nombreCompleto = (s: { nombre: string; apellido: string }) =>
    `${s.nombre} ${s.apellido}`;

  console.log(
    `   ${nombreCompleto(socioActivo)}, ${nombreCompleto(socioVencido)}, ${nombreCompleto(socioInactivo)}, ${nombreCompleto(socioSuspendido)}\n`,
  );

  // ==========================================
  // 4. MEMBRESIAS
  // ==========================================
  console.log("Creando membresias...");

  const membresiaActiva = await prisma.membresia.upsert({
    where: { id: "00000000-0000-0000-0000-000000000010" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000010",
      socioId: socioActivo.id,
      planId: planMensual.id,
      fechaInicio: haceUnMes,
      fechaVencimiento: enUnaSemana,
      estado: EstadoMembresia.ACTIVA,
    },
  });

  const membresiaVencida = await prisma.membresia.upsert({
    where: { id: "00000000-0000-0000-0000-000000000011" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000011",
      socioId: socioVencido.id,
      planId: planTrimestral.id,
      fechaInicio: new Date("2025-01-01"),
      fechaVencimiento: haceUnMes,
      estado: EstadoMembresia.VENCIDA,
    },
  });

  console.log(`   Membresia activa: ${membresiaActiva.id.slice(0, 8)}...`);
  console.log(`   Membresia vencida: ${membresiaVencida.id.slice(0, 8)}...\n`);

  // ==========================================
  // 5. PAGOS
  // ==========================================
  console.log("Creando pagos...");

  const pago1 = await prisma.pago.upsert({
    where: { id: "00000000-0000-0000-0000-000000000020" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000020",
      socioId: socioActivo.id,
      membresiaId: membresiaActiva.id,
      monto: 25.0,
      metodoPago: MetodoPago.PAGO_MOVIL,
      referencia: "PM-2026-001",
      fechaPago: haceUnMes,
      diasAgregados: 30,
      fechaVencimientoAnterior: null,
      fechaVencimientoNueva: enUnaSemana,
      operadorId: operador1.id,
      notas: "Pago mensual",
    },
  });

  const pago2 = await prisma.pago.upsert({
    where: { id: "00000000-0000-0000-0000-000000000021" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000021",
      socioId: socioVencido.id,
      membresiaId: membresiaVencida.id,
      monto: 65.0,
      metodoPago: MetodoPago.TARJETA,
      referencia: "TXN-2025-042",
      fechaPago: new Date("2025-01-01"),
      diasAgregados: 90,
      fechaVencimientoAnterior: null,
      fechaVencimientoNueva: haceUnMes,
      operadorId: operador1.id,
      notas: "Pago trimestral",
    },
  });

  console.log(`   ${pago1.referencia} (${pago1.monto})`);
  console.log(`   ${pago2.referencia} (${pago2.monto})\n`);

  // ==========================================
  // 6. HUELLAS
  // ==========================================
  console.log("Creando huellas...");

  const huella1 = await prisma.huella.upsert({
    where: { id: "00000000-0000-0000-0000-000000000030" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000030",
      socioId: socioActivo.id,
      dedo: DedoHuella.INDICE_DERECHO,
      plantillaHash: "hash_demo_huella_indice_derecho_juan",
      calidad: 95,
      activo: true,
      registradoPor: admin.id,
    },
  });

  const huella2 = await prisma.huella.upsert({
    where: { id: "00000000-0000-0000-0000-000000000031" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000031",
      socioId: socioActivo.id,
      dedo: DedoHuella.PULGAR_IZQUIERDO,
      plantillaHash: "hash_demo_huella_pulgar_izquierdo_juan",
      calidad: 88,
      activo: true,
      registradoPor: admin.id,
    },
  });

  console.log(`   ${huella1.dedo} (calidad ${huella1.calidad})`);
  console.log(`   ${huella2.dedo} (calidad ${huella2.calidad})\n`);

  // ==========================================
  // 7. HISTORIAL DE ACCESOS
  // ==========================================
  console.log("Creando historial de accesos...");

  await prisma.historialAcceso.upsert({
    where: { id: "00000000-0000-0000-0000-000000000040" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000040",
      socioId: socioActivo.id,
      huellaId: huella1.id,
      tipoEvento: TipoEventoAcceso.ENTRADA,
      resultado: ResultadoAcceso.PERMITIDO,
      fechaHora: new Date(Date.now() - 3600000),
      dispositivoId: "DISPOSITIVO-01",
    },
  });

  await prisma.historialAcceso.upsert({
    where: { id: "00000000-0000-0000-0000-000000000041" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000041",
      socioId: socioActivo.id,
      huellaId: huella1.id,
      tipoEvento: TipoEventoAcceso.SALIDA,
      resultado: ResultadoAcceso.PERMITIDO,
      fechaHora: new Date(Date.now() - 1800000),
      dispositivoId: "DISPOSITIVO-01",
    },
  });

  await prisma.historialAcceso.upsert({
    where: { id: "00000000-0000-0000-0000-000000000042" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000042",
      socioId: socioVencido.id,
      huellaId: null,
      tipoEvento: TipoEventoAcceso.ENTRADA,
      resultado: ResultadoAcceso.DENEGADO,
      motivoDenegacion: MotivoDenegacion.MEMBRESIA_VENCIDA,
      fechaHora: new Date(Date.now() - 7200000),
      dispositivoId: "DISPOSITIVO-01",
      observaciones: "Socio intento entrar con membresia vencida",
    },
  });

  console.log(`   Acceso permitido (entrada)`);
  console.log(`   Acceso permitido (salida)`);
  console.log(`   Acceso denegado (membresia vencida)\n`);

  // ==========================================
  // 8. LOGS DE AUDITORIA
  // ==========================================
  console.log("Creando logs de auditoria...");

  await prisma.logAuditoria.create({
    data: {
      usuarioId: admin.id,
      accion: "CREATE",
      entidad: "Socio",
      entidadId: socioActivo.id,
      datosNuevos: {
        cedula: socioActivo.cedula,
        nombre: socioActivo.nombre,
        apellido: socioActivo.apellido,
      },
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    },
  });

  await prisma.logAuditoria.create({
    data: {
      usuarioId: operador1.id,
      accion: "UPDATE",
      entidad: "Socio",
      entidadId: socioVencido.id,
      datosAnteriores: { estado: "ACTIVO" },
      datosNuevos: { estado: "VENCIDO" },
      ipAddress: "192.168.1.101",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    },
  });

  console.log(`   2 logs de auditoria\n`);

  // ==========================================
  // RESUMEN
  // ==========================================
  console.log("========================================");
  console.log("SEED COMPLETADO");
  console.log("========================================");
  console.log(`Usuarios:    3 (1 admin, 2 operadores)`);
  console.log(`Planes:      3`);
  console.log(`Socios:      4 (activo, vencido, inactivo, suspendido)`);
  console.log(`Membresias:  2 (activa, vencida)`);
  console.log(`Pagos:       2`);
  console.log(`Huellas:     2`);
  console.log(`Accesos:     3 (2 permitidos, 1 denegado)`);
  console.log(`Auditoria:   2 logs`);
  console.log("========================================\n");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error en seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });