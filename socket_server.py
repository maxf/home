from wsgiref.simple_server import make_server

def hello_world_app(environ, start_response):
    status = '200 OK'
    headers = [('Content-type', 'text/plain')]
    start_response(status, headers)

    if environ['PATH_INFO'] == '/':
        return ['root']
    else:
        return ['no root']

httpd = make_server('', 8000, hello_world_app)
print "Serving on port 8000..."

httpd.serve_forever()
