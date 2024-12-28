from typing import Optional

from pymysql import Date, Time
from pydantic import BaseModel


class TicketBookingRequest(BaseModel):
    client_id: int
    flight_id: int
    ticket_price: int
    serve_stat_id: int
    ticket_count: int


class FlightRequest(BaseModel):
    flight_id: int
    airport_from: int
    airport_dest: int
    plane_id: int
    departure_date: Date
    seats_availiable: int
    flight_count: Optional[int] = 1


class UserLogin(BaseModel):
    login: str
    password: str


class AirlineLogin(BaseModel):
    login: int
    password: str


class UserCreate(BaseModel):
    first_name: str
    surname: str
    last_name: str | None
    email: str
    login: str
    password: str


class AirlineCreate(BaseModel):
    first_name: str
    surname: str
    last_name: str | None
    password: str
    airline_id: int


class SearchFlightRequest(BaseModel):
    from_city: str
    to_city: Optional[str] = None
    departure_date: Optional[Date] = None
    seats: Optional[int] = None
