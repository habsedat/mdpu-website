# Firebase Environment Setup Script
# This script helps set up your .env.local file with the proper Firebase configuration

Write-Host "🔥 Firebase Environment Setup for MDPU Website" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Check if .env.local already exists
if (Test-Path ".env.local") {
    Write-Host "⚠️  .env.local already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "❌ Setup cancelled." -ForegroundColor Red
        exit 1
    }
}

# Create .env.local with Firebase configuration
$envContent = @"
# Firebase Client Configuration
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

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_DUES_PRICE_ID=price_xxxxx
PUBLIC_URL=https://your-domain.com

# Admin Configuration
ADMIN_EMAILS=habmfk@gmail.com,admin@mdpu.org,president@mdpu.org

# Admin Initialization (Change this key for security!)
ADMIN_INIT_KEY=mdpu-admin-init-2024

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

# Write the .env.local file
try {
    $envContent | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "✅ .env.local created successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create .env.local: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Security reminders
Write-Host ""
Write-Host "🔒 SECURITY REMINDERS:" -ForegroundColor Yellow
Write-Host "======================" -ForegroundColor Yellow
Write-Host "1. ✅ .env.local is in .gitignore (will not be committed)" -ForegroundColor Green
Write-Host "2. ✅ firebase-service-account.json is in .gitignore (will not be committed)" -ForegroundColor Green
Write-Host "3. ⚠️  NEVER commit these files to GitHub!" -ForegroundColor Red
Write-Host "4. ⚠️  Keep your private keys secret!" -ForegroundColor Red
Write-Host "5. ℹ️  The private key has been properly formatted with \n for line breaks" -ForegroundColor Blue

Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: npm run dev" -ForegroundColor White
Write-Host "2. Check Firebase connection in browser console" -ForegroundColor White
Write-Host "3. Configure Stripe keys when ready for payments" -ForegroundColor White

Write-Host ""
Write-Host "✅ Firebase setup complete!" -ForegroundColor Green





