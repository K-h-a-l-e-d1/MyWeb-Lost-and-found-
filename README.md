<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Digital Complaint & Maintenance System</title>
    <link rel="icon" type="image/png" href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjNDA0MDQwIi8+CjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjYiIGhlaWdodD0iMzIiIHJ4PSIzIiBmaWxsPSIjQjk3RkZGIi8+Cjx0ZXh0IHg9IjI4IiB5PSIyNCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSJ3aGl0ZSI+RElHSVRBTCBNQUlOVEVOQU5DRTwvdGV4dD4KPHRleHQgeD0iMjgiIHk9IjM0IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iOCIgZmlsbD0iIzk5OTk5OSI+WU9VUiBWT0lDRSwgT1VSIEFDVElPTjwvdGV4dD4KPHRleHQgeD0iMjgiIHk9IjQ0IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IndoaXRlIj5TWVNURU08L3RleHQ+Cjwvc3ZnPgo=">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }

        /* Header */
        .header {
            text-align: center;
            margin-bottom: 3rem;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }



        .header h1 {
            font-size: 3rem;
            font-weight: 700;
            color: white;
            margin-bottom: 0.5rem;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .header p {
            font-size: 1.2rem;
            color: rgba(255, 255, 255, 0.9);
            max-width: 800px;
            margin: 0 auto;
            line-height: 1.8;
        }

        /* Main Content */
        .content {
            background: white;
            border-radius: 20px;
            padding: 3rem;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
            margin-bottom: 2rem;
        }

        /* Table of Contents */
        .toc {
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            border-radius: 15px;
            padding: 2rem;
            margin-bottom: 3rem;
            border-left: 5px solid #667eea;
        }

        .toc h2 {
            color: #495057;
            margin-bottom: 1rem;
            font-size: 1.5rem;
        }

        .toc ol {
            list-style: none;
            counter-reset: toc-counter;
        }

        .toc li {
            counter-increment: toc-counter;
            margin-bottom: 0.5rem;
            padding-left: 2rem;
            position: relative;
        }

        .toc li::before {
            content: counter(toc-counter);
            position: absolute;
            left: 0;
            top: 0;
            background: #667eea;
            color: white;
            width: 25px;
            height: 25px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            font-weight: 600;
        }

        .toc a {
            color: #495057;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
        }

        .toc a:hover {
            color: #667eea;
        }

        /* Section Styling */
        .section {
            margin-bottom: 3rem;
            scroll-margin-top: 2rem;
        }

        .section h2 {
            font-size: 2rem;
            color: #2c3e50;
            margin-bottom: 1.5rem;
            position: relative;
            padding-bottom: 0.5rem;
        }

        .section h2::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 50px;
            height: 3px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            border-radius: 2px;
        }

        /* Feature Cards */
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }

        .feature-card {
            background: linear-gradient(135deg, #ffffff, #f8f9fa);
            border-radius: 15px;
            padding: 2rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .feature-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(45deg, #667eea, #764ba2);
        }

        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .feature-card h3 {
            color: #2c3e50;
            margin-bottom: 1rem;
            font-size: 1.3rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .feature-card i {
            color: #667eea;
            font-size: 1.5rem;
        }

        .feature-card ul {
            list-style: none;
        }

        .feature-card li {
            padding: 0.5rem 0;
            position: relative;
            padding-left: 1.5rem;
        }

        .feature-card li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #28a745;
            font-weight: bold;
        }

        /* Technology Stack */
        .tech-stack {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }

        .tech-category {
            background: linear-gradient(135deg, #f8f9fa, #ffffff);
            border-radius: 15px;
            padding: 1.5rem;
            border-left: 4px solid #667eea;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .tech-category h4 {
            color: #495057;
            margin-bottom: 1rem;
            font-size: 1.1rem;
            font-weight: 600;
        }

        .tech-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        .tech-tag {
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 500;
        }

        /* Code Block */
        .code-block {
            background: #1e1e1e;
            border-radius: 10px;
            padding: 1.5rem;
            margin: 1rem 0;
            overflow-x: auto;
            position: relative;
        }

        .code-block::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 30px;
            background: #2d2d2d;
            border-radius: 10px 10px 0 0;
        }

        .code-block::after {
            content: '⚫ ⚫ ⚫';
            position: absolute;
            top: 8px;
            left: 15px;
            color: #666;
            font-size: 8px;
            letter-spacing: 3px;
        }

        .code-block pre {
            margin-top: 20px;
            color: #f8f8f2;
            font-family: 'Consolas', monospace;
            line-height: 1.5;
        }

        /* Setup Steps */
        .setup-steps {
            margin-top: 2rem;
        }

        .setup-step {
            background: linear-gradient(135deg, #ffffff, #f8f9fa);
            border-radius: 15px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            border-left: 4px solid #28a745;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
            position: relative;
        }

        .setup-step h4 {
            color: #2c3e50;
            margin-bottom: 0.8rem;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .step-number {
            background: #28a745;
            color: white;
            width: 25px;
            height: 25px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            font-weight: 600;
        }

        /* Usage Section */
        .usage-list {
            list-style: none;
            margin-top: 1rem;
        }

        .usage-list li {
            background: linear-gradient(135deg, #e8f5e8, #f0f8f0);
            border-radius: 10px;
            padding: 1rem 1.5rem;
            margin-bottom: 0.8rem;
            border-left: 4px solid #28a745;
            position: relative;
        }

        .usage-list li::before {
            content: '👤';
            margin-right: 0.5rem;
        }

        /* Contributors Section */
        .contributors {
            background: linear-gradient(135deg, #f8f9ff, #ffffff);
            border-radius: 15px;
            padding: 2rem;
            border: 2px solid #e9ecef;
            margin-top: 2rem;
        }

        .contributor {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
            padding: 1rem;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .contributor-avatar {
            width: 50px;
            height: 50px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.2rem;
            font-weight: 600;
        }

        /* Call to Action */
        .cta {
            text-align: center;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border-radius: 20px;
            padding: 3rem 2rem;
            margin-top: 3rem;
        }

        .cta h3 {
            font-size: 1.8rem;
            margin-bottom: 1rem;
        }

        .cta-button {
            display: inline-block;
            background: white;
            color: #667eea;
            padding: 1rem 2rem;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            margin-top: 1rem;
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        /* Animations */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .section {
            animation: fadeInUp 0.6s ease forwards;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }

            .header {
                padding: 1.5rem;
            }

            .header h1 {
                font-size: 2rem;
            }

            .header p {
                font-size: 1rem;
            }

            .content {
                padding: 2rem 1.5rem;
            }

            .features-grid {
                grid-template-columns: 1fr;
            }

            .tech-stack {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 480px) {
            .header h1 {
                font-size: 1.8rem;
            }

            .content {
                padding: 1.5rem 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>Digital Complaint & Maintenance System</h1>
            <p>A web-based Digital Complaint & Maintenance System that allows users to file complaints and track their resolution while also enabling administrators to manage staff, tasks, and complaints efficiently. This project serves as a solution for maintaining a well-organized system for addressing complaints and managing maintenance tasks within an organization.</p>
        </header>

        <div class="content">
            <div class="toc">
                <h2><i class="fas fa-list"></i> Table of Contents</h2>
                <ol>
                    <li><a href="#introduction">Introduction</a></li>
                    <li><a href="#features">Features</a></li>
                    <li><a href="#technologies">Technologies Used</a></li>
                    <li><a href="#setup">Setup and Installation</a></li>
                    <li><a href="#usage">Usage</a></li>
                    <li><a href="#contributors">Contributors</a></li>
                    <li><a href="#license">License</a></li>
                </ol>
            </div>

            <section class="section" id="introduction">
                <h2><i class="fas fa-info-circle"></i> Introduction</h2>
                <p>The <strong>Digital Complaint & Maintenance System</strong> is designed to simplify complaint handling and task management. Users can easily report issues, and administrators can efficiently manage and resolve complaints by assigning tasks to maintenance staff. The system provides various features, such as task management, complaint tracking, real-time notifications, and more.</p>
            </section>

            <section class="section" id="features">
                <h2><i class="fas fa-star"></i> Features</h2>
                <div class="features-grid">
                    <div class="feature-card">
                        <h3><i class="fas fa-exclamation-triangle"></i> Complaint Management</h3>
                        <ul>
                            <li>Users can file complaints with descriptions and categories</li>
                            <li>Admins can view, assign, and track complaints</li>
                        </ul>
                    </div>

                    <div class="feature-card">
                        <h3><i class="fas fa-tasks"></i> Task Management</h3>
                        <ul>
                            <li>Admins can create, assign, and track maintenance tasks</li>
                            <li>Task status can be updated (e.g., in-progress, completed)</li>
                        </ul>
                    </div>

                    <div class="feature-card">
                        <h3><i class="fas fa-users"></i> Staff Management</h3>
                        <ul>
                            <li>Admins can manage maintenance staff and monitor their activity</li>
                        </ul>
                    </div>

                    <div class="feature-card">
                        <h3><i class="fas fa-shield-alt"></i> User Authentication</h3>
                        <ul>
                            <li>Secure login and session management for admin and user roles</li>
                        </ul>
                    </div>

                    <div class="feature-card">
                        <h3><i class="fas fa-bell"></i> Notifications</h3>
                        <ul>
                            <li>Real-time alerts for new complaints and task updates</li>
                        </ul>
                    </div>

                    <div class="feature-card">
                        <h3><i class="fas fa-chart-bar"></i> Reports</h3>
                        <ul>
                            <li>Detailed reports and data analysis for admins to track performance</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section class="section" id="technologies">
                <h2><i class="fas fa-code"></i> Technologies Used</h2>
                <div class="tech-stack">
                    <div class="tech-category">
                        <h4><i class="fas fa-palette"></i> Frontend</h4>
                        <div class="tech-tags">
                            <span class="tech-tag">HTML</span>
                            <span class="tech-tag">CSS</span>
                            <span class="tech-tag">JavaScript</span>
                            <span class="tech-tag">Materialize</span>
                            <span class="tech-tag">FontAwesome</span>
                            <span class="tech-tag">Google Fonts</span>
                        </div>
                    </div>

                    <div class="tech-category">
                        <h4><i class="fas fa-server"></i> Backend</h4>
                        <div class="tech-tags">
                            <span class="tech-tag">PHP</span>
                            <span class="tech-tag">MySQL</span>
                        </div>
                    </div>

                    <div class="tech-category">
                        <h4><i class="fas fa-code-branch"></i> Version Control</h4>
                        <div class="tech-tags">
                            <span class="tech-tag">Git</span>
                            <span class="tech-tag">GitHub</span>
                        </div>
                    </div>

                    <div class="tech-category">
                        <h4><i class="fas fa-tools"></i> Other Tools</h4>
                        <div class="tech-tags">
                            <span class="tech-tag">Live Server</span>
                            <span class="tech-tag">XAMPP</span>
                        </div>
                    </div>
                </div>
            </section>

            <section class="section" id="setup">
                <h2><i class="fas fa-cog"></i> Setup and Installation</h2>
                <p>To set up the <strong>Digital Complaint & Maintenance System</strong> on your local machine:</p>
                
                <div class="setup-steps">
                    <div class="setup-step">
                        <h4><span class="step-number">1</span> Clone the repository</h4>
                        <div class="code-block">
                            <pre>git clone https://github.com/yourusername/digital-complaint-system.git
cd digital-complaint-system</pre>
                        </div>
                    </div>

                    <div class="setup-step">
                        <h4><span class="step-number">2</span> Install XAMPP</h4>
                        <p>Download and install XAMPP (if not already installed).</p>
                    </div>

                    <div class="setup-step">
                        <h4><span class="step-number">3</span> Set up the database</h4>
                        <ul>
                            <li>Open <strong>phpMyAdmin</strong> via XAMPP</li>
                            <li>Create a new database (e.g., <code>digital_complaints_db</code>)</li>
                            <li>Import the provided SQL file (if available) or create tables as per the required schema</li>
                        </ul>
                    </div>

                    <div class="setup-step">
                        <h4><span class="step-number">4</span> Run the application</h4>
                        <ul>
                            <li>Place the project folder inside the <strong>htdocs</strong> directory of XAMPP</li>
                            <li>Open the project in a browser: <code>http://localhost/digital-complaint-system/</code></li>
                        </ul>
                    </div>
                </div>
            </section>

            <section class="section" id="usage">
                <h2><i class="fas fa-play"></i> Usage</h2>
                <ul class="usage-list">
                    <li><strong>Login</strong> with the admin credentials to manage the system</li>
                    <li><strong>Users</strong> can log in to file complaints and track their resolutions</li>
                    <li><strong>Admins</strong> can assign tasks to staff and track the status of complaints</li>
                </ul>
            </section>

            <section class="section" id="contributors">
                <h2><i class="fas fa-heart"></i> Contributors</h2>
                <div class="contributors">
                    <div class="contributor">
                        <div class="contributor-avatar">YN</div>
                        <div>
                            <strong>Your Name</strong> - <a href="#">GitHub Profile</a>
                        </div>
                    </div>
                    <div class="contributor">
                        <div class="contributor-avatar">SN</div>
                        <div>
                            <strong>Supervisor's Name</strong> - <a href="#">Supervisor GitHub Profile</a>
                        </div>
                    </div>
                </div>
                <p style="margin-top: 1rem; font-style: italic;">Feel free to contribute or suggest changes through <strong>pull requests</strong>!</p>
            </section>

            <div class="cta">
                <h3>Ready to Get Started?</h3>
                <p>Transform your complaint management process with our modern, efficient system</p>
            </div>
        </div>
    </div>

    <script>
        // Smooth scrolling for table of contents
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add loading animation
        window.addEventListener('load', function() {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 100);
        });

        // Add hover effects to feature cards
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            }); 
        });
    </script>
</body>
</html>
