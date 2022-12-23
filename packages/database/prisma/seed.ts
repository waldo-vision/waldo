import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const site = await prisma.waldoSite.upsert({
    where: { siteName: 'waldo' },
    update: {},
    create: {
      showLpAlert: false,
      lpAlertTitle: 'Under Maintenance',
      lpAlertDescription:
        'Currently under maintenance. Please come back later.',
      pages: {
        createMany: {
          data: [
            {
              name: 'account',
              customReason: 'Creating new accounts is under maintenance.',
            },
            {
              name: 'review',
              customReason: 'Reviewing gameplay is under maintenance.',
            },
            {
              name: 'upload',
              customReason: 'Uploading gameplay is under maintenance.',
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
