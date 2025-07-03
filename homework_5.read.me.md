## homework_5
Course: Highload Architect
Ершов Виктор Анатольевич
04.07.2025

GitHUB: https://github.com/ve131061/homework_5.git branch main

## Prerequisites

1. OS: Windows 10
2. install node.js: https://nodejs.org/en
3. install postgresql: https://www.postgresql.org/

## Конфигурирование кластера на базе горизонтального шардирования по хэш функции и FOREIGN DATA WRAPPER

1. Register MASTER PostgreSQL Server (localhost: 5432)
2. Register Shard_1 PostgreSQL Server (localhost: 5433)
3. Register Shard_2 PostgreSQL Server (localhost: 5434)
4. Run: 

==========
ON MASTER:
==========
CREATE TABLE IF NOT EXISTS public.posts
(
    id_sender bigint NOT NULL,
    id_receiver bigint NOT NULL,
    text character varying COLLATE pg_catalog."default" NOT NULL,
    "timestamp" time without time zone DEFAULT now()
)
PARTITION BY HASH (id_sender);
ALTER TABLE IF EXISTS public.posts
    OWNER to postgres;

==========
ON SHARD_1:
==========

CREATE TABLE IF NOT EXISTS public.posts_even
(
    id_sender bigint NOT NULL,
    id_receiver bigint NOT NULL,
    text character varying COLLATE pg_catalog."default" NOT NULL,
    "timestamp" character varying COLLATE pg_catalog."default"
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.posts_even
    OWNER to postgres;

==========
ON SHARD_2:
==========

CREATE TABLE IF NOT EXISTS public.posts_odd
(
    id_sender bigint NOT NULL,
    id_receiver bigint NOT NULL,
    text character varying COLLATE pg_catalog."default" NOT NULL,
    "timestamp" character varying COLLATE pg_catalog."default"
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.posts_odd
    OWNER to postgres;


==========
ON MASTER:
==========
CREATE EXTENSION postgres_fdw;
GRANT USAGE ON FOREIGN DATA WRAPPER postgres_fdw TO myuser;
GRANT USAGE ON FOREIGN DATA WRAPPER postgres_fdw TO postgres;

CREATE SERVER shard_1 FOREIGN DATA WRAPPER postgres_fdw OPTIONS (host 'localhost', dbname 'mydatabase', port '5433');
CREATE USER MAPPING FOR myuser SERVER shard_1 OPTIONS (user 'postgres', password 'postgres');
CREATE USER MAPPING FOR postgres SERVER shard_1 OPTIONS (user 'postgres', password 'postgres');
CREATE FOREIGN TABLE posts_even PARTITION OF posts FOR VALUES WITH (MODULUS 2,REMAINDER 0) SERVER shard_1;


CREATE SERVER shard_2 FOREIGN DATA WRAPPER postgres_fdw OPTIONS (host 'localhost', dbname 'mydatabase', port '5434');
CREATE USER MAPPING FOR myuser SERVER shard_2 OPTIONS (user 'postgres', password 'postgres');
CREATE USER MAPPING FOR postgres SERVER shard_2 OPTIONS (user 'postgres', password 'postgres');
CREATE FOREIGN TABLE posts_odd PARTITION OF posts FOR VALUES WITH (MODULUS 2,REMAINDER 1) SERVER shard_2;

==========

## Clone https://github.com/ve131061/homework_5.git branch main

## Run server
 
cd cd <homework_5 dir>
node ./src/server.js


## Реализованный функционал:

Отправка сообщения пользователю (метод http://localhost:3000/api/dialog/send). Реализация в ./src/controllers/userController.js (postSend)
Получение диалога между двумя пользователями (метод http://localhost:3000/api/dialog/send).  Реализация в ./src/controllers/userController.js (getList)

Примеры вызова методов в https://github.com/ve131061/homework_5/homework_5.postman_collection.json
