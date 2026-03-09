import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
    const db = readDB();
    return NextResponse.json(db.projects);
}

export async function POST(request) {
    try {
        const body = await request.json();

        if (!body.projectName || !body.client || !body.designPhase || !body.assignedTeam) {
            return NextResponse.json({ error: 'Missing required project fields' }, { status: 400 });
        }

        const db = readDB();

        const newProject = {
            id: uuidv4(),
            projectName: body.projectName,
            client: body.client,
            designPhase: body.designPhase,
            assignedTeam: body.assignedTeam
        };

        db.projects.push(newProject);
        const success = writeDB(db);

        if (!success) {
            return NextResponse.json({ error: 'Failed to save project' }, { status: 500 });
        }

        return NextResponse.json(newProject, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const body = await request.json();

        if (!body.id || !body.designPhase) {
            return NextResponse.json({ error: 'Project ID and new designPhase are required' }, { status: 400 });
        }

        const db = readDB();
        const projectIndex = db.projects.findIndex(p => p.id === body.id);

        if (projectIndex === -1) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // We only allow updating the phase for now
        db.projects[projectIndex].designPhase = body.designPhase;

        const success = writeDB(db);

        if (!success) {
            return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
        }

        return NextResponse.json(db.projects[projectIndex]);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        // Next.js App Router exposes searchParams on the URL
        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
        }

        const db = readDB();
        const projectExists = db.projects.some(p => p.id === id);

        if (!projectExists) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        db.projects = db.projects.filter(p => p.id !== id);

        const success = writeDB(db);

        if (!success) {
            return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
