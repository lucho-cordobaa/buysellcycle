import { PrismaClient } from '../generated/prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const provincias = [
  'Buenos Aires',
  'Ciudad Autónoma de Buenos Aires',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
];

async function seedProvincias() {
  const data = provincias.map((nombre) => ({ nombre }));
  await prisma.provincia.createMany({ data, skipDuplicates: true });
  console.log('Provincias creadas correctamente');
}

async function seedLocalidades() {
  const filePath = path.join(__dirname, 'localidades.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const json = JSON.parse(rawData);
  const localidadesJson = json.localidades as Array<{
    nombre: string;
    provincia: { nombre: string };
  }>;

  const provinciasDb = await prisma.provincia.findMany();

  const mapaProvincias = new Map<string, number>();
  for (const provincia of provinciasDb) {
    mapaProvincias.set(provincia.nombre, provincia.id);
  }

  const data: { nombre: string; provinciaId: number }[] = [];
  for (const loc of localidadesJson) {
    const provinciaId = mapaProvincias.get(loc.provincia.nombre);
    if (provinciaId) {
      data.push({ nombre: loc.nombre, provinciaId });
    }
  }

  await prisma.localidad.createMany({ data, skipDuplicates: true });
  console.log(`Localidades creadas correctamente: ${data.length}`);
}

async function main() {
  await seedProvincias();
  await seedLocalidades();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
