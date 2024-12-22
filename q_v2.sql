drop database if exists aviasales_db;
create database aviasales_db;
use aviasales_db;

create table Client (
  ID_client INT(255) primary key not null AUTO_INCREMENT,
  First_name varchar(15) not null check (First_name regexp '^[А-Яа-яЁё-]+$'),
  Surname varchar(30) not null check (Surname regexp '^[А-Яа-яЁё-]+$'),
  Last_name varchar(20) null check (Last_name regexp '^[А-Яа-яЁё-]+$'),
  Email varchar(50) not null check (Email regexp '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  Passwords varchar(8) not null check (Passwords regexp '^[A-Za-z0-9._-]+$'),
  Login varchar(20) not null check (Login regexp '^[A-Za-z0-9._-]+$')
);

create table Representative (
  ID_representative INT(255) primary key not null AUTO_INCREMENT,
  First_name varchar(15) not null check (First_name regexp '^[А-Яа-яЁё-]+$'),
  Surname varchar(30) not null check (Surname regexp '^[А-Яа-яЁё-]+$'),
  Last_name varchar(20) null check (Last_name regexp '^[А-Яа-яЁё-]+$'),
  Passwords varchar(8) not null check (Passwords regexp '^[A-Za-z0-9._-]+$'),
  AirlineID_airline int(255) NOT NULL
);

create table Airline (
  ID_airline INT(255) primary key not null AUTO_INCREMENT,
  Airline_name varchar(30) not null check (Airline_name regexp '^[А-Яа-яЁёA-Za-z- ]+$')
);

create table City (
  ID_city INT(255) primary key not null AUTO_INCREMENT,
  City_name varchar(30) not null check (City_name regexp '^[А-Яа-яЁёA-Za-z-]+$')
);

create table Stat (
  ID_Stat INT(255) primary key not null AUTO_INCREMENT,
  Status_name varchar(50) not null check (Status_name regexp '^(забронирован|куплен|возвращён)$')
);

create table Serve_stat (
  ID_serve_stat INT(255) primary key not null AUTO_INCREMENT,
  Serve_name varchar(50) not null check (Serve_name regexp '^(эконом|бизнес|1-класс)$')
);

create table Plane (
  ID_plane INT(255) primary key not null AUTO_INCREMENT,
  Model_plane varchar(50) not null,
  Capacity INT(255) not null check (Capacity>=0 AND Capacity<=700),
  AirlineID_airline int(255) NOT NULL
);

create table Airport (
  ID_airport INT(255) primary key not null AUTO_INCREMENT,
  Airport_name varchar(50) not null check (Airport_name regexp '^[А-Яа-яЁёA-Za-z-]+$'),
  CityID_city  int(255) not null
);

create table Flight (
  ID_flight INT(255) primary key not null AUTO_INCREMENT,
  AirportID_airport_from int(255) NOT NULL,
  AirportID_airport_dest int(255) NOT NULL,
  PlaneID_plane  int(255) NOT NULL,
  Departure_date date not null,
  Time_the_way time not null,
  Seats_availiable int(255) null check (Seats_availiable regexp '^[0-9]+$')
);

create table Ticket (
  ID_ticket INT(255) primary key not null AUTO_INCREMENT,
  Number_place INT(255) not null check (Number_place>=1 AND Number_place<=700),
  Ticket_price INT(255) not null check (Ticket_price>0),
  ClientID_client int(255) NOT NULL,
  Serve_statID_serve_stat int(255) NOT NULL,
  StatID_Stat int(255) NOT NULL,
  FlightID_flight int(255) NOT NULL
);

ALTER TABLE Ticket ADD CONSTRAINT FKTicket981045 FOREIGN KEY (Serve_statID_serve_stat) REFERENCES Serve_stat (ID_serve_stat);
ALTER TABLE Ticket ADD CONSTRAINT FKTicket303921 FOREIGN KEY (StatID_Stat) REFERENCES Stat (ID_Stat);
ALTER TABLE Ticket ADD CONSTRAINT FKTicket523673 FOREIGN KEY (FlightID_flight) REFERENCES Flight (ID_flight);
ALTER TABLE Representative ADD CONSTRAINT FKRepresenta220324 FOREIGN KEY (AirlineID_airline) REFERENCES Airline (ID_airline);
ALTER TABLE Plane ADD CONSTRAINT FKPlane36145 FOREIGN KEY (AirlineID_airline) REFERENCES Airline (ID_airline);
ALTER TABLE Flight ADD CONSTRAINT FKFlight956185 FOREIGN KEY (PlaneID_plane) REFERENCES Plane (ID_plane);
ALTER TABLE Airport ADD CONSTRAINT FKAirport594432 FOREIGN KEY (CityID_city) REFERENCES City (ID_city);
ALTER TABLE Flight ADD CONSTRAINT FKFlight563963 FOREIGN KEY (AirportID_airport_from) REFERENCES Airport (ID_airport);
ALTER TABLE Flight ADD CONSTRAINT FKFlight563964 FOREIGN KEY (AirportID_airport_dest) REFERENCES Airport (ID_airport);
ALTER TABLE Ticket ADD CONSTRAINT FKTicket773959 FOREIGN KEY (ClientID_client) REFERENCES Client (ID_client);

-- Insert Clients (8 entries)
INSERT INTO Client (First_name, Surname, Last_name, Email, Passwords, Login) VALUES
('Андрей', 'Соколов', 'Михайлович', 'andrey.soko@mail.ru', 'Ab12_cd3', 'andrsoko'),
('Галина', 'Павлова', NULL, 'galina.pav@mail.ru', 'Qw90_asd', 'galpav'),
('Виктор', 'Родионов', 'Петрович', 'victor.rod@mail.ru', 'As_12345', 'victrod'),
('Елизавета', 'Киселёв', 'Сергеевна', 'eliz.kis@mail.ru', 'Zx_cv678', 'elzkis'),
('Даниил', 'Котов', NULL, 'dan.kot@mail.ru', 'Po_iu789', 'dankot'),
('Борис', 'Шестаков', 'Владимирович', 'boris.shes@mail.ru', 'Lk_jh654', 'borishes'),
('Жанна', 'Фролов', NULL, 'zhan.fro@mail.ru', 'Mn_bv321', 'zhanfro'),
('Иван', 'Гаврилов', 'Андреевич', 'ivan.gav@mail.ru', 'Hg_f2345', 'ivangav');

-- Insert Airlines (5 entries)
INSERT INTO Airline (Airline_name) VALUES
('SkyFly'),
('Аэровис'),
('NordStar'),
('SunWings'),
('Air Rus');

-- Insert Cities (5 entries)
INSERT INTO City (City_name) VALUES
('Москва'),
('Сочи'),
('Омск'),
('Санкт-Петербург'),
('Уфа');

-- Insert Stat (5 entries)
INSERT INTO Stat (Status_name) VALUES
('куплен'),
('забронирован'),
('возвращён');

-- Insert Serve_stat (5 entries)
INSERT INTO Serve_stat (Serve_name) VALUES
('бизнес'),
('эконом'),
('1-класс');


-- Insert Planes (25 entries)
INSERT INTO Plane (Model_plane, Capacity, AirlineID_airline) VALUES
('TU-134', 180, 1),
('Boeing 767', 300, 1),
('Airbus A320', 156, 1),
('Airbus A321', 220, 1),
('Boeing 737', 200, 1),
('Суперджет 100', 98, 2),
('Ил-96-300', 262, 2),
('Bombardier CRJ200', 50, 2),
('Airbus A220', 140, 2),
('Embraer E190', 100, 2),
('Boeing 777', 400, 3),
('Airbus A350', 315, 3),
('Мс-21', 211, 3),
('Ан-148', 80, 3),
('Ил-62М', 195, 3),
('Boeing 787', 296, 4),
('Boeing 737 MAX', 210, 4),
('Airbus A330', 277, 4),
('Ил-76', 167, 4),
('Су-100', 120, 4),
('Ту-204', 210, 5),
('Ан-124', 88, 5),
('Cessna 208', 14, 5),
('Boeing 747', 467, 5),
('Airbus A380', 700, 5);

-- Insert Airports (25 entries)
INSERT INTO Airport (Airport_name, CityID_city) VALUES
('Шереметьево', 1),
('Домодедово', 1),
('Внуково', 1),
('Жуковский', 1),
('Остафьево', 1),
('Пулково', 2),
('Ржевка', 2),
('Левашово', 2),
('Горелово', 2),
('Дергачёво', 2),
('Толмачёво', 3),
('Обь', 3),
('Ельцовка', 3),
('Бердск', 3),
('Калининский', 3),
('Кольцово', 4),
('Уктус', 4),
('Сибирский', 4),
('Артинский', 4),
('Алапаевск', 4),
('Казань', 5),
('Борисоглебское', 5),
('Северный', 5),
('Юдино', 5),
('Чистополь', 5);

-- Insert Representatives (25 entries)
INSERT INTO Representative (First_name, Surname, Last_name, Passwords, AirlineID_airline) VALUES
('Павел', 'Иванов', 'Сергеевич', 'pass111', 1),
('Ирина', 'Петрова', 'Андреевна', 'pass222', 1),
('Дмитрий', 'Сидоров', 'Владимирович', 'pass333', 1),
('Екатерина', 'Козлова', 'Михайловна', 'pass444', 1),
('Николай', 'Борисов', 'Алексеевич', 'pass555', 1),
('Ольга', 'Орлова', 'Игоревна', 'secure12', 2),
('Виктор', 'Соколов', 'Павлович', 'secure23', 2),
('Мария', 'Федорова', 'Дмитриевна', 'secure34', 2),
('Антон', 'Белый', 'Семенович', 'secure45', 2),
('Тамара', 'Морозова', 'Ильинична', 'secure56', 2),
('Петр', 'Новиков', 'Константинович', '123secur', 3),
('Анна', 'Егорова', 'Ивановна', '123lock', 3),
('Сергей', 'Васильев', 'Петрович', '123lock', 3),
('Юлия', 'Михайлова', 'Андреевна', '123pass', 3),
('Григорий', 'Романов', 'Владимирович', '1234pwd', 3),
('Татьяна', 'Морозова', 'Дмитриевна', 'mypwd67', 4),
('Михаил', 'Федоров', 'Сергеевич', 'mypwd78', 4),
('Елена', 'Григорьева', 'Александровна', 'mypwd89', 4),
('Андрей', 'Лебедев', 'Иванович', 'mypwd90', 4),
('Кирилл', 'Зайцев', 'Денисович', 'mypwd01', 4),
('Игорь', 'Волков', 'Алексеевич', 'pwd1234', 5),
('Наталья', 'Петрова', 'Олеговна', 'pwd2345', 5),
('Александр', 'Борисов', 'Константинович', 'pwd3456', 5),
('Валентина', 'Чернова', 'Дмитриевна', 'pwd4567', 5),
('Олег', 'Кравцов', 'Викторович', 'pwd5678', 5);

-- Insert Flights (25 entries)
INSERT INTO Flight (AirportID_airport_from, AirportID_airport_dest, PlaneID_plane, Departure_date, Time_the_way, Seats_availiable) VALUES
(1, 5, 3, '2024-03-10', '02:30:00', 150),
(7, 6, 3, '2024-07-11', '04:10:00', 110),
(9, 7, 3, '2024-09-25', '03:50:00', 190),
(3, 8, 3, '2024-10-05', '05:20:00', 210),
(10, 9, 3, '2025-02-19', '06:00:00', 170),
(2, 10, 13, '2025-04-06', '04:05:00', 130),
(11, 8, 13, '2024-05-09', '05:15:00', 115),
(19, 20, 13, '2024-06-30', '03:25:00', 185),
(25, 22, 13, '2025-03-05', '02:55:00', 140),
(21, 24, 13, '2024-12-16', '04:45:00', 190),
(17, 8, 13, '2025-01-28', '06:40:00', 200),
(22, 4, 13, '2024-01-20', '03:35:00', 220),
(13, 20, 4, '2025-02-18', '05:10:00', 230),
(14, 25, 4, '2024-09-10', '04:30:00', 180),
(15, 19, 4, '2025-03-22', '07:15:00', 210),
(18, 12, 4, '2025-06-09', '05:05:00', 160),
(16, 13, 11, '2025-08-13', '04:25:00', 170),
(4, 1, 11, '2025-01-27', '03:20:00', 140),
(6, 2, 11, '2024-11-29', '06:25:00', 150),
(12, 16, 11, '2024-10-21', '04:15:00', 130),
(7, 6, 11, '2025-04-10', '02:55:00', 190),
(23, 4, 4, '2025-03-12', '04:35:00', 180),
(21, 13, 4, '2025-01-28', '05:05:00', 170),
(22, 20, 4, '2024-11-18', '06:10:00', 160),
(16, 22, 4, '2024-12-20', '03:40:00', 200);

-- Insert Tickets (25 entries)
INSERT INTO Ticket (Number_place, Ticket_price, ClientID_client, Serve_statID_serve_stat, StatID_Stat, FlightID_flight) VALUES
(10, 4900, 1, 1, 1, 1),
(25, 5300, 2, 2, 2, 1),
(50, 5700, 3, 3, 3, 1),
(60, 6000, 4, 1, 1, 1),
(70, 6500, 5, 2, 2, 1),
(15, 5200, 6, 1, 3, 2),
(18, 5600, 7, 2, 1, 2),
(90, 5800, 8, 3, 1, 2),
(33, 6300, 1, 1, 2, 2),
(47, 7200, 2, 2, 2, 2),
(100,8000,3, 1, 1, 3),
(99, 8100, 4, 2, 1, 3),
(120,7500,5, 3, 3, 3),
(85, 9300, 6, 1, 2, 3),
(76, 9550, 7, 2, 2, 3),
(12, 4600, 8, 1, 1, 4),
(44, 7770, 1, 2, 2, 4),
(58, 8880, 2, 3, 1, 4),
(66, 9200, 3, 1, 2, 4),
(73, 8700, 4, 2, 3, 4),
(2,  4800, 5, 1, 1, 5),
(3,  4900, 6, 2, 2, 5),
(5,  6800, 7, 3, 3, 5),
(9,  9750, 8, 1, 1, 5),
(1,  9900, 1, 2, 2, 5);

CREATE VIEW view_tickets_by_class_and_client AS
SELECT
    t.ClientID_client AS client_id,
    t.ID_ticket as ticket_id,
    s.Serve_name AS class_name,
    COUNT(t.ID_ticket) AS ticket_count,
    SUM(t.Ticket_price) AS total_sum,
    stat.ID_Stat AS ticket_status_id,
    stat.Status_name as ticket_status
FROM
    Ticket t
JOIN
    Serve_stat s ON t.Serve_statID_serve_stat = s.ID_serve_stat
JOIN
    Flight f ON t.FlightID_flight = f.ID_flight
JOIN
    Stat stat ON t.StatID_stat = stat.ID_stat
WHERE
    f.Departure_date BETWEEN '2024-01-01' AND '2024-12-31'
GROUP BY
    t.ID_ticket,
    s.Serve_name,
    stat.ID_Stat;

-- Retrieve only reserved tickets for a specific client
SELECT *
FROM view_tickets_by_class_and_client
WHERE client_id = 1 AND ticket_status = 'Забронирован';

drop view if exists view_flights_by_city_and_airline;
CREATE VIEW view_flights_by_city_and_airline AS
SELECT
    c.City_name AS city_name,
    COUNT(f.ID_flight) AS flight_count,
    p.AirlineID_airline AS airline_id
FROM
    Flight f
JOIN
    Airport a ON f.AirportID_airport_dest = a.ID_airport
JOIN
    City c ON a.CityID_city = c.ID_city
JOIN
    Plane p ON f.PlaneID_plane = p.ID_plane
WHERE
    f.Departure_date BETWEEN '2024-01-01' AND '2025-12-31'
GROUP BY
    c.City_name, p.AirlineID_airline;

SELECT *
FROM view_flights_by_city_and_airline
WHERE airline_id = 1;


drop view if exists view_income_by_class;
CREATE VIEW view_income_by_class_and_airline AS
SELECT
    s.Serve_name AS class_name,
    SUM(t.Ticket_price) AS total_income,
    p.AirlineID_airline AS airline_id
FROM
    Ticket t
JOIN
    Serve_stat s ON t.Serve_statID_serve_stat = s.ID_serve_stat
JOIN
    Flight f ON t.FlightID_flight = f.ID_flight
JOIN
    Plane p ON f.PlaneID_plane = p.ID_plane
WHERE
    f.Departure_date BETWEEN '2024-01-01' AND '2024-12-31'
GROUP BY
    s.Serve_name, p.AirlineID_airline;


SELECT *
FROM view_income_by_class_and_airline
WHERE airline_id = 1;




CREATE VIEW view_client_flight_stats AS
SELECT
    t.ClientID_client AS client_id,
    f.ID_flight AS flight_id,
    CONCAT(a_from.Airport_name, ' - ', a_to.Airport_name) AS route,
    COUNT(t.ID_ticket) AS flight_count,
    SUM(TIME_TO_SEC(f.Time_the_way)) / 3600 AS total_hours,
    ROUND(SUM(TIME_TO_SEC(f.Time_the_way)) / 3600 / 24, 2) AS total_days
FROM
    Ticket t
JOIN
    Flight f ON t.FlightID_flight = f.ID_flight
JOIN
    Airport a_from ON f.AirportID_airport_from = a_from.ID_airport
JOIN
    Airport a_to ON f.AirportID_airport_dest = a_to.ID_airport
WHERE
    f.Departure_date BETWEEN '2024-01-01' AND '2024-12-31'
GROUP BY
    t.ClientID_client, f.ID_flight;

select * from view_client_flight_stats where client_id = 9;


CREATE VIEW view_income_by_class_for_client AS
SELECT
    t.ClientID_client as client_id,
    s.Serve_name AS class_name,
    SUM(t.Ticket_price) AS total_income
FROM
    Ticket t
JOIN
    Serve_stat s ON t.Serve_statID_serve_stat = s.ID_serve_stat
JOIN
    Flight f ON t.FlightID_flight = f.ID_flight
WHERE
    f.Departure_date BETWEEN '2024-01-01' AND '2024-12-31'
GROUP BY
    t.ClientID_client,
    s.Serve_name;


select * from Stat;

DELIMITER $$
CREATE FUNCTION book_tickets(
    p_client_id INT,
    p_flight_id INT,
    p_serve_stat_id INT,
    p_ticket_count INT
)
RETURNS VARCHAR(100)
DETERMINISTIC
MODIFIES SQL DATA
BEGIN
    DECLARE i INT DEFAULT 0;

    WHILE i < p_ticket_count DO
        INSERT INTO Ticket (Number_place, Ticket_price, ClientID_client, Serve_statID_serve_stat, StatID_Stat, FlightID_flight)
        VALUES (FLOOR(1 + RAND() * 700), 1000, p_client_id, p_serve_stat_id, 1, p_flight_id);
        SET i = i + 1;
    END WHILE;

    RETURN CONCAT(p_ticket_count, ' билетов успешно забронировано.');
END $$
DELIMITER ;

DELIMITER $$
CREATE FUNCTION add_flights(
    p_airport_from INT,
    p_airport_dest INT,
    p_plane_id INT,
    p_departure_date DATE,
    p_time_the_way TIME,
    p_flight_count INT
)
RETURNS VARCHAR(100)
DETERMINISTIC
BEGIN
    DECLARE i INT DEFAULT 0;
    WHILE i < p_flight_count DO
        INSERT INTO Flight (AirportID_airport_from, AirportID_airport_dest, PlaneID_plane, Departure_date, Time_the_way, Seats_availiable)
        VALUES (p_airport_from, p_airport_dest, p_plane_id, DATE_ADD(p_departure_date, INTERVAL i DAY), p_time_the_way, 200);

        SET i = i + 1;
    END WHILE;

    RETURN CONCAT(p_flight_count, ' рейсов успешно добавлено.');
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE add_flights_procedure(
    IN p_airport_from INT,
    IN p_airport_dest INT,
    IN p_plane_id INT,
    IN p_departure_date DATE,
    IN p_time_the_way TIME,
    IN p_flight_count INT
)
BEGIN
    DECLARE i INT DEFAULT 0;
    WHILE i < p_flight_count DO
        INSERT INTO Flight (AirportID_airport_from, AirportID_airport_dest, PlaneID_plane, Departure_date, Time_the_way, Seats_availiable)
        VALUES (p_airport_from, p_airport_dest, p_plane_id, DATE_ADD(p_departure_date, INTERVAL i DAY), p_time_the_way, 200);

        SET i = i + 1;
    END WHILE;
    SELECT CONCAT(p_flight_count, ' рейсов успешно добавлено.') AS result;
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE return_ticket_procedure(
    IN p_ticket_id INT
)
BEGIN
    IF EXISTS (SELECT 1 FROM Ticket WHERE ID_ticket = p_ticket_id AND StatID_stat <> 3) THEN
        UPDATE Ticket
        SET StatID_stat = 3
        WHERE ID_ticket = p_ticket_id;

        SELECT CONCAT('Билет с ID ', p_ticket_id, ' успешно возвращён.') AS result;
    ELSE
        SELECT CONCAT('Билет с ID ', p_ticket_id, ' не найден или уже возвращён.') AS result;
    END IF;
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE update_flight_procedure(
    IN p_flight_id INT,
    IN p_airport_from INT,
    IN p_airport_dest INT,
    IN p_plane_id INT,
    IN p_departure_date DATE,
    IN p_time_the_way TIME,
    IN p_seats_available INT
)
BEGIN
    IF EXISTS (SELECT 1 FROM Flight WHERE ID_flight = p_flight_id) THEN
        UPDATE Flight
        SET
            AirportID_airport_from = p_airport_from,
            AirportID_airport_dest = p_airport_dest,
            PlaneID_plane = p_plane_id,
            Departure_date = p_departure_date,
            Time_the_way = p_time_the_way,
            Seats_availiable = p_seats_available
        WHERE ID_flight = p_flight_id;

        SELECT CONCAT('Рейс с ID ', p_flight_id, ' успешно обновлён.') AS result;
    ELSE
        SELECT CONCAT('Рейс с ID ', p_flight_id, ' не найден.') AS result;
    END IF;
END $$
DELIMITER ;


select * from Stat;

DELIMITER $$
CREATE PROCEDURE book_tickets_procedure(
    IN p_client_id INT,
    IN p_flight_id INT,
    IN p_serve_stat_id INT,
    IN p_stat_id INT,
    IN p_ticket_count INT
)
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE max_number_place INT DEFAULT 0;

    IF EXISTS (SELECT 1 FROM Flight WHERE ID_flight = p_flight_id)
       AND EXISTS (SELECT 1 FROM Client WHERE ID_client = p_client_id) THEN

        SELECT IFNULL(MAX(Number_place), 0) INTO max_number_place
        FROM Ticket
        WHERE FlightID_flight = p_flight_id;

        WHILE i < p_ticket_count DO
            SET max_number_place = max_number_place + 1;

            INSERT INTO Ticket (Number_place, Ticket_price, ClientID_client, Serve_statID_serve_stat, StatID_stat, FlightID_flight)
            VALUES (max_number_place, 1000, p_client_id, p_serve_stat_id, p_stat_id, p_flight_id);

            SET i = i + 1;
        END WHILE;

        SELECT CONCAT(p_ticket_count, ' билетов успешно забронировано.') AS result;

    ELSE
        SELECT 'Ошибка: указанный рейс или клиент не существует.' AS result;
    END IF;

END $$
DELIMITER ;




#   ========================================

DELIMITER $$
CREATE PROCEDURE update_ticket_procedure(
    IN p_ticket_id INT,
    IN p_serve_stat_id INT,
    IN p_flight_id INT,
    IN p_ticket_price INT
)
BEGIN
    IF EXISTS (SELECT 1 FROM Ticket WHERE ID_ticket = p_ticket_id) THEN
        UPDATE Ticket
        SET
            Serve_statID_serve_stat = p_serve_stat_id,
            FlightID_flight = p_flight_id,
            Ticket_price = p_ticket_price
        WHERE ID_ticket = p_ticket_id;

        SELECT CONCAT('Ticket with ID ', p_ticket_id, ' successfully updated.') AS result;
    ELSE
        SELECT CONCAT('Ticket with ID ', p_ticket_id, ' does not exist.') AS result;
    END IF;
END $$
DELIMITER ;


CREATE VIEW view_client_flights AS
SELECT
    t.ID_ticket AS ticket_id,
    t.Number_place AS seat_number,
    t.Ticket_price AS ticket_price,
    t.ClientID_client AS client_id,
    s.Serve_name AS service_class,
    f.Departure_date AS departure_date,
    a_from.Airport_name AS departure_airport,
    a_to.Airport_name AS destination_airport,
    p.Model_plane AS plane_model,
    stat.Status_name AS ticket_status
FROM
    Ticket t
JOIN
    Serve_stat s ON t.Serve_statID_serve_stat = s.ID_serve_stat
JOIN
    Flight f ON t.FlightID_flight = f.ID_flight
JOIN
    Airport a_from ON f.AirportID_airport_from = a_from.ID_airport
JOIN
    Airport a_to ON f.AirportID_airport_dest = a_to.ID_airport
JOIN
    Plane p ON f.PlaneID_plane = p.ID_plane
JOIN
    Stat stat ON t.StatID_stat = stat.ID_stat;


DELIMITER //

CREATE PROCEDURE LoginUser(
    IN input_login VARCHAR(20),
    IN input_password VARCHAR(8),
    OUT output_client_id INT
)
BEGIN
    SELECT ID_client
    INTO output_client_id
    FROM Client
    WHERE Login = input_login AND Passwords = input_password;

    IF output_client_id IS NULL THEN
        SET output_client_id = NULL;
    END IF;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE GetAvailableFlights(
    IN from_city VARCHAR(50),
    IN to_city VARCHAR(50),
    IN departure_date DATE,
    IN seats_required INT
)
BEGIN
    SELECT
        Flight.ID_flight,
        AirportFrom.Airport_name AS FromAirport,
        AirportTo.Airport_name AS ToAirport,
        Flight.Departure_date,
        Flight.Seats_availiable,
        Plane.Model_plane
    FROM Flight
    JOIN Airport AS AirportFrom ON Flight.AirportID_airport_from = AirportFrom.ID_airport
    JOIN Airport AS AirportTo ON Flight.AirportID_airport_dest = AirportTo.ID_airport
    JOIN Plane ON Flight.PlaneID_plane = Plane.ID_plane
    WHERE
        AirportFrom.CityID_city IN (
            SELECT ID_city FROM City WHERE City_name LIKE CONCAT('%', from_city, '%')
        )
        AND (to_city IS NULL OR
            AirportTo.CityID_city IN (
                SELECT ID_city FROM City WHERE City_name LIKE CONCAT('%', to_city, '%')
            )
        )
        AND (departure_date IS NULL OR Flight.Departure_date = departure_date)
        AND (seats_required IS NULL OR Flight.Seats_availiable >= seats_required);
END //

DELIMITER ;


DELIMITER //

CREATE PROCEDURE RegisterUser(
    IN input_first_name VARCHAR(15),
    IN input_surname VARCHAR(30),
    IN input_last_name VARCHAR(20),
    IN input_email VARCHAR(50),
    IN input_login VARCHAR(20),
    IN input_password VARCHAR(8),
    OUT output_client_id INT
)
BEGIN
    DECLARE existing_user INT;

    SELECT COUNT(*) INTO existing_user
    FROM Client
    WHERE Login = input_login OR Email = input_email;

    IF existing_user > 0 THEN
        SET output_client_id = NULL;
    ELSE
        INSERT INTO Client (First_name, Surname, Last_name, Email, Login, Passwords)
        VALUES (input_first_name, input_surname, input_last_name, input_email, input_login, input_password);

        SET output_client_id = LAST_INSERT_ID();
    END IF;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE update_ticket_status(
    IN ticket_id INT,
    IN new_status_id INT
)
BEGIN
    UPDATE Ticket
    SET StatID_stat = new_status_id
    WHERE ID_ticket = ticket_id;
END //

DELIMITER ;


DELIMITER //

CREATE PROCEDURE LoginRepresentative(
    IN input_airline_id INT,
    IN input_password VARCHAR(20),
    OUT output_representative_id INT
)
BEGIN
    SELECT ID_representative
    INTO output_representative_id
    FROM Representative
    WHERE AirlineID_airline = input_airline_id AND Passwords = input_password;

    IF output_representative_id IS NULL THEN
        SET output_representative_id = -1;
    END IF;
END //

DELIMITER ;


DELIMITER //

CREATE PROCEDURE RegisterRepresentative(
    IN input_first_name VARCHAR(50),
    IN input_surname VARCHAR(50),
    IN input_last_name VARCHAR(50),
    IN input_password VARCHAR(20),
    IN input_airline_id INT,
    OUT output_representative_id INT
)
BEGIN
    DECLARE existing_representative_id INT;

    SELECT ID_representative
    INTO existing_representative_id
    FROM Representative
    WHERE AirlineID_airline = input_airline_id AND Passwords = input_password;

    IF existing_representative_id IS NULL THEN
        INSERT INTO Representative (First_name, Surname, Last_name, Passwords, AirlineID_airline)
        VALUES (input_first_name, input_surname, input_last_name, input_password, input_airline_id);

        SET output_representative_id = LAST_INSERT_ID();
    ELSE
        SET output_representative_id = -1;
    END IF;
END //

DELIMITER ;


CREATE VIEW view_airline_by_representative AS
SELECT
    r.ID_representative AS representative_id,
    a.Airline_name AS airline_name
FROM
    Representative r
JOIN
    Airline a ON r.AirlineID_airline = a.ID_airline;

SELECT *
FROM view_airline_by_representative
WHERE representative_id = 28;


select * from Airport;

select * from City;

select * from Client;

select * from Representative;

select * from Plane;

select * from Serve_stat;

select * from Ticket;
