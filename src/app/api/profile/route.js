import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function GET() {
    const db = readDB();
    return NextResponse.json(db.profile);
}

export async function PUT(request) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.name || !body.role || !body.email) {
            return NextResponse.json({ error: 'Missing required profile fields' }, { status: 400 });
        }

        const db = readDB();

        // Update profile
        db.profile = {
            ...db.profile,
            name: body.name,
            role: body.role,
            email: body.email
        };

        const success = writeDB(db);

        if (!success) {
            return NextResponse.json({ error: 'Failed to update database' }, { status: 500 });
        }

        return NextResponse.json(db.profile);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
