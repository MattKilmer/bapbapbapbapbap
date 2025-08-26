import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log('Checking database state...');
  
  // Check if zones already exist
  const existingZones = await prisma.zone.count();
  console.log(`Found ${existingZones} existing zones`);
  
  if (existingZones > 0) {
    console.log('Zones already exist, skipping seed');
    return;
  }

  console.log('Creating default zones...');

  // Animation keys in order for the 16 zones (4x4 grid)
  const animationKeys = [
    'burst', 'ripple', 'confetti', 'waves',
    'spiral', 'pulse', 'lightning', 'flower', 
    'tornado', 'firework', 'snowflake', 'matrix',
    'galaxy', 'geometric', 'plasma', 'crystal'
  ];

  // Create zones without soundboard assignment (legacy standalone mode)
  for (let i = 0; i < 16; i++) {
    await prisma.zone.create({
      data: {
        label: `Zone ${i + 1}`,
        animationKey: animationKeys[i],
        isActive: true,
        position: i + 1,
        soundboardId: null
      }
    });
  }

  console.log('Seed completed successfully');
}
main().finally(() => prisma.$disconnect());