from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.jobs.models import Job

User = get_user_model()

class Command(BaseCommand):
    help = 'Load all 15 mock jobs data into database'

    def handle(self, *args, **options):
        # Utwórz u¿ytkownika jeœli nie istnieje
        user, created = User.objects.get_or_create(
            email='admin@fluffyjobs.com',
            defaults={
                'username': 'admin@fluffyjobs.com',
                'is_staff': True,
                'is_superuser': True
            }
        )
        if created:
            user.set_password('admin123')
            user.save()
            self.stdout.write(f'Created admin user: {user.email}')

        # Funkcja do parsowania salary
        def parse_salary(salary_str):
            # "15,000 - 20,000 PLN" -> (15000, 20000)
            try:
                parts = salary_str.replace(',', '').replace(' PLN', '').split(' - ')
                return float(parts[0]), float(parts[1])
            except:
                return 10000, 15000  # default values

        # Wszystkie 15 mock jobs
        mock_jobs = [
            {
                'title': 'Senior Frontend Developer',
                'company': 'TechCorp Solutions',
                'location': 'Warsaw, Poland',
                'type': 'Full-time',
                'salary': '15,000 - 20,000 PLN',
                'description': 'We are looking for an experienced Frontend Developer to join our dynamic team. You will be responsible for developing user-facing web applications using modern JavaScript frameworks.',
                'requirements': ['React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Git'],
                'experience_level': 'Senior'
            },
            {
                'title': 'Backend Developer - Node.js',
                'company': 'StartupXYZ',
                'location': 'Krakow, Poland',
                'type': 'Full-time',
                'salary': '12,000 - 16,000 PLN',
                'description': 'Join our fast-growing startup as a Backend Developer. You will work on scalable APIs and microservices architecture using Node.js and modern cloud technologies.',
                'requirements': ['Node.js', 'Express.js', 'MongoDB', 'REST API', 'Docker', 'AWS'],
                'experience_level': 'Mid'
            },
            {
                'title': 'Full Stack Developer',
                'company': 'WebDev Inc',
                'location': 'Gdansk, Poland',
                'type': 'Contract',
                'salary': '18,000 - 22,000 PLN',
                'description': 'We need a versatile Full Stack Developer to work on various client projects. Experience with both frontend and backend technologies is essential.',
                'requirements': ['React', 'Node.js', 'Python', 'PostgreSQL', 'GraphQL', 'Docker'],
                'experience_level': 'Senior'
            },
            {
                'title': 'Junior React Developer',
                'company': 'ModernTech',
                'location': 'Wroclaw, Poland',
                'type': 'Full-time',
                'salary': '8,000 - 11,000 PLN',
                'description': 'Perfect opportunity for a junior developer to grow their skills in React development. You will work under mentorship of senior developers on exciting projects.',
                'requirements': ['JavaScript', 'React', 'HTML5', 'CSS3', 'Git', 'Basic TypeScript'],
                'experience_level': 'Junior'
            },
            {
                'title': 'DevOps Engineer',
                'company': 'CloudPro',
                'location': 'Poznan, Poland',
                'type': 'Full-time',
                'salary': '16,000 - 21,000 PLN',
                'description': 'We are seeking a DevOps Engineer to help us build and maintain our cloud infrastructure. Experience with AWS and containerization is required.',
                'requirements': ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux'],
                'experience_level': 'Mid'
            },
            {
                'title': 'Python Developer',
                'company': 'DataScience Ltd',
                'location': 'Warsaw, Poland',
                'type': 'Full-time',
                'salary': '13,000 - 17,000 PLN',
                'description': 'Join our data science team as a Python Developer. You will work on machine learning projects and data processing pipelines.',
                'requirements': ['Python', 'Django', 'FastAPI', 'PostgreSQL', 'Redis', 'Machine Learning'],
                'experience_level': 'Mid'
            },
            {
                'title': 'Mobile Developer - React Native',
                'company': 'MobileFirst',
                'location': 'Lodz, Poland',
                'type': 'Full-time',
                'salary': '14,000 - 18,000 PLN',
                'description': 'We are looking for a React Native developer to build cross-platform mobile applications. Experience with both iOS and Android development is preferred.',
                'requirements': ['React Native', 'JavaScript', 'TypeScript', 'iOS', 'Android', 'Redux'],
                'experience_level': 'Mid'
            },
            {
                'title': 'QA Automation Engineer',
                'company': 'TestPro',
                'location': 'Katowice, Poland',
                'type': 'Full-time',
                'salary': '11,000 - 15,000 PLN',
                'description': 'We need a QA Automation Engineer to develop and maintain our test automation framework. Experience with Selenium and Cypress is required.',
                'requirements': ['Selenium', 'Cypress', 'JavaScript', 'Python', 'TestNG', 'Jenkins'],
                'experience_level': 'Mid'
            },
            {
                'title': 'UI/UX Designer',
                'company': 'DesignStudio',
                'location': 'Warsaw, Poland',
                'type': 'Full-time',
                'salary': '10,000 - 14,000 PLN',
                'description': 'We are seeking a creative UI/UX Designer to design user interfaces for web and mobile applications. Strong portfolio is required.',
                'requirements': ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research', 'HTML/CSS'],
                'experience_level': 'Mid'
            },
            {
                'title': 'Product Manager',
                'company': 'ProductCorp',
                'location': 'Krakow, Poland',
                'type': 'Full-time',
                'salary': '17,000 - 23,000 PLN',
                'description': 'We are looking for an experienced Product Manager to lead our product development initiatives. Strong analytical and communication skills required.',
                'requirements': ['Product Management', 'Agile', 'Analytics', 'User Research', 'Roadmapping', 'Stakeholder Management'],
                'experience_level': 'Senior'
            },
            {
                'title': 'Data Engineer',
                'company': 'BigData Solutions',
                'location': 'Warsaw, Poland',
                'type': 'Full-time',
                'salary': '15,000 - 19,000 PLN',
                'description': 'Join our data engineering team to build scalable data pipelines and infrastructure. Experience with big data technologies is essential.',
                'requirements': ['Python', 'Apache Spark', 'Kafka', 'Airflow', 'SQL', 'AWS'],
                'experience_level': 'Senior'
            },
            {
                'title': 'Cybersecurity Specialist',
                'company': 'SecureIT',
                'location': 'Gdansk, Poland',
                'type': 'Full-time',
                'salary': '16,000 - 22,000 PLN',
                'description': 'We need a Cybersecurity Specialist to protect our infrastructure and applications. Security certifications are highly valued.',
                'requirements': ['Network Security', 'Penetration Testing', 'CISSP', 'Firewall Management', 'Incident Response', 'Risk Assessment'],
                'experience_level': 'Senior'
            },
            {
                'title': 'Machine Learning Engineer',
                'company': 'AI Innovations',
                'location': 'Wroclaw, Poland',
                'type': 'Full-time',
                'salary': '18,000 - 25,000 PLN',
                'description': 'We are seeking a Machine Learning Engineer to develop and deploy ML models in production. PhD or strong practical experience preferred.',
                'requirements': ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'Docker', 'Kubernetes'],
                'experience_level': 'Senior'
            },
            {
                'title': 'Blockchain Developer',
                'company': 'CryptoTech',
                'location': 'Warsaw, Poland',
                'type': 'Contract',
                'salary': '20,000 - 28,000 PLN',
                'description': 'Join the blockchain revolution as a Blockchain Developer. Experience with Ethereum and smart contracts is required.',
                'requirements': ['Solidity', 'Ethereum', 'Web3.js', 'Smart Contracts', 'DeFi', 'JavaScript'],
                'experience_level': 'Senior'
            },
            {
                'title': 'Game Developer - Unity',
                'company': 'GameStudio',
                'location': 'Krakow, Poland',
                'type': 'Full-time',
                'salary': '12,000 - 16,000 PLN',
                'description': 'We are looking for a passionate Game Developer to create amazing gaming experiences using Unity. Portfolio of published games preferred.',
                'requirements': ['Unity', 'C#', 'Game Design', '3D Graphics', 'Physics', 'Mobile Games'],
                'experience_level': 'Mid'
            }
        ]

        created_count = 0
        for job_data in mock_jobs:
            salary_min, salary_max = parse_salary(job_data['salary'])
            
            job, created = Job.objects.get_or_create(
                title=job_data['title'],
                company=job_data['company'],
                defaults={
                    'location': job_data['location'],
                    'job_type': job_data['type'].lower().replace('-', '_'),
                    'salary_min': salary_min,
                    'salary_max': salary_max,
                    'description': job_data['description'],
                    'requirements': ', '.join(job_data['requirements']),
                    'is_active': True,
                    'posted_by': user
                }
            )
            if created:
                created_count += 1
                self.stdout.write(f'Created job: {job.title} at {job.company}')
            else:
                self.stdout.write(f'Job already exists: {job.title} at {job.company}')

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {created_count} new jobs out of {len(mock_jobs)} total jobs')
        )
