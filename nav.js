/**
 * Common Navigation Logic for NewsKrish
 * Handles:
 * 1. Fetching user status from /api/auth/me
 * 2. Updating Nav Buttons (Login -> Profile/Logout)
 * 3. Adding Admin link if applicable
 * 4. Theme Toggling (if present)
 */

async function initNav() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
            const user = await res.json();
            updateNavForUser(navLinks, user);
        } else {
            updateNavForGuest(navLinks);
        }
    } catch (err) {
        // Quietly fail for guest view
        updateNavForGuest(navLinks);
    }

    setupThemeToggle();
}

function setupThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;

    const icon = themeBtn.querySelector('i');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (icon) icon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';

    themeBtn.onclick = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        if (icon) icon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        
        // Add a small rotation effect
        icon.style.transform = 'rotate(180deg)';
        setTimeout(() => icon.style.transform = 'rotate(0deg)', 300);
    };
}

function updateNavForUser(container, user) {
    let html = `<a href="index.html" class="nav-item">News Hub</a>`;
    
    if (user.role === 'admin') {
        html += `<a href="admin.html" class="nav-item" style="color: var(--primary); font-weight: bold;"><i class="fas fa-shield-alt"></i> Dashboard</a>`;
    }

    html += `
        <a href="profile.html" class="nav-item">Bookmarks</a>
        <a href="profile.html" class="nav-item">Profile</a>
        <a href="#" id="nav-logout" class="nav-item btn-logout" style="color: var(--accent);"><i class="fas fa-sign-out-alt"></i></a>
        <button id="theme-toggle" style="background:none; border:none; cursor:pointer; font-size: 1.2rem; display: flex; align-items: center; color: var(--text-main);">
            <i class="fas fa-moon" style="transition: transform 0.3s ease;"></i>
        </button>
    `;

    container.innerHTML = html;

    const logoutBtn = document.getElementById('nav-logout');
    if (logoutBtn) {
        logoutBtn.onclick = async (e) => {
            e.preventDefault();
            logoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = 'index.html';
        };
    }
}

function updateNavForGuest(container) {
    container.innerHTML = `
        <a href="index.html" class="nav-item">Explore news</a>
        <a href="auth.html" class="btn-primary" style="padding: 0.6rem 1.4rem; font-size: 0.9rem; border-radius: 50px;"> <i class="fas fa-user-circle"></i> Connect</a>
        <button id="theme-toggle" style="background:none; border:none; cursor:pointer; font-size: 1.2rem; display: flex; align-items: center; color: var(--text-main);">
            <i class="fas fa-moon" style="transition: transform 0.3s ease;"></i>
        </button>
    `;
}

document.addEventListener('DOMContentLoaded', initNav);
