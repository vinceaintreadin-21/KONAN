# ── Stage 1: builder ─────────────────────────────────────────────────────────
FROM python:3.12-slim AS builder

WORKDIR /app

ENV PYTHONUNBUFFERED=1

# System deps for mysqlclient
RUN apt-get update && apt-get install -y --no-install-recommends \
    default-libmysqlclient-dev \
    gcc \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# ── Stage 2: runtime ─────────────────────────────────────────────────────────
FROM python:3.12-slim AS runtime

WORKDIR /app

# Runtime MySQL client library (needed by mysqlclient at runtime)
RUN apt-get update && apt-get install -y --no-install-recommends \
    default-mysql-client \
    libmariadb3 \
    && rm -rf /var/lib/apt/lists/*

# Copy installed packages from builder
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy project source
COPY . .

# Collect static files (Django admin, DRF browsable API)
RUN python manage.py collectstatic --noinput

RUN echo "Build-time ALLOWED_HOSTS: $ALLOWED_HOSTS"

EXPOSE 8000

# Daphne serves both HTTP and WebSocket over ASGI
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "core.asgi:application"]