from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        status = self.request.query_params.get('status')
        if status:
            qs = qs.filter(status=status)
        return qs

    @action(detail=False, methods=['get'])
    def board(self, request):
        data = {
            'todo': TaskSerializer(Task.objects.filter(status='todo'), many=True).data,
            'doing': TaskSerializer(Task.objects.filter(status='doing'), many=True).data,
            'done': TaskSerializer(Task.objects.filter(status='done'), many=True).data,
        }
        return Response(data)
