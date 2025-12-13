import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = __dirname;
const PROJECTS_FILE = join(DATA_DIR, 'projects.json');
const TESTIMONIALS_FILE = join(DATA_DIR, 'testimonials.json');
const USERS_FILE = join(DATA_DIR, 'users.json');

// Initialize data files if they don't exist
const initializeDataFiles = () => {
  if (!existsSync(PROJECTS_FILE)) {
    const defaultProjects = [
      {
        id: uuidv4(),
        title: 'E-Commerce Platform',
        subtitle: 'Full Stack Web Application',
        description: 'A modern e-commerce platform built with React and Node.js featuring real-time inventory management, secure payments, and responsive design.',
        tech: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Socket.io'],
        year: '2024',
        featured: true,
        thumbnailUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        title: 'Task Management App',
        subtitle: 'Productivity Tool',
        description: 'A collaborative task management application with drag-and-drop functionality, real-time updates, and team collaboration features.',
        tech: ['React', 'Firebase', 'Material-UI', 'TypeScript'],
        year: '2024',
        featured: false,
        thumbnailUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    writeFileSync(PROJECTS_FILE, JSON.stringify(defaultProjects, null, 2));
  }

  if (!existsSync(TESTIMONIALS_FILE)) {
    const defaultTestimonials = [
      {
        id: uuidv4(),
        name: 'Sarah Johnson',
        position: 'CEO',
        company: 'TechStart Inc.',
        message: 'Outstanding work! The project was delivered on time and exceeded all our expectations. The attention to detail and technical expertise shown throughout the development process was remarkable.',
        rating: 5,
        featured: true,
        avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b587?w=150',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Michael Chen',
        position: 'Product Manager',
        company: 'InnovateLab',
        message: 'Professional, efficient, and creative. The final product perfectly aligned with our vision and business goals. Highly recommended for any development project.',
        rating: 5,
        featured: true,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    writeFileSync(TESTIMONIALS_FILE, JSON.stringify(defaultTestimonials, null, 2));
  }

  if (!existsSync(USERS_FILE)) {
    const defaultUsers = [
      {
        id: uuidv4(),
        username: 'admin',
        email: 'admin@portfolio.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Lw5C5T4Y1G0A3K5ZS', // 'admin123'
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
  }
};

// Data access methods
class DataStore {
  static readData(filename) {
    try {
      const data = readFileSync(filename, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${filename}:`, error.message);
      return [];
    }
  }

  static writeData(filename, data) {
    try {
      writeFileSync(filename, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Error writing ${filename}:`, error.message);
      return false;
    }
  }

  // Projects
  static getProjects() {
    return this.readData(PROJECTS_FILE);
  }

  static saveProjects(projects) {
    return this.writeData(PROJECTS_FILE, projects);
  }

  static getProjectById(id) {
    const projects = this.getProjects();
    return projects.find(project => project.id === id);
  }

  static addProject(project) {
    const projects = this.getProjects();
    const newProject = {
      id: uuidv4(),
      ...project,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    projects.push(newProject);
    this.saveProjects(projects);
    return newProject;
  }

  static updateProject(id, updates) {
    const projects = this.getProjects();
    const index = projects.findIndex(project => project.id === id);
    
    if (index !== -1) {
      projects[index] = {
        ...projects[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveProjects(projects);
      return projects[index];
    }
    return null;
  }

  static deleteProject(id) {
    const projects = this.getProjects();
    const filteredProjects = projects.filter(project => project.id !== id);
    
    if (filteredProjects.length !== projects.length) {
      this.saveProjects(filteredProjects);
      return true;
    }
    return false;
  }

  // Testimonials
  static getTestimonials() {
    return this.readData(TESTIMONIALS_FILE);
  }

  static saveTestimonials(testimonials) {
    return this.writeData(TESTIMONIALS_FILE, testimonials);
  }

  static getTestimonialById(id) {
    const testimonials = this.getTestimonials();
    return testimonials.find(testimonial => testimonial.id === id);
  }

  static addTestimonial(testimonial) {
    const testimonials = this.getTestimonials();
    const newTestimonial = {
      id: uuidv4(),
      ...testimonial,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    testimonials.push(newTestimonial);
    this.saveTestimonials(testimonials);
    return newTestimonial;
  }

  static updateTestimonial(id, updates) {
    const testimonials = this.getTestimonials();
    const index = testimonials.findIndex(testimonial => testimonial.id === id);
    
    if (index !== -1) {
      testimonials[index] = {
        ...testimonials[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveTestimonials(testimonials);
      return testimonials[index];
    }
    return null;
  }

  static deleteTestimonial(id) {
    const testimonials = this.getTestimonials();
    const filteredTestimonials = testimonials.filter(testimonial => testimonial.id !== id);
    
    if (filteredTestimonials.length !== testimonials.length) {
      this.saveTestimonials(filteredTestimonials);
      return true;
    }
    return false;
  }

  // Users
  static getUsers() {
    return this.readData(USERS_FILE);
  }

  static saveUsers(users) {
    return this.writeData(USERS_FILE, users);
  }

  static getUserByEmail(email) {
    const users = this.getUsers();
    return users.find(user => user.email === email);
  }

  static getUserById(id) {
    const users = this.getUsers();
    return users.find(user => user.id === id);
  }

  static addUser(user) {
    const users = this.getUsers();
    const newUser = {
      id: uuidv4(),
      ...user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }
}

// Initialize data files on module load
initializeDataFiles();

export default DataStore;
