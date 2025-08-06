"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const agenda_routes_1 = __importDefault(require("./routes/agenda.routes"));
const Agenda_1 = require("./entity/Agenda");
const express_ejs_layouts_1 = __importDefault(require("express-ejs-layouts"));
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "bd_agenda_typeorm",
    synchronize: true,
    logging: false,
    entities: [Agenda_1.Agenda],
    migrations: [],
    subscribers: [],
});
// Inicialización
exports.AppDataSource.initialize()
    .then(async () => {
    console.log("Conexión a MySQL establecida con TypeORM");
    // Crear app Express
    const app = (0, express_1.default)();
    const PORT = 3001;
    // Middleware
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
    app.use(express_ejs_layouts_1.default);
    // Configurar motor de vistas
    app.set('view engine', 'ejs');
    app.set('views', path_1.default.join(__dirname, 'views'));
    app.set('layout', 'layout');
    // Rutas
    app.use('/', agenda_routes_1.default);
    // Iniciar servidor
    app.listen(PORT, () => {
        console.log(`Servidor TypeORM corriendo en http://localhost:${PORT}`);
    });
})
    .catch(error => console.error("Error durante la inicialización de TypeORM:", error));
//# sourceMappingURL=index.js.map