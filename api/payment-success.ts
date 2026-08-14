import { setCorsHeaders } from './_utils';

export default async function handler(req: any, res: any) {
  setCorsHeaders(req, res);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
      <head>
        <meta charset="utf-8">
        <title>تم الدفع بنجاح</title>
      </head>
      <body>
        <script>
          if (window.parent) {
            window.parent.postMessage({ type: 'PAYMENT_SUCCESS' }, '*');
          }
          window.location.href = '/thankyou?payment_return=true';
        </script>
        <p>جاري إعادة توجيهك للمتجر...</p>
      </body>
    </html>
  `);
}
