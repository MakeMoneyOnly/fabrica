import { PrismaClient, ProductType } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('secret123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@habesha.store' },
    update: {},
    create: { email: 'demo@habesha.store', passwordHash, name: 'Demo User' },
  });

  const store = await prisma.store.upsert({
    where: { slug: 'demo' },
    update: {},
    create: { name: 'Demo Store', slug: 'demo', ownerId: user.id },
  });

  await prisma.product.upsert({
    where: { id: 'seed-product-1' },
    update: {},
    create: {
      id: 'seed-product-1',
      storeId: store.id,
      type: ProductType.DIGITAL,
      title: 'Ethiopian Business Template Pack',
      description: 'Templates and guides for small businesses in Ethiopia.',
      priceInt: 9900,
      downloadUrl: 'https://example.com/downloads/template-pack.zip',
    },
  });

  // eslint-disable-next-line no-console
  console.log('Seed complete:', { user: user.email, store: store.slug });
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
