export const mockUserCreate = jest.fn();
export const mockUserFindUnique = jest.fn();

const mockPrismaClient = {
  user: {
    create: mockUserCreate,
    findUnique: mockUserFindUnique,
  },
};

export const PrismaClient = jest.fn(() => mockPrismaClient);
