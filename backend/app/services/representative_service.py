from sqlalchemy import text
from sqlalchemy.orm import Session


def db_login_user(db: Session, login: int, password: str) -> int | None:
    db.execute(text('CALL LoginRepresentative(:airline_login, :airline_password, @airline_id)'), {
        "airline_login": login,
        "airline_password": password
    })
    result = db.execute(text('SELECT @airline_id')).fetchone()
    db.commit()

    if result and result[0]:
        return result[0]
    return None


def db_register_user(
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


def add_flights_procedure(db: Session, airport_from: int, airport_dest: int, plane_id: int, departure_date: str, time_the_way: str, flight_count: int):
    result = db.execute(
        text('CALL add_flights_procedure(:airport_from, :airport_dest, :plane_id, :departure_date, :time_the_way, :flight_count)'),
        {
            "airport_from": airport_from,
            "airport_dest": airport_dest,
            "plane_id": plane_id,
            "departure_date": departure_date,
            "time_the_way": time_the_way,
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
        'select * from Flight f join Plane p on f.PlaneID_plane = p.ID_plane where p.AirlineID_airline = :airline_id'),
        {"airline_id": airline_id}
    ).fetchall()
    return [dict(row._mapping) for row in result]


def update_flight(db: Session, flight_id: int, airport_from: int, airport_dest: int, plane_id: int, departure_date: str, time_the_way: str, seats_available: int):
    result = db.execute(
        text('CALL update_flight_procedure(:flight_id, :airport_from, :airport_dest, :plane_id, :departure_date, :time_the_way, :seats_available)'),
        {
            "flight_id": flight_id,
            "airport_from": airport_from,
            "airport_dest": airport_dest,
            "plane_id": plane_id,
            "departure_date": departure_date,
            "time_the_way": time_the_way,
            "seats_available": seats_available,
        },
    ).fetchone()
    db.commit()
    return result[0]


def delete_flight(db: Session, flight_id: int):
    db.execute(text('DELETE FROM Flight WHERE ID_flight = :flight_id'), {"flight_id": flight_id})
    db.commit()
    return {"message": f"Flight with ID {flight_id} deleted successfully"}