// Quick script to test username generation locally
// Run with: node scripts/generate-usernames.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function generateUsername(name, email) {
  // Try to create username from name first
  if (name) {
    const baseName = name.toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 15);
    if (baseName.length >= 3) {
      return baseName;
    }
  }

  // Fallback to email local part
  const emailLocal = email.split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 15);
  
  return emailLocal.length >= 3 ? emailLocal : 'user';
}

async function generateUniqueUsername(baseName, email) {
  const baseUsername = generateUsername(baseName, email);
  
  let username = baseUsername;
  let counter = 1;
  
  while (true) {
    const existing = await prisma.user.findUnique({
      where: { username }
    });
    
    if (!existing) {
      return username;
    }
    
    username = `${baseUsername}${counter}`;
    counter++;
    
    // Safety check
    if (counter > 1000) {
      username = `${baseUsername}${Date.now()}`;
      break;
    }
  }
  
  return username;
}

async function main() {
  console.log('Generating usernames for users without them...');
  
  const usersWithoutUsernames = await prisma.user.findMany({
    where: {
      username: null
    },
    select: {
      id: true,
      name: true,
      email: true
    }
  });

  console.log(`Found ${usersWithoutUsernames.length} users without usernames`);

  for (const user of usersWithoutUsernames) {
    try {
      const username = await generateUniqueUsername(user.name || '', user.email);
      
      await prisma.user.update({
        where: { id: user.id },
        data: { username }
      });

      console.log(`Generated username "${username}" for ${user.email}`);
    } catch (error) {
      console.error(`Failed to generate username for user ${user.id}:`, error);
    }
  }

  console.log('Username generation complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });