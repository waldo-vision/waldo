import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const site = await prisma.waldoSite.upsert({
    where: { name: 'waldo' },
    update: {},
    create: {
      name: 'waldo',
      isCustomAlert: false,
      alertTitle: 'Under Maintenance',
      alertDescription: 'Currently under maintenance. Please come back later.',
      pages: {
        createMany: {
          data: [
            {
              name: 'account',
              alertTitle: 'Creating new accounts is under maintenance.',
            },
            {
              name: 'review',
              alertTitle: 'Reviewing gameplay is under maintenance.',
            },
            {
              name: 'upload',
              alertTitle: 'Uploading gameplay is under maintenance.',
            },
          ],
        },
      },
    },
  });
  console.log(site);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
