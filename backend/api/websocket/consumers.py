import json
from channels.generic.websocket import AsyncWebsocketConsumer

class RoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'room_{self.room_id}'

        # Join the room's multicast group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave the room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receives messages from the client (Tab -> Server)
    async def receive(self, text_data):
        data = json.loads(text_data)
        event_type = data.get("event")

        # Broadcast events directly to the group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "room_event",
                "message": data
            }
        )

    # Receives broadcast events from the group channel layer (Server -> Tabs)
    async def room_event(self, event):
        await self.send(text_data=json.dumps(event["message"]))