from django.urls import path

from .websocket.consumers import RoomConsumer

websocket_urlpatterns = [
    path("ws/rooms/<int:room_id>/", RoomConsumer.as_asgi()),
]