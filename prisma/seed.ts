import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Animation keys in order for the 16 zones (4x4 grid)
  const animationKeys = [
    'burst', 'ripple', 'confetti', 'waves',
    'spiral', 'pulse', 'lightning', 'flower', 
    'tornado', 'firework', 'snowflake', 'matrix',
    'galaxy', 'geometric', 'plasma', 'crystal'
  ];

  const zones = Array.from({ length: 16 }, (_, i) => ({ 
    id: i, 
    label: `Zone ${i}`,
    animationKey: animationKeys[i],
    isActive: true 
  }));
  
  for (const z of zones) {
    await prisma.zone.upsert({ 
      where: { id: z.id }, 
      create: z, 
      update: { animationKey: z.animationKey, isActive: z.isActive } 
    });
  }
}
main().finally(() => prisma.$disconnect());