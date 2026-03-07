import { useState, useEffect } from "react";
import { Github, ExternalLink, Play, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { supabase } from "@/integrations/supabase/client";

// Import fallback thumbnails for seeded projects
import irisFlowerImg from "@/assets/projects/iris-flower-intelligence.jpg";
import powerbiSalesImg from "@/assets/projects/powerbi-sales-dashboard.jpg";
import personalFinanceImg from "@/assets/projects/personal-finance-dashboard.jpg";
import salesTrackerImg from "@/assets/projects/sales-tracker.jpg";
import tableauSalesImg from "@/assets/projects/tableau-sales-dashboard.jpg";
import weatherAnalysisImg from "@/assets/projects/weather-analysis.jpg";
import inventoryManagerImg from "@/assets/projects/inventory-manager.jpg";
import studentPerformanceImg from "@/assets/projects/student-performance.jpg";
import secureFileStorageImg from "@/assets/projects/secure-file-storage.jpg";
import studentzoneImg from "@/assets/projects/studentzone.jpg";
import healthcareInfoImg from "@/assets/projects/healthcare-info.jpg";

interface Project {
  id: string;
  name: string;
  description: string;
  tech_stack: string[];
  github: string;
  demo: string | null;
  live: string | null;
  thumbnail_url: string | null;
  display_order: number;
}

// Map known project names to local thumbnail images
const thumbnailMap: Record<string, string> = {
  "Iris Flower Intelligence": irisFlowerImg,
  "Power BI Sales Analytics Dashboard": powerbiSalesImg,
  "Personal Finance Dashboard": personalFinanceImg,
  "Sales Performance Tracker": salesTrackerImg,
  "Sales Performance Analysis (Tableau)": tableauSalesImg,
  "Weather Data Analysis": weatherAnalysisImg,
  "Inventory Manager": inventoryManagerImg,
  "Student Performance Analyzer": studentPerformanceImg,
  "Secure File Storage": secureFileStorageImg,
  "StudentZone": studentzoneImg,
  "HealthCare Info": healthcareInfoImg,
};

const getProjectThumbnail = (project: Project): string => {
  // Use the database thumbnail_url if available, otherwise fall back to local assets
  if (project.thumbnail_url) return project.thumbnail_url;
  return thumbnailMap[project.name] || "/placeholder.svg";
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
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

const ProjectCard = ({ project }: { project: Project }) => {
  const thumbnail = getProjectThumbnail(project);
  
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="glass-card overflow-hidden flex flex-col h-full group"
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden">
        <AspectRatio ratio={16 / 9}>
          <motion.img
            src={thumbnail}
            alt={`${project.name} preview`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        </AspectRatio>
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <motion.h3 
          className="text-base sm:text-lg font-heading font-semibold text-foreground mb-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {project.name}
        </motion.h3>
        <p className="text-muted-foreground text-xs sm:text-sm mb-3 flex-grow line-clamp-2">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
          {project.tech_stack.slice(0, 3).map((tech, i) => (
            <motion.span 
              key={tech} 
              className="skill-tag text-xs px-2 py-1"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i }}
            >
              {tech}
            </motion.span>
          ))}
          {project.tech_stack.length > 3 && (
            <span className="text-xs text-muted-foreground">+{project.tech_stack.length - 3}</span>
          )}
        </div>

        <div className="flex gap-2 mt-auto">
          <motion.a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex-1 text-xs sm:text-sm py-2 px-3"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Github size={14} />
            <span className="hidden xs:inline">View</span> Code
          </motion.a>
          {project.demo && (
            <motion.a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex-1 text-xs sm:text-sm py-2 px-3"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Play size={14} />
              Demo
            </motion.a>
          )}
          {project.live && (
            <motion.a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex-1 text-xs sm:text-sm py-2 px-3"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <ExternalLink size={14} />
              Live
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('is_featured', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section id="projects" className="py-12 sm:py-20 section-bg">
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
            Featured <span className="gradient-text">Projects</span>
          </motion.h2>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            A collection of my AI, ML, and data analysis projects showcasing
            practical applications and technical expertise.
          </motion.p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Projects;
