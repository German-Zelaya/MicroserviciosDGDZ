const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;

// Middleware para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal - servir la página HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint para realizar cálculos
app.post('/calcular', (req, res) => {
    try {
        const { operation, a, b } = req.body;
        
        // Validar que los valores sean números
        const numA = parseFloat(a);
        const numB = parseFloat(b);
        
        if (isNaN(numA) || isNaN(numB)) {
            return res.json({
                success: false,
                error: 'Por favor ingrese números válidos'
            });
        }
        
        let result;
        let operationSymbol;
        
        switch (operation) {
            case 'suma':
                result = numA + numB;
                operationSymbol = '+';
                break;
            case 'resta':
                result = numA - numB;
                operationSymbol = '-';
                break;
            case 'multiplicacion':
                result = numA * numB;
                operationSymbol = '×';
                break;
            case 'division':
                if (numB === 0) {
                    return res.json({
                        success: false,
                        error: 'No se puede dividir por cero'
                    });
                }
                result = numA / numB;
                operationSymbol = '÷';
                break;
            default:
                return res.json({
                    success: false,
                    error: 'Operación no válida'
                });
        }
        
        res.json({
            success: true,
            result: result,
            operation: `${numA} ${operationSymbol} ${numB} = ${result}`
        });
        
    } catch (error) {
        console.error('Error en el cálculo:', error);
        res.json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Calculadora web lista para usar`);
});