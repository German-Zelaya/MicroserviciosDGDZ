# Imagen base de Python
FROM python:3.11-slim

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY requirements.txt .

# Instalar dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código de la aplicación
COPY Eventos.py .

# Crear directorio para la base de datos
RUN mkdir -p /app/data

# Exponer el puerto
EXPOSE 5002

# Variables de entorno por defecto
ENV SECRET_KEY=tu_clave_secreta_jwt_12345
ENV PORT=5002
ENV DATABASE=/app/data/eventos.db

# Comando para ejecutar la aplicación
CMD ["python", "Eventos.py"]