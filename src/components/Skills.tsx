import { motion } from "framer-motion";
import { Code, Brain, Layers, BarChart3, Wrench } from "lucide-react";

interface SkillCategory {
  title: string;
  icon: React.ElementType;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    title: "Programming",
    icon: Code,
    skills: ["Python", "SQL", "JavaScript"],
  },
  {
    title: "Machine Learning",
    icon: Brain,
    skills: [
      "Scikit-learn",
      "XGBoost",
      "Random Forest",
      "SVM",
      "Regression",
      "Classification",
      "Clustering",
      "Feature Engineering",
    ],
  },
  {
    title: "Deep Learning",
    icon: Layers,
    skills: [
      "TensorFlow",
      "PyTorch",
      "Keras",
      "Neural Networks",
      "CNN",
      "RNN",
      "LSTM",
      "Transfer Learning",
    ],
  },
  {
    title: "Data Analysis",
    icon: BarChart3,
    skills: [
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Seaborn",
      "Plotly",
      "Power BI",
      "Tableau",
      "Excel",
    ],
  },
  {
    title: "Tools & Platforms",
    icon: Wrench,
    skills: [
      "Git",
      "Docker",
      "AWS",
      "Google Cloud",
      "Jupyter",
      "Google Analytics",
      "VS Code",
      "Streamlit",
      "FastAPI",
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const SkillCard = ({
  category,
}: {
  category: SkillCategory;
}) => {
  const Icon = category.icon;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="glass-card p-6 group"
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.div 
          className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Icon className="w-5 h-5 text-primary" />
        </motion.div>
        <h3 className="text-lg font-heading font-semibold">{category.title}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill, i) => (
          <motion.span 
            key={skill} 
            className="skill-tag"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.03 * i }}
            whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--primary) / 0.2)" }}
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};

const Skills = () => {
  return (
    <section id="skills" className="py-12 sm:py-20">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Technical <span className="gradient-text">Skills</span>
          </motion.h2>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Expertise across the full spectrum of AI, machine learning, and data
            analysis technologies.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {skillCategories.map((category) => (
            <SkillCard key={category.title} category={category} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
