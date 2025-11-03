import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@winningproductfinder.com' },
    update: {},
    create: {
      email: 'demo@winningproductfinder.com',
    },
  });

  const search = await prisma.searchQuery.create({
    data: {
      userId: user.id,
      query: 'baby thermal',
      filtersJSON: {
        marketplaces: ['amazon', 'flipkart', 'meesho'],
        minPrice: 200,
        maxPrice: 1500,
        minRating: 3.5,
      },
      results: {
        createMany: {
          data: [
            {
              marketplace: 'amazon',
              externalId: 'demo-amazon-1',
              title: 'Cozy Baby Thermal Onesie',
              imageUrl: 'https://placehold.co/200x200',
              price: 899,
              rating: 4.5,
              reviews: 430,
              categoryPathJSON: ['Baby', 'Thermals'],
              bsr: 120,
              sellersCount: 12,
              scoresJSON: {
                demandScore: 82,
                competitionScore: 48,
                profitEstimate: 220,
                profitMarginPct: 24,
                opportunityScore: 71,
              },
            },
          ],
        },
      },
    },
  });

  // eslint-disable-next-line no-console
  console.log('Seeded demo data', { user: user.email, searchId: search.id });
}

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

