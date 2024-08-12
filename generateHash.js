/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
const bcrypt = require('bcrypt');

async function generateHash(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log(hashedPassword);
}

generateHash('AdminSecurePass123');
generateHash('UserSecurePass123');
