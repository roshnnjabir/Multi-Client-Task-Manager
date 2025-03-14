from rest_framework import serializers
from .models import Task, User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','name', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance  = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status']
        extra_kwargs = {
            'title': {'required': True},
            'description': {'required': True},
            'status': {'required': True}
        }