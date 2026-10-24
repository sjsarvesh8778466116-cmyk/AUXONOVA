"""
Tests for AXONOVA Authentication Endpoints
==========================================
Verifies:
1. PBKDF2 hashed password login for student and patient roles
2. Mobile OTP dispatch and verification
3. Google Identity authentication
4. New user registration with password hashing
5. Forgot password / email service configuration checking
6. Protected /me endpoint with Bearer token
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_login_demo_student():
    payload = {
        "identifier": "student@gmail.com",
        "password": "student123",
        "role": "student"
    }
    res = client.post("/api/auth/login", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "token" in data
    assert data["user"]["role"] == "student"
    assert data["user"]["name"] == "Alex Chen"

def test_login_demo_patient():
    payload = {
        "identifier": "patient@gmail.com",
        "password": "patient123",
        "role": "patient"
    }
    res = client.post("/api/auth/login", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["user"]["role"] == "patient"
    assert data["user"]["name"] == "Dr. Sarah Vance, MD"

def test_login_invalid_password():
    payload = {
        "identifier": "student@gmail.com",
        "password": "wrong_password_999",
        "role": "student"
    }
    res = client.post("/api/auth/login", json=payload)
    assert res.status_code == 401
    assert "Unable to sign in. Please check your credentials." in res.json()["detail"]

def test_forgot_password_unconfigured():
    res = client.post("/api/auth/forgot-password", json={"email": "student@gmail.com"})
    assert res.status_code == 200
    data = res.json()
    assert "configured" in data
    assert "detail" in data
    assert "Email recovery service is not currently configured" in data["message"]

def test_send_and_verify_otp():
    phone = "+1 555-234-5678"
    
    # 1. Send OTP
    send_res = client.post("/api/auth/send-otp", json={"phone": phone, "role": "student"})
    assert send_res.status_code == 200
    send_data = send_res.json()
    assert send_data["success"] is True
    assert send_data["demo_otp"] == "123456"

    # 2. Verify with valid OTP
    verify_res = client.post("/api/auth/verify-otp", json={"phone": phone, "otp": "123456", "role": "student"})
    assert verify_res.status_code == 200
    verify_data = verify_res.json()
    assert verify_data["success"] is True
    assert "token" in verify_data
    assert verify_data["user"]["phone"] == phone
    assert verify_data["user"]["auth_method"] == "otp"

def test_verify_otp_invalid():
    res = client.post("/api/auth/verify-otp", json={"phone": "+1 555-999-0000", "otp": "000000"})
    assert res.status_code == 400

def test_google_auth():
    payload = {
        "email": "dr.elena.rostova@gmail.com",
        "name": "Dr. Elena Rostova",
        "picture": "https://images.unsplash.com/photo-1594824813511-2095f9226cb9?w=150",
        "role": "student"
    }
    res = client.post("/api/auth/google", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["user"]["email"] == "dr.elena.rostova@gmail.com"
    assert data["user"]["name"] == "Dr. Elena Rostova"
    assert data["user"]["auth_method"] == "google"

def test_register_account():
    payload = {
        "name": "Marcus Chen",
        "email": "marcus.chen@gmail.com",
        "password": "securePassword456",
        "role": "student",
        "institution": "Institute of Neural Engineering"
    }
    res = client.post("/api/auth/register", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["user"]["name"] == "Marcus Chen"

def test_me_endpoint():
    # Login first
    login_res = client.post("/api/auth/login", json={"identifier": "student@gmail.com", "password": "student123"})
    token = login_res.json()["token"]

    # Call /me with Bearer token
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    user = me_res.json()
    assert user["email"] == "student@gmail.com"
    assert user["name"] == "Alex Chen"
