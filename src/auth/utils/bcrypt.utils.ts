import bcrypt from "bcrypt";

const compareHash = async (entity: string, hashedEntity: string) => {
  const comparedEntity = await bcrypt.compare(entity, hashedEntity);
  if (!comparedEntity) return false;
  return true;
};

const hashEntity = async (entity: string) => {
  return bcrypt.hash(entity, 10);
};

//  logout

export { compareHash, hashEntity };
