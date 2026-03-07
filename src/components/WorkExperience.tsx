import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

interface ExperienceItem {
  title: string;
  organization: string;
  location: string;
  period: string;
  description: string;
  skills: string[];
}

const experienceItems: ExperienceItem[] = [
  {
    title: "Freelance Designer & Developer",
    organization: "DesignNDeploy",
    location: "Remote",
    period: "2024 - Present",
    description:
      "Designing and developing custom portfolio websites and branding solutions using MERN stack. Building responsive web applications with animations, contact forms, and PDF export functionality. Delivered 10+ projects with modern UI/UX.",
    skills: ["React.js", "JavaScript", "MERN Stack", "UI/UX", "Responsive Design"],
  },
  {
    title: "Python Developer Intern",
    organization: "Stack Industry",
    location: "Vadodara, Gujarat",
    period: "Dec 2024 - May 2025",
    description:
      "Developed enterprise Inventory Management System using Python, PyQt5, and MySQL with real-time tracking. Implemented PDF/Excel exports, dynamic forms, and role-based access. Optimized application performance by 30% through code refactoring.",
    skills: ["Python", "PyQt5", "MySQL", "SDLC", "Agile"],
  },
];

const ExperienceCard = ({
  item,
  index,
}: {
  item: ExperienceItem;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pl-8 pb-8 last:pb-0"
    >
      {/* Timeline line */}
      <div className="timeline-line" />

      {/* Timeline dot */}
      <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-primary transform -translate-x-[3px]" />

      <div className="glass-card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-heading font-semibold leading-tight">{item.title}</h3>
              <p className="text-secondary text-xs sm:text-sm break-words">{item.organization} • {item.location}</p>
            </div>
          </div>
          <span className="text-muted-foreground text-xs sm:text-sm whitespace-nowrap ml-13 sm:ml-0">
            {item.period}
          </span>
        </div>

        <p className="text-muted-foreground text-sm mb-4">{item.description}</p>

        <div className="flex flex-wrap gap-2">
          {item.skills.map((skill) => (
            <span key={skill} className="skill-tag text-xs">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const WorkExperience = () => {
  return (
    <section id="experience" className="py-12 sm:py-20 section-bg">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-4">
            Work <span className="gradient-text">Experience</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-2">
            My professional journey building intelligent systems and data-driven solutions.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {experienceItems.map((item, index) => (
            <ExperienceCard key={item.title + item.organization} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkExperience;
