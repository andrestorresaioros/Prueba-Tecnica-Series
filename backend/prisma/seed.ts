import { PrismaClient, SeriesStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.seriesDirector.deleteMany();
  await prisma.series.deleteMany();
  await prisma.director.deleteMany();

  const vince = await prisma.director.create({
    data: {
      fullName: 'Vince Gilligan',
      nationality: 'Estadounidense',
      birthDate: new Date('1967-02-10'),
      biography: 'Creador, guionista y director de televisión reconocido por dramas criminales.',
    },
  });

  const michelle = await prisma.director.create({
    data: {
      fullName: 'Michelle MacLaren',
      nationality: 'Canadiense',
      birthDate: new Date('1965-01-01'),
      biography: 'Directora y productora con participación en series dramáticas de alto impacto.',
    },
  });

  const david = await prisma.director.create({
    data: {
      fullName: 'David Fincher',
      nationality: 'Estadounidense',
      birthDate: new Date('1962-08-28'),
      biography: 'Director de cine y televisión con estilo visual oscuro y narrativas de suspenso.',
    },
  });

  await prisma.series.create({
    data: {
      name: 'Breaking Bad',
      releaseDate: new Date('2008-01-20'),
      synopsis: 'Un profesor de química se involucra en el mundo criminal tras recibir un diagnóstico médico complejo.',
      country: 'Estados Unidos',
      seasons: 5,
      rating: 9.5,
      status: SeriesStatus.FINISHED,
      directors: {
        create: [
          { directorId: vince.id, role: 'CREADOR / DIRECTOR' },
          { directorId: michelle.id, role: 'DIRECTORA' },
        ],
      },
    },
  });

  await prisma.series.create({
    data: {
      name: 'Mindhunter',
      releaseDate: new Date('2017-10-13'),
      synopsis: 'Agentes del FBI entrevistan asesinos seriales para entender patrones criminales.',
      country: 'Estados Unidos',
      seasons: 2,
      rating: 8.6,
      status: SeriesStatus.FINISHED,
      directors: {
        create: [{ directorId: david.id, role: 'PRODUCTOR EJECUTIVO / DIRECTOR' }],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
