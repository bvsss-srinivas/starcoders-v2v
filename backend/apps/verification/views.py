from rest_framework import generics, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import FileResponse
from django.shortcuts import get_object_or_404
from .models import Verification
from .serializers import (
    VerificationSubmitSerializer, 
    VerificationStatusSerializer,
    AdminVerificationListSerializer,
    AdminVerificationActionSerializer
)
from .permissions import IsAdminOrVerifier
from .services import submit_verification, approve_verification, reject_verification

class VerificationSubmitView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = VerificationSubmitSerializer(data=request.data)
        if serializer.is_valid():
            try:
                verification = submit_verification(
                    user=request.user,
                    id_type=serializer.validated_data['id_type'],
                    id_number_masked=serializer.validated_data['id_number_masked'],
                    document_file=serializer.validated_data['document_file']
                )
                return Response(VerificationStatusSerializer(verification).data, status=status.HTTP_201_CREATED)
            except ValueError as e:
                return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerificationStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if hasattr(request.user, 'verification'):
            serializer = VerificationStatusSerializer(request.user.verification)
            return Response(serializer.data)
        return Response({"status": "unverified", "has_document": False}, status=status.HTTP_200_OK)

class AdminVerificationListView(generics.ListAPIView):
    permission_classes = [IsAdminOrVerifier]
    serializer_class = AdminVerificationListSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['user__email', 'user__first_name', 'user__last_name']
    ordering_fields = ['submitted_at', 'status']
    ordering = ['-submitted_at']

    def get_queryset(self):
        queryset = Verification.objects.select_related('user').all()
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset

class AdminVerificationApproveView(APIView):
    permission_classes = [IsAdminOrVerifier]

    def post(self, request, pk):
        verification = get_object_or_404(Verification, pk=pk)
        approve_verification(verification, request.user)
        return Response({"detail": "Verification approved."}, status=status.HTTP_200_OK)

class AdminVerificationRejectView(APIView):
    permission_classes = [IsAdminOrVerifier]

    def post(self, request, pk):
        serializer = AdminVerificationActionSerializer(data=request.data)
        if serializer.is_valid():
            reason = serializer.validated_data.get('reason')
            if not reason:
                return Response({"detail": "Rejection reason is required."}, status=status.HTTP_400_BAD_REQUEST)
            verification = get_object_or_404(Verification, pk=pk)
            reject_verification(verification, request.user, reason)
            return Response({"detail": "Verification rejected."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminVerificationDocumentView(APIView):
    permission_classes = [IsAdminOrVerifier]

    def get(self, request, pk):
        verification = get_object_or_404(Verification, pk=pk)
        if not verification.document_file:
            return Response({"detail": "No document found."}, status=status.HTTP_404_NOT_FOUND)
            
        file_handle = verification.document_file.open('rb')
        response = FileResponse(file_handle, content_type='application/octet-stream')
        response['Content-Disposition'] = f'attachment; filename="{verification.document_file.name.split("/")[-1]}"'
        return response
