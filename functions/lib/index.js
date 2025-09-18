"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextjsFunc = exports.exportMonthlyReport = exports.triggerMonthlyReport = exports.generateMonthlyReport = void 0;
const scheduler_1 = require("firebase-functions/v2/scheduler");
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();
/**
 * Scheduled function to generate monthly financial reports
 * Runs on the 1st of each month at 9:00 AM Africa/Freetown time
 */
exports.generateMonthlyReport = (0, scheduler_1.onSchedule)({
    schedule: '0 9 1 * *',
    timeZone: 'Africa/Freetown',
}, async (event) => {
    try {
        console.log('Starting monthly report generation...');
        // Get the previous month
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const reportId = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;
        // Check if report already exists
        const existingReport = await db.collection('reports').doc('monthly').collection('reports').doc(reportId).get();
        if (existingReport.exists) {
            console.log(`Report for ${reportId} already exists`);
            return;
        }
        // Query payments for the previous month
        const paymentsQuery = db.collection('payments')
            .where('createdAt', '>=', admin.firestore.Timestamp.fromDate(lastMonth))
            .where('createdAt', '<', admin.firestore.Timestamp.fromDate(thisMonth))
            .where('status', 'in', ['succeeded', 'verified']);
        const paymentsSnapshot = await paymentsQuery.get();
        let totalAmount = 0;
        const byCurrency = {};
        const byMethod = {};
        const byType = {};
        paymentsSnapshot.forEach((doc) => {
            const payment = doc.data();
            const amount = payment.amount || 0;
            const currency = payment.currency || 'USD';
            const method = payment.method || 'unknown';
            const type = payment.type || 'unknown';
            // Convert all amounts to USD for total (simplified conversion)
            let usdAmount = amount;
            if (currency === 'SLL') {
                // Approximate conversion rate (in production, use real exchange rates)
                usdAmount = amount / 20000; // 1 USD ≈ 20,000 SLL
            }
            totalAmount += usdAmount;
            byCurrency[currency] = (byCurrency[currency] || 0) + amount;
            byMethod[method] = (byMethod[method] || 0) + usdAmount;
            byType[type] = (byType[type] || 0) + usdAmount;
        });
        // Create the report
        const reportData = {
            id: reportId,
            period: {
                start: admin.firestore.Timestamp.fromDate(lastMonth),
                end: admin.firestore.Timestamp.fromDate(thisMonth),
            },
            totalAmount: Math.round(totalAmount * 100) / 100, // Round to 2 decimal places
            byCurrency,
            byMethod,
            byType,
            count: paymentsSnapshot.size,
            generatedAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        // Save the report
        await db.collection('reports').doc('monthly').collection('reports').doc(reportId).set(reportData);
        console.log(`Monthly report generated for ${reportId}:`, {
            totalAmount: reportData.totalAmount,
            count: reportData.count,
            byCurrency,
            byMethod,
            byType,
        });
        return;
    }
    catch (error) {
        console.error('Error generating monthly report:', error);
        throw error;
    }
});
/**
 * HTTP function to manually trigger monthly report generation
 * Useful for testing or generating reports for specific months
 */
exports.triggerMonthlyReport = (0, https_1.onRequest)(async (req, res) => {
    try {
        // Verify admin access (in production, add proper authentication)
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        // Check if user is admin
        if (decodedToken.role !== 'admin') {
            res.status(403).json({ error: 'Insufficient permissions' });
            return;
        }
        const { year, month } = req.body;
        if (!year || !month) {
            res.status(400).json({ error: 'Year and month are required' });
            return;
        }
        // Generate report for specified month
        const reportMonth = new Date(parseInt(year), parseInt(month) - 1, 1);
        const nextMonth = new Date(parseInt(year), parseInt(month), 1);
        const reportId = `${year}-${String(month).padStart(2, '0')}`;
        console.log(`Generating manual report for ${reportId}...`);
        // Query payments for the specified month
        const paymentsQuery = db.collection('payments')
            .where('createdAt', '>=', admin.firestore.Timestamp.fromDate(reportMonth))
            .where('createdAt', '<', admin.firestore.Timestamp.fromDate(nextMonth))
            .where('status', 'in', ['succeeded', 'verified']);
        const paymentsSnapshot = await paymentsQuery.get();
        let totalAmount = 0;
        const byCurrency = {};
        const byMethod = {};
        const byType = {};
        paymentsSnapshot.forEach((doc) => {
            const payment = doc.data();
            const amount = payment.amount || 0;
            const currency = payment.currency || 'USD';
            const method = payment.method || 'unknown';
            const type = payment.type || 'unknown';
            // Convert all amounts to USD for total
            let usdAmount = amount;
            if (currency === 'SLL') {
                usdAmount = amount / 20000;
            }
            totalAmount += usdAmount;
            byCurrency[currency] = (byCurrency[currency] || 0) + amount;
            byMethod[method] = (byMethod[method] || 0) + usdAmount;
            byType[type] = (byType[type] || 0) + usdAmount;
        });
        // Create the report
        const reportData = {
            id: reportId,
            period: {
                start: admin.firestore.Timestamp.fromDate(reportMonth),
                end: admin.firestore.Timestamp.fromDate(nextMonth),
            },
            totalAmount: Math.round(totalAmount * 100) / 100,
            byCurrency,
            byMethod,
            byType,
            count: paymentsSnapshot.size,
            generatedAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        // Save the report (overwrite if exists)
        await db.collection('reports').doc('monthly').collection('reports').doc(reportId).set(reportData);
        res.json({
            success: true,
            reportId,
            data: reportData,
        });
    }
    catch (error) {
        console.error('Error triggering monthly report:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * HTTP function to export monthly report as CSV
 */
exports.exportMonthlyReport = (0, https_1.onRequest)(async (req, res) => {
    try {
        // Verify admin access
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        if (decodedToken.role !== 'admin') {
            res.status(403).json({ error: 'Insufficient permissions' });
            return;
        }
        const reportId = req.query.reportId;
        if (!reportId) {
            res.status(400).json({ error: 'Report ID is required' });
            return;
        }
        // Get the report
        const reportDoc = await db.collection('reports').doc('monthly').collection('reports').doc(reportId).get();
        if (!reportDoc.exists) {
            res.status(404).json({ error: 'Report not found' });
            return;
        }
        const report = reportDoc.data();
        // Get detailed payments for the report period
        const paymentsQuery = db.collection('payments')
            .where('createdAt', '>=', report.period.start)
            .where('createdAt', '<', report.period.end)
            .where('status', 'in', ['succeeded', 'verified'])
            .orderBy('createdAt', 'desc');
        const paymentsSnapshot = await paymentsQuery.get();
        // Generate CSV content
        const csvHeaders = 'Date,Amount,Currency,Method,Type,Status,Reference,User ID\n';
        const csvRows = paymentsSnapshot.docs.map(doc => {
            var _a;
            const payment = doc.data();
            const date = payment.createdAt.toDate().toISOString().split('T')[0];
            const reference = ((_a = payment.refs) === null || _a === void 0 ? void 0 : _a.reference) || '';
            return [
                date,
                payment.amount,
                payment.currency,
                payment.method,
                payment.type,
                payment.status,
                reference,
                payment.uid
            ].join(',');
        }).join('\n');
        const csvContent = csvHeaders + csvRows;
        // Set response headers for CSV download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="mdpu-report-${reportId}.csv"`);
        res.send(csvContent);
    }
    catch (error) {
        console.error('Error exporting monthly report:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * Minimal Next.js API proxy to satisfy hosting rewrite.
 * You can expand this to actually proxy to your Next runtime if needed.
 */
exports.nextjsFunc = (0, https_1.onRequest)(async (req, res) => {
    res.status(200).json({ status: 'ok' });
});
//# sourceMappingURL=index.js.map