"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("./index"));
const client_1 = require("@prisma/client");
const auth_utils_1 = require("auth-utils");
jest.mock('@prisma/client');
jest.mock('auth-utils', () => (Object.assign(Object.assign({}, jest.requireActual('auth-utils')), { comparePassword: jest.fn() })));
const prisma = new client_1.PrismaClient();
describe('Auth Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('POST /register', () => {
        it('should register a new user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            prisma.user.create.mockResolvedValueOnce({
                id: 1,
                email: 'test@example.com',
                password: 'hashedpassword',
            });
            const res = yield (0, supertest_1.default)(index_1.default)
                .post('/register')
                .send({ email: 'test@example.com', password: 'password123' });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toEqual({ id: 1, email: 'test@example.com' });
        }));
        it('should return 400 if user already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            prisma.user.create.mockRejectedValueOnce(new Error());
            const res = yield (0, supertest_1.default)(index_1.default)
                .post('/register')
                .send({ email: 'test@example.com', password: 'password123' });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual({ error: 'User with this email already exists' });
        }));
    });
    describe('POST /login', () => {
        it('should login an existing user and return a token', () => __awaiter(void 0, void 0, void 0, function* () {
            prisma.user.findUnique.mockResolvedValueOnce({
                id: 1,
                email: 'test@example.com',
                password: 'hashedpassword',
            });
            auth_utils_1.comparePassword.mockResolvedValueOnce(true);
            const res = yield (0, supertest_1.default)(index_1.default)
                .post('/login')
                .send({ email: 'test@example.com', password: 'password123' });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('accessToken');
        }));
        it('should return 400 for invalid credentials (wrong password)', () => __awaiter(void 0, void 0, void 0, function* () {
            prisma.user.findUnique.mockResolvedValueOnce({
                id: 1,
                email: 'test@example.com',
                password: 'hashedpassword',
            });
            auth_utils_1.comparePassword.mockResolvedValueOnce(false);
            const res = yield (0, supertest_1.default)(index_1.default)
                .post('/login')
                .send({ email: 'test@example.com', password: 'wrongpassword' });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual({ error: 'Invalid credentials' });
        }));
        it('should return 400 for non-existent user', () => __awaiter(void 0, void 0, void 0, function* () {
            prisma.user.findUnique.mockResolvedValueOnce(null);
            const res = yield (0, supertest_1.default)(index_1.default)
                .post('/login')
                .send({ email: 'nouser@example.com', password: 'password123' });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual({ error: 'Invalid credentials' });
        }));
    });
});
