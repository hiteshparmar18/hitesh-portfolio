import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

interface EducationItem {
  title: string;
  organization: string;
  period: string;
  description: string;
  skills: string[];
}

const educationItems: EducationItem[] = [
  {
    title: "AI & ML Specialization",
    organization: "NearLearn, Bengaluru",
    period: "June 2025 - March 2026",
    description:
      "Specializing in Deep Learning & TensorFlow with focus on Machine Learning, Neural Networks, and Generative AI. Hands-on training in building production-ready ML models.",
    skills: ["TensorFlow", "Deep Learning", "Neural Networks", "Generative AI"],
  },
  {
    title: "B.Tech in Computer Science & Engineering",
    organization: "Parul Institute of Engineering & Technology, Parul University",
    period: "Jun 2022 - May 2025",
    description:
      "Comprehensive study of computer science fundamentals, software engineering, and data structures. Completed multiple projects in ML, deep learning, and full-stack development.",
    skills: ["Data Structures", "Algorithms", "Python", "Software Engineering"],
  },
  {
    title: "Diploma in Computer Science & Engineering",
    organization: "Parul University, Vadodara",
    period: "Jun 2019 - May 2022",
    description:
      "Foundation in computer science, programming fundamentals, and database management. Built strong technical foundation in software development.",
    skills: ["Programming Fundamentals", "Database Management", "Web Development"],
  },
];

const EducationCard = ({
  item,
  index,
}: {
  item: EducationItem;
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
      <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-secondary transform -translate-x-[3px]" />

      <div className="glass-card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-5 h-5 text-secondary" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-heading font-semibold leading-tight">{item.title}</h3>
              <p className="text-secondary text-xs sm:text-sm break-words">{item.organization}</p>
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

const Education = () => {
  return (
    <section id="education" className="py-12 sm:py-20">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-4">
            <span className="gradient-text">Education</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-2">
            My academic journey in computer science and AI/ML specialization.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {educationItems.map((item, index) => (
            <EducationCard key={item.title + item.organization} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
