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
      maintenance: false,
      alertDescription: 'Currently under maintenance. Please come back later.',
      pages: {
        createMany: {
          data: [
            {
              name: 'account',
              alertTitle: 'Creating new accounts is under maintenance.',
              alertDescription:
                "We're currently working on creating new accounts. Please come back later.",
              maintenance: false,
              isCustomAlert: false,
            },
            {
              name: 'review',
              alertTitle: 'Reviewing gameplay is under maintenance.',
              alertDescription:
                "We're currently working on reviewing gameplay. Please come back later.",
              maintenance: false,
              isCustomAlert: false,
            },
            {
              name: 'upload',
              alertTitle: 'Uploading gameplay is under maintenance.',
              alertDescription:
                "We're currently working on uploading gameplay. Please come back later.",
              maintenance: false,
              isCustomAlert: false,
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
