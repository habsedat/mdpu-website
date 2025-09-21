# MDPU Website - Environment Setup Script
# This script creates the .env.local file with your Firebase configuration

Write-Host "🔥 Setting up Firebase environment for MDPU Website..." -ForegroundColor Green

$envContent = @"
# Firebase Client Configuration (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAIolW8yCebj0GjWfEf_SOAFATnv3f4BA8
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mdpu-website.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mdpu-website
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mdpu-website.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=776606667203
NEXT_PUBLIC_FIREBASE_APP_ID=1:776606667203:web:66332e3afc0861efe52d76
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-6TTWLCDLC8

# Firebase Admin Configuration (Server-side)
FIREBASE_PROJECT_ID=mdpu-website
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@mdpu-website.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDoTVX3WjEzdlXi\nBOKxIRpd58/YKhP8aT2TBKjHFSd/s8RZ0LFLM8r1KwY1E4/ZLkdU6H7Re2p2oCJJ\nJlpkBPUUYKG5/qT2qOMgVoliKAN1FR4KjvlirOIAX/b8zLWJRBpmLFqAURW+PlN4\n18ffBhk4dtkbN33bLCMXjI/HN9a6M3w/kEZxCOk5jxeO5tXcZDO1Hx3Z3vN5gEjQ\nPSmjoZjaXcC4ZKvSo1Cevq1lKvcN5DV+nFHNrv0FDdv3p4oCi67bz0lO1agTd9GG\nl8BFumRnk32nhARcSHSNrDFNjF1M08NG3HbfRmZrLf+dgC6pbR6NbT1mF1sHc8Ul\nsYYKa4+nAgMBAAECggEADnlvH1Pv1+CKNmSOiXHiFjLQ+QuaJjKagxQZvhnb1bGq\nTNxbh6+I+GC/aMQ4xNQE3s4DxOK3Pf/5UuyAWlYSvTvOJ+wtdC8Ow9+QfNy4Zm2z\n6v2AnXzfMh3IonTQ5OYo7O/bjb4/qBRzGAb97bAQFzwUiAUbovHrl9aKyON6Tiyz\npzi4njq00igOWxDqzewGSV8LSUr2idSUbVM/I2arkW1xocvbxFR8NhX/MoTPp+Kt\nT6jytDhJNojZf3vAS86NIvAuDQZ2EXiGwannE3ozCKix8qAMMTz/sucF1Wfk9qB7\nUtUeN+Neqw8rtKAt6MMJzuGe6gbAkpxeLqZMglQ1GQKBgQD/pronDvP2pxQ4tdb4\nL6T6r2sioIyPR0VDPWCzIXHsaK73HNNDDIwOyhmOUPzk9nb5lHy1ROSx5xJ+jD6R\nU+igKt6Gf1QSBSjbs4Q3LUjOT+hwiI6AC97zkAy5C6Vy2kh2TpPyV2L/GkcBQGzP\nhax0H7vuvfUBYpvpp18ZqMMu2QKBgQDonnSFss7S+/9GF8R8266guGJI4JkWIItQ\nLqtoxRcBqrMkDmNDth6/BU/P5hHpTGlNsqAbGPsaUruTD/2QTCiP5g0xMna0DtXb\nk4dXu8zNLPgHjXvwQCnAMJO7T23V8i/mWxakwPaVZgoVinCndTEhK77skSW6stvB\n2gJbSkKifwKBgQD10jLDJdyuOl/2W9tWEDIaHpzs0eX2S3itPBKEjE9IHCzJTn1R\nxnnSKsDCGNvjqZ4jRIVZo+InsmIVLvNmuIFBqZcJStvi6/UqtIYYrEGKqEmAE766\nHzAFkWi6chlnw77Ti6E08JQvaewGpxU5wnZdvrntydgRuejjll2aha0QmQKBgBLi\nCgNwaGmoGyjNdR3Nl3dkgFX6JXMuYSC5KSDwHtX7zV737AbrGcPX4oq12m5dzY6J\nGYYZmQih/qgJfEPiasiDnD6KIiirq6CPcUUl8ZIWPGwgiBcQnlMDnnpuEDR13H2O\nl1/4agvmpJrrCgoN8VcH/g+mGLH3Iu+xis9uT8pxAoGBALDCka0yllrJYpOSt3Eg\nSE174hNW6+p4C5CRMeYONHUgbp4hPz7eSIHeEX9yH8PoegzQ74H7uP4WR3wlrpvY\nxegUR1KQpx93LFYqNViPxB1B7o/jLfi1LNVRp/YE359IJQVY/7KrsBdVrMHZCOk5\n/NgsJ2/c5vZcNwLe+sbrhxBy\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=mdpu-website.firebasestorage.app

# Admin Configuration
ADMIN_EMAILS=habmfk@gmail.com,admin@mdpu.org,president@mdpu.org
ADMIN_INIT_KEY=mdpu-admin-init-2024

# Stripe Configuration - FOR LATER
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_DUES_PRICE_ID=price_xxxxx
PUBLIC_URL=https://your-domain.com

# Optional: Orange Money API (Sierra Leone)
ORANGE_API_KEY=your_orange_api_key
ORANGE_MERCHANT_ID=your_orange_merchant_id
ORANGE_TOKEN_URL=https://api.orange.com/oauth/v3/token
ORANGE_PAYMENT_URL=https://api.orange.com/orange-money-webpay/dev/v1

# Optional: AfriMoney API (Sierra Leone)
AFRIMONEY_API_KEY=your_afrimoney_api_key
AFRIMONEY_MERCHANT_ID=your_afrimoney_merchant_id
AFRIMONEY_BASE_URL=https://api.africell.sl/afrimoney
"@

try {
    Set-Content -Path ".env.local" -Value $envContent -Encoding UTF8
    Write-Host "✅ .env.local file created successfully!" -ForegroundColor Green
    Write-Host "📍 Location: $(Get-Location)\.env.local" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🔑 Firebase Configuration:" -ForegroundColor Cyan
    Write-Host "   ✅ Client-side keys configured" -ForegroundColor Green
    Write-Host "   ✅ Admin SDK keys configured" -ForegroundColor Green
    Write-Host "   ✅ habmfk@gmail.com set as admin" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Next Steps:" -ForegroundColor Cyan
    Write-Host "   1. Run: npm run dev" -ForegroundColor Yellow
    Write-Host "   2. Test Firebase connection" -ForegroundColor Yellow
    Write-Host "   3. Initialize admin user" -ForegroundColor Yellow
    Write-Host "   4. Access /admin dashboard" -ForegroundColor Yellow
} catch {
    Write-Host "❌ Error creating .env.local: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please create the file manually with the content above." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔒 Security Note: .env.local is gitignored - your keys are safe!" -ForegroundColor Green







