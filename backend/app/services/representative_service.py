from pymysql import Date
from sqlalchemy import text
from sqlalchemy.engine import row
from sqlalchemy.orm import Session


def db_login_represent(db: Session, login: int, password: str) -> int | None:
    db.execute(text('CALL LoginRepresentative(:airline_login, :airline_password, @airline_id)'), {
        "airline_login": login,
        "airline_password": password
    })
    result = db.execute(text('SELECT @airline_id')).fetchone()
    db.commit()

    if result and result[0]:
        return result[0]
    return None


def db_register_represent(
        db: Session,
        first_name: str,
        surname: str,
        last_name: str,
        password: str,
        airline_id: int,
) -> int | None:
    db.execute(
        text('CALL RegisterRepresentative(:first_name, :surname, :last_name, :password, :airline_id, @represent_id)'),
        {
            "first_name": first_name,
            "surname": surname,
            "last_name": last_name,
            "password": password,
            "airline_id": airline_id
        }
    )
    result = db.execute(text('SELECT @represent_id')).fetchone()
    db.commit()

    if result and result[0]:
        return result[0]
    return None


def add_flights_procedure(db: Session, flight_id: int, airport_from: int, airport_dest: int, plane_id: int,
                          departure_date: Date, seats_availiable: int, flight_count: int):
    result = db.execute(
        text(
            'CALL add_flights_procedure(:airport_from, :airport_dest, :plane_id, :departure_date, :seats_availiable, :flight_count)'),
        {
            "airport_from": airport_from,
            "airport_dest": airport_dest,
            "plane_id": plane_id,
            "departure_date": departure_date,
            "seats_availiable": seats_availiable,
            "flight_count": flight_count,
        },
    ).fetchone()
    db.commit()
    return result[0]


def get_flights_by_city(airline_id: int, db: Session):
    result = db.execute(text(
        'SELECT * FROM view_flights_by_city_and_airline WHERE airline_id = :airline_id;'),
        {"airline_id": airline_id}
    ).fetchall()
    return [dict(row._mapping) for row in result]


def view_all_flights_by_airline_id(airline_id: int, db: Session):
    result = db.execute(text(
        'select * from AirlineFlightsWithCities where AirlineID_airline = :airline_id;'),
        {"airline_id": airline_id}
    ).fetchall()
    return [dict(row._mapping) for row in result]


def update_flight(db: Session, flight_id: int, airport_from: int, airport_dest: int, plane_id: int,
                  departure_date: Date, seats_availiable: int, flight_count: int):
    result = db.execute(
        text(
            'CALL update_flight_procedure(:flight_id, :airport_from, :airport_dest, :plane_id, :departure_date, :seats_available)'),
        {
            "flight_id": flight_id,
            "airport_from": airport_from,
            "airport_dest": airport_dest,
            "plane_id": plane_id,
            "seats_available": seats_availiable,
            "departure_date": departure_date
        },
    ).fetchone()
    db.commit()
    return result[0]


def get_airports(db: Session):
    result = db.execute(text("CALL GetAirports()")).fetchall()
    return [{"id": row[0], "name": row[1]} for row in result]


def get_planes(airline_id: int, db: Session):
    result = db.execute(text("CALL GetPlanes(:airline_id)"), {"airline_id": airline_id}).fetchall()
    return [{"id": row[0], "name": row[1], "capacity": row[2]} for row in result]


def get_cities(db: Session):
    result = db.execute(text("SELECT * FROM City")).fetchall()
    return [{"id": row[0], "name": row[1]} for row in result]


def add_plane_db(db: Session, name: str, capacity: int, airline_id: int):
    new_id = db.execute(text("SELECT MAX(ID_plane) + 2 AS new_id FROM Plane")).fetchone()[0]
    if new_id is None:
        new_id = 1

    db.execute(text(
        "INSERT INTO Plane (ID_plane, Model_plane, Capacity, AirlineID_airline) VALUES (:id, :name, :capacity, :airline_id)"),
               {"id": new_id, "name": name, "capacity": capacity, "airline_id": airline_id})
    db.commit()
    return {"message": f"Самолет с ID {new_id} успешно добавлен."}


def delete_plane_db(db: Session, plane_id: int):
    plane_exists = db.execute(
        text("SELECT ID_plane FROM Plane WHERE ID_plane = :plane_id"),
        {"plane_id": plane_id}
    ).fetchone()

    if not plane_exists:
        return {"error": f"Самолет с ID {plane_id} не найден."}

    db.execute(
        text("DELETE FROM Plane WHERE ID_plane = :plane_id"),
        {"plane_id": plane_id}
    )
    db.commit()
    return {"message": f"Самолет с ID {plane_id} успешно удален."}


def delete_airport_db(db: Session, airport_id: int):
    plane_exists = db.execute(
        text("SELECT ID_airport FROM Airport WHERE ID_airport = :airport_id"),
        {"airport_id": airport_id}
    ).fetchone()

    if not plane_exists:
        return {"error": f"Аэропорт с ID {airport_id} не найден."}

    db.execute(
        text("call CascadeDeleteAirport(:airport_id)"),
        {"airport_id": airport_id}
    )
    db.commit()
    return {"message": f"Аэропорт с ID {airport_id} успешно удален."}


def add_airport_db(db: Session, name: str, city_id: int):
    new_id = db.execute(text("SELECT MAX(ID_airport) + 1 AS new_id FROM Airport")).fetchone()[0]
    if new_id is None:
        new_id = 1

    db.execute(
        text("INSERT INTO Airport (ID_airport, Airport_name, CityID_city) VALUES (:id, :name, :city_id)"),
        {"id": new_id, "name": name, "city_id": city_id}
    )
    db.commit()
    return {"message": f"Аэропорт с ID {new_id} успешно добавлен."}


def get_ticket_stats(db: Session, airline_id: int):
    res = db.execute(text("select * from TicketCountStatistics where TicketCountStatistics.airline_id = :airline_id"),
                       {"airline_id": airline_id}, ).fetchall()
    return [{"flight_id": row[0], "departure_date": row[1], "purchased_tickets": row[2]} for row in res]


def get_revenue_stats(db: Session, airline_id: int):
    res = db.execute(text("select * from RevenueStatisticsByClass where RevenueStatisticsByClass.airline_id = :airline_id"),
                     {"airline_id": airline_id}).fetchall()
    return [{"serve_class": row[0], "total_revenue": row[1], "start_date": row[2], "end_date": row[3]} for row in res]


def delete_flight(db: Session, flight_id: int):
    db.execute(text('call CascadeDeleteFlight(:flight_id)'), {"flight_id": flight_id})
    db.commit()
    return {"message": f"Flight with ID {flight_id} deleted successfully"}


def get_all_airlines(db: Session):
    res = db.execute(text("select * from aviasales_db.Airline")).fetchall()
    return [{"id": row[0], "name": row[1]} for row in res]

