require('dotenv').config();
const { connectDB, sequelize } = require('./config/db');
const { User, Article } = require('./models');

const seedData = async () => {
    try {
        await connectDB();
        
        console.log('Clearing existing data...');
        // Force sync will drop tables and recreate them
        await sequelize.sync({ force: true });

        console.log('Creating Admin Account...');
        const adminEmail = 'admin@psrengg.edu.in';
        const adminUser = await User.create({
            name: 'PSR Admin',
            email: adminEmail,
            password: 'admin123',
            profile_id: 'PSR_ADMIN_01',
            department: 'Administration',
            role: 'admin'
        });

        console.log('Seeding PSR Engineering College Articles...');
        const articles = [
            // Placements
            {
                title: 'Top MNCs Recruits 50+ Students from PSR Engineering College',
                content: 'PSR Engineering College continues its streak of excellence in placements. Over 50 students from the 2026 batch have been placed in top-tier multinational companies with lucrative packages. The training and placement cell expressed their pride in the students\' achievements.',
                category: 'placements',
                authorId: adminUser.id,
                views: 1250,
                image_url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800'
            },
            {
                title: 'Placement Drive by Zoho: 15 Students Selected from Final Year',
                content: 'The recent recruitment drive by Zoho Corporation at PSR Engineering College saw a massive turnout. After multiple rounds of rigorous testing and interviews, 15 talented students from the CSE and IT departments were selected for roles in software development.',
                category: 'placements',
                authorId: adminUser.id,
                views: 980,
                image_url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800'
            },
            // Events
            {
                title: 'Annual Cultural Fest "SPARK 2026" Kickstarts at PSR Campus',
                content: 'The campus is buzzing with energy as PSR\'s annual cultural extravaganza, SPARK 2026, officially begins today. The event features music, dance, theatre, and the much-awaited celebrity guest performance on the final day.',
                category: 'events',
                authorId: adminUser.id,
                views: 3200,
                image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800'
            },
            {
                title: 'International Conference on Sustainable Energy Hosted by PSR',
                content: 'PSR Engineering College recently hosted a three-day International Conference on Sustainable Energy and Environment. Experts from across the globe shared their insights on the latest trends in renewable energy and green technologies.',
                category: 'events',
                authorId: adminUser.id,
                views: 850,
                image_url: 'https://images.unsplash.com/photo-1475721027187-402ad2989a3b?auto=format&fit=crop&q=80&w=800'
            },
            // Departments
            {
                title: 'CSE Department Inaugurates Advanced AI & Robotics Lab',
                content: 'To foster innovation in cutting-edge technologies, the Department of Computer Science and Engineering at PSR has inaugurated a state-of-the-art AI & Robotics Lab, equipped with the latest hardware and simulation tools.',
                category: 'departments',
                authorId: adminUser.id,
                views: 1420,
                image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800'
            },
            {
                title: 'Mechanical Engineering Department Wins National Level Baja Competition',
                content: 'The student team from the Mechanical Engineering department at PSR Engineering College brought home the trophy at the National Level Baja Competition held in Indore, showcasing their exceptional design and engineering skills.',
                category: 'departments',
                authorId: adminUser.id,
                views: 740,
                image_url: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=800'
            },
            // Exams
            {
                title: 'Semester Examination Schedule Released for April/May 2026',
                content: 'The Controller of Examinations at PSR Engineering College has officially released the schedule for the upcoming even-semester examinations. Students are advised to download the timetable from the official student portal.',
                category: 'exams',
                authorId: adminUser.id,
                views: 5600,
                image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800'
            },
            {
                title: 'Special Guidance Session for GATE Aspirants Conducted at PSR',
                content: 'PSR Engineering College organized a comprehensive guidance session for students appearing for GATE 2027. Experienced faculty members provided valuable tips on time management, subject focus, and preparation strategies.',
                category: 'exams',
                authorId: adminUser.id,
                views: 1100,
                image_url: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=800'
            },
            // Sports
            {
                title: 'PSR Engineering College Wins Zonal Cricket Championship',
                content: 'Continuing their dominance in sports, the PSR cricket team emerged victorious in the TNEB Zonal Cricket Championship. The team beat their rivals in a nail-biting final match held at the PSR Sports Complex.',
                category: 'sports',
                authorId: adminUser.id,
                views: 2100,
                image_url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800'
            },
            {
                title: 'PSR Annual Sports Meet: Winners Awarded by Chief Guest',
                content: 'The PSR Annual Sports Meet concluded with a grand prize distribution ceremony. The Chief Guest, a former Olympian, praised the athletes for their sportsmanship and dedication to maintaining physical fitness.',
                category: 'sports',
                authorId: adminUser.id,
                views: 1340,
                image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800'
            },
            // Technology
            {
                title: 'PSR Students Develop Smart Irrigation System using IoT',
                content: 'Final year students from the ECE and IT departments of PSR Engineering College have developed a low-cost Smart Irrigation System that uses sensors and IoT to optimize water usage in agricultural fields.',
                category: 'technology',
                authorId: adminUser.id,
                views: 1890,
                image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800'
            },
            {
                title: 'Workshop on Blockchain Technology and Web3.0 Organised for IT Students',
                content: 'The Information Technology department at PSR Engineering College organized a workshop on Blockchain and Web3.0. The session provided hands-on training on developing decentralized applications (DApps) and smart contracts.',
                category: 'technology',
                authorId: adminUser.id,
                views: 1200,
                image_url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800'
            }
        ];

        await Article.bulkCreate(articles);

        console.log('Setup Complete! 12 PSR Engineering College articles and admin user created.');
        process.exit();
    } catch (error) {
        console.error('Error with import:', error);
        process.exit(1);
    }
}

seedData();

