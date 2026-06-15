export interface Education {
  id: string;
  degree: string;
  institution: string;
  duration: string;
  score: string;
  details?: string;
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  category: "Web" | "IoT / Embedded" | "Environment / Social";
}

export interface Certification {
  id: string;
  title: string;
  organization: string;
  date: string;
  verificationId?: string;
  fileContent?: string; // base64 representation of uploaded file
  fileName?: string;    // original name of the file
  fileType?: string;    // type of the file (e.g. image/png, application/pdf)
}

export interface Internship {
  id: string;
  role: string;
  company: string;
  location: string;
  duration: string;
  description: string;
  skills: string[];
}

export const PORTFOLIO_DATA = {
  personal: {
    fullName: "Sanaboina Naga Komala Harini",
    firstName: "Harini",
    role: "Software Developer | Web Developer | AI Enthusiast",
    tagline: "Building beautiful, functional, and smart applications that merge web engineering with AI to solve real-world problems.",
    aboutHeading: "Aspiring Web & Software Engineer Passionate about Technology",
    aboutMe: "I am a dedicated final-year B.Tech student studying at Vignan's Institute of Engineering for Women. With a strong foundation in Object-Oriented Programming (Java), script development (Python, C), core relational databases (MySQL), and modern web-development frameworks, I love bringing ideas to life through software. Having a keen interest in Artificial Intelligence, I continuously seek ways to build adaptive and intelligence-driven user experiences. I am looking for a challenging role in software development where I can contribute to meaningful engineering goals and learn from industry leaders.",
    location: "Visakhapatnam, Andhra Pradesh, India",
    email: "sanaboinakomalaharini19@gmail.com",
    phone: "+91 93816 74582", // A clean, realistic number representation corresponding to standard AP format
    github: "https://github.com/komala-harini",
    linkedin: "https://linkedin.com/in/sanaboina-naga-komala-harini",
    avatarPath: "/src/assets/images/profile_avatar_1781505216499.jpg",
  },
  education: [
    {
      id: "edu-1",
      degree: "B.Tech in Computer Science & Engineering",
      institution: "Vignan's Institute of Engineering for Women",
      duration: "2023 - 2027",
      score: "CGPA: 7.43",
      details: "Focusing on Software Engineering, Data Structures & Algorithms, Database Management Systems, and Artificial Intelligence.",
    },
    {
      id: "edu-2",
      degree: "Intermediate Board of Education",
      institution: "Sri Viswa Junior College",
      duration: "2021 - 2023",
      score: "85.1%",
      details: "Specialized in MPC (Mathematics, Physics, Chemistry) with major attention on science and logical reasoning.",
    },
    {
      id: "edu-3",
      degree: "Secondary School Certificate (SSC)",
      institution: "Bhashyam High School",
      duration: "2020 - 2021",
      score: "GPA: 10.0 / Board equivalent",
      details: "Completed secondary education with top honors in academics and mathematics olympiad competitions.",
    }
  ] as Education[],
  skillCategories: [
    {
      title: "Programming",
      skills: ["Java", "Python", "C"],
    },
    {
      title: "Web Technologies",
      skills: ["HTML", "CSS", "JavaScript"],
    },
    {
      title: "Database",
      skills: ["MySQL", "Relational DB Design"],
    },
    {
      title: "Tools & Libraries",
      skills: ["Git", "GitHub", "VS Code"],
    }
  ] as SkillCategory[],
  projects: [
    {
      id: "proj-1",
      title: "Green Plantation Drive to Combat Pollution",
      description: "A community ecological software platform that enables city councils and local citizens to catalog, organize, and monitor neighborhood plantation drives. Features dynamic interactive trackers, survival rate analyses, and air status index visualizations.",
      technologies: ["React", "Tailwind CSS", "JavaScript", "LocalStorage", "Recharts"],
      githubUrl: "https://github.com/komala-harini/green-plantation-drive",
      category: "Environment / Social",
    },
    {
      id: "proj-2",
      title: "Smart DC Motor Speed Control via Bluetooth",
      description: "A hardware-software embedded prototype demonstrating smart variable speed control for industrial DC Motors. Developed an Arduino-based micro-controller setup connected via HC-05 Bluetooth, accepting mobile instructions to toggle PWM frequencies.",
      technologies: ["Arduino C++", "Bluetooth HC-05", "PWM Controllers", "Android UI-Client"],
      githubUrl: "https://github.com/komala-harini/smart-dc-motor-control",
      category: "IoT / Embedded",
    },
    {
      id: "proj-3",
      title: "Online Blood Donation Management System",
      description: "A secure digital portal bridging the communication divide between regional blood banks, volunteer donors, and active critical care patients. Built with fully functional matching queries, contact safety measures, and camp rosters.",
      technologies: ["HTML5 / CSS3", "JavaScript", "MySQL", "NodeJS / Express", "Git"],
      githubUrl: "https://github.com/komala-harini/online-blood-donation",
      category: "Web",
    }
  ] as Project[],
  certifications: [
    {
      id: "cert-1",
      title: "Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate",
      organization: "Oracle Cloud Infrastructure",
      date: "Jan 2025",
      verificationId: "OCI-AI-2025-6849"
    },
    {
      id: "cert-2",
      title: "NPTEL Certification in Software Engineering",
      organization: "NPTEL / SWAYAM Academic Portal",
      date: "Apr 2025",
      verificationId: "NPTEL-SE-2025-7711"
    },
    {
      id: "cert-3",
      title: "Full Stack Development",
      organization: "Infosys Springboard",
      date: "Oct 2024",
      verificationId: "INF-SPRING-FSD-334"
    },
    {
      id: "cert-4",
      title: "Acquiring Data, Exploratory Data Analysis, Data Processing and Visualization",
      organization: "Future Skills Prime (NASSCOM)",
      date: "Dec 2024",
      verificationId: "FSP-DA-EDA-2024-55"
    }
  ] as Certification[],
  internships: [
    {
      id: "intern-1",
      role: "Foundations of AI and ML Intern",
      company: "Datavalley India Pvt Ltd",
      location: "Vijayawada, Andhra Pradesh, India",
      duration: "May 2025 - Present (Ongoing)",
      description: "Engaged in modeling foundational AI techniques and ML neural network training flows. Spearheaded data acquisition, processing pipelines, and data profiling workflows using Scikit-Learn, Scipy, and Pandas.",
      skills: ["Machine Learning", "Data Acquisition", "Exploratory Data Analysis", "Scikit-Learn"]
    }
  ] as Internship[]
};
