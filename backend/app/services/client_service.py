from typing import Optional

from sqlalchemy import text
from sqlalchemy.orm import Session


def db_login_user(db: Session, login: str, password: str) -> int | None:
    db.execute(text('CALL LoginUser(:user_login, :user_password, @client_id)'), {
        "user_login": login,
        "user_password": password
    })
    result = db.execute(text('SELECT @client_id')).fetchone()
    db.commit()

    if result and result[0]:
        return result[0]
    return None


def db_register_user(
    db: Session,
    first_name: str,
    surname: str,
    last_name: str,
    email: str,
    login: str,
    password: str
) -> int | None:
    db.execute(
        text('CALL RegisterUser(:first_name, :surname, :last_name, :email, :login, :password, @client_id)'),
        {
            "first_name": first_name,
            "surname": surname,
            "last_name": last_name,
            "email": email,
            "login": login,
            "password": password
        }
    )
    result = db.execute(text('SELECT @client_id')).fetchone()
    db.commit()

    if result and result[0]:
        return result[0]
    return None


def get_client_profile(db: Session, client_id: int):
    result = db.execute(
        text("SELECT ID_client, First_name, Surname, Last_name FROM Client WHERE ID_client = :client_id"),
        {"client_id": client_id},
    ).fetchone()

    if not result:
        return None

    return {
        "id": result.ID_client,
        "first_name": result.First_name,
        "surname": result.Surname,
        "last_name": result.Last_name
    }


def db_search_flights(db: Session,
                      from_city: str,
                      to_city: Optional[str] = None,
                      departure_date: Optional[str] = None,
                      seats: Optional[int] = None
                      ):

    result = db.execute(
        text("CALL GetAvailableFlights(:from_city, :to_city, :departure_date, :seats_required)"),
        {
            "from_city": from_city,
            "to_city": to_city,
            "departure_date": departure_date,
            "seats_required": seats,
        }
    ).fetchall()

    flights = []
    for row in result:
        flight = {
            "ID_flight": row.ID_flight,
            "FromAirport": row.FromAirport,
            "ToAirport": row.ToAirport,
            "Departure_date": str(row.Departure_date),
            "Seats_availiable": row.Seats_availiable,
            "Model_plane": row.Model_plane
        }
        flights.append(flight)

    db.commit()
    return flights


def get_client_flights(db: Session, client_id: int):
    result = db.execute(
        text('SELECT * FROM view_client_flights WHERE client_id = :client_id'),
        {"client_id": client_id},
    ).fetchall()

    status_colors = {
        "забронирован": "grey",
        "куплен": "green",
        "возвращён": "red"
    }

    flights = []
    for row in result:
        flight = dict(row._mapping)
        flight["ticket_status_color"] = status_colors.get(flight["ticket_status"], "black")
        flights.append(flight)

    return flights


def get_reserved_tickets(db: Session, client_id: int):
    result = db.execute(
        text('SELECT * FROM view_tickets_by_class_and_client WHERE client_id = :client_id AND ticket_status_id = :status'),
        {"client_id": client_id, "status": 2},
    ).fetchall()
    return [dict(row._mapping) for row in result]


def get_tickets_by_class(db: Session, client_id: int):
    result = db.execute(
        text('SELECT * FROM view_income_by_class_for_client WHERE client_id = :client_id'),
        {"client_id": client_id},
    ).fetchall()
    return [dict(row._mapping) for row in result]


def get_ticket_stats(db: Session, client_id: int):
    result = db.execute(
        text('SELECT * FROM view_client_flight_stats where client_id = :client_id'),
        {"client_id": client_id}).fetchall()
    return [dict(row._mapping) for row in result]


def return_ticket(db: Session, ticket_id: int):
    result = db.execute(
        text('CALL return_ticket_procedure(:ticket_id)'),
        {"ticket_id": ticket_id},
    ).fetchone()
    db.commit()
    return result[0]


def book_tickets(db: Session, client_id: int, flight_id: int, ticket_price: int, serve_stat_id: int, ticket_count: int):
    result = db.execute(
        text('select book_tickets(:client_id, :flight_id, :ticket_price, :serve_stat_id, :ticket_status_id, :ticket_count)'),
        {
            "client_id": client_id,
            "flight_id": flight_id,
            "ticket_price": ticket_price,
            "serve_stat_id": serve_stat_id,
            "ticket_status_id": 1,
            "ticket_count": ticket_count,
        },
    ).fetchone()
    db.commit()
    return result[0]


def update_ticket(db: Session, ticket_id: int, serve_stat_id: int, flight_id: int, ticket_price: int):
    result = db.execute(
        text('CALL update_ticket_procedure(:ticket_id, :serve_stat_id, :flight_id, :ticket_price)'),
        {
            "ticket_id": ticket_id,
            "serve_stat_id": serve_stat_id,
            "flight_id": flight_id,
            "ticket_price": ticket_price,
        },
    ).fetchone()
    db.commit()
    return {"message": result[0]}


def delete_ticket_service(db: Session, ticket_id: int):
    db.execute(text('DELETE FROM Ticket WHERE ID_ticket = :ticket_id'), {"ticket_id": ticket_id})
    db.commit()
    return {"message": f"Flight with ID {ticket_id} deleted successfull"}


def pay_for_ticket(db: Session, ticket_id: int):
    db.execute(
        text('CALL update_ticket_status(:ticket_id, :new_status_id)'),
        {"ticket_id": ticket_id, "new_status_id": 1},
    )
    db.commit()

