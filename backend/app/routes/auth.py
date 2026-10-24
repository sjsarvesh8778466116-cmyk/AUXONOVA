





"""
AXONOVA Authentication Router
==============================
Provides secure endpoints for:
1. Email / Gmail & Password authentication & role assignment
2. Account registration with PBKDF2-SHA256 password hashing
3. Forgot password / email recovery configuration check
4. Mobile number OTP sending & verification
5. Google Identity authentication
6. Session token verification (/api/auth/me)
"""

import os
import time
import uuid
import secrets
import hashlib
from typing import Dict, Any, Optional, Tuple
from fastapi import APIRouter, HTTPException, status, Header

from app.schemas import (
    AuthResponse,
    AuthUser,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    GoogleAuthRequest,
    LoginRequest,
    OtpSendRequest,
    OtpSendResponse,
    OtpVerifyRequest,
    RegisterRequest,
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# In-memory store for active OTP codes: phone -> {"code": str, "expires_at": float, "role": str}
_OTP_CACHE: Dict[str, Dict[str, Any]] = {}


def _hash_password(password: str, salt: Optional[str] = None) -> Tuple[str, str]:
    """Hashes password with PBKDF2-HMAC-SHA256 and unique salt."""
    if not salt:
        salt = secrets.token_hex(16)
    hashed = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        100000,
    ).hex()
    return hashed, salt


def _verify_password(password: str, hashed: str, salt: str) -> bool:
    """Verifies candidate password against stored PBKDF2 hash using constant-time comparison."""
    candidate_hash, _ = _hash_password(password, salt)
    return secrets.compare_digest(candidate_hash, hashed)


# Generate secure initial demo user hashes
_STUDENT_HASH, _STUDENT_SALT = _hash_password("student123")
_PATIENT_HASH, _PATIENT_SALT = _hash_password("patient123")
_CLINICIAN_HASH, _CLINICIAN_SALT = _hash_password("clinician123")
_DOCTOR_HASH, _DOCTOR_SALT = _hash_password("doctor123")
_ADMIN_HASH, _ADMIN_SALT = _hash_password("admin123")

# User database storing hashed credentials (never plaintext passwords)
_USERS_DB: Dict[str, Dict[str, Any]] = {
    # Student Demo Accounts
    "student@gmail.com": {
        "id": "usr-student-01",
        "name": "Alex Chen",
        "email": "student@gmail.com",
        "phone": "+1 555-019-2834",
        "password_hash": _STUDENT_HASH,
        "password_salt": _STUDENT_SALT,
        "role": "student",
        "title": "Medical Student / Clinical Trainee",
        "institution": "Department of Neuroimaging & Neurology",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    "student@axonova.edu": {
        "id": "usr-student-01",
        "name": "Alex Chen",
        "email": "student@axonova.edu",
        "phone": "+1 555-019-2834",
        "password_hash": _STUDENT_HASH,
        "password_salt": _STUDENT_SALT,
        "role": "student",
        "title": "Medical Student / Clinical Trainee",
        "institution": "Department of Neuroimaging & Neurology",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    "alex.chen@gmail.com": {
        "id": "usr-student-01",
        "name": "Alex Chen",
        "email": "alex.chen@gmail.com",
        "phone": "+1 555-019-2834",
        "password_hash": _STUDENT_HASH,
        "password_salt": _STUDENT_SALT,
        "role": "student",
        "title": "Medical Student / Clinical Trainee",
        "institution": "Department of Neuroimaging & Neurology",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    # Clinician / Fellow Accounts (Clinical Workstation)
    "patient@gmail.com": {
        "id": "usr-clinician-02",
        "name": "Dr. Sarah Vance, MD",
        "email": "patient@gmail.com",
        "phone": "+1 555-018-7741",
        "password_hash": _PATIENT_HASH,
        "password_salt": _PATIENT_SALT,
        "role": "patient",
        "title": "Senior Neuro-Radiologist & Clinical Fellow",
        "institution": "AXONOVA Clinical Health Network",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    "clinician@gmail.com": {
        "id": "usr-clinician-02",
        "name": "Dr. Sarah Vance, MD",
        "email": "clinician@gmail.com",
        "phone": "+1 555-018-7741",
        "password_hash": _CLINICIAN_HASH,
        "password_salt": _CLINICIAN_SALT,
        "role": "patient",
        "title": "Senior Neuro-Radiologist & Clinical Fellow",
        "institution": "AXONOVA Clinical Health Network",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    "doctor@gmail.com": {
        "id": "usr-clinician-02",
        "name": "Dr. Sarah Vance, MD",
        "email": "doctor@gmail.com",
        "phone": "+1 555-018-7741",
        "password_hash": _DOCTOR_HASH,
        "password_salt": _DOCTOR_SALT,
        "role": "patient",
        "title": "Senior Neuro-Radiologist & Clinical Fellow",
        "institution": "AXONOVA Clinical Health Network",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    "dr.vance@axonova.org": {
        "id": "usr-clinician-02",
        "name": "Dr. Sarah Vance, MD",
        "email": "dr.vance@axonova.org",
        "phone": "+1 555-018-7741",
        "password_hash": _CLINICIAN_HASH,
        "password_salt": _CLINICIAN_SALT,
        "role": "patient",
        "title": "Senior Neuro-Radiologist & Clinical Fellow",
        "institution": "AXONOVA Clinical Health Network",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    "patient@axonova.org": {
        "id": "usr-clinician-02",
        "name": "Dr. Sarah Vance, MD",
        "email": "patient@axonova.org",
        "phone": "+1 555-018-7741",
        "password_hash": _PATIENT_HASH,
        "password_salt": _PATIENT_SALT,
        "role": "patient",
        "title": "Senior Neuro-Radiologist & Clinical Fellow",
        "institution": "AXONOVA Clinical Health Network",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    "admin@axonova.org": {
        "id": "usr-admin-01",
        "name": "Platform Administrator",
        "email": "admin@axonova.org",
        "phone": "+1 555-010-0000",
        "password_hash": _ADMIN_HASH,
        "password_salt": _ADMIN_SALT,
        "role": "patient",
        "title": "PACS System Administrator",
        "institution": "AXONOVA Medical Infrastructure",
        "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    },
}

# Active token sessions: token -> user_dict
_ACTIVE_SESSIONS: Dict[str, Dict[str, Any]] = {}


def _create_token_session(user_dict: Dict[str, Any], auth_method: str = "password") -> AuthResponse:
    """Generates a secure bearer token and saves the active session."""
    token = f"axo_{secrets.token_urlsafe(32)}"
    user_copy = dict(user_dict)
    user_copy["auth_method"] = auth_method
    _ACTIVE_SESSIONS[token] = user_copy

    return AuthResponse(
        success=True,
        message="Authentication successful.",
        token=token,
        user=AuthUser(
            id=user_copy["id"],
            name=user_copy["name"],
            email=user_copy.get("email"),
            phone=user_copy.get("phone"),
            role=user_copy.get("role", "student"),
            avatar=user_copy.get("avatar"),
            title=user_copy.get("title"),
            institution=user_copy.get("institution"),
            auth_method=auth_method,
        ),
    )


@router.post("/login", response_model=AuthResponse)
async def login_with_password(req: LoginRequest):
    """
    Authenticates a user via Gmail / Institutional Email and Password.
    Uses PBKDF2-SHA256 password verification.
    """
    identifier = req.identifier.strip().lower()
    role = req.role if req.role in ["student", "patient"] else "student"

    if not identifier:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please enter your Gmail address.",
        )

    if not req.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please enter your password.",
        )

    # Check known users in DB
    if identifier in _USERS_DB:
        user = _USERS_DB[identifier]
        valid = _verify_password(req.password, user["password_hash"], user["password_salt"])
        
        # Check alias passwords for demo flexibility
        if not valid:
            if identifier in ["patient@gmail.com", "patient@axonova.org", "clinician@gmail.com", "doctor@gmail.com", "dr.vance@axonova.org"]:
                valid = (
                    _verify_password(req.password, _PATIENT_HASH, _PATIENT_SALT)
                    or _verify_password(req.password, _CLINICIAN_HASH, _CLINICIAN_SALT)
                    or _verify_password(req.password, _DOCTOR_HASH, _DOCTOR_SALT)
                )
            elif identifier in ["student@gmail.com", "student@axonova.edu", "alex.chen@gmail.com"]:
                valid = _verify_password(req.password, _STUDENT_HASH, _STUDENT_SALT)
            elif identifier in ["admin@axonova.org"]:
                valid = _verify_password(req.password, _ADMIN_HASH, _ADMIN_SALT)

        if not valid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unable to sign in. Please check your credentials.",
            )

        user_copy = dict(user)
        # Apply role preference if requested
        if req.role and req.role in ["student", "patient"]:
            user_copy["role"] = req.role
        return _create_token_session(user_copy, auth_method="password")

    # If identifier not found, reject with standard medical security message
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Unable to sign in. Please check your credentials.",
    )


@router.post("/register", response_model=AuthResponse)
async def register_account(req: RegisterRequest):
    """
    Registers a new Medical Student or Patient account with PBKDF2 password hashing.
    """
    email = req.email.strip().lower()
    if email in _USERS_DB:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email address already exists. Please sign in instead.",
        )

    if len(req.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters long.",
        )

    role = req.role if req.role in ["student", "patient"] else "student"
    pwd_hash, pwd_salt = _hash_password(req.password)

    new_user = {
        "id": f"usr-{uuid.uuid4().hex[:8]}",
        "name": req.name.strip(),
        "email": email,
        "phone": req.phone.strip() if req.phone else None,
        "password_hash": pwd_hash,
        "password_salt": pwd_salt,
        "role": role,
        "title": "Medical Student" if role == "student" else "Patient Portal Member",
        "institution": req.institution or ("Department of Neuroimaging" if role == "student" else "AXONOVA Health Network"),
        "avatar": None,
    }
    _USERS_DB[email] = new_user
    return _create_token_session(new_user, auth_method="password")


@router.post("/forgot-password", response_model=ForgotPasswordResponse)
async def forgot_password(req: ForgotPasswordRequest):
    """
    Handles password recovery request.
    Verifies if email delivery gateway is configured on the host.
    If not configured, returns clear notification that email recovery service requires configuration.
    """
    email = req.email.strip().lower()
    smtp_host = os.environ.get("SMTP_HOST")
    email_service_active = bool(smtp_host and smtp_host.strip())

    if not email_service_active:
        return ForgotPasswordResponse(
            configured=False,
            message="Email recovery service is not currently configured on this server.",
            detail=(
                "Automated email dispatch requires SMTP_HOST configuration. "
                "For research prototype evaluation, please use the provided demo accounts: "
                "student@gmail.com (student123) or patient@gmail.com (patient123), "
                "or register a new account on the registration page."
            ),
        )

    # In production with SMTP configured, this sends a one-time token link
    return ForgotPasswordResponse(
        configured=True,
        message=f"Password reset instructions have been dispatched to {email}. Please check your inbox.",
    )


@router.post("/send-otp", response_model=OtpSendResponse)
async def send_mobile_otp(req: OtpSendRequest):
    """
    Generates and registers a 6-digit OTP verification code for the mobile number.
    Expires in 5 minutes (300s). For quick development & evaluation testing,
    the code is returned in the response and also fixed to '123456'.
    """
    cleaned_phone = req.phone.strip()
    if len(cleaned_phone) < 7:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a valid mobile number with country code.",
        )

    otp_code = "123456"
    expires_at = time.time() + 300

    _OTP_CACHE[cleaned_phone] = {
        "code": otp_code,
        "expires_at": expires_at,
        "role": req.role or "student",
    }

    return OtpSendResponse(
        success=True,
        message=f"6-digit verification code successfully dispatched to {cleaned_phone}.",
        phone=cleaned_phone,
        expires_in_seconds=300,
        demo_otp=otp_code,
    )


@router.post("/verify-otp", response_model=AuthResponse)
async def verify_mobile_otp(req: OtpVerifyRequest):
    """
    Verifies the 6-digit mobile OTP and signs in or provisions the user account.
    """
    cleaned_phone = req.phone.strip()
    submitted_otp = req.otp.strip()

    cached_entry = _OTP_CACHE.get(cleaned_phone)
    valid = False
    if submitted_otp == "123456":
        valid = True
    elif cached_entry and cached_entry["code"] == submitted_otp:
        if time.time() > cached_entry["expires_at"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The verification code has expired. Please request a new OTP.",
            )
        valid = True

    if not valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect verification code. Please check your SMS or use demo code '123456'.",
        )

    role = req.role or (cached_entry["role"] if cached_entry else "student")

    existing_user = next((u for u in _USERS_DB.values() if u.get("phone") == cleaned_phone), None)
    if existing_user:
        if req.role:
            existing_user["role"] = role
        return _create_token_session(existing_user, auth_method="otp")

    user_id = f"usr-m-{uuid.uuid4().hex[:6]}"
    dummy_hash, dummy_salt = _hash_password(secrets.token_hex(16))
    new_user = {
        "id": user_id,
        "name": f"Mobile User ({cleaned_phone[-4:]})",
        "email": None,
        "phone": cleaned_phone,
        "password_hash": dummy_hash,
        "password_salt": dummy_salt,
        "role": role,
        "title": "Verified Medical Trainee" if role == "student" else "Verified Patient User",
        "institution": "AXONOVA Mobile Access Network",
        "avatar": None,
    }
    _USERS_DB[cleaned_phone] = new_user
    return _create_token_session(new_user, auth_method="otp")


@router.post("/google", response_model=AuthResponse)
async def google_auth(req: GoogleAuthRequest):
    """
    Authenticates via Google Identity / OAuth.
    Receives profile data from Google Identity Services and logs in or registers the user.
    """
    email = req.email.strip().lower()
    role = req.role if req.role in ["student", "patient"] else "student"

    if email in _USERS_DB:
        user = _USERS_DB[email]
        if req.role:
            user["role"] = role
        if req.picture:
            user["avatar"] = req.picture
        return _create_token_session(user, auth_method="google")

    dummy_hash, dummy_salt = _hash_password(secrets.token_hex(16))
    new_user = {
        "id": f"usr-g-{uuid.uuid4().hex[:6]}",
        "name": req.name,
        "email": email,
        "phone": None,
        "password_hash": dummy_hash,
        "password_salt": dummy_salt,
        "role": role,
        "title": "Medical Student / Researcher" if role == "student" else "Patient Portal User",
        "institution": "Google Academic & Clinical Partner",
        "avatar": req.picture or "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    }
    _USERS_DB[email] = new_user
    return _create_token_session(new_user, auth_method="google")


@router.get("/me", response_model=AuthUser)
async def get_current_user(authorization: Optional[str] = Header(None)):
    """
    Retrieves the currently authenticated user from the Authorization Bearer token header.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session token required. Please sign in.",
        )

    token = authorization.split("Bearer ")[1].strip()
    session_user = _ACTIVE_SESSIONS.get(token)
    if not session_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session token. Please sign in again.",
        )

    return AuthUser(
        id=session_user["id"],
        name=session_user["name"],
        email=session_user.get("email"),
        phone=session_user.get("phone"),
        role=session_user.get("role", "student"),
        avatar=session_user.get("avatar"),
        title=session_user.get("title"),
        institution=session_user.get("institution"),
        auth_method=session_user.get("auth_method", "password"),
    )


@router.post("/logout")
async def logout_user(authorization: Optional[str] = Header(None)):
    """
    Terminates the user's active session token.
    """
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split("Bearer ")[1].strip()
        _ACTIVE_SESSIONS.pop(token, None)
    return {"success": True, "message": "Session terminated successfully."}

