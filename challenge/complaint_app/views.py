from rest_framework import viewsets
from .models import UserProfile, Complaint
from .serializers import UserSerializer, UserProfileSerializer, ComplaintSerializer
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count
# Create your views here.

class ComplaintViewSet(viewsets.ModelViewSet):
  http_method_names = ['get']
  serializer_class = ComplaintSerializer
  def list(self, request):
    # Get all complaints from the user's district
    user_profile = UserProfile.objects.get(user=request.user)
    user_district = user_profile.formatted_district
    complaints = Complaint.objects.filter(account=f"NYCC{user_district}")
    serializer = ComplaintSerializer(complaints, many=True)

    return Response({"complaints": serializer.data, "user": UserProfileSerializer(user_profile).data})

class OpenCasesViewSet(viewsets.ModelViewSet):
  http_method_names = ['get']
  def list(self, request):
    # Get only the open complaints from the user's district
    user_profile = UserProfile.objects.get(user=request.user)
    user_district = user_profile.formatted_district
    open_cases = Complaint.objects.filter(account=f"NYCC{user_district}", closedate__isnull=True)
    serializer = ComplaintSerializer(open_cases, many=True)
  
    return Response(serializer.data)

class ClosedCasesViewSet(viewsets.ModelViewSet):
  http_method_names = ['get'] 
  def list(self, request):
    # Get only complaints that are close from the user's district
    user_profile = UserProfile.objects.get(user=request.user)
    user_district = user_profile.formatted_district
    closed_cases = Complaint.objects.filter(account=f"NYCC{user_district}", closedate__isnull=False)
    serializer = ComplaintSerializer(closed_cases, many=True)

    return Response(serializer.data)
    
class TopComplaintTypeViewSet(viewsets.ModelViewSet):
  http_method_names = ['get']
  def list(self, request):
    # Get the top 3 complaint types from the user's district
    user_profile = UserProfile.objects.get(user=request.user)
    user_district = user_profile.formatted_district
    top_3_complaint_types = Complaint.objects.filter(account=f"NYCC{user_district}").values('complaint_type').annotate(count=Count('complaint_type')).order_by('-count')[:3]
            
    return Response(top_3_complaint_types)

class ConstituentsComplaintsViewSet(viewsets.ModelViewSet):
  http_method_names = ['get']
  def list(self, request):
    # Get all complaints that were made by constituents that live in the logged in council member’s district
    user_profile = UserProfile.objects.get(user=request.user)
    user_district = user_profile.formatted_district
    const_complaints = Complaint.objects.filter(council_dist=f"NYCC{user_district}")
    serializer = ComplaintSerializer(const_complaints, many=True)
  
    return Response(serializer.data)