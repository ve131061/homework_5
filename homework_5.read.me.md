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

План исполнения команды SELECT в файле ./SELECT_EXPLAIN.bmp 


## Resharding procedures without downtime

1. Consistent Hashing

Консистентное хеширование можно представить как круг, на котором равномерно распределены сервера (или шарды). Каждый ключ (например, ID пользователя) тоже хешируется и помещается на этот круг. Запросы направляются на ближайший сервер по часовой стрелке. Это позволяет легко добавлять или удалять сервера: вместо перераспределения всех данных, достаточно переместить только те, которые попадали на изменённый участок круга. Например, если добавить новый сервер, он возьмёт часть данных у ближайшего соседа, но остальные сервера останутся нетронутыми.

2. Rendezvous Hashing

Хеш-функция принимает 2 аргумента - pivot поле и номер шарда. Комбинация, при которой хеш будет наибольшим будет указывать нужный шард.

shard := 0 // assume that hash_func(any) > 0
for i := 0; i < len(shards); i++ {
  shard = max(hash_func(user_id, i), shard)
}
После указанных команд, в переменной shard будет хранится номер нужного узла. Если сервер выходит из строя или добавляется новый, только те ключи, которые были привязаны к нему, перераспределяются, а все остальные остаются на месте.

3. Virtual Buckets

Данные распределяются по виртуальным бакетам. Затем бакеты, привязываются к серверам. Если сервер выходит из строя, только его бакеты перераспределяются между оставшимися серверами, а не все данные сразу.


