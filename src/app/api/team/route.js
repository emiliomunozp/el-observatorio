import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
    const db = readDB();
    return NextResponse.json(db.team);
}

export async function POST(request) {
    try {
        const body = await request.json();

        if (!body.name || !body.role || !body.department || !body.email) {
            return NextResponse.json({ error: 'Missing required team member fields' }, { status: 400 });
        }

        const db = readDB();

        const newMember = {
            id: uuidv4(),
            name: body.name,
            role: body.role, // 'Junta Directiva', 'Mentores (Profesores UCM)', 'Alumni'
            department: body.department,
            email: body.email
        };

        db.team.push(newMember);
        const success = writeDB(db);

        if (!success) {
            return NextResponse.json({ error: 'Failed to save team member' }, { status: 500 });
        }

        return NextResponse.json(newMember, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Member ID is required' }, { status: 400 });
        }

        const db = readDB();
        const memberExists = db.team.some(m => m.id === id);

        if (!memberExists) {
            return NextResponse.json({ error: 'Member not found' }, { status: 404 });
        }

        db.team = db.team.filter(m => m.id !== id);
        const success = writeDB(db);

        if (!success) {
            return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
