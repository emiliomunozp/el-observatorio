import axios from 'axios';

const api = axios.create({
    headers: {
        'Content-Type': 'application/json'
    }
});

// ==========================================
// PROFILE API
// ==========================================
export const fetchProfile = async () => {
    const res = await api.get('/api/profile');
    return res.data;
};

export const updateProfile = async (profileData) => {
    const res = await api.put('/api/profile', profileData);
    return res.data;
};

// ==========================================
// PROJECTS API
// ==========================================
export const fetchProjects = async () => {
    const res = await api.get('/api/projects');
    return res.data;
};

export const createProject = async (projectData) => {
    const res = await api.post('/api/projects', projectData);
    return res.data;
};

export const updateProjectPhase = async (id, designPhase) => {
    const res = await api.put('/api/projects', { id, designPhase });
    return res.data;
};

export const deleteProject = async (id) => {
    const res = await api.delete(`/api/projects?id=${id}`);
    return res.data;
};

// ==========================================
// TEAM API
// ==========================================
export const fetchTeam = async () => {
    const res = await api.get('/api/team');
    return res.data;
};

export const createTeamMember = async (memberData) => {
    const res = await api.post('/api/team', memberData);
    return res.data;
};

export const deleteTeamMember = async (id) => {
    const res = await api.delete(`/api/team?id=${id}`);
    return res.data;
};

// ==========================================
// RESOURCES API
// ==========================================
export const fetchResources = async () => {
    const res = await api.get('/api/resources');
    return res.data;
};
