class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        print(f"=== MIDDLEWARE DEBUG ===")
        print(f"Request method: {request.method}")
        print(f"Request path: {request.path}")
        print(f"Request content type: {request.content_type}")
        print(f"Request headers: {dict(request.headers)}")
        
        response = self.get_response(request)
        
        print(f"Response status: {response.status_code}")
        print(f"=== MIDDLEWARE END ===")
        
        return response
