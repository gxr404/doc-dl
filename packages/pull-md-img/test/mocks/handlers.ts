import { http, delay, HttpResponse } from 'msw'

export const handlers = [
  http.get('https://localhost/jpgContentType', () => {
    return new HttpResponse('jpg Data', {
      status: 200,
      headers: {
        'Content-Type': 'image/jpg'
      }
    })
  }),
  http.get('https://localhost/normal.png', () => {
    return new HttpResponse('png Data', {
      status: 200,
      headers: {
        'Content-Type': ''
      }
    })
  }),
  http.get('https://localhost/contentTypeXML', () => {
    return new HttpResponse('png Data', {
      status: 200,
      headers: {
        'Content-Type': 'text/xml'
      }
    })
  }),
  http.get('https://localhost/prioritizeContentType.awebp', () => {
    return new HttpResponse('awebp Data', {
      status: 200,
      headers: {
        'Content-Type': 'image/webp'
      }
    })
  }),
  http.get('https://localhost/referer', ({ request }) => {
    return new HttpResponse(request.headers.get('referer'), {
      status: 200,
      headers: {
        'Content-Type': 'text/plain'
      }
    })
  }),
  http.get(`https://localhost/longName_${'1'.repeat(280)}`, ({ request }) => {
    return new HttpResponse('', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain'
      }
    })
  }),
  http.get(`https://localhost/404`, ({ request }) => {
    return new HttpResponse('', {
      status: 404
    })
  })
]
