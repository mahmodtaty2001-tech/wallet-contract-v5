#!/bin/bash

# خطوات تشغيل مشروع TON Wallet V5
# Steps to run TON Wallet V5 Project

echo "======================================"
echo "🚀 TON Wallet V5 - Setup & Build 🚀"
echo "======================================"
echo ""

# الخطوة 1: تثبيت المتطلبات
echo "📦 الخطوة 1️⃣: تثبيت المتطلبات..."
echo "📦 Step 1️⃣: Installing dependencies..."
echo ""
npm install
echo "✅ تم التثبيت بنجاح!"
echo ""

# الخطوة 2: بناء المشروع
echo "🔨 الخطوة 2️⃣: بناء المشروع..."
echo "🔨 Step 2️⃣: Building project..."
echo ""
npm run build
echo "✅ تم البناء بنجاح!"
echo ""

# الخطوة 3: تشغيل الاختبارات
echo "✅ الخطوة 3️⃣: تشغيل الاختبارات..."
echo "✅ Step 3️⃣: Running tests..."
echo ""
npm run test
echo ""

echo "======================================"
echo "✅ تم الإعداد بنجاح!"
echo "✅ Setup completed successfully!"
echo "======================================"
echo ""
echo "🎯 الخطوة التالية: نشر محفظتك"
echo "🎯 Next step: Deploy your wallet"
echo ""
echo "الأوامر المتاحة:"
echo "Available commands:"
echo "  npm run deploy-wallet          - نشر محفظة جديدة"
echo "  npm run deploy-library         - نشر المكتبة"
echo "  npm run print-wallet-code      - طباعة كود المحفظة"
echo "  npm run scalpel                - تحسين الغاز"
echo ""
echo "اختر أحد الأوامر وشغله! 🚀"
echo ""