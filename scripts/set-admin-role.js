// Script to set mvkilmer@gmail.com as ADMIN
// Run with: node scripts/set-admin-role.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Setting mvkilmer@gmail.com as ADMIN...');
  
  try {
    const user = await prisma.user.update({
      where: {
        email: 'mvkilmer@gmail.com'
      },
      data: {
        role: 'ADMIN'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    console.log(`✅ Successfully set ${user.email} (${user.name}) as ADMIN`);
    console.log(`User ID: ${user.id}`);
    console.log(`Role: ${user.role}`);

  } catch (error) {
    if (error.code === 'P2025') {
      console.error('❌ User mvkilmer@gmail.com not found in database');
      console.log('Make sure the user has signed up first');
    } else {
      console.error('❌ Error setting admin role:', error);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });