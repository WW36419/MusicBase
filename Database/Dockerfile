FROM postgres:16

# Ustawienia bazy
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=mbase90l
ENV POSTGRES_DB=musicbase

# Skopiuj dump do katalogu inicjalizacyjnego Postgresa
# Wszystko co znajdzie się w /docker-entrypoint-initdb.d/
# zostanie wykonane przy pierwszym starcie kontenera
COPY musicbase_db.sql /docker-entrypoint-initdb.d/