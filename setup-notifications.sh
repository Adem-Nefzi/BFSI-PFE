#!/bin/bash
# 🔔 Notification System Setup Script
# Run this script to set up the notification system in your project

set -e

echo "🔔 Starting Notification System Setup..."
echo ""

# Step 1: Create Prisma migration
echo "📋 Step 1: Creating Prisma migration..."
echo "Running: npx prisma migrate dev --name add_notifications"
npx prisma migrate dev --name add_notifications

# Step 2: Generate Prisma client
echo ""
echo "🔄 Step 2: Generating Prisma Client..."
echo "Running: npx prisma generate"
npx prisma generate

# Step 3: Verify installation
echo ""
echo "✅ Step 3: Verifying installation..."

# Check if migration was successful
if npm ls @prisma/client > /dev/null 2>&1; then
  echo "✅ Prisma Client found"
else
  echo "❌ Prisma Client not found, installing..."
  npm install @prisma/client
fi

# Step 4: Build TypeScript
echo ""
echo "🔨 Step 4: Building TypeScript..."
npm run build

# Step 5: Success message
echo ""
echo "✅ Notification System Setup Complete!"
echo ""
echo "📚 Next Steps:"
echo "1. Review NOTIFICATION_SYSTEM_SETUP.md for detailed documentation"
echo "2. Check that the NotificationBar component appears in your dashboard"
echo "3. Test the notification system by:"
echo "   - Uploading a contract (should see success notification)"
echo "   - Analyzing a contract (should see processing then success/error notification)"
echo "   - Checking the notification bar for deadline alerts"
echo ""
echo "🚀 The notification system is now active!"
