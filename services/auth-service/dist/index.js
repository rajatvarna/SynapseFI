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
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const auth_utils_1 = require("auth-utils");
const auth_middleware_1 = require("auth-middleware");
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.get('/', (req, res) => {
    res.send('Auth service is running!');
});
app.post('/register', (request, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = request.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
        const hashedPassword = yield (0, auth_utils_1.hashPassword)(password);
        const user = yield prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
        res.status(201).json({ id: user.id, email: user.email });
    }
    catch (error) {
        res.status(400).json({ error: 'User with this email already exists' });
    }
}));
app.post('/login', (request, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = request.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = yield prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }
    const isPasswordValid = yield (0, auth_utils_1.comparePassword)(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }
    const accessToken = (0, auth_utils_1.generateToken)(user.id);
    res.json({ accessToken });
}));
app.get('/me', auth_middleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const user = yield prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, createdAt: true },
    });
    res.json(user);
}));
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Auth service listening at http://localhost:${port}`);
    });
}
exports.default = app;
