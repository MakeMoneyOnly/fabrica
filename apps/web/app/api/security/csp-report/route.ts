import { NextRequest, NextResponse } from 'next/server';

/**
 * CSP Report Endpoint
 * Handles Content Security Policy violation reports from browsers
 * This endpoint receives and logs CSP violations for security monitoring
 */
export async function POST(request: NextRequest) {
  try {
    const report = await request.json();

    // Log essential CSP violation info (concise for production)
    const cspReport = report['csp-report'];
    if (cspReport) {
      console.log(`CSP Violation: ${cspReport['violated-directive']} blocked ${cspReport['blocked-uri']} on ${cspReport['document-uri']}`);
    } else {
      console.log('CSP Violation: Received report without csp-report data');
    }

    // In a production environment, you might want to:
    // 1. Store reports in a database for analysis
    // 2. Send alerts for critical violations
    // 3. Generate security reports

    // For now, just return a success response
    return NextResponse.json({
      status: 'received',
      message: 'CSP violation report logged successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error processing CSP report:', error);
    return NextResponse.json({
      error: 'Failed to process CSP report'
    }, { status: 500 });
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
