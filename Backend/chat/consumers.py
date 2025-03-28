import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    chat_history = [] 
    async def connect(self):
        self.room_name = "general"
        self.room_group_name = f"chat_{self.room_name}"

        # Add user to the chat room
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        for msg in self.chat_history:
            await self.send(text_data=json.dumps(msg))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        """
        Handle messages from WebSocket and broadcast them to the group.
        """
        data = json.loads(text_data)
        message = data["message"]
        sender = data["sender"]
        is_staff = data["is_staff"]
        self.chat_history.append({"sender": sender, "message": message})

        if len(self.chat_history) > 10:
            self.chat_history.pop(0)

        sender_name = "Admin" if is_staff else sender

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "sender": sender_name,
            }
        )

    async def chat_message(self, event):
        """
        This method ensures the message is sent to ALL connected users.
        """
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender": event["sender"]
        }))
