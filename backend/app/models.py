from typing import Optional

from pymysql import Date, Time
from pydantic import BaseModel


class TicketBookingRequest(BaseModel):
    client_id: int
    flight_id: int
    serve_stat_id: int
    ticket_status_id: int
    ticket_count: int


class FlightRequest(BaseModel):
    airport_from: int
    airport_dest: int
    plane_id: int
    departure_date: Date
    time_the_way: Time
    flight_count: int


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
