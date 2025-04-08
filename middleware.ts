// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const maintenanceMode = process.env.MAINTENANCE_MODE === 'true';
  const isMaintenancePage = request.nextUrl.pathname === '/maintenance';

  if (maintenanceMode && !isMaintenancePage) {
    const maintenanceUrl = request.nextUrl.clone();
    maintenanceUrl.pathname = '/maintenance';
    return NextResponse.redirect(maintenanceUrl);
  }

  return NextResponse.next();
}
