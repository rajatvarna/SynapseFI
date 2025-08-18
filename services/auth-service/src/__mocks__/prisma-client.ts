export const mockUserCreate = jest.fn();
export const mockUserFindUnique = jest.fn();
export const mockUserUpdate = jest.fn();

const mockPrismaClient = {
  user: {
    create: mockUserCreate,
    findUnique: mockUserFindUnique,
    update: mockUserUpdate,
  },
};

export const PrismaClient = jest.fn(() => mockPrismaClient);
