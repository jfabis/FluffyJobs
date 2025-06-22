import requests
from typing import Optional, Dict, Any
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class GoogleOAuthService:
    def __init__(self):
        self.client_id = settings.GOOGLE_CLIENT_ID
        self.client_secret = settings.GOOGLE_CLIENT_SECRET
        
    def get_user_info(self, access_token: str) -> Optional[Dict[str, Any]]:
        """Pobiera informacje o użytkowniku z Google API"""
        try:
            headers = {"Authorization": f"Bearer {access_token}"}
            response = requests.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                return response.json()
            logger.error(f"Google API error: {response.status_code}")
            return None
        except Exception as e:
            logger.error(f"Error getting user info: {e}")
            return None
    
    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Weryfikuje token Google"""
        try:
            response = requests.get(
                f"https://www.googleapis.com/oauth2/v1/tokeninfo?access_token={token}",
                timeout=10
            )
            
            if response.status_code == 200:
                token_info = response.json()
                if token_info.get("audience") == self.client_id:
                    return token_info
            return None
        except Exception as e:
            logger.error(f"Token verification error: {e}")
            return None
